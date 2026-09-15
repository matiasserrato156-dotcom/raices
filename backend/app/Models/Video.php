<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Video extends Model
{
    use HasFactory;

    protected $fillable = [
        'titulo',
        'descripcion',
        'url',
        'miniatura',
        'categoria',
        'artesano_nombre',
        'comunidad',
        'duracion',
        'vistas',
        'destacado',
    ];
}