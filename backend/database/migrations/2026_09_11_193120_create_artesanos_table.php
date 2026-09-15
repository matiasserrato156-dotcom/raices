<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('artesanos', function (Blueprint $table) {
            $table->id();
            $table->string('nombre');
            $table->string('foto')->nullable();
            $table->string('oficio');
            $table->string('comunidad');
            $table->string('departamento')->default('Colombia');
            $table->text('biografia');
            $table->text('historia_cultural')->nullable();
            $table->integer('anios_experiencia')->default(10);
            $table->boolean('verificado')->default(true);
            $table->string('telefono')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('artesanos');
    }
};