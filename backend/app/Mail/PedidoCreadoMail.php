<?php

namespace App\Mail;

use App\Models\Pago;
use App\Models\Pedido;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class PedidoCreadoMail extends Mailable
{
    use Queueable, SerializesModels;

    public Pedido $pedido;
    public ?Pago $pago;

    public function __construct(Pedido $pedido, ?Pago $pago = null)
    {
        $this->pedido = $pedido;
        $this->pago = $pago;
    }

    public function envelope(): Envelope
    {
        return new Envelope(
            subject: 'Confirmación de compra - RAÍCES #' . $this->pedido->id,
        );
    }

    public function content(): Content
    {
        return new Content(
            view: 'emails.pedido-creado',
        );
    }
}