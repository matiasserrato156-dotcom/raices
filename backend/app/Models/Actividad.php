<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Actividad extends Model
{
    use HasFactory;

    protected $table = 'actividades';

    protected $fillable = [
        'user_id',
        'tipo',
        'descripcion',
        'datos',
    ];

    protected $casts = [
        'datos' => 'array',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
