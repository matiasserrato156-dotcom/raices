<?php

namespace App\Http\Controllers;

use App\Mail\EstadoPedidoActualizado;
use App\Models\Pedido;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;

class AdminPedidoController extends Controller
{
    private array $estadosPermitidos = [
        'pendiente',
        'confirmado',
        'preparando',
        'en_camino',
        'entregado',
        'cancelado',
    ];

    private function verificarAdmin(
        Request $request
    ): void {
        if (
            $request->user()->role !==
            'admin'
        ) {
            abort(
                403,
                'No tienes permisos de administrador.'
            );
        }
    }

    public function index(
        Request $request
    ): JsonResponse {
        $this->verificarAdmin(
            $request
        );

        $pedidos =
            Pedido::with([
                'user',
                'detalles.producto',
            ])
                ->latest()
                ->get();

        return response()->json([
            'pedidos' => $pedidos,
        ]);
    }

    public function show(
        Request $request,
        Pedido $pedido
    ): JsonResponse {
        $this->verificarAdmin(
            $request
        );

        $pedido->load([
            'user',
            'detalles.producto',
        ]);

        return response()->json([
            'pedido' => $pedido,
        ]);
    }

    public function actualizarEstado(
        Request $request,
        Pedido $pedido
    ): JsonResponse {
        $this->verificarAdmin(
            $request
        );

        $validated =
            $request->validate([
                'estado' => [
                    'required',
                    'string',
                    'in:' .
                        implode(
                            ',',
                            $this
                                ->estadosPermitidos
                        ),
                ],
            ]);

        $estadoAnterior =
            $pedido->estado;

        $nuevoEstado =
            $validated['estado'];

        if (
            $estadoAnterior ===
            $nuevoEstado
        ) {
            return response()->json([
                'message' =>
                    'El pedido ya tiene este estado.',

                'pedido' =>
                    $pedido->load([
                        'user',
                        'detalles.producto',
                    ]),
            ]);
        }

        $pedido->update([
            'estado' =>
                $nuevoEstado,
        ]);

        $pedido->load([
            'user',
            'detalles.producto',
        ]);

        /*
         * El correo es secundario.
         * Si falla, NO deshacemos el cambio
         * de estado.
         */
        try {
            Mail::to(
                $pedido->user->email
            )->send(
                new EstadoPedidoActualizado(
                    $pedido,
                    $estadoAnterior
                )
            );
        } catch (
            \Throwable $mailError
        ) {
            report(
                $mailError
            );
        }

        return response()->json([
            'message' =>
                'Estado del pedido actualizado correctamente.',

            'pedido' =>
                $pedido,
        ]);
    }
}