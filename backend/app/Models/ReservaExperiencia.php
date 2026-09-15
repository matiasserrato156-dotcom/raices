<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ReservaExperiencia extends Model
{
    use HasFactory;

    protected $table = 'reserva_experiencias';

    protected $fillable = [
        'user_id',
        'experiencia_id',
        'fecha_reserva',
        'cupos_reservados',
        'total',
        'estado',
        'notas',
    ];

    public function usuario()
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    public function experiencia()
    {
        return $this->belongsTo(Experiencia::class, 'experiencia_id');
    }
}