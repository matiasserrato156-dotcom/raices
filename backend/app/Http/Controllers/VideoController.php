<?php

namespace App\Http\Controllers;

use App\Models\Video;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class VideoController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $query = Video::query();

        if ($request->filled('categoria') && $request->categoria !== 'todas') {
            $query->where('categoria', $request->categoria);
        }

        if ($request->filled('buscar')) {
            $termino = $request->buscar;
            $query->where(function ($q) use ($termino) {
                $q->where('titulo', 'like', "%{$termino}%")
                  ->orWhere('comunidad', 'like', "%{$termino}%")
                  ->orWhere('artesano_nombre', 'like', "%{$termino}%");
            });
        }

        $videos = $query->latest()->get();

        return response()->json([
            'videos' => $videos,
        ]);
    }

    public function show(Video $video): JsonResponse
    {
        $video->increment('vistas');
        return response()->json([
            'video' => $video,
        ]);
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'titulo' => 'required|string|max:255',
            'descripcion' => 'required|string',
            'tipo_origen' => 'required|in:youtube,archivo',
            'url' => 'nullable|required_if:tipo_origen,youtube|url',
            'archivo_video' => 'nullable|required_if:tipo_origen,archivo|file|mimes:mp4,mov,webm,avi|max:102400', // Hasta 100MB
            'miniatura' => 'nullable|url',
            'categoria' => 'required|string|max:100',
            'artesano_nombre' => 'nullable|string|max:150',
            'comunidad' => 'nullable|string|max:150',
            'duracion' => 'nullable|string|max:20',
        ]);

        $urlFinal = '';

        if ($validated['tipo_origen'] === 'archivo' && $request->hasFile('archivo_video')) {
            $path = $request->file('archivo_video')->store('videos_culturales', 'public');
            $urlFinal = asset('storage/' . $path);
        } else {
            $urlFinal = $validated['url'];
        }

        $video = Video::create([
            'titulo' => $validated['titulo'],
            'descripcion' => $validated['descripcion'],
            'url' => $urlFinal,
            'miniatura' => $validated['miniatura'] ?? 'https://images.unsplash.com/photo-1606744837616-56c9a5c6a6eb',
            'categoria' => $validated['categoria'],
            'artesano_nombre' => $validated['artesano_nombre'] ?? ($request->user() ? $request->user()->name : 'Maestro Artesano'),
            'comunidad' => $validated['comunidad'] ?? 'Colombia',
            'duracion' => $validated['duracion'] ?? '05:00',
            'vistas' => 0,
            'destacado' => false,
        ]);

        return response()->json([
            'message' => '¡Video cultural publicado con éxito!',
            'video' => $video,
        ], 201);
    }
}