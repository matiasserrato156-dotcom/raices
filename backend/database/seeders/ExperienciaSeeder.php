<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Experiencia;

class ExperienciaSeeder extends Seeder
{
    public function run(): void
    {
        $experiencias = [
            [
                'titulo' => 'Taller de Telar Vertical y Simbología Wayuu',
                'descripcion' => 'Aprende los fundamentos del tejido ancestral en telar vertical guiado por una tejedora tradicional. Conocerás el significado de los kanasü (figuras geométricas) y prepararás tu propia pieza textil.',
                'ubicacion' => 'Ranchería Kanasü, Uribia (La Guajira)',
                'artesano_nombre' => 'Rosa Pushaina Uriana',
                'duracion' => '4 horas',
                'precio' => 120000,
                'cupos_maximos' => 8,
                'imagen' => 'https://images.unsplash.com/photo-1606744837616-56c9a5c6a6eb',
                'modalidad' => 'Presencial',
                'activo' => true,
            ],
            [
                'titulo' => 'Torno Alfarero y Moldeado en Barro de Ráquira',
                'descripcion' => 'Experiencia práctica con arcilla boyacense. Aprenderás a centrar el barro en el torno tradicional de pie, levantar las paredes de una vasija y llevarte tu obra lista para secado.',
                'ubicacion' => 'Taller Resguardo, Ráquira (Boyacá)',
                'artesano_nombre' => 'Maestro Jorge Sierra',
                'duracion' => '3 horas',
                'precio' => 85000,
                'cupos_maximos' => 6,
                'imagen' => 'https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261',
                'modalidad' => 'Presencial',
                'activo' => true,
            ],
            [
                'titulo' => 'Iniciación a la Filigrana en Plata Momposina',
                'descripcion' => 'Descubre el delicado arte de la orfebrería colonial. Estirarás hilos finos de plata 970, aprenderás a entorcharlos y soldarás un broche tradicional inspirado en la flor del río.',
                'ubicacion' => 'Calle Real del Medio, Mompox (Bolívar)',
                'artesano_nombre' => 'Efraín Alvis Martínez',
                'duracion' => '5 horas',
                'precio' => 190000,
                'cupos_maximos' => 5,
                'imagen' => 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908',
                'modalidad' => 'Presencial',
                'activo' => true,
            ],
        ];

        foreach ($experiencias as $exp) {
            Experiencia::create($exp);
        }
    }
}