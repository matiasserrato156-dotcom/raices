<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Video;
use Illuminate\Support\Facades\DB;

class VideoSeeder extends Seeder
{
    public function run(): void
    {
        DB::table('videos')->truncate();

        $videos = [
            [
                'titulo' => 'El Secreto del Tejido Wayuu: Tradición Ancestral',
                'descripcion' => 'Aprende sobre la leyenda de Waleker y cómo las maestras artesanas plasman la cosmogonía de La Guajira en cada puntada con hilos de algodón y tintes naturales.',
                'url' => 'https://www.youtube.com/watch?v=kYI4xT45Yy4',
                'miniatura' => 'https://images.unsplash.com/photo-1606744837616-56c9a5c6a6eb',
                'categoria' => 'Tejidos',
                'artesano_nombre' => 'Rosa Pushaina Uriana',
                'comunidad' => 'Kanasü, Uribia (La Guajira)',
                'duracion' => '08:15',
                'vistas' => 412,
                'destacado' => true,
            ],
            [
                'titulo' => 'Alfarería de Ráquira: Moldeando el Barro Negro',
                'descripcion' => 'Recorrido por los talleres tradicionales de Boyacá, mostrando el proceso de extracción, amasado, modelado en torno de pie y horneado de las vasijas de arcilla.',
                'url' => 'https://www.youtube.com/watch?v=y881t8ilMyc',
                'miniatura' => 'https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261',
                'categoria' => 'Cerámica',
                'artesano_nombre' => 'Maestro Jorge Sierra',
                'comunidad' => 'Ráquira, Boyacá',
                'duracion' => '06:40',
                'vistas' => 280,
                'destacado' => true,
            ],
            [
                'titulo' => 'Filigrana Momposina: Tejiendo Hilos de Plata',
                'descripcion' => 'Técnica orfebre centenaria en las orillas del Río Magdalena. Cómo fundir, hilar plata fina 970 y componer joyas minuciosas de diseño colonial.',
                'url' => 'https://www.youtube.com/watch?v=L_LUpnjgPso',
                'miniatura' => 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908',
                'categoria' => 'Joyería',
                'artesano_nombre' => 'Efraín Alvis Martínez',
                'comunidad' => 'Santa Cruz de Mompox',
                'duracion' => '10:10',
                'vistas' => 635,
                'destacado' => false,
            ],
        ];

        foreach ($videos as $v) {
            Video::create($v);
        }
    }
}