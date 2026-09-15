<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('reserva_experiencias', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained('users')->onDelete('cascade');
            $table->foreignId('experiencia_id')->constrained('experiencias')->onDelete('cascade');
            $table->date('fecha_reserva');
            $table->integer('cupos_reservados')->default(1);
            $table->decimal('total', 12, 2);
            $table->string('estado')->default('confirmada');
            $table->text('notas')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('reserva_experiencias');
    }
};