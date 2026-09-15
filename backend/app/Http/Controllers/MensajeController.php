<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Mensaje;

class MensajeController extends Controller
{
    public function store(Request $request)
    {
        $request->validate([
            'producto_id' => 'required',
            'contenido' => 'required|string|max:1000',
        ]);

        $mensaje = new Mensaje();
        $mensaje->producto_id = $request->producto_id;
        $mensaje->contenido = $request->contenido;
        $mensaje->save();

        return response()->json([
            'success' => true,
            'message' => '¡Mensaje enviado con éxito al artesano!'
        ], 201);
    }
}