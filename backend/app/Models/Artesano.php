<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Artesano extends Model
{
    use HasFactory;

    protected $fillable = [
        'nombre',
        'foto',
        'oficio',
        'comunidad',
        'departamento',
        'biografia',
        'historia_cultural',
        'anios_experiencia',
        'verificado',
        'telefono',
    ];

    public function productos()
    {
        return $this->hasMany(Producto::class);
    }
}