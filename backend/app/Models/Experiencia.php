<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Experiencia extends Model
{
    use HasFactory;

    protected $fillable = [
        'titulo',
        'descripcion',
        'ubicacion',
        'artesano_nombre',
        'duracion',
        'precio',
        'cupos_maximos',
        'imagen',
        'modalidad',
        'activo',
    ];

    public function reservas()
    {
        return $this->hasMany(ReservaExperiencia::class);
    }
}