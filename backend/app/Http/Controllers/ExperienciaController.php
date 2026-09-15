<?php

namespace App\Http\Controllers;

use App\Models\Experiencia;
use App\Models\ReservaExperiencia;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class ExperienciaController extends Controller
{
    /**
     * Listado público de experiencias con cupos y detalles.
     */
    public function index(): JsonResponse
    {
        $experiencias = Experiencia::where('activo', true)
            ->withCount('reservas')
            ->latest()
            ->get();

        return response()->json([
            'experiencias' => $experiencias,
        ]);
    }

    /**
     * Detalle de una experiencia individual.
     */
    public function show($id): JsonResponse
    {
        $experiencia = Experiencia::find($id);

        if (!$experiencia) {
            return response()->json(['message' => 'Experiencia no encontrada'], 404);
        }

        return response()->json([
            'experiencia' => $experiencia,
        ]);
    }

    /**
     * Registrar una reserva con validación de cupos por fecha.
     */
    public function reservar(Request $request, $id): JsonResponse
    {
        $experiencia = Experiencia::findOrFail($id);

        $validated = $request->validate([
            'fecha_reserva' => 'required|date|after_or_equal:today',
            'cupos' => 'required|integer|min:1|max:10',
            'notas' => 'nullable|string|max:500',
        ]);

        return DB::transaction(function () use ($request, $validated, $experiencia) {
            $cuposReservados = ReservaExperiencia::where('experiencia_id', $experiencia->id)
                ->where('fecha_reserva', $validated['fecha_reserva'])
                ->where('estado', 'confirmada')
                ->sum('cupos_reservados');

            $cuposDisponibles = $experiencia->cupos_maximos - $cuposReservados;

            if ($validated['cupos'] > $cuposDisponibles) {
                return response()->json([
                    'message' => "Solo quedan {$cuposDisponibles} cupos disponibles para esta fecha.",
                ], 422);
            }

            $total = $experiencia->precio * $validated['cupos'];

            $reserva = ReservaExperiencia::create([
                'user_id' => $request->user()->id,
                'experiencia_id' => $experiencia->id,
                'fecha_reserva' => $validated['fecha_reserva'],
                'cupos_reservados' => $validated['cupos'],
                'total' => $total,
                'estado' => 'confirmada',
                'notas' => $validated['notas'] ?? null,
            ]);

            return response()->json([
                'message' => '¡Reserva confirmada exitosamente!',
                'reserva' => $reserva->load('experiencia'),
            ], 201);
        });
    }

    /**
     * Listar las reservas del usuario autenticado.
     */
    public function misReservas(Request $request): JsonResponse
    {
        $reservas = ReservaExperiencia::with('experiencia')
            ->where('user_id', $request->user()->id)
            ->latest()
            ->get();

        return response()->json([
            'reservas' => $reservas,
        ]);
    }
}