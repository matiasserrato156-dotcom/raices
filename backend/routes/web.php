<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return redirect('/login');
});

Route::get('/login', function () {
    return response()->view('welcome');
})->name('login');

/*
|--------------------------------------------------------------------------
| Recuperación de contraseña
|--------------------------------------------------------------------------
| Laravel recibe el enlace desde el correo y envía al usuario
| al formulario de recuperación del frontend.
*/

Route::get('/reset-password/{token}', function (Request $request, string $token) {

    $frontendUrl = 'http://localhost:5173';

    $email = $request->query('email');

    $url = $frontendUrl . '/reset-password/' . urlencode($token);

    if ($email) {
        $url .= '?email=' . urlencode($email);
    }

    return redirect()->away($url);

})->name('password.reset');