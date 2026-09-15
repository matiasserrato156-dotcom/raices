<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;

class Pedido extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'total',
        'estado',
        'direccion',
        'telefono',
        'latitud',
        'longitud',
        'observaciones',
    ];

    protected $casts = [
        'total' => 'decimal:2',
        'latitud' => 'decimal:7',
        'longitud' => 'decimal:7',
    ];

    /**
     * Estados disponibles para un pedido.
     */
    public const ESTADOS = [
        'pendiente',
        'confirmado',
        'preparando',
        'en_camino',
        'entregado',
        'cancelado',
    ];

    /**
     * Usuario que realizó el pedido.
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Detalles del pedido.
     */
    public function detalles(): HasMany
    {
        return $this->hasMany(PedidoDetalle::class);
    }

    /**
     * Pago asociado al pedido.
     */
    public function pago(): HasOne
    {
        return $this->hasOne(Pago::class);
    }

    /**
     * Comprobar si el pedido está pendiente.
     */
    public function estaPendiente(): bool
    {
        return $this->estado === 'pendiente';
    }

    /**
     * Comprobar si el pedido está confirmado.
     */
    public function estaConfirmado(): bool
    {
        return $this->estado === 'confirmado';
    }

    /**
     * Comprobar si el pedido está en preparación.
     */
    public function estaPreparando(): bool
    {
        return $this->estado === 'preparando';
    }

    /**
     * Comprobar si el pedido está en camino.
     */
    public function estaEnCamino(): bool
    {
        return $this->estado === 'en_camino';
    }

    /**
     * Comprobar si el pedido fue entregado.
     */
    public function estaEntregado(): bool
    {
        return $this->estado === 'entregado';
    }

    /**
     * Comprobar si el pedido fue cancelado.
     */
    public function estaCancelado(): bool
    {
        return $this->estado === 'cancelado';
    }

    /**
     * Nombre bonito del estado.
     */
    public function getEstadoNombreAttribute(): string
    {
        return match ($this->estado) {
            'pendiente' => 'Pedido recibido',
            'confirmado' => 'Compra confirmada',
            'preparando' => 'Preparando pedido',
            'en_camino' => 'En camino',
            'entregado' => 'Entregado',
            'cancelado' => 'Cancelado',
            default => ucfirst($this->estado),
        };
    }
}

