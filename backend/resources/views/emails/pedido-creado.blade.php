<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">

    <title>
        Confirmación de compra RAÍCES
    </title>
</head>

<body
    style="
        margin: 0;
        padding: 0;
        background: #f4f1ea;
        font-family: Arial, Helvetica, sans-serif;
        color: #212529;
    "
>
    <div
        style="
            max-width: 650px;
            margin: 30px auto;
            background: #ffffff;
            border-radius: 16px;
            overflow: hidden;
            box-shadow: 0 4px 20px rgba(0,0,0,.08);
        "
    >

        <div
            style="
                background: #212529;
                color: #ffffff;
                padding: 30px;
                text-align: center;
            "
        >
            <h1
                style="
                    margin: 0;
                    font-size: 32px;
                "
            >
                RAÍCES
            </h1>

            <p
                style="
                    margin: 10px 0 0;
                    opacity: .9;
                "
            >
                Artesanía, cultura y tradición colombiana
            </p>
        </div>

        <div style="padding: 35px;">

            <h2>
                ¡Gracias por tu compra!
            </h2>

            <p>
                Hola
                <strong>
                    {{ $pedido->user->name }}
                </strong>,
            </p>

            <p>
                Hemos recibido correctamente tu pedido.
                Aquí tienes el resumen de tu compra:
            </p>

            <div
                style="
                    background: #f8f9fa;
                    border-radius: 12px;
                    padding: 20px;
                    margin: 25px 0;
                "
            >
                <p>
                    <strong>Pedido:</strong>
                    #{{ $pedido->id }}
                </p>

                <p>
                    <strong>Fecha:</strong>
                    {{ $pedido->created_at->format('d/m/Y H:i') }}
                </p>

                <p>
                    <strong>Estado:</strong>
                    Pedido recibido
                </p>

                <p>
                    <strong>Dirección:</strong>
                    {{ $pedido->direccion }}
                </p>

                <p>
                    <strong>Teléfono:</strong>
                    {{ $pedido->telefono }}
                </p>
            </div>

            <h3>
                Productos
            </h3>

            @foreach ($pedido->detalles as $detalle)

                <div
                    style="
                        border-bottom: 1px solid #eeeeee;
                        padding: 12px 0;
                    "
                >
                    <strong>
                        {{ $detalle->producto->nombre }}
                    </strong>

                    <br>

                    <span style="color: #666666;">
                        Cantidad:
                        {{ $detalle->cantidad }}
                    </span>

                    <br>

                    <span>
                        ${{ number_format(
                            $detalle->subtotal,
                            0,
                            ',',
                            '.'
                        ) }}
                    </span>
                </div>

            @endforeach

            <div
                style="
                    text-align: right;
                    margin-top: 25px;
                    font-size: 22px;
                "
            >
                <strong>
                    Total:
                    ${{ number_format(
                        $pedido->total,
                        0,
                        ',',
                        '.'
                    ) }}
                </strong>
            </div>

            <div
                style="
                    background: #e9f7ef;
                    border-radius: 12px;
                    padding: 18px;
                    margin-top: 30px;
                "
            >
                <strong>
                    📦 ¿Quieres hacer seguimiento?
                </strong>

                <p style="margin-bottom: 0;">
                    Ingresa a RAÍCES y revisa el estado
                    de tu pedido para consultar su avance
                    y la ruta de entrega.
                </p>
            </div>

        </div>

        <div
            style="
                background: #f8f9fa;
                text-align: center;
                padding: 20px;
                color: #777777;
                font-size: 13px;
            "
        >
            RAÍCES — Cultura que conecta
        </div>

    </div>
</body>
</html>