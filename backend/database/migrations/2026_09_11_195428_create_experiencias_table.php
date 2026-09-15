<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('experiencias', function (Blueprint $table) {
            $table->id();
            $table->string('titulo');
            $table->text('descripcion');
            $table->string('ubicacion');
            $table->string('artesano_nombre');
            $table->string('duracion');
            $table->decimal('precio', 12, 2);
            $table->integer('cupos_maximos')->default(10);
            $table->string('imagen')->nullable();
            $table->string('modalidad')->default('Presencial');
            $table->boolean('activo')->default(true);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('experiencias');
    }
};