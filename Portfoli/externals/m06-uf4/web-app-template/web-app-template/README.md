# Proyecto CRUD - Categorías Sakila

## Descripción
Aplicación web para gestionar la tabla `category` de la base de datos Sakila usando Node.js, Express, TypeScript y una interfaz web simple.

## Requisitos previos
- Node.js instalado
- PostgreSQL instalado con la base de datos Sakila cargada
- VS Code con la extensión REST Client instalada

## Estructura del proyecto

```
web-app-template/
├── api/                    # Backend con Express
│   ├── routes/
│   │   └── categories.ts   # Rutas CRUD de categorías
│   ├── engine/
│   │   └── database.ts     # Configuración de conexión a BD
│   ├── api.ts              # Servidor Express principal
│   └── package.json        # Dependencias del backend
├── web/                    # Frontend con Vite
│   ├── src/
│   │   ├── main.ts         # Lógica principal del cliente
│   │   └── styles.css      # Estilos de la aplicación
│   ├── index.html          # Estructura HTML
│   └── package.json        # Dependencias del frontend
└── requests.rest           # Peticiones para probar con REST Client
```

## Instalación y ejecución

### 1. Instalar dependencias del backend
```bash
cd api
npm install
cd ..
```

### 2. Instalar dependencias del frontend
```bash
cd web
npm install
cd ..
```

### 3. Verificar conexión a la base de datos
Asegúrate de que:
- PostgreSQL está corriendo
- Tienes la base de datos Sakila creada
- Los datos de conexión en `api/engine/database.ts` son correctos

### 4. Ejecutar el servidor backend
Abre una terminal en la carpeta `api`:
```bash
npm run dev
```

Deberías ver: `Listening backend in http://localhost:3000`

### 5. Ejecutar el servidor frontend
Abre otra terminal en la carpeta `web`:
```bash
npm run dev
```

Deberías ver una URL como: `Local: http://localhost:5173`

### 6. Abrir la aplicación
Ve a `http://localhost:5173` en tu navegador

## Cómo usar la aplicación

### Ver categorías
- La tabla carga automáticamente al abrir la página
- Muestra 10 categorías por página
- Puedes navegar con los botones "Anterior" y "Siguiente"

### Crear nueva categoría
1. Haz click en "+ Nueva Categoría"
2. Escribe el nombre
3. Haz click en "Guardar"

### Editar categoría
1. Haz click en el botón "Editar" en la fila de la categoría
2. Modifica el nombre
3. Haz click en "Guardar"

### Eliminar categoría
1. Haz click en el botón "Eliminar" en la fila
2. Confirma que deseas eliminar

## Probar la API con REST Client

Abre el archivo `requests.rest` y utiliza los comandos disponibles:

- **Listar** - GET a `/api/categories?page=1`
- **Obtener por ID** - GET a `/api/categories/1`
- **Crear** - POST a `/api/categories` con JSON
- **Actualizar** - PUT a `/api/categories/:id` con JSON
- **Eliminar** - DELETE a `/api/categories/:id`

Haz click en "Send Request" para enviar cada petición.

## Características principales

✅ Listar categorías con paginación de 10 registros  
✅ Crear nuevas categorías  
✅ Editar categorías existentes  
✅ Eliminar categorías  
✅ Spinner de carga mientras se obtienen datos  
✅ Modal para crear/editar  
✅ Interfaz responsiva  
✅ API REST completa  
✅ TypeScript en frontend y backend  

## Troubleshooting

**Error: "Cannot find module 'express'"**
- Ejecuta `npm install` en la carpeta `api`

**Error: "Connection refused" en base de datos**
- Verifica que PostgreSQL está corriendo
- Comprueba que los datos de conexión son correctos en `api/engine/database.ts`

**Error: "Cannot GET /api/categories"**
- Asegúrate de que el servidor backend está corriendo (`npm run dev` en la carpeta `api`)
- Comprueba que está escuchando en puerto 3000

## Notas importantes

- El spinner aparece automáticamente mientras se cargan datos
- Los botones de paginación se deshabilitan automáticamente en la primera/última página
- Se te pedirá confirmación antes de eliminar una categoría
- Los cambios se guardan directamente en la base de datos
