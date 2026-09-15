<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('pedidos', function (Blueprint $table) {
            $table->string('telefono', 30)
                ->nullable()
                ->after('direccion');

            $table->decimal('latitud', 10, 7)
                ->nullable()
                ->after('telefono');

            $table->decimal('longitud', 10, 7)
                ->nullable()
                ->after('latitud');
        });
    }

    public function down(): void
    {
        Schema::table('pedidos', function (Blueprint $table) {
            $table->dropColumn([
                'telefono',
                'latitud',
                'longitud',
            ]);
        });
    }
};