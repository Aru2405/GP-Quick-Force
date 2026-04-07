# GP-Quick-Force — Admin Frontend (Listado + Eliminación)

Parte del "Admin frontend" del proyecto GP-Quick-Force. Vista de administración y un servidor mock para desarrollo y pruebas.

## Estructura y archivos clave

- Punto de entrada: [src/main.jsx](src/main.jsx#L1)
- Componente admin (listado + eliminación): [src/components/AdminCarsList.jsx](src/components/AdminCarsList.jsx#L1)
- Cliente HTTP (Axios): [src/api/client.js](src/api/client.js#L1) — `baseURL` por defecto `http://localhost:4000/api`
- Servicios de coches: [src/api/cars.js](src/api/cars.js#L1) — `getCars()` y `deleteCar(id)`
- Servidor mock (datos en memoria): [server/index.js](server/index.js#L1)
- Scripts: [package.json](package.json#L1)

## Flujo resumido

- Al cargar la SPA, `AdminCarsList` llama a `getCars()` (GET `/api/cars`) y muestra una tabla con los vehículos.
- Al pulsar "Eliminar" se solicita confirmación; si se confirma se llama a `deleteCar(id)` (DELETE `/api/cars/:id`) y se elimina la fila del estado local sin recargar.
- El servidor mock devuelve y actualiza datos en memoria; reiniciarlo restaurará los datos iniciales.

## Comandos (desde la raíz del proyecto)

- Instalar dependencias:

```bash
npm install
```

- Iniciar servidor mock (puerto 4000):

```bash
npm run server
```

- Iniciar frontend (Vite - puerto 5173):

```bash
npm run dev
```

Visitar `http://localhost:5173` y la app mostrará la vista de administrador con listado y acción de eliminación.

Notas:
- El servidor mock mantiene datos en memoria; reiniciarlo restaura los ejemplos.
- El frontend usa `axios` apuntando a `http://localhost:4000/api`.
# GP-Quick-Force