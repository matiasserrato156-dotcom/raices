<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\Pedido;
use App\Models\Actividad;
use Illuminate\Support\Facades\Mail;
use App\Mail\EstadoPedidoActualizado;

class ActualizarEstadosPedidos extends Command
{
    protected $signature = 'pedidos:actualizar-estados';
    protected $description = 'Avanza automáticamente los estados de los pedidos y notifica al cliente';

    public function handle()
    {
        $this->info("Iniciando actualización automática de estados...");

        $siguienteEstado = [
            'pendiente'  => 'confirmado',
            'confirmado' => 'preparando',
            'preparando' => 'en camino',
            'en camino'  => 'entregado',
        ];

        $pedidos = Pedido::whereIn('estado', array_keys($siguienteEstado))->get();

        foreach ($pedidos as $pedido) {
            $estadoAnterior = $pedido->estado;
            $nuevo = $siguienteEstado[$estadoAnterior];

            $pedido->estado = $nuevo;
            $pedido->save();

            // Registrar actividad
            Actividad::create([
                'user_id'     => $pedido->user_id,
                'tipo'        => 'cambio_estado_automatico',
                'descripcion' => "Pedido #{$pedido->id} avanzó automáticamente de {$estadoAnterior} a {$nuevo}.",
                'datos'       => [
                    'pedido_id'       => $pedido->id,
                    'estado_anterior' => $estadoAnterior,
                    'estado_nuevo'    => $nuevo,
                ],
            ]);

            // Enviar correo al comprador
            if ($pedido->user && $pedido->user->email) {
                try {
                    Mail::to($pedido->user->email)->send(new EstadoPedidoActualizado($pedido, $estadoAnterior));
                } catch (\Exception $e) {
                    $this->error("Error enviando correo del pedido #{$pedido->id}: " . $e->getMessage());
                }
            }

            $this->info("Pedido #{$pedido->id}: {$estadoAnterior} -> {$nuevo}");
        }

        $this->info("Proceso completado.");
    }
}