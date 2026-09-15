<?php

namespace Tests\Unit;

use PHPUnit\Framework\TestCase;

class ExampleTest extends TestCase
{
    public function test_calculo_total_del_pedido(): void
    {
        $precio = 50000;
        $cantidad = 3;

        $total = $precio * $cantidad;

        $this->assertEquals(150000, $total);
    }
}