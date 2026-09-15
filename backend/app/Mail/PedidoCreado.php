<?php

namespace App\Mail;

use App\Models\Pedido;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class PedidoCreado extends Mailable
{
    use Queueable, SerializesModels;

    public Pedido $pedido;

    /**
     * Crear una nueva instancia del correo.
     */
    public function __construct(Pedido $pedido)
    {
        $this->pedido = $pedido;
    }

    /**
     * Asunto del correo.
     */
    public function envelope(): Envelope
    {
        return new Envelope(
            subject: 'Has realizado una compra en RAÍCES',
        );
    }

    /**
     * Contenido del correo.
     */
    public function content(): Content
    {
        return new Content(
            view: 'emails.pedidos.creado',
        );
    }

    /**
     * Archivos adjuntos.
     */
    public function attachments(): array
    {
        return [];
    }
}