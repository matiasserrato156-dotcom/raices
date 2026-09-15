<?php

namespace Tests\Feature;

use Tests\TestCase;

class ExampleTest extends TestCase
{
    public function test_la_api_de_productos_responde_correctamente(): void
    {
        $response = $this->getJson('/api/productos');

        $response->assertStatus(200);
    }
}
