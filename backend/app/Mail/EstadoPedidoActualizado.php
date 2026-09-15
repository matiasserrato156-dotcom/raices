<?php

namespace App\Mail;

use App\Models\Pedido;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class EstadoPedidoActualizado extends Mailable
{
    use Queueable, SerializesModels;

    public Pedido $pedido;

    public string $estadoAnterior;

    public function __construct(
        Pedido $pedido,
        string $estadoAnterior
    ) {
        $this->pedido = $pedido;
        $this->estadoAnterior = $estadoAnterior;
    }

    public function envelope(): Envelope
    {
        return new Envelope(
            subject: 'Actualización de tu pedido en RAÍCES #' . $this->pedido->id,
        );
    }

    public function content(): Content
    {
        return new Content(
            markdown: 'emails.pedidos.estado-actualizado',
        );
    }

    public function attachments(): array
    {
        return [];
    }
}