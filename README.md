# Calzado del Pueblo

Una tienda en línea premium de calzado urbano con experiencia de usuario excepcional. Diseñada para ofrecer productos de alta calidad con un enfoque en la elegancia y el estilo moderno.

## ✨ Características

- **Diseño Premium**: Interfaz elegante con animaciones suaves y diseño responsivo
- **Catálogo Completo**: Colección de zapatos urbanos con imágenes de alta calidad
- **Carrito de Compras**: Sistema completo de carrito con gestión de cantidades y tallas
- **Autenticación**: Sistema de registro y login de usuarios
- **API REST**: Endpoints para productos, servicios y autenticación
- **Base de Datos**: SQLite con Prisma ORM para persistencia de datos
- **Despliegue**: Optimizado para Vercel con Next.js

## 🛠️ Tecnologías

- **Frontend**: Next.js 16, React 19, CSS Modules
- **Backend**: Next.js API Routes
- **Base de Datos**: SQLite con Prisma
- **Autenticación**: JWT con bcryptjs
- **UI/UX**: Lucide React icons, fuentes Google Fonts
- **Despliegue**: Vercel

## 🚀 Instalación y Ejecución

### Prerrequisitos

- Node.js 18+ (recomendado 20+)
- npm o yarn

### Instalación

1. Clona el repositorio:
```bash
git clone https://github.com/AngeloE14/PaginaZapatos.git
cd PaginaZapatos
```

2. Instala las dependencias:
```bash
npm install
```

3. Configura la base de datos:
```bash
npx prisma generate
```

4. Ejecuta el servidor de desarrollo:
```bash
npm run dev
```

5. Abre [http://localhost:3000](http://localhost:3000) en tu navegador.

## 📁 Estructura del Proyecto

```
src/
├── app/                    # Next.js App Router
│   ├── api/               # API Routes
│   │   ├── auth/          # Autenticación
│   │   ├── products/      # Productos
│   │   ├── services/      # Servicios
│   │   └── ...
│   ├── productos/         # Página de productos
│   ├── reparaciones/      # Página de reparaciones
│   ├── layout.js          # Layout principal
│   ├── page.js            # Página de inicio
│   └── globals.css        # Estilos globales
├── components/            # Componentes reutilizables
│   ├── Header.jsx         # Navegación principal
│   ├── Footer.jsx         # Pie de página
│   ├── CartSection.jsx    # Carrito de compras
│   └── ...
├── context/               # Context API
│   └── AppContext.js      # Estado global de la app
└── lib/                   # Utilidades
    └── db.js              # Configuración de base de datos
```

## 🎯 Funcionalidades

### Para Usuarios
- Explorar catálogo de productos
- Ver detalles de productos con selección de tallas
- Agregar productos al carrito
- Gestionar carrito (cantidades, eliminación)
- Sistema de autenticación (registro/login)
- Cotización de servicios de reparación

### Para Administradores
- Gestión de productos vía API
- Gestión de usuarios
- Servicios de reparación

## 📡 API Endpoints

- `GET /api/products` - Lista todos los productos
- `POST /api/auth/login` - Autenticación de usuario
- `POST /api/auth/register` - Registro de usuario
- `GET /api/services` - Lista servicios de reparación
- `POST /api/services/quote` - Cotización de reparación

## 👥 Equipo de Desarrollo

- **Angelo Emmanuel Flores Montes**
- **Oscar Gomez Vazquez**
- **Esteban Santos Angulo**
- **Arath Daniel Noriega Domíngue**
- **Enrique Vega Mayer**

## 🚀 Despliegue

Este proyecto está optimizado para desplegarse en Vercel:

1. Conecta tu repositorio de GitHub a Vercel
2. Configura las variables de entorno si es necesario
3. Despliega automáticamente con cada push

### Configuración de Vercel

- **Root Directory**: `./`
- **Build Command**: `npm run build`
- **Output Directory**: vacío (Next.js default)

## 📄 Licencia

Este proyecto es parte de un trabajo académico y no tiene licencia comercial.
