<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('videos', function (Blueprint $table) {
            $table->id();
            $table->string('titulo');
            $table->text('descripcion');
            $table->string('url');
            $table->string('miniatura')->nullable();
            $table->string('categoria');
            $table->string('artesano_nombre')->nullable();
            $table->string('comunidad')->nullable();
            $table->string('duracion')->default('05:00');
            $table->unsignedBigInteger('vistas')->default(0);
            $table->boolean('destacado')->default(false);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('videos');
    }
};