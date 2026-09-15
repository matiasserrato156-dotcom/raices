<x-mail::message>
# Actualización de tu pedido en RAÍCES

Hola {{ $pedido->user->name }},

Te informamos que el estado de tu pedido **#{{ $pedido->id }}** ha sido actualizado.

## Estado del pedido

**Estado anterior:**

{{ ucfirst(str_replace('_', ' ', $estadoAnterior)) }}

**Nuevo estado:**

{{ ucfirst(str_replace('_', ' ', $pedido->estado)) }}

---

## Detalles de tu pedido

@foreach ($pedido->detalles as $detalle)

### {{ $detalle->producto->nombre }}

- **Cantidad:** {{ $detalle->cantidad }}
- **Precio unitario:** ${{ number_format($detalle->precio_unitario, 0, ',', '.') }}
- **Subtotal:** ${{ number_format($detalle->subtotal, 0, ',', '.') }}

@endforeach

---

## Información de entrega

**Total del pedido:**

${{ number_format($pedido->total, 0, ',', '.') }}

**Dirección:**

{{ $pedido->direccion ?? 'No especificada' }}

@if ($pedido->observaciones)

**Observaciones:**

{{ $pedido->observaciones }}

@endif

---

<x-mail::button :url="rtrim(env('FRONTEND_URL', 'http://localhost:5173'), '/') . '/pedidos/' . $pedido->id">
Ver mi pedido
</x-mail::button>

Gracias por comprar en **RAÍCES**.

Saludos,

**Equipo RAÍCES**
</x-mail::message>