<?php

namespace Database\Seeders;

use App\Models\Producto;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\File;

class ProductoSeeder extends Seeder
{
    public function run(): void
    {
        $admin = User::where('id', 4)
            ->where('role', 'admin')
            ->first();

        if (!$admin) {
            throw new \RuntimeException(
                'No se encontró el usuario administrador con ID 4.'
            );
        }

        /*
        |--------------------------------------------------------------------------
        | PRODUCTOS ARTESANALES
        |--------------------------------------------------------------------------
        */

        $productos = [

            // CERÁMICA
            [
                'nombre' => 'Jarrón Tierra Andina',
                'categoria' => 'Cerámica',
                'descripcion' => 'Jarrón de cerámica modelado a mano con acabado natural inspirado en los tonos de la tierra andina.',
                'precio' => 128000,
            ],
            [
                'nombre' => 'Taza Brisa de Montaña',
                'categoria' => 'Cerámica',
                'descripcion' => 'Taza artesanal de cerámica con acabado mate y detalles inspirados en los paisajes de montaña.',
                'precio' => 42000,
            ],
            [
                'nombre' => 'Cuenco Amanecer',
                'categoria' => 'Cerámica',
                'descripcion' => 'Cuenco artesanal elaborado en barro cocido, ideal para servir o decorar espacios del hogar.',
                'precio' => 58000,
            ],
            [
                'nombre' => 'Plato Raíces del Valle',
                'categoria' => 'Cerámica',
                'descripcion' => 'Plato decorativo trabajado a mano con formas orgánicas que evocan los valles colombianos.',
                'precio' => 69000,
            ],
            [
                'nombre' => 'Florero Canto de Barro',
                'categoria' => 'Cerámica',
                'descripcion' => 'Florero artesanal de barro con textura irregular y acabado cálido para decoración.',
                'precio' => 95000,
            ],
            [
                'nombre' => 'Maceta Selva Viva',
                'categoria' => 'Cerámica',
                'descripcion' => 'Maceta artesanal inspirada en la vegetación tropical colombiana.',
                'precio' => 76000,
            ],
            [
                'nombre' => 'Jarra Agua de Montaña',
                'categoria' => 'Cerámica',
                'descripcion' => 'Jarra de cerámica hecha a mano, pensada para acompañar mesas con un estilo rústico y elegante.',
                'precio' => 112000,
            ],
            [
                'nombre' => 'Copa Barro Dorado',
                'categoria' => 'Cerámica',
                'descripcion' => 'Copa artesanal de barro con detalles decorativos y acabado único.',
                'precio' => 47000,
            ],
            [
                'nombre' => 'Vasija Guardianes de Tierra',
                'categoria' => 'Cerámica',
                'descripcion' => 'Vasija decorativa inspirada en las formas ancestrales de la artesanía colombiana.',
                'precio' => 145000,
            ],
            [
                'nombre' => 'Centro de Mesa Montaña',
                'categoria' => 'Cerámica',
                'descripcion' => 'Centro de mesa artesanal con formas naturales y acabado artesanal.',
                'precio' => 135000,
            ],

            // MADERA
            [
                'nombre' => 'Bandeja Bosque Vivo',
                'categoria' => 'Madera',
                'descripcion' => 'Bandeja tallada en madera con vetas naturales visibles y acabado protector.',
                'precio' => 145000,
            ],
            [
                'nombre' => 'Cuenco Roble de la Sierra',
                'categoria' => 'Madera',
                'descripcion' => 'Cuenco trabajado artesanalmente para conservar la textura y personalidad de la madera.',
                'precio' => 88000,
            ],
            [
                'nombre' => 'Tabla Cosecha Colombiana',
                'categoria' => 'Madera',
                'descripcion' => 'Tabla para servir elaborada artesanalmente con madera seleccionada.',
                'precio' => 99000,
            ],
            [
                'nombre' => 'Cofre Secretos del Bosque',
                'categoria' => 'Madera',
                'descripcion' => 'Pequeño cofre decorativo tallado a mano para guardar objetos especiales.',
                'precio' => 118000,
            ],
            [
                'nombre' => 'Escultura Espíritu del Jaguar',
                'categoria' => 'Madera',
                'descripcion' => 'Figura artesanal tallada a mano inspirada en uno de los animales emblemáticos de Colombia.',
                'precio' => 235000,
            ],
            [
                'nombre' => 'Portavelas Noche Andina',
                'categoria' => 'Madera',
                'descripcion' => 'Portavelas artesanal con formas orgánicas y acabado natural.',
                'precio' => 62000,
            ],
            [
                'nombre' => 'Organizador Raíz Natural',
                'categoria' => 'Madera',
                'descripcion' => 'Organizador de madera hecho a mano para escritorio o espacios del hogar.',
                'precio' => 108000,
            ],
            [
                'nombre' => 'Marco Caminos de Colombia',
                'categoria' => 'Madera',
                'descripcion' => 'Marco decorativo de madera con detalles tallados artesanalmente.',
                'precio' => 92000,
            ],
            [
                'nombre' => 'Mortero Sabores de la Tierra',
                'categoria' => 'Madera',
                'descripcion' => 'Mortero artesanal pensado para preparar especias y conservar el sabor tradicional.',
                'precio' => 83000,
            ],
            [
                'nombre' => 'Caja Café de Montaña',
                'categoria' => 'Madera',
                'descripcion' => 'Caja artesanal inspirada en las montañas cafeteras colombianas.',
                'precio' => 127000,
            ],

            // TEJIDOS
            [
                'nombre' => 'Mochila Amanecer Wayuu',
                'categoria' => 'Tejidos',
                'descripcion' => 'Mochila tejida artesanalmente con patrones geométricos inspirados en la tradición Wayuu.',
                'precio' => 245000,
            ],
            [
                'nombre' => 'Bolso Caminos del Caribe',
                'categoria' => 'Tejidos',
                'descripcion' => 'Bolso tejido a mano con una combinación de formas y texturas inspiradas en el Caribe.',
                'precio' => 178000,
            ],
            [
                'nombre' => 'Tapiz Montañas Vivas',
                'categoria' => 'Tejidos',
                'descripcion' => 'Tapiz decorativo elaborado con fibras y tejidos artesanales.',
                'precio' => 215000,
            ],
            [
                'nombre' => 'Camino de Mesa Tierra',
                'categoria' => 'Tejidos',
                'descripcion' => 'Camino de mesa tejido artesanalmente con diseño inspirado en colores naturales.',
                'precio' => 96000,
            ],
            [
                'nombre' => 'Cojín Selva Colombiana',
                'categoria' => 'Tejidos',
                'descripcion' => 'Cojín artesanal con textura tejida y motivos inspirados en la naturaleza.',
                'precio' => 89000,
            ],
            [
                'nombre' => 'Chal Luna de Montaña',
                'categoria' => 'Tejidos',
                'descripcion' => 'Chal artesanal tejido a mano, ligero y pensado para complementar diferentes estilos.',
                'precio' => 164000,
            ],
            [
                'nombre' => 'Bufanda Niebla Andina',
                'categoria' => 'Tejidos',
                'descripcion' => 'Bufanda tejida artesanalmente con textura suave y diseño inspirado en los Andes.',
                'precio' => 118000,
            ],
            [
                'nombre' => 'Canasto Tejido Palma Dorada',
                'categoria' => 'Tejidos',
                'descripcion' => 'Canasto tejido con fibras naturales para decoración y almacenamiento.',
                'precio' => 105000,
            ],
            [
                'nombre' => 'Cesta Hogar Raíces',
                'categoria' => 'Tejidos',
                'descripcion' => 'Cesta artesanal elaborada con fibras naturales y técnicas tradicionales.',
                'precio' => 94000,
            ],
            [
                'nombre' => 'Atrapasueños Canto del Viento',
                'categoria' => 'Tejidos',
                'descripcion' => 'Pieza decorativa tejida a mano con fibras naturales y detalles artesanales.',
                'precio' => 72000,
            ],

            // FIBRAS NATURALES
            [
                'nombre' => 'Canasto Fique de Montaña',
                'categoria' => 'Fibras Naturales',
                'descripcion' => 'Canasto elaborado con fique natural mediante técnicas artesanales tradicionales.',
                'precio' => 115000,
            ],
            [
                'nombre' => 'Cesta Palma del Caribe',
                'categoria' => 'Fibras Naturales',
                'descripcion' => 'Cesta decorativa tejida con fibras de palma seleccionadas.',
                'precio' => 97000,
            ],
            [
                'nombre' => 'Bolso Fibras del Valle',
                'categoria' => 'Fibras Naturales',
                'descripcion' => 'Bolso artesanal elaborado con fibras naturales de textura resistente.',
                'precio' => 152000,
            ],
            [
                'nombre' => 'Portavasos Fique Natural',
                'categoria' => 'Fibras Naturales',
                'descripcion' => 'Juego de portavasos elaborados artesanalmente con fique.',
                'precio' => 48000,
            ],
            [
                'nombre' => 'Bandeja Palma Silvestre',
                'categoria' => 'Fibras Naturales',
                'descripcion' => 'Bandeja artesanal tejida con fibras naturales para servir o decorar.',
                'precio' => 86000,
            ],
            [
                'nombre' => 'Panera Cosecha Natural',
                'categoria' => 'Fibras Naturales',
                'descripcion' => 'Panera artesanal tejida con fibras naturales y acabados tradicionales.',
                'precio' => 78000,
            ],
            [
                'nombre' => 'Frutero Raíces del Campo',
                'categoria' => 'Fibras Naturales',
                'descripcion' => 'Frutero tejido artesanalmente con fibras de origen natural.',
                'precio' => 83000,
            ],
            [
                'nombre' => 'Organizador Fique Dorado',
                'categoria' => 'Fibras Naturales',
                'descripcion' => 'Organizador artesanal para el hogar elaborado con fique.',
                'precio' => 92000,
            ],
            [
                'nombre' => 'Canasta Cosecha Caribe',
                'categoria' => 'Fibras Naturales',
                'descripcion' => 'Canasta artesanal de fibras naturales inspirada en los colores del Caribe.',
                'precio' => 128000,
            ],
            [
                'nombre' => 'Lámpara Fibra de Luna',
                'categoria' => 'Fibras Naturales',
                'descripcion' => 'Lámpara decorativa artesanal tejida con fibras naturales para crear ambientes cálidos.',
                'precio' => 198000,
            ],

            // ACCESORIOS
            [
                'nombre' => 'Collar Semillas del Bosque',
                'categoria' => 'Accesorios',
                'descripcion' => 'Collar artesanal elaborado con semillas naturales cuidadosamente seleccionadas.',
                'precio' => 68000,
            ],
            [
                'nombre' => 'Pulsera Caminos de Tierra',
                'categoria' => 'Accesorios',
                'descripcion' => 'Pulsera tejida artesanalmente con detalles inspirados en patrones tradicionales.',
                'precio' => 39000,
            ],
            [
                'nombre' => 'Aretes Sol del Caribe',
                'categoria' => 'Accesorios',
                'descripcion' => 'Aretes artesanales ligeros con formas inspiradas en el sol y el Caribe colombiano.',
                'precio' => 52000,
            ],
            [
                'nombre' => 'Aretes Flor de Montaña',
                'categoria' => 'Accesorios',
                'descripcion' => 'Aretes hechos a mano con detalles florales inspirados en la naturaleza.',
                'precio' => 57000,
            ],
            [
                'nombre' => 'Pulsera Fuego Andino',
                'categoria' => 'Accesorios',
                'descripcion' => 'Pulsera artesanal con tejido tradicional y combinación de tonos cálidos.',
                'precio' => 44000,
            ],
            [
                'nombre' => 'Collar Luna de Semillas',
                'categoria' => 'Accesorios',
                'descripcion' => 'Collar artesanal elaborado con materiales naturales y diseño inspirado en la luna.',
                'precio' => 74000,
            ],
            [
                'nombre' => 'Peineta Flores del Campo',
                'categoria' => 'Accesorios',
                'descripcion' => 'Peineta decorativa artesanal inspirada en flores tradicionales.',
                'precio' => 61000,
            ],
            [
                'nombre' => 'Broche Jardín Colombiano',
                'categoria' => 'Accesorios',
                'descripcion' => 'Broche artesanal con diseño floral inspirado en la biodiversidad colombiana.',
                'precio' => 55000,
            ],
            [
                'nombre' => 'Llaveros Caminos de Colombia',
                'categoria' => 'Accesorios',
                'descripcion' => 'Set de llaveros artesanales inspirados en diferentes paisajes colombianos.',
                'precio' => 46000,
            ],
            [
                'nombre' => 'Pulsera Río de Montaña',
                'categoria' => 'Accesorios',
                'descripcion' => 'Pulsera artesanal tejida a mano con un diseño inspirado en los ríos de montaña.',
                'precio' => 41000,
            ],

            // DECORACIÓN
            [
                'nombre' => 'Escultura Guardián del Bosque',
                'categoria' => 'Decoración',
                'descripcion' => 'Escultura artesanal decorativa inspirada en la fauna y los bosques colombianos.',
                'precio' => 280000,
            ],
            [
                'nombre' => 'Figura Colibrí de la Sierra',
                'categoria' => 'Decoración',
                'descripcion' => 'Figura decorativa artesanal inspirada en el colibrí y la biodiversidad de Colombia.',
                'precio' => 132000,
            ],
            [
                'nombre' => 'Máscara Espíritu del Caribe',
                'categoria' => 'Decoración',
                'descripcion' => 'Máscara decorativa artesanal inspirada en la identidad cultural del Caribe.',
                'precio' => 175000,
            ],
            [
                'nombre' => 'Farol Noche de Pueblo',
                'categoria' => 'Decoración',
                'descripcion' => 'Farol artesanal decorativo inspirado en las noches de los pueblos colombianos.',
                'precio' => 119000,
            ],
            [
                'nombre' => 'Campana Viento de Montaña',
                'categoria' => 'Decoración',
                'descripcion' => 'Campana decorativa artesanal diseñada para producir un sonido suave con el viento.',
                'precio' => 87000,
            ],
            [
                'nombre' => 'Móvil Canto de Aves',
                'categoria' => 'Decoración',
                'descripcion' => 'Móvil artesanal decorativo inspirado en las aves de Colombia.',
                'precio' => 98000,
            ],
            [
                'nombre' => 'Espejo Camino Andino',
                'categoria' => 'Decoración',
                'descripcion' => 'Espejo decorativo con marco artesanal inspirado en formas naturales.',
                'precio' => 225000,
            ],
            [
                'nombre' => 'Cuadro Paisaje Cafetero',
                'categoria' => 'Decoración',
                'descripcion' => 'Pieza decorativa inspirada en los paisajes de la región cafetera colombiana.',
                'precio' => 189000,
            ],
            [
                'nombre' => 'Adorno Flor Tropical',
                'categoria' => 'Decoración',
                'descripcion' => 'Adorno artesanal inspirado en las flores tropicales de Colombia.',
                'precio' => 69000,
            ],
            [
                'nombre' => 'Centro Decorativo Selva',
                'categoria' => 'Decoración',
                'descripcion' => 'Pieza decorativa artesanal inspirada en las formas de la selva colombiana.',
                'precio' => 142000,
            ],

            // HOGAR
            [
                'nombre' => 'Set Mesa Tierra Colombiana',
                'categoria' => 'Hogar',
                'descripcion' => 'Set artesanal para mesa compuesto por piezas inspiradas en materiales naturales.',
                'precio' => 175000,
            ],
            [
                'nombre' => 'Set Cocina Sabores de Raíz',
                'categoria' => 'Hogar',
                'descripcion' => 'Conjunto de utensilios artesanales pensado para una cocina con identidad.',
                'precio' => 158000,
            ],
            [
                'nombre' => 'Cucharas Madera del Bosque',
                'categoria' => 'Hogar',
                'descripcion' => 'Juego de cucharas talladas artesanalmente en madera.',
                'precio' => 67000,
            ],
            [
                'nombre' => 'Espátula Cosecha Andina',
                'categoria' => 'Hogar',
                'descripcion' => 'Espátula de madera elaborada artesanalmente para acompañar la cocina diaria.',
                'precio' => 43000,
            ],
            [
                'nombre' => 'Tabla Servir Amanecer',
                'categoria' => 'Hogar',
                'descripcion' => 'Tabla artesanal para servir alimentos con acabado natural.',
                'precio' => 92000,
            ],
            [
                'nombre' => 'Salvamanteles Fibras del Campo',
                'categoria' => 'Hogar',
                'descripcion' => 'Salvamanteles tejido artesanalmente con fibras naturales.',
                'precio' => 54000,
            ],
            [
                'nombre' => 'Portavelas Noche Caribe',
                'categoria' => 'Hogar',
                'descripcion' => 'Portavelas artesanal pensado para crear ambientes cálidos en el hogar.',
                'precio' => 59000,
            ],
            [
                'nombre' => 'Bandeja Desayuno Andino',
                'categoria' => 'Hogar',
                'descripcion' => 'Bandeja artesanal de madera para desayunos y momentos especiales.',
                'precio' => 116000,
            ],
            [
                'nombre' => 'Organizador Esencia Natural',
                'categoria' => 'Hogar',
                'descripcion' => 'Organizador artesanal para mantener espacios ordenados y con estilo natural.',
                'precio' => 89000,
            ],
            [
                'nombre' => 'Frutero Madera de Montaña',
                'categoria' => 'Hogar',
                'descripcion' => 'Frutero artesanal tallado en madera con diseño orgánico.',
                'precio' => 108000,
            ],

            // ARTE COLOMBIANO
            [
                'nombre' => 'Jaguar Espíritu de Colombia',
                'categoria' => 'Arte Colombiano',
                'descripcion' => 'Pieza artística artesanal inspirada en la fuerza y presencia del jaguar colombiano.',
                'precio' => 320000,
            ],
            [
                'nombre' => 'Cóndor Guardián de los Andes',
                'categoria' => 'Arte Colombiano',
                'descripcion' => 'Obra artesanal inspirada en el cóndor y los paisajes de la cordillera.',
                'precio' => 295000,
            ],
            [
                'nombre' => 'Colibrí Corazón de Selva',
                'categoria' => 'Arte Colombiano',
                'descripcion' => 'Pieza decorativa inspirada en el color y movimiento del colibrí.',
                'precio' => 185000,
            ],
            [
                'nombre' => 'Atardecer sobre el Valle',
                'categoria' => 'Arte Colombiano',
                'descripcion' => 'Obra artesanal inspirada en los colores de un atardecer colombiano.',
                'precio' => 245000,
            ],
            [
                'nombre' => 'Memoria de los Abuelos',
                'categoria' => 'Arte Colombiano',
                'descripcion' => 'Pieza artesanal que representa la transmisión de historias entre generaciones.',
                'precio' => 275000,
            ],
            [
                'nombre' => 'Guardianes de la Montaña',
                'categoria' => 'Arte Colombiano',
                'descripcion' => 'Obra decorativa inspirada en las comunidades y paisajes de los Andes.',
                'precio' => 260000,
            ],
            [
                'nombre' => 'Caminos de Nuestra Tierra',
                'categoria' => 'Arte Colombiano',
                'descripcion' => 'Pieza artesanal que representa la diversidad de caminos y territorios colombianos.',
                'precio' => 210000,
            ],
            [
                'nombre' => 'Corazón de Fique',
                'categoria' => 'Arte Colombiano',
                'descripcion' => 'Obra artesanal elaborada con fibras naturales y formas inspiradas en Colombia.',
                'precio' => 198000,
            ],
            [
                'nombre' => 'Raíces del Caribe',
                'categoria' => 'Arte Colombiano',
                'descripcion' => 'Pieza decorativa inspirada en la cultura, colores y energía del Caribe colombiano.',
                'precio' => 230000,
            ],
            [
                'nombre' => 'Alma de la Selva',
                'categoria' => 'Arte Colombiano',
                'descripcion' => 'Obra artesanal inspirada en la biodiversidad y los paisajes de la selva.',
                'precio' => 310000,
            ],
        ];

        /*
        |--------------------------------------------------------------------------
        | IMÁGENES LOCALES ÚNICAS
        |--------------------------------------------------------------------------
        */

        $directorio = storage_path('app/public/productos');

        if (!File::exists($directorio)) {
            File::makeDirectory($directorio, 0755, true);
        }

        foreach ($productos as $indice => $productoData) {

            $slug = strtolower(
                preg_replace(
                    '/[^A-Za-z0-9]+/',
                    '-',
                    iconv('UTF-8', 'ASCII//TRANSLIT', $productoData['nombre'])
                )
            );

            $slug = trim($slug, '-');

            $nombreImagen = 'raices-' . ($indice + 1) . '-' . $slug . '.svg';

            $rutaImagen = $directorio . DIRECTORY_SEPARATOR . $nombreImagen;

            $svg = $this->crearImagenProducto(
                $productoData['nombre'],
                $productoData['categoria'],
                $indice
            );

            File::put($rutaImagen, $svg);

            Producto::updateOrCreate(
                [
                    'nombre' => $productoData['nombre'],
                ],
                [
                    'user_id' => $admin->id,
                    'descripcion' => $productoData['descripcion'],
                    'precio' => $productoData['precio'],
                    'stock' => rand(4, 30),
                    'categoria' => $productoData['categoria'],
                    'imagen' => 'productos/' . $nombreImagen,
                    'activo' => true,
                ]
            );
        }

        $this->command->info(
            'Se cargaron correctamente ' . count($productos) . ' productos artesanales únicos.'
        );
    }

    private function crearImagenProducto(
        string $nombre,
        string $categoria,
        int $indice
    ): string {
        $fondos = [
            '#E8DCC8',
            '#D8C3A5',
            '#C9B79C',
            '#E4D5C4',
            '#D6C7B2',
            '#E1D8CC',
            '#CBBFA9',
            '#DED0BC',
            '#D5C8B5',
            '#E7DCCB',
        ];

        $acento = [
            '#5C4033',
            '#795548',
            '#6D4C41',
            '#8D6E63',
            '#4E342E',
            '#795548',
            '#5D4037',
            '#6B4F3A',
            '#704214',
            '#806044',
        ];

        $fondo = $fondos[$indice % count($fondos)];
        $colorAcento = $acento[$indice % count($acento)];

        $numero = $indice + 1;

        $nombreSeguro = htmlspecialchars(
            $nombre,
            ENT_QUOTES | ENT_XML1,
            'UTF-8'
        );

        $categoriaSegura = htmlspecialchars(
            $categoria,
            ENT_QUOTES | ENT_XML1,
            'UTF-8'
        );

        return <<<SVG
<svg xmlns="http://www.w3.org/2000/svg" width="900" height="700" viewBox="0 0 900 700">
    <rect width="900" height="700" fill="{$fondo}"/>

    <circle
        cx="450"
        cy="300"
        r="190"
        fill="none"
        stroke="{$colorAcento}"
        stroke-width="8"
        opacity="0.25"
    />

    <circle
        cx="450"
        cy="300"
        r="130"
        fill="none"
        stroke="{$colorAcento}"
        stroke-width="4"
        opacity="0.35"
    />

    <path
        d="M270 390 Q450 130 630 390"
        fill="none"
        stroke="{$colorAcento}"
        stroke-width="12"
        opacity="0.65"
    />

    <path
        d="M320 410 Q450 230 580 410"
        fill="none"
        stroke="{$colorAcento}"
        stroke-width="7"
        opacity="0.45"
    />

    <circle
        cx="450"
        cy="300"
        r="65"
        fill="{$colorAcento}"
        opacity="0.18"
    />

    <text
        x="450"
        y="285"
        text-anchor="middle"
        font-family="Arial, sans-serif"
        font-size="32"
        font-weight="bold"
        fill="{$colorAcento}"
    >
        RAÍCES
    </text>

    <text
        x="450"
        y="330"
        text-anchor="middle"
        font-family="Arial, sans-serif"
        font-size="18"
        fill="{$colorAcento}"
    >
        PIEZA ARTESANAL #{$numero}
    </text>

    <text
        x="450"
        y="555"
        text-anchor="middle"
        font-family="Arial, sans-serif"
        font-size="27"
        font-weight="bold"
        fill="{$colorAcento}"
    >
        {$nombreSeguro}
    </text>

    <text
        x="450"
        y="595"
        text-anchor="middle"
        font-family="Arial, sans-serif"
        font-size="20"
        fill="{$colorAcento}"
    >
        {$categoriaSegura}
    </text>

    <text
        x="450"
        y="640"
        text-anchor="middle"
        font-family="Arial, sans-serif"
        font-size="16"
        fill="{$colorAcento}"
        opacity="0.75"
    >
        Hecho a mano · Colombia · RAÍCES
    </text>
</svg>
SVG;
    }
}