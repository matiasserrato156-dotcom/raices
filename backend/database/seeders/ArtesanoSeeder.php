<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Artesano;

class ArtesanoSeeder extends Seeder
{
    public function run(): void
    {
        $artesanos = [
            [
                'nombre' => 'Rosa Pushaina Uriana',
                'foto' => 'https://images.unsplash.com/photo-1544005313-94ddf0286df2',
                'oficio' => 'Maestra Tejedora Wayuu',
                'comunidad' => 'Ranchería Kanasü, Uribia',
                'departamento' => 'La Guajira',
                'biografia' => 'Heredera del saber de la araña Waleker. Lleva más de 30 años tejiendo gasas, mochilas y chinchorros con hilos de algodón silvestre y tintes naturales.',
                'historia_cultural' => 'El tejido en la cultura Wayuu no es solo un oficio, es una expresión del pensamiento y la madurez de la mujer indígena.',
                'anios_experiencia' => 32,
                'verificado' => true,
                'telefono' => '+57 312 000 0001',
            ],
            [
                'nombre' => 'Jorge Sierra Cárdenas',
                'foto' => 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d',
                'oficio' => 'Maestro Alfarero',
                'comunidad' => 'Vereda Resguardo',
                'departamento' => 'Ráquira, Boyacá',
                'biografia' => 'Tercera generación de ceramistas dedicados al torneado y cocción en hornos de leña tradicionales de ollas, vasijas y figuras de barro negro.',
                'historia_cultural' => 'Ráquira proviene del chibcha y significa "Ciudad de las Ollas". Nuestro barro guarda la memoria de los muiscas.',
                'anios_experiencia' => 25,
                'verificado' => true,
                'telefono' => '+57 314 000 0002',
            ],
            [
                'nombre' => 'Efraín Alvis Martínez',
                'foto' => 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e',
                'oficio' => 'Maestro Joyero Filigranero',
                'comunidad' => 'Santa Cruz de Mompox',
                'departamento' => 'Bolívar',
                'biografia' => 'Custodio del arte orfebre momposino, estirando hilos de plata y oro de 24k tan delgados como cabellos para crear joyas de herencia colonial.',
                'historia_cultural' => 'La filigrana momposina fusiona técnicas árabes, españolas e indígenas llegadas a través del río Magdalena.',
                'anios_experiencia' => 40,
                'verificado' => true,
                'telefono' => '+57 310 000 0003',
            ]
        ];

        foreach ($artesanos as $a) {
            Artesano::create($a);
        }
    }
}