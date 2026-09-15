<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Pago extends Model
{
    use HasFactory;

    protected $fillable = [
        'pedido_id',
        'metodo',
        'estado',
        'referencia',
        'comprobante',
        'monto',
    ];

    protected $casts = [
        'monto' => 'decimal:2',
    ];

    public const METODOS = [
        'contraentrega',
        'nequi',
        'bancolombia',
    ];

    public const ESTADOS = [
        'pendiente',
        'por_verificar',
        'verificado',
        'rechazado',
    ];

    public function pedido(): BelongsTo
    {
        return $this->belongsTo(Pedido::class);
    }
}