<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('pagos', function (Blueprint $table) {
            $table->id();

            $table->foreignId('pedido_id')
                ->constrained('pedidos')
                ->cascadeOnDelete();

            $table->enum('metodo', [
                'contraentrega',
                'nequi',
                'bancolombia',
            ]);

            $table->enum('estado', [
                'pendiente',
                'por_verificar',
                'verificado',
                'rechazado',
            ])->default('pendiente');

            $table->string('referencia', 255)->nullable();

            $table->string('comprobante', 500)->nullable();

            $table->decimal('monto', 12, 2);

            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('pagos');
    }
};