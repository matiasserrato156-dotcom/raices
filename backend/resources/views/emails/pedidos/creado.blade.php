<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">

    <meta name="viewport" content="width=device-width, initial-scale=1.0">

    <title>Compra realizada - RAÍCES</title>
</head>

<body style="
    margin: 0;
    padding: 0;
    background-color: #f5f2eb;
    font-family: Arial, Helvetica, sans-serif;
    color: #1f2933;
">

<table
    width="100%"
    cellpadding="0"
    cellspacing="0"
    border="0"
    style="background-color: #f5f2eb; padding: 30px 15px;"
>
    <tr>
        <td align="center">

            <table
                width="600"
                cellpadding="0"
                cellspacing="0"
                border="0"
                style="
                    max-width: 600px;
                    width: 100%;
                    background-color: #ffffff;
                    border-radius: 12px;
                    overflow: hidden;
                    box-shadow: 0 3px 12px rgba(0,0,0,0.08);
                "
            >

                <!-- ENCABEZADO -->

                <tr>
                    <td
                        style="
                            background-color: #212529;
                            padding: 30px;
                            text-align: center;
                        "
                    >

                        <div
                            style="
                                color: #ffffff;
                                font-size: 28px;
                                font-weight: bold;
                                letter-spacing: 2px;
                            "
                        >
                            RAÍCES
                        </div>

                        <div
                            style="
                                color: #dddddd;
                                font-size: 14px;
                                margin-top: 8px;
                            "
                        >
                            Artesanías, cultura y tradición
                        </div>

                    </td>
                </tr>


                <!-- MENSAJE PRINCIPAL -->

                <tr>
                    <td style="padding: 35px 30px 20px;">

                        <h1
                            style="
                                margin: 0 0 15px;
                                font-size: 25px;
                                color: #212529;
                            "
                        >
                            🎉 ¡Has realizado una compra!
                        </h1>

                        <p
                            style="
                                font-size: 16px;
                                line-height: 1.6;
                                margin: 0;
                                color: #555555;
                            "
                        >
                            Hola
                            <strong>
                                {{ $pedido->user->name ?? 'cliente' }}
                            </strong>,
                        </p>

                        <p
                            style="
                                font-size: 16px;
                                line-height: 1.6;
                                color: #555555;
                            "
                        >
                            Tu compra en <strong>RAÍCES</strong> ha sido
                            registrada correctamente.
                        </p>

                    </td>
                </tr>


                <!-- PEDIDO -->

                <tr>
                    <td style="padding: 0 30px 20px;">

                        <table
                            width="100%"
                            cellpadding="0"
                            cellspacing="0"
                            border="0"
                            style="
                                background-color: #f8f9fa;
                                border-radius: 10px;
                            "
                        >

                            <tr>
                                <td style="padding: 20px;">

                                    <div
                                        style="
                                            font-size: 13px;
                                            color: #777777;
                                            margin-bottom: 5px;
                                        "
                                    >
                                        Número de pedido
                                    </div>

                                    <div
                                        style="
                                            font-size: 24px;
                                            font-weight: bold;
                                            color: #212529;
                                        "
                                    >
                                        #{{ $pedido->id }}
                                    </div>

                                    <div
                                        style="
                                            font-size: 13px;
                                            color: #777777;
                                            margin-top: 8px;
                                        "
                                    >
                                        {{ $pedido->created_at?->format('d/m/Y H:i') }}
                                    </div>

                                </td>
                            </tr>

                        </table>

                    </td>
                </tr>


                <!-- PRODUCTOS -->

                <tr>
                    <td style="padding: 10px 30px;">

                        <h2
                            style="
                                font-size: 20px;
                                margin: 0 0 20px;
                                color: #212529;
                            "
                        >
                            🛍️ Detalles de tu compra
                        </h2>

                        @foreach($pedido->detalles as $detalle)

                            <table
                                width="100%"
                                cellpadding="0"
                                cellspacing="0"
                                border="0"
                                style="
                                    border-bottom: 1px solid #eeeeee;
                                    margin-bottom: 15px;
                                    padding-bottom: 15px;
                                "
                            >

                                <tr>

                                    <!-- IMAGEN -->

                                    <td
                                        width="80"
                                        valign="top"
                                        style="padding-right: 15px;"
                                    >

                                        @if(
                                            !empty($detalle->producto?->imagen)
                                        )

                                            <img
                                                src="{{ $detalle->producto->imagen }}"
                                                alt="{{ $detalle->producto->nombre }}"
                                                width="70"
                                                height="70"
                                                style="
                                                    width: 70px;
                                                    height: 70px;
                                                    object-fit: cover;
                                                    border-radius: 8px;
                                                    display: block;
                                                "
                                            >

                                        @else

                                            <div
                                                style="
                                                    width: 70px;
                                                    height: 70px;
                                                    background-color: #f1f1f1;
                                                    border-radius: 8px;
                                                    text-align: center;
                                                    line-height: 70px;
                                                    font-size: 25px;
                                                "
                                            >
                                                🛍️
                                            </div>

                                        @endif

                                    </td>


                                    <!-- INFORMACIÓN -->

                                    <td valign="top">

                                        <div
                                            style="
                                                font-size: 16px;
                                                font-weight: bold;
                                                color: #212529;
                                            "
                                        >
                                            {{ $detalle->producto->nombre ?? 'Producto' }}
                                        </div>

                                        @if($detalle->producto?->categoria)

                                            <div
                                                style="
                                                    font-size: 12px;
                                                    color: #777777;
                                                    margin-top: 4px;
                                                "
                                            >
                                                {{ $detalle->producto->categoria }}
                                            </div>

                                        @endif

                                        <div
                                            style="
                                                font-size: 13px;
                                                color: #666666;
                                                margin-top: 7px;
                                            "
                                        >
                                            Cantidad:
                                            <strong>
                                                {{ $detalle->cantidad }}
                                            </strong>
                                        </div>

                                    </td>


                                    <!-- PRECIO -->

                                    <td
                                        width="100"
                                        valign="top"
                                        align="right"
                                    >

                                        <div
                                            style="
                                                font-size: 15px;
                                                font-weight: bold;
                                                color: #212529;
                                            "
                                        >
                                            ${{ number_format(
                                                (float) $detalle->subtotal,
                                                0,
                                                ',',
                                                '.'
                                            ) }}
                                        </div>

                                    </td>

                                </tr>

                            </table>

                        @endforeach

                    </td>
                </tr>


                <!-- TOTAL -->

                <tr>
                    <td style="padding: 10px 30px 25px;">

                        <table
                            width="100%"
                            cellpadding="0"
                            cellspacing="0"
                            border="0"
                        >

                            <tr>

                                <td
                                    style="
                                        font-size: 18px;
                                        font-weight: bold;
                                    "
                                >
                                    Total
                                </td>

                                <td
                                    align="right"
                                    style="
                                        font-size: 24px;
                                        font-weight: bold;
                                    "
                                >
                                    ${{ number_format(
                                        (float) $pedido->total,
                                        0,
                                        ',',
                                        '.'
                                    ) }}
                                </td>

                            </tr>

                        </table>

                    </td>
                </tr>


                <!-- ENTREGA -->

                <tr>
                    <td style="padding: 0 30px 25px;">

                        <table
                            width="100%"
                            cellpadding="0"
                            cellspacing="0"
                            border="0"
                            style="
                                background-color: #fafafa;
                                border-radius: 10px;
                            "
                        >

                            <tr>
                                <td style="padding: 20px;">

                                    <h2
                                        style="
                                            font-size: 18px;
                                            margin: 0 0 15px;
                                        "
                                    >
                                        📦 Información de entrega
                                    </h2>

                                    <div
                                        style="
                                            font-size: 13px;
                                            color: #777777;
                                            margin-bottom: 5px;
                                        "
                                    >
                                        Dirección
                                    </div>

                                    <div
                                        style="
                                            font-size: 15px;
                                            color: #333333;
                                            margin-bottom: 15px;
                                        "
                                    >
                                        {{ $pedido->direccion ?: 'No se indicó dirección.' }}
                                    </div>


                                    <div
                                        style="
                                            font-size: 13px;
                                            color: #777777;
                                            margin-bottom: 5px;
                                        "
                                    >
                                        Observaciones
                                    </div>

                                    <div
                                        style="
                                            font-size: 15px;
                                            color: #333333;
                                        "
                                    >
                                        {{ $pedido->observaciones ?: 'Sin observaciones.' }}
                                    </div>

                                </td>
                            </tr>

                        </table>

                    </td>
                </tr>


                <!-- BOTÓN -->

                <tr>
                    <td
                        align="center"
                        style="padding: 5px 30px 35px;"
                    >

                        <a
                            href="{{ rtrim(env('FRONTEND_URL', 'http://localhost:5173'), '/') }}/pedidos/{{ $pedido->id }}"
                            style="
                                display: inline-block;
                                background-color: #212529;
                                color: #ffffff;
                                text-decoration: none;
                                padding: 14px 28px;
                                border-radius: 7px;
                                font-size: 15px;
                                font-weight: bold;
                            "
                        >
                            🚚 Ver detalles y seguimiento
                        </a>

                    </td>
                </tr>


                <!-- TEXTO FINAL -->

                <tr>
                    <td
                        style="
                            background-color: #212529;
                            padding: 25px 30px;
                            text-align: center;
                        "
                    >

                        <div
                            style="
                                color: #ffffff;
                                font-size: 15px;
                                font-weight: bold;
                            "
                        >
                            Gracias por comprar en RAÍCES ❤️
                        </div>

                        <div
                            style="
                                color: #aaaaaa;
                                font-size: 12px;
                                margin-top: 8px;
                            "
                        >
                            Conectamos personas con nuestra cultura,
                            tradición y artesanía.
                        </div>

                    </td>
                </tr>

            </table>

        </td>
    </tr>
</table>

</body>
</html>