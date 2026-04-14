# Rentadora Autos

Proyecto de ejemplo para demostrar **Clean Architecture** con NestJS y MikroORM.

## Slides de la Clase

[Ver presentación](https://docs.google.com/presentation/d/1Hf2pUWK4uaJmgrl4XWM30xRTuxq7r3GYMjdX20GJkQc/edit?slide=id.g3d43dd60a97_0_249#slide=id.g3d43dd60a97_0_249)
[Ver clase](https://www.youtube.com/watch?v=RltjVf7PaPA)

## Arquitectura

```
src/
├── domain/           # Entidades puras (sin decoradores)
├── application/     # Casos de uso
├── infrastructure/  # Repositorios, MikroORM
└── presentation/     # Controladores REST
```

### Principios Clave

| Regla | Descripción |
|-------|-------------|
| **Dominio Puro** | Entidades sin decoradores de framework |
| **Repository por Operación** | Un repositorio por caso de uso, no uno gordo |
| **Transacciones** | Siempre usar `transactional()` |
| **Imports Directos** | Sin barrel files |

## Instalación Local

### Requisitos

- Node.js 18+
- Docker y Docker Compose
- pnpm

### Pasos

1. **Clonar el repositorio**
   ```bash
   git clone <repo-url>
   cd rentadora-autos
   ```

2. **Instalar dependencias**
   ```bash
   pnpm install
   ```

3. **Configurar variables de entorno**
   ```bash
   cp .env.example .env
   # Editar .env con tus configuraciones si es necesario
   ```

4. **Iniciar la base de datos PostgreSQL con Docker**
   ```bash
   # Iniciar el contenedor de PostgreSQL
   pnpm docker:up

   # Verificar que está corriendo
   pnpm docker:logs
   ```

5. **Compilar y ejecutar la aplicación**
   ```bash
   # Modo desarrollo (con hot-reload)
   pnpm start:dev

   # O compilar y ejecutar en modo producción
   pnpm build
   pnpm start:prod
   ```

6. **Verificar que funciona**
   - API: http://localhost:3000
   - Swagger: http://localhost:3000/api

### Comandos Docker

```bash
# Iniciar PostgreSQL
pnpm docker:up

# Detener PostgreSQL
pnpm docker:down

# Ver logs
pnpm docker:logs
```

### Variables de Entorno

| Variable | Descripción | Default |
|----------|-------------|---------|
| `DB_HOST` | Host de PostgreSQL | localhost |
| `DB_PORT` | Puerto de PostgreSQL | 5432 |
| `DB_USERNAME` | Usuario de PostgreSQL | postgres |
| `DB_PASSWORD` | Contraseña de PostgreSQL | postgres |
| `DB_NAME` | Nombre de la base de datos | rentadora_autos |
| `PORT` | Puerto de la API | 3000 |
| `NODE_ENV` | Entorno (development/production) | development |

## Comandos Principales

```bash
# Desarrollo
pnpm start:dev          # Modo desarrollo (watch)
pnpm build              # Compilar TypeScript
pnpm start:prod         # Producción

# Testing
pnpm test               # Tests unitarios
pnpm test:e2e           # Tests E2E

# Docker
pnpm docker:up          # Iniciar PostgreSQL
pnpm docker:down        # Detener PostgreSQL
pnpm docker:logs        # Ver logs de PostgreSQL

# Verificación
npx tsc --noEmit          # Verificar tipos
pnpm lint              # Ejecutar linter
```

## Documentación

- [Índice](./docs/00_INDEX.md)
- [Arquitectura](./docs/01_ARQUITECTURA.md)
- [Entidades](./docs/02_ENTIDADES.md)
- [Casos de Uso](./docs/03_CASOS_DE_USO.md)
- [API](./docs/04_API.md)
- [Máquina de Estados](./docs/05_MAQUINA_ESTADOS.md)
- [Excepciones](./docs/06_EXCEPCIONES.md)
- [Testing](./docs/07_TESTING.md)
