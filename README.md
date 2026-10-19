# 🌱 RAÍCES — Plataforma de comercio para productos artesanales

RAÍCES es un proyecto colaborativo de desarrollo web orientado a conectar productos artesanales con sus usuarios mediante una plataforma digital. Su desarrollo integra frontend, backend y gestión de datos, aplicando conocimientos de programación, organización de software y trabajo en equipo.

> **Estado:** Proyecto en desarrollo.

## 📌 Acerca del proyecto

El objetivo de RAÍCES es construir una plataforma web que facilite la exploración de productos y la interacción entre usuarios y artesanos.

La estructura actual del código contempla módulos relacionados con productos, autenticación, perfiles, carrito de compras, pedidos, experiencias artesanales y administración. La disponibilidad y el funcionamiento completo de cada módulo deben verificarse en la aplicación.

## ✨ Funcionalidades contempladas

- 🛍️ Catálogo y detalle de productos.
- 🔐 Registro, inicio de sesión y recuperación de contraseña.
- 🛒 Carrito de compras, favoritos y proceso de checkout.
- 📦 Consulta y gestión de pedidos.
- 👤 Perfiles de usuarios y artesanos.
- 🗺️ Mapa y funcionalidades relacionadas con rutas de entrega.
- 📊 Paneles de administración.
- 🎥 Sección de videos y experiencias.

## 🛠️ Tecnologías

### Frontend

- **React** — construcción de interfaces.
- **JavaScript** — lógica de la aplicación.
- **Vite** — herramientas de desarrollo y compilación.
- **React Router** — navegación entre páginas.
- **Axios** — comunicación HTTP.
- **Bootstrap** y **Bootstrap Icons** — estilos e iconografía.
- **Leaflet** y **React Leaflet** — integración de mapas.
- **Chart.js** y **React Chart.js 2** — visualización de datos.
- **jsPDF** y **jspdf-autotable** — generación de documentos PDF.

### Backend

- **PHP 8.4** — entorno PHP declarado en el Dockerfile.
- **Laravel 13** — framework backend declarado en Composer.
- **Composer** — gestión de dependencias PHP.
- **Laravel Sanctum** — herramienta disponible para autenticación mediante API y sesiones.
- **Apache** — servidor web utilizado en el contenedor Docker.
- **MySQL y PostgreSQL** — extensiones de conexión incluidas en el Dockerfile; el motor realmente utilizado debe confirmarse en la configuración del entorno.

### Despliegue y herramientas

- **Docker** — configuración del entorno de ejecución del backend.
- **Render** — plataforma indicada en la configuración de despliegue.
- **Git y GitHub** — control de versiones y colaboración.

## 🏗️ Estructura del proyecto

```text
raices/
├── backend/          # Aplicación Laravel y API
├── frontend/         # Aplicación React
├── src/              # Código fuente adicional en la raíz
├── render.yaml       # Configuración de despliegue en Render
└── README.md         # Documentación del proyecto
```

La estructura puede evolucionar durante el desarrollo. El frontend y el backend cuentan con sus propias dependencias y herramientas de ejecución.

## 🚀 Instalación y ejecución

### Requisitos previos

- Git.
- Node.js y npm.
- PHP compatible con Laravel 13.
- Composer.
- Un motor de base de datos compatible con la configuración del proyecto.

### 1. Clonar el repositorio

```bash
git clone https://github.com/matiasserrato156-dotcom/raices.git
cd raices
```

### 2. Preparar el backend

```bash
cd backend
composer install
```

Configura las variables de entorno a partir de `.env.example`, si está disponible:

```bash
cp .env.example .env
php artisan key:generate
```

Configura la conexión a la base de datos en el archivo `.env`. Después de verificar que la conexión y las migraciones sean correctas, ejecuta:

```bash
php artisan migrate
php artisan serve
```

### 3. Preparar el frontend

Abre una terminal independiente desde la carpeta raíz del repositorio:

```bash
cd frontend
npm install
npm run dev
```

Utiliza la dirección local que muestre Vite en la terminal para abrir la aplicación.

> **Nota:** Estos son pasos de referencia. La ejecución completa puede requerir variables de entorno adicionales, configuración de la API y ajustes específicos del proyecto.

## 👥 Equipo de desarrollo

RAÍCES es un proyecto colaborativo desarrollado por:

- **Eilin Acuña**
- **Jschua Ramírez**
- **Matías Serrato**

El proyecto refleja el trabajo conjunto en el desarrollo de una aplicación web y la aplicación práctica de conocimientos de programación, arquitectura y organización del código.

## 📚 Aprendizajes y objetivos

- Desarrollo de interfaces con React.
- Construcción de funcionalidades backend con Laravel y PHP.
- Organización de un proyecto con frontend y backend.
- Integración de dependencias y servicios web.
- Gestión de versiones y colaboración mediante Git y GitHub.
- Preparación de una aplicación para su ejecución y posible despliegue.

## 👨‍💻 Perfil

**Matías Serrato**  
Aprendiz de desarrollo Full Stack, enfocado en fortalecer sus habilidades en desarrollo frontend, backend, bases de datos y construcción de aplicaciones web mediante proyectos prácticos.

## 📄 Licencia

La licencia del proyecto debe definirse de acuerdo con los acuerdos del equipo y las condiciones de uso del código y sus dependencias.

---

⭐ Gracias por visitar **RAÍCES**.
