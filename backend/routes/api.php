<?php

use App\Http\Controllers\AdminPedidoController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\PedidoController;
use App\Http\Controllers\ProductoController;
use App\Http\Controllers\VideoController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\ResenaController;

/*
|--------------------------------------------------------------------------
| Rutas públicas
|--------------------------------------------------------------------------
*/

Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

Route::post('/forgot-password', [AuthController::class, 'forgotPassword']);
Route::post('/reset-password', [AuthController::class, 'resetPassword']);

/*
|--------------------------------------------------------------------------
| Productos
|--------------------------------------------------------------------------
*/

Route::get('/productos', [ProductoController::class, 'index']);
Route::get('/productos/{producto}', [ProductoController::class, 'show']);
Route::get('/productos/{producto}/resenas', [ResenaController::class, 'index']);

/*
|--------------------------------------------------------------------------
| Videos culturales
|--------------------------------------------------------------------------
*/

Route::get('/videos', [VideoController::class, 'index']);
Route::get('/videos/{video}', [VideoController::class, 'show']);

/*
|--------------------------------------------------------------------------
| Rutas protegidas
|--------------------------------------------------------------------------
*/

Route::middleware('auth:sanctum')->group(function () {

    /*
    |--------------------------------------------------------------------------
    | Usuario autenticado
    |--------------------------------------------------------------------------
    */

    Route::get('/user', function (Request $request) {
        return response()->json($request->user());
    });

    Route::post('/logout', [AuthController::class, 'logout']);

    Route::put('/profile', [AuthController::class, 'updateProfile']);
    Route::post('/productos/{producto}/resenas', [ResenaController::class, 'store']);
    Route::delete('/productos/{producto}/resenas/{resena}', [ResenaController::class, 'destroy']);

    /*
    |--------------------------------------------------------------------------
    | Productos
    |--------------------------------------------------------------------------
    */

    Route::post('/productos', [ProductoController::class, 'store']);

    Route::put('/productos/{producto}', [ProductoController::class, 'update']);

    Route::delete('/productos/{producto}', [ProductoController::class, 'destroy']);

    /*
    |--------------------------------------------------------------------------
    | Pedidos
    |--------------------------------------------------------------------------
    */

    Route::get('/pedidos', [PedidoController::class, 'index']);

    Route::post('/pedidos', [PedidoController::class, 'store']);

    Route::get('/pedidos/{pedido}', [PedidoController::class, 'show']);

    /*
    |--------------------------------------------------------------------------
    | Videos culturales
    |--------------------------------------------------------------------------
    */

    Route::post('/videos', [VideoController::class, 'store']);

    /*
    |--------------------------------------------------------------------------
    | Administración de pedidos
    |--------------------------------------------------------------------------
    */

    Route::get('/admin/pedidos', [AdminPedidoController::class, 'index']);

    Route::get('/admin/pedidos/{pedido}', [AdminPedidoController::class, 'show']);

    Route::put(
        '/admin/pedidos/{pedido}/estado',
        [AdminPedidoController::class, 'actualizarEstado']
    );
});