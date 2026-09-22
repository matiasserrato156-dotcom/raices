<?php

namespace App\Http\Controllers;

use App\Mail\PedidoCreadoMail;
use App\Models\Pago;
use App\Models\Pedido;
use App\Models\Producto;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;

class PedidoController extends Controller
{
    /**
     * Listar los pedidos del usuario autenticado.
     */
    public function index(Request $request): JsonResponse
    {
        $pedidos = Pedido::with([
            'user',
            'detalles.producto',
            'pago',
        ])
            ->where(
                'user_id',
                $request->user()->id
            )
            ->latest()
            ->get();

        return response()->json([
            'pedidos' => $pedidos,
        ]);
    }

    /**
     * Crear un nuevo pedido con su pago.
     */
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'direccion' => [
                'required',
                'string',
                'max:1000',
            ],

            'telefono' => [
                'required',
                'string',
                'max:30',
            ],

            'latitud' => [
                'nullable',
                'numeric',
                'between:-90,90',
            ],

            'longitud' => [
                'nullable',
                'numeric',
                'between:-180,180',
            ],

            'observaciones' => [
                'nullable',
                'string',
                'max:2000',
            ],

            'productos' => [
                'required',
                'array',
                'min:1',
            ],

            'productos.*.producto_id' => [
                'required',
                'integer',
                'distinct',
                'exists:productos,id',
            ],

            'productos.*.cantidad' => [
                'required',
                'integer',
                'min:1',
            ],

            'metodo_pago' => [
                'required',
                'in:contraentrega,nequi,bancolombia',
            ],

            'referencia_pago' => [
                'nullable',
                'string',
                'max:255',
            ],

            'comprobante_pago' => [
                'nullable',
                'file',
                'mimes:jpg,jpeg,png,webp,pdf',
                'max:5120',
            ],
        ]);

        $pedido = DB::transaction(
            function () use (
                $request,
                $validated
            ) {
                $total = 0;

                $detalles = [];

                /*
                |--------------------------------------------------------------------------
                | Verificar productos y stock
                |--------------------------------------------------------------------------
                */

                foreach (
                    $validated['productos']
                    as $item
                ) {
                    $producto = Producto::query()
                        ->where(
                            'id',
                            $item['producto_id']
                        )
                        ->where(
                            'activo',
                            true
                        )
                        ->lockForUpdate()
                        ->first();

                    if (!$producto) {
                        abort(
                            404,
                            'Uno de los productos ya no está disponible.'
                        );
                    }

                    $cantidad =
                        (int) $item['cantidad'];

                    $stock =
                        (int) $producto->stock;

                    if (
                        $stock <
                        $cantidad
                    ) {
                        abort(
                            422,
                            "No hay suficiente stock para el producto: {$producto->nombre}."
                        );
                    }

                    $precioUnitario =
                        (float) $producto->precio;

                    $subtotal =
                        $precioUnitario *
                        $cantidad;

                    $total += $subtotal;

                    $detalles[] = [
                        'producto' =>
                            $producto,

                        'cantidad' =>
                            $cantidad,

                        'precio_unitario' =>
                            $precioUnitario,

                        'subtotal' =>
                            $subtotal,
                    ];
                }

                /*
                |--------------------------------------------------------------------------
                | Crear pedido
                |--------------------------------------------------------------------------
                */

                $pedido = Pedido::create([
                    'user_id' =>
                        $request->user()->id,

                    'total' =>
                        $total,

                    'estado' =>
                        'pendiente',

                    'direccion' =>
                        $validated['direccion'],

                    'telefono' =>
                        $validated['telefono'],

                    'latitud' =>
                        $validated['latitud'] ??
                        null,

                    'longitud' =>
                        $validated['longitud'] ??
                        null,

                    'observaciones' =>
                        $validated['observaciones'] ??
                        null,
                ]);

                /*
                |--------------------------------------------------------------------------
                | Crear detalles y descontar stock
                |--------------------------------------------------------------------------
                */

                foreach (
                    $detalles as $detalle
                ) {
                    $pedido
                        ->detalles()
                        ->create([
                            'producto_id' =>
                                $detalle['producto']->id,

                            'cantidad' =>
                                $detalle['cantidad'],

                            'precio_unitario' =>
                                $detalle['precio_unitario'],

                            'subtotal' =>
                                $detalle['subtotal'],
                        ]);

                    $detalle['producto']
                        ->decrement(
                            'stock',
                            $detalle['cantidad']
                        );
                }

                /*
                |--------------------------------------------------------------------------
                | Guardar comprobante
                |--------------------------------------------------------------------------
                */

                $rutaComprobante =
                    null;

                if (
                    $request->hasFile(
                        'comprobante_pago'
                    )
                ) {
                    $rutaComprobante =
                        $request
                            ->file(
                                'comprobante_pago'
                            )
                            ->store(
                                'comprobantes_pagos',
                                'public'
                            );
                }

                /*
                |--------------------------------------------------------------------------
                | Estado inicial del pago
                |--------------------------------------------------------------------------
                */

                $estadoPago =
                    'pendiente';

                if (
                    in_array(
                        $validated['metodo_pago'],
                        [
                            'nequi',
                            'bancolombia',
                        ],
                        true
                    )
                ) {
                    $estadoPago =
                        'por_verificar';
                }

                /*
                |--------------------------------------------------------------------------
                | Crear pago
                |--------------------------------------------------------------------------
                */

                Pago::create([
                    'pedido_id' =>
                        $pedido->id,

                    'metodo' =>
                        $validated['metodo_pago'],

                    'estado' =>
                        $estadoPago,

                    'referencia' =>
                        $validated[
                            'referencia_pago'
                        ] ?? null,

                    'comprobante' =>
                        $rutaComprobante,

                    'monto' =>
                        $total,
                ]);

                return $pedido;
            }
        );

        /*
        |--------------------------------------------------------------------------
        | Cargar información completa
        |--------------------------------------------------------------------------
        */

        $pedido->load([
            'user',
            'detalles.producto',
            'pago',
        ]);

        /*
        |--------------------------------------------------------------------------
        | ENVIAR CORREO DE CONFIRMACIÓN
        |--------------------------------------------------------------------------
        |
        | El correo recibe el pedido y su información de pago
        | para diferenciar:
        |
        | - Contraentrega
        | - Nequi
        | - Bancolombia
        |
        | Si el correo falla, NO cancelamos el pedido.
        |
        */

        try {
            if (
                $pedido->user &&
                $pedido->user->email
            ) {
                Mail::to(
                    $pedido->user->email
                )->send(
                    new PedidoCreadoMail(
                        $pedido,
                        $pedido->pago
                    )
                );
            }
        } catch (\Throwable $mailError) {
            Log::error(
                'No se pudo enviar el correo de confirmación del pedido.',
                [
                    'pedido_id' =>
                        $pedido->id,

                    'error' =>
                        $mailError->getMessage(),
                ]
            );
        }

        /*
        |--------------------------------------------------------------------------
        | RESPUESTA
        |--------------------------------------------------------------------------
        */

        return response()->json([
            'message' =>
                'Pedido creado correctamente.',

            'pedido' =>
                $pedido,
        ], 201);
    }

    /**
     * Mostrar un pedido específico del usuario.
     */
    public function show(
        Request $request,
        Pedido $pedido
    ): JsonResponse {
        if (
            $pedido->user_id !==
            $request->user()->id
        ) {
            return response()->json([
                'message' =>
                    'No tienes permiso para ver este pedido.',
            ], 403);
        }

        $pedido->load([
            'user',
            'detalles.producto',
            'pago',
        ]);

        return response()->json([
            'pedido' =>
                $pedido,
        ]);
    }
}