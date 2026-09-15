<?php

namespace App\Http\Controllers;

use App\Models\Producto;
use App\Models\Resena;
use Illuminate\Http\Request;

class ResenaController extends Controller
{
    public function index(Producto $producto)
    {
        $resenas = $producto->resenas()
            ->with('user:id,name')
            ->latest()
            ->get()
            ->map(function ($resena) {
                return [
                    'id' => $resena->id,
                    'calificacion' => $resena->calificacion,
                    'comentario' => $resena->comentario,
                    'usuario' => $resena->user?->name ?? 'Usuario',
                    'user_id' => $resena->user_id,
                    'created_at' => $resena->created_at,
                ];
            });

        $promedio = $producto->resenas()->avg('calificacion');

        return response()->json([
            'producto_id' => $producto->id,
            'promedio' => round((float) ($promedio ?? 0), 1),
            'total' => $resenas->count(),
            'resenas' => $resenas,
        ]);
    }

    public function store(Request $request, Producto $producto)
    {
        if (!$request->user()) {
            return response()->json([
                'message' => 'Debes iniciar sesión para publicar una reseña.'
            ], 401);
        }

        $validated = $request->validate([
            'calificacion' => [
                'required',
                'integer',
                'min:1',
                'max:5',
            ],
            'comentario' => [
                'required',
                'string',
                'min:5',
                'max:1000',
            ],
        ]);

        $resena = Resena::updateOrCreate(
            [
                'producto_id' => $producto->id,
                'user_id' => $request->user()->id,
            ],
            [
                'calificacion' => $validated['calificacion'],
                'comentario' => $validated['comentario'],
            ]
        );

        $resena->load('user:id,name');

        return response()->json([
            'message' => 'Reseña guardada correctamente.',
            'resena' => [
                'id' => $resena->id,
                'calificacion' => $resena->calificacion,
                'comentario' => $resena->comentario,
                'usuario' => $resena->user?->name ?? 'Usuario',
                'user_id' => $resena->user_id,
                'created_at' => $resena->created_at,
            ],
            'promedio' => round(
                (float) $producto->resenas()->avg('calificacion'),
                1
            ),
            'total' => $producto->resenas()->count(),
        ], 201);
    }

    public function destroy(
        Request $request,
        Producto $producto,
        Resena $resena
    ) {
        if (
            $resena->producto_id !== $producto->id ||
            $resena->user_id !== $request->user()->id
        ) {
            return response()->json([
                'message' => 'No tienes permiso para eliminar esta reseña.'
            ], 403);
        }

        $resena->delete();

        return response()->json([
            'message' => 'Reseña eliminada correctamente.',
            'promedio' => round(
                (float) $producto->resenas()->avg('calificacion'),
                1
            ),
            'total' => $producto->resenas()->count(),
        ]);
    }
}