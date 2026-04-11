# GP-Quick-Force — Admin Frontend con Persistencia en PostgreSQL

Parte del "Admin frontend" del proyecto GP-Quick-Force. Vista de administración para gestionar un catálogo de vehículos con persistencia en base de datos PostgreSQL.

## Stack tecnológico

- **Frontend:** React 18 + Vite
- **Backend:** Express.js
- **Base de datos:** PostgreSQL (en Docker)
- **ORM:** Prisma
- **Cliente HTTP:** Axios

## Requisitos previos

- Node.js 16+ y npm
- Docker y Docker Compose (para PostgreSQL)

## Instalación y setup

### 1. Instalar dependencias

```bash
npm install
```

### 2. Configurar variables de entorno

Copia `.env.example` a `.env`:

```bash
cp .env.example .env
```

El archivo `.env` contiene:
- `DATABASE_URL`: Conexión a PostgreSQL
- `PORT`: Puerto del servidor (default 4000)
- `NODE_ENV`: Ambiente (development/production)

### 3. Levantar PostgreSQL con Docker

```bash
docker-compose up -d
```

Verifica que el contenedor está corriendo:

```bash
docker ps
```

### 4. Ejecutar migraciones de Prisma

```bash
npm run prisma:migrate:dev
```

Nombre de la migración: `init` (o lo que prefieras).

### 5. Seed de datos iniciales

```bash
npm run prisma:seed
```

Esto carga 3 vehículos de ejemplo en la BD.

## Desarrollo

### Terminal 1: Servidor backend

```bash
npm run server
```

El servidor escucha en `http://localhost:4000/api`.

### Terminal 2: Frontend (Vite)

```bash
npm run dev
```

Abre `http://localhost:5173` en el navegador.

## Flujo de datos

1. Frontend ([src/components/AdminCarsList.jsx](src/components/AdminCarsList.jsx)) llama a `getCars()` → GET `/api/cars`
2. Backend ([server/index.js](server/index.js)) delega a repositorio ([server/repositories/carsRepository.js](server/repositories/carsRepository.js))
3. Repositorio accede a BD vía Prisma ([server/db.js](server/db.js))
4. Datos se persisten en PostgreSQL

## Operaciones CRUD

### GET `/api/cars`
Obtener todos los vehículos.

### GET `/api/cars/:id`
Obtener un vehículo por ID.

### POST `/api/cars`
Crear nuevo vehículo. Requiere: `make`, `model`, `year`, `pricePerDay`.

**Ejemplo:**
```bash
curl -X POST http://localhost:4000/api/cars \
  -H "Content-Type: application/json" \
  -d '{"make":"Toyota","model":"Corolla","year":2020,"pricePerDay":35.5}'
```

### PUT `/api/cars/:id`
Actualizar vehículo existente. Se pueden actualizar campos parcialmente.

### DELETE `/api/cars/:id`
Eliminar vehículo. Respuesta: 204 No Content.

## Validación de datos

El repositorio valida:
- **make** y **model**: Strings no vacíos
- **year**: Número entre 1900 y año actual
- **pricePerDay**: Número positivo

Los errores devuelven 400 Bad Request con mensaje en español.

## Herramientas útiles

### Prisma Studio (UI para explorar BD)

```bash
npm run prisma:studio
```

Abre http://localhost:5555 para explorar/editar datos directamente.

### Migraciones

Ver migraciones aplicadas:
```bash
npm run prisma:migrate:deploy
```

Reset de BD (⚠️ borra todo):
```bash
npx prisma migrate reset
```

## Estructura de carpetas

```
.
├── src/
│   ├── components/        # Componentes React (AdminCarsList, etc.)
│   ├── api/              # Cliente HTTP y servicios (cars.js)
│   ├── styles.css        # Estilos globales
│   └── main.jsx
├── server/
│   ├── index.js          # Endpoints Express
│   ├── db.js             # Cliente Prisma
│   └── repositories/     # Lógica de acceso a datos
├── prisma/
│   ├── schema.prisma     # Esquema de BD
│   ├── seed.js           # Script de seed
│   └── migrations/       # Historial de migraciones
├── docker-compose.yml    # PostgreSQL
├── .env                  # Variables (NO commitar)
├── .env.example          # Template de variables
└── package.json
```

## Notas importantes

- **Persistencia:** Los datos se guardan en PostgreSQL. Al reiniciar el servidor, los datos **se mantienen**.
- **Seed:** Solo ejecuta el seed si quieres restaurar los datos iniciales.
- **CORS:** Habilitado en backend, frontend y API pueden estar en puertos diferentes.
- **Validación:** La BD rechaza datos inválidos (año, precio). Ver errores en terminal.

## Troubleshooting

**Puerto 4000 en uso:**
```bash
lsof -ti:4000 | xargs kill -9
```

**BD no conecta:**
```bash
docker-compose logs db
```

**Migraciones fallidas:**
```bash
npx prisma migrate resolve --rolled-back "nombre_migracion"
npm run prisma:migrate:dev
```

## Scripts disponibles

| Script | Descripción |
|--------|-------------|
| `npm run dev` | Inicia Vite (frontend) |
| `npm run build` | Build de producción |
| `npm run preview` | Preview del build |
| `npm run server` | Inicia Express backend |
| `npm run prisma:migrate:dev` | Crear/aplicar migraciones |
| `npm run prisma:seed` | Ejecutar seed.js |
| `npm run prisma:studio` | Abrir Prisma Studio |
# GP-Quick-Force