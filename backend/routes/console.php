<?php

use Illuminate\Foundation\Inspiring;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Schedule;

// Opción 1: Ejecutar todos los días a una hora fija (ejemplo: 11:00 AM)
Schedule::command('pedidos:actualizar-estados')
    ->dailyAt('11:00')
    ->timezone('America/Bogota');

// Opción 2: Para pruebas continuas (cada minuto)
// Schedule::command('pedidos:actualizar-estados')->everyMinute();

Artisan::command('inspire', function () {
    $this->comment(Inspiring::quote());
})->purpose('Display an inspiring quote');
