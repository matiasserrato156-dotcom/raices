<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('resenas', function (Blueprint $table) {
            $table->id();

            $table->foreignId('producto_id')
                ->constrained('productos')
                ->cascadeOnDelete();

            $table->foreignId('user_id')
                ->constrained('users')
                ->cascadeOnDelete();

            $table->unsignedTinyInteger('calificacion');

            $table->text('comentario');

            $table->timestamps();

            $table->unique(
                ['producto_id', 'user_id'],
                'resenas_producto_usuario_unique'
            );

            $table->index('producto_id');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('resenas');
    }
};