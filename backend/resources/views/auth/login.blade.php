<!DOCTYPE html>

<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">

```
<title>Iniciar sesión | Raíces</title>

@vite(['resources/css/app.css', 'resources/js/app.js'])
```

</head>

<body class="min-h-screen bg-gray-100 flex items-center justify-center">

```
<main class="w-full max-w-md px-6">

    <div class="bg-white rounded-2xl shadow-xl p-8">

        <div class="text-center mb-8">
            <h1 class="text-3xl font-bold text-gray-900">
                RAÍCES
            </h1>

            <p class="mt-2 text-gray-500">
                Inicia sesión para continuar
            </p>
        </div>

        <form id="loginForm" class="space-y-5">

            <div>
                <label for="email" class="block text-sm font-medium text-gray-700 mb-2">
                    Correo electrónico
                </label>

                <input
                    type="email"
                    id="email"
                    name="email"
                    required
                    autocomplete="email"
                    class="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-black focus:ring-1 focus:ring-black"
                    placeholder="correo@ejemplo.com"
                >
            </div>

            <div>
                <label for="password" class="block text-sm font-medium text-gray-700 mb-2">
                    Contraseña
                </label>

                <input
                    type="password"
                    id="password"
                    name="password"
                    required
                    autocomplete="current-password"
                    class="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-black focus:ring-1 focus:ring-black"
                    placeholder="••••••••"
                >
            </div>

            <div id="errorMessage"
                 class="hidden rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
            </div>

            <button
                type="submit"
                id="loginButton"
                class="w-full rounded-lg bg-black px-4 py-3 font-semibold text-white transition hover:bg-gray-800 disabled:opacity-50"
            >
                Iniciar sesión
            </button>

        </form>

        <div class="mt-6 text-center">

            <a
                href="/forgot-password"
                class="text-sm text-gray-600 hover:text-black"
            >
                ¿Olvidaste tu contraseña?
            </a>

        </div>

        <div class="mt-4 text-center">

            <span class="text-sm text-gray-500">
                ¿No tienes una cuenta?
            </span>

            <a
                href="/register"
                class="text-sm font-semibold text-black hover:underline"
            >
                Crear cuenta
            </a>

        </div>

    </div>

</main>
```

</body>
</html>
