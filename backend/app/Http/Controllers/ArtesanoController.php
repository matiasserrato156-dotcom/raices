<?php

namespace App\Http\Controllers;

use App\Models\Artesano;
use App\Models\Producto;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ArtesanoController extends Controller
{
    public function index(): JsonResponse
    {
        $artesanos = Artesano::latest()->get();
        return response()->json([
            'artesanos' => $artesanos,
        ]);
    }

    public function show($id): JsonResponse
    {
        $artesano = Artesano::find($id);

        if (!$artesano) {
            return response()->json(['message' => 'Artesano no encontrado'], 404);
        }

        $productos = Producto::where('artesano_id', $id)
            ->orWhere('nombre', 'like', "%{$artesano->comunidad}%")
            ->take(8)
            ->get();

        return response()->json([
            'artesano' => $artesano,
            'productos' => $productos,
        ]);
    }
}