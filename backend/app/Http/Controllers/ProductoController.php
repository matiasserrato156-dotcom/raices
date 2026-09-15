<?php

namespace App\Http\Controllers;

use App\Models\Producto;
use App\Models\Actividad;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\ValidationException;

class ProductoController extends Controller
{
    private function verificarAdmin(Request $request)
    {
        if (!$request->user() || $request->user()->role !== 'admin') {
            abort(403, 'No tienes permisos de administrador.');
        }
    }

    public function index()
    {
        return response()->json(Producto::where('activo', true)->latest()->get());
    }

    public function store(Request $request)
    {
        $this->verificarAdmin($request);

        $validated = $request->validate([
            'nombre'      => ['required', 'string', 'max:255'],
            'descripcion' => ['nullable', 'string'],
            'precio'      => ['required', 'numeric', 'min:0'],
            'stock'       => ['required', 'integer', 'min:0'],
            'categoria'   => ['required', 'string', 'max:255'],
            'imagen'      => ['nullable', 'image', 'mimes:jpg,jpeg,png,webp', 'max:5120'],
        ]);

        $rutaImagen = null;

        if ($request->hasFile('imagen')) {
            $archivo = $request->file('imagen');
            $hash = hash_file('sha256', $archivo->getRealPath());
            $nombreArchivo = $hash . '.' . $archivo->getClientOriginalExtension();
            $rutaRelativa = 'productos/' . $nombreArchivo;

            if (Producto::where('imagen', $rutaRelativa)->exists()) {
                throw ValidationException::withMessages([
                    'imagen' => ['Esta imagen ya ha sido asignada a otro producto. Debe ser única.'],
                ]);
            }

            $rutaImagen = $archivo->storeAs('productos', $nombreArchivo, 'public');
        }

        $producto = Producto::create([
            'user_id'     => $request->user()->id,
            'nombre'      => $validated['nombre'],
            'descripcion' => $validated['descripcion'] ?? null,
            'precio'      => $validated['precio'],
            'stock'       => $validated['stock'],
            'categoria'   => $validated['categoria'],
            'imagen'      => $rutaImagen,
            'activo'      => true,
        ]);

        Actividad::create([
            'user_id'     => $request->user()->id,
            'tipo'        => 'producto_creado',
            'descripcion' => "Creó el producto '{$producto->nombre}' con stock inicial de {$producto->stock}.",
            'datos'       => [
                'producto_id' => $producto->id,
                'precio'      => $producto->precio,
                'stock'       => $producto->stock,
            ],
        ]);

        return response()->json($producto, 201);
    }

    public function show(Producto $producto)
    {
        return response()->json($producto);
    }

    public function update(Request $request, Producto $producto)
    {
        $this->verificarAdmin($request);

        $validated = $request->validate([
            'nombre'      => ['sometimes', 'required', 'string', 'max:255'],
            'descripcion' => ['nullable', 'string'],
            'precio'      => ['sometimes', 'required', 'numeric', 'min:0'],
            'stock'       => ['sometimes', 'required', 'integer', 'min:0'],
            'categoria'   => ['sometimes', 'required', 'string', 'max:255'],
            'imagen'      => ['nullable', 'image', 'mimes:jpg,jpeg,png,webp', 'max:5120'],
            'activo'      => ['sometimes', 'boolean'],
        ]);

        $stockAnterior = $producto->stock;

        if ($request->hasFile('imagen')) {
            $archivo = $request->file('imagen');
            $hash = hash_file('sha256', $archivo->getRealPath());
            $nombreArchivo = $hash . '.' . $archivo->getClientOriginalExtension();
            $nuevaRuta = 'productos/' . $nombreArchivo;

            if (Producto::where('imagen', $nuevaRuta)->where('id', '!=', $producto->id)->exists()) {
                throw ValidationException::withMessages([
                    'imagen' => ['Esta imagen ya ha sido asignada a otro producto. Debe ser única.'],
                ]);
            }

            if ($producto->imagen && Storage::disk('public')->exists($producto->imagen)) {
                Storage::disk('public')->delete($producto->imagen);
            }

            $validated['imagen'] = $archivo->storeAs('productos', $nombreArchivo, 'public');
        }

        $producto->update($validated);

        Actividad::create([
            'user_id'     => $request->user()->id,
            'tipo'        => 'producto_editado',
            'descripcion' => "Actualizó el producto '{$producto->nombre}'.",
            'datos'       => [
                'producto_id'    => $producto->id,
                'stock_anterior' => $stockAnterior,
                'stock_nuevo'    => $producto->stock,
            ],
        ]);

        return response()->json($producto);
    }

    public function destroy(Request $request, Producto $producto)
    {
        $this->verificarAdmin($request);

        $nombre = $producto->nombre;
        $id = $producto->id;

        try {
            // Intenta borrado físico si el producto nunca se vendió
            if ($producto->imagen && Storage::disk('public')->exists($producto->imagen)) {
                Storage::disk('public')->delete($producto->imagen);
            }

            $producto->delete();
            $mensaje = 'Producto eliminado permanentemente.';
        } catch (\Illuminate\Database\QueryException $e) {
            // Si tiene pedidos asociados (error 1451/23000), aplica borrado lógico
            $producto->update(['activo' => false]);
            $mensaje = 'El producto tiene ventas registradas, por lo que fue retirado del catálogo para proteger el historial.';
        }

        Actividad::create([
            'user_id'     => $request->user()->id,
            'tipo'        => 'producto_eliminado',
            'descripcion' => "Eliminó o desactivó el producto '{$nombre}'.",
            'datos'       => ['producto_id' => $id],
        ]);

        return response()->json(['message' => $mensaje]);
    }
}