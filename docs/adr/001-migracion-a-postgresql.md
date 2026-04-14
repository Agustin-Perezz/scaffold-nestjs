# ADR-0001: Migración de SQLite a PostgreSQL

## Estado

**Aceptado** — 2026-04-02

## Contexto

### Limitaciones de SQLite en Producción

SQLite es una base de datos embebida excelente para desarrollo y aplicaciones pequeñas, pero presenta limitaciones críticas para un sistema de rental de vehículos en producción:

| Aspecto | SQLite | PostgreSQL |
|---------|--------|------------|
| **Concurrencia** | Lecturas concurrentes limitadas, un solo writer | MVCC permite lecturas y escrituras simultáneas |
| **Escalabilidad** | Base de datos única en archivo | Arquitectura cliente-servidor horizontalmente escalable |
| **Confiabilidad** | Sin replication nativa | Streaming replication, HA con Patroni |
| **Transacciones** | Limited concurrency writes | ACID completo con isolation levels configurables |
| **Backups** | Copia de archivo binario | pg_dump online, point-in-time recovery |
| **Rendimiento** | Bueno para < 100K registros | Optimizado para millones de registros |

### Problemas Específicos para Rentadora Autos

1. **Reservas concurrentes**: Múltiples clientes pueden intentar reservar el mismo auto simultáneamente. SQLite tiene problemas de locking que pueden causar `SQLITE_BUSY`.

2. **Reportes y análisis**: Consultas complejas sobre reservas históricas con agregaciones serán más lentas en SQLite.

3. **Crecimiento del negocio**: El sistema debe soportar múltiples sucursales y un parque vehicular creciente.

4. **Integridad referencial**: SQLite tiene soporte limitado para foreign keys con cascadas.

5. **Timezones**: Manejo de zonas horarias para fechas de reserva requiere configuración especial en SQLite.

## Decisión

### Tecnológica Elegida

Usaremos **PostgreSQL 15+** como motor de base de datos con **MikroORM** como ORM.

### Justificación

1. **PostgreSQL**:
   - Open source con licencia PostgreSQL (compatible con MIT/BSD)
   - Ampliamente usado en producción (AWS RDS, Supabase, Neon)
   - Excelente soporte para tipos de datos: JSON, arrays, ranges, geometric
   - Full-text search integrado
   - Extensiones: PostGIS para geolocalización futura

2. **MikroORM**:
   - Soporte nativo para PostgreSQL con driver `@mikro-orm/postgresql`
   - Cambio mínimo desde la configuración actual con SQLite
   - Migraciones de esquema integradas
   - Query builder potente

### Configuración del Driver

```typescript
//安装依赖
npm install @mikro-orm/postgresql pg
npm install --save-dev @types/pg
```

## Consecuencias

### Beneficios

| Beneficio | Descripción |
|-----------|-------------|
| **Robustez** | Recuperación ante fallos con WAL y point-in-time recovery |
| **Concurrencia real** | MVCC permite múltiples transacciones simultáneas sin bloqueos |
| **Escalabilidad** | Posibilidad de añadir réplicas de lectura |
| **Rendimiento** | Índices Partial, expression indexes, covering indexes |
| **Herramientas** | pgAdmin, DBeaver, psql para administración |
| **JSON nativo** | Almacenar metadata flexible sin esquema |
| **Full-text search** | Búsquedas de texto completas sin ElasticSearch |

### Drawbacks (Contrapartidas)

| Drawback | Mitigation |
|----------|------------|
| **Infraestructura** | Requiere Docker/container para PostgreSQL | Usar Docker Compose |
| **Configuración** | Más variables de entorno | Documentación clara |
| **Costoops** | Monitoring y backups más complejos | Tools automatizadas |
| **Latencia** | Comunicação por red vs arquivo local | Connection pooling con PgBouncer |

## Diagrama de Arquitectura

```mermaid
flowchart TB
    subgraph Client["Presentación / Cliente"]
        API[("REST API<br/>NestJS")]
        Swagger[("Swagger<br/>OpenAPI")]
    end

    subgraph App["Capa de Aplicación"]
        UC[("Use Cases<br/>NestJS Services")]
    end

    subgraph Domain["Capa de Dominio"]
        Auto[("Auto Entity"))]
        Cliente[("Cliente Entity"))]
        Reserva[("Reserva Entity"))]
    end

    subgraph Infra["Infrastructure Layer"]
        subgraph ORM["MikroORM"]
            Driver["@mikro-orm/<br/>postgresql"]
            Repos[("Repositories")]
            Migrations["Migrations")]
        end
        
        subgraph DB["PostgreSQL 15+"]
            PGBouncer[("PgBouncer<br/>Connection Pool")]
            PostgresDB[("postgres<br/>database: rentadora")]
        end
    end

    API --> UC
    UC --> Repos
    Repos --> Driver
    Driver --> PGBouncer
    PGBouncer --> PostgresDB

    Swagger --> API

    style PostgresDB fill:#336791,color:#fff
    style PGBouncer fill:#f0a30a,color:#000
    style Driver fill:#3f8b56,color:#fff
```

```mermaid
sequenceDiagram
    participant Client as Cliente API
    participant NestJS as NestJS App
    participant MikroORM as MikroORM
    participant PgBouncer as PgBouncer
    participant PostgreSQL as PostgreSQL

    Client->>NestJS: POST /reservas
    NestJS->>MikroORM: CrearReservaUseCase.execute()
    MikroORM->>MikroORM: Validar dominio
    MikroORM->>MikroORM: em.transactional()
    MikroORM->>PgBouncer: SQL INSERT
    PgBouncer->>PostgreSQL: Connection from pool
    PostgreSQL->>PostgreSQL: INSERT returning *
    PostgreSQL-->>PgBouncer: Result
    PgBouncer-->>MikroORM: Result
    MikroORM-->>NestJS: Reserva creada
    NestJS-->>Client: 201 Created
```

## Configuración Requerida

### Variables de Entorno

```env
# Database Configuration
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_NAME=rentadora_autos
DATABASE_USER=rentadora_user
DATABASE_PASSWORD=your_secure_password_here

# Connection Pool (MikroORM)
DATABASE_POOL_SIZE=10
DATABASE_MIN_POOL_SIZE=2
DATABASE_MAX_POOL_SIZE=20

# Timeouts
DATABASE_CONNECTION_TIMEOUT=10000
DATABASE_REQUEST_TIMEOUT=30000

# SSL (production)
DATABASE_SSL=true
```

### Docker Compose

```yaml
version: '3.8'

services:
  postgres:
    image: postgres:15-alpine
    container_name: rentadora_postgres
    environment:
      POSTGRES_DB: rentadora_autos
      POSTGRES_USER: rentadora_user
      POSTGRES_PASSWORD: your_secure_password_here
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data
      - ./docker/postgres/init.sql:/docker-entrypoint-initdb.d/init.sql
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U rentadora_user -d rentadora_autos"]
      interval: 10s
      timeout: 5s
      retries: 5

  pgbouncer:
    image: pgbouncer/pgbouncer:latest
    container_name: rentadora_pgbouncer
    environment:
      DATABASE_URL: "postgres://rentadora_user:your_secure_password_here@postgres:5432/rentadora_autos"
      POOL_MODE: transaction
      MAX_CLIENT_CONN: 100
      DEFAULT_POOL_SIZE: 20
    ports:
      - "6432:5432"
    depends_on:
      postgres:
        condition: service_healthy

volumes:
  postgres_data:
```

### Configuración MikroORM

```typescript
// src/infrastructure/database/config/mikro-orm.config.ts
import { MikroORM } from '@mikro-orm/core';
import { PostgreSqlDriver } from '@mikro-orm/postgresql';

export default MikroORM.init({
  driver: PostgreSqlDriver,
  dbName: process.env.DATABASE_NAME || 'rentadora_autos',
  user: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  host: process.env.DATABASE_HOST || 'localhost',
  port: parseInt(process.env.DATABASE_PORT || '5432', 10),
  pool: {
    min: parseInt(process.env.DATABASE_MIN_POOL_SIZE || '2', 10),
    max: parseInt(process.env.DATABASE_MAX_POOL_SIZE || '20', 10),
  },
  ssl: process.env.DATABASE_SSL === 'true',
  debug: process.env.NODE_ENV !== 'production',
  migrations: {
    tableName: 'mikro_orm_migrations',
    path: './dist/infrastructure/database/migrations',
    glob: '!(*.spec|*.test).ts',
  },
});
```

### Entidades de Dominio → Esquema PostgreSQL

#### Auto Entity → Tabla `autos`

| Campo | Tipo PostgreSQL | Constraints |
|-------|-----------------|-------------|
| `id` | UUID | PRIMARY KEY, DEFAULT gen_random_uuid() |
| `marca` | VARCHAR(100) | NOT NULL |
| `modelo` | VARCHAR(100) | NOT NULL |
| `anio` | INTEGER | NOT NULL, CHECK (anio > 1900) |
| `patente` | VARCHAR(10) | NOT NULL, UNIQUE |
| `precio_por_hora` | DECIMAL(10,2) | NOT NULL, CHECK (precio_por_hora > 0) |
| `disponible` | BOOLEAN | NOT NULL, DEFAULT true |
| `created_at` | TIMESTAMP WITH TIME ZONE | NOT NULL, DEFAULT NOW() |
| `updated_at` | TIMESTAMP WITH TIME ZONE | NOT NULL, DEFAULT NOW() |

#### Cliente Entity → Tabla `clientes`

| Campo | Tipo PostgreSQL | Constraints |
|-------|-----------------|-------------|
| `id` | UUID | PRIMARY KEY, DEFAULT gen_random_uuid() |
| `nombre` | VARCHAR(100) | NOT NULL |
| `apellido` | VARCHAR(100) | NOT NULL |
| `dni` | VARCHAR(20) | NOT NULL, UNIQUE |
| `telefono` | VARCHAR(20) | NOT NULL |
| `email` | VARCHAR(255) | NULL |
| `created_at` | TIMESTAMP WITH TIME ZONE | NOT NULL, DEFAULT NOW() |
| `updated_at` | TIMESTAMP WITH TIME ZONE | NOT NULL, DEFAULT NOW() |

#### Reserva Entity → Tabla `reservas`

| Campo | Tipo PostgreSQL | Constraints |
|-------|-----------------|-------------|
| `id` | UUID | PRIMARY KEY, DEFAULT gen_random_uuid() |
| `auto_id` | UUID | NOT NULL, FK → autos(id) |
| `cliente_id` | UUID | NOT NULL, FK → clientes(id) |
| `fecha_inicio` | TIMESTAMP WITH TIME ZONE | NOT NULL |
| `fecha_fin` | TIMESTAMP WITH TIME ZONE | NOT NULL |
| `fecha_retorno` | TIMESTAMP WITH TIME ZONE | NULL |
| `estado` | VARCHAR(20) | NOT NULL, CHECK (estado IN (...)) |
| `precio_total` | DECIMAL(12,2) | NOT NULL, CHECK (precio_total >= 0) |
| `penalidad` | DECIMAL(12,2) | NULL, CHECK (penalidad >= 0) |
| `created_at` | TIMESTAMP WITH TIME ZONE | NOT NULL, DEFAULT NOW() |
| `updated_at` | TIMESTAMP WITH TIME ZONE | NOT NULL, DEFAULT NOW() |

**Índices sugeridos:**

```sql
-- Índices para optimizar consultas frecuentes
CREATE INDEX idx_reservas_auto_fecha ON reservas(auto_id, fecha_inicio, fecha_fin);
CREATE INDEX idx_reservas_cliente ON reservas(cliente_id);
CREATE INDEX idx_reservas_estado ON reservas(estado) WHERE estado NOT IN ('completada', 'cancelada');
CREATE INDEX idx_autos_disponible ON autos(disponible) WHERE disponible = true;
```

## Pasos de Migración

### Fase 1: Preparación

```bash
# 1. Instalar nuevas dependencias
npm install @mikro-orm/postgresql pg
npm install --save-dev @types/pg

# 2. Crear script de backup de datos SQLite
# (Ya que tenemos datos de prueba en desarrollo)
```

### Fase 2: Configuración Paralela

```bash
# 1. Crear archivo de configuración de producción
cp .env.example .env.postgres

# 2. Editar mikro-orm.config.ts para soportar ambos drivers
# Usar factory pattern o configuración por entorno
```

### Fase 3: Migración de Datos

#### Opción A: Migración Manual (Recomendada para desarrollo)

```typescript
// scripts/migrate-to-postgres.ts
import { MikroORM } from '@mikro-orm/core';
import { SQLiteDriver } from '@mikro-orm/sqlite';
import { PostgreSqlDriver } from '@mikro-orm/postgresql';

async function migrate() {
  // 1. Conectar a SQLite origen
  const sqliteORM = await MikroORM.init({
    driver: SQLiteDriver,
    dbName: './data/rentadora.db',
  });

  // 2. Extraer datos
  const autos = await sqliteORM.em.findAll(AutoEntity);
  const clientes = await sqliteORM.em.findAll(ClienteEntity);
  const reservas = await sqliteORM.em.findAll(ReservaEntity);

  // 3. Conectar a PostgreSQL destino
  const postgresORM = await MikroORM.init({
    driver: PostgreSqlDriver,
    dbName: 'rentadora_autos',
    // ... config
  });

  // 4. Insertar datos en PostgreSQL
  await postgresORM.em.transactional(async (em) => {
    for (const auto of autos) {
      em.persist(auto);
    }
    for (const cliente of clientes) {
      em.persist(cliente);
    }
    for (const reserva of reservas) {
      em.persist(reserva);
    }
  });

  // 5. Verificar conteos
  const pgAutos = await postgresORM.em.count(AutoEntity);
  const sqliteAutos = await sqliteORM.em.count(AutoEntity);
  
  console.log(`SQLite: ${sqliteAutos} autos | PostgreSQL: ${pgAutos} autos`);

  await sqliteORM.close();
  await postgresORM.close();
}

migrate();
```

#### Opción B: Usando Migraciones de MikroORM

```bash
# 1. Generar migración desde esquema actual
npx mikro-orm migration:create --name=initial_postgres_schema

# 2. Ejecutar migración en PostgreSQL
npx mikro-orm migration:up

# 3. Exportar datos de SQLite e importar
# (Usar scripts de seeding o CSV exports)
```

### Fase 4: Verificación

```bash
# 1. Verificar conexión a PostgreSQL
psql "postgres://rentadora_user:password@localhost:5432/rentadora_autos"

# 2. Verificar tablas creadas
\dt

# 3. Verificar datos migrados
SELECT COUNT(*) FROM autos;
SELECT COUNT(*) FROM clientes;
SELECT COUNT(*) FROM reservas;

# 4. Ejecutar tests con nueva configuración
DATABASE_HOST=localhost npm run test:e2e
```

### Fase 5: Deploy

```bash
# 1. Actualizar configuración de producción
# Establecer DATABASE_HOST, DATABASE_PORT, etc.

# 2. Iniciar PostgreSQL con Docker
docker-compose up -d postgres pgbouncer

# 3. Esperar a que PostgreSQL esté healthy
docker-compose ps

# 4. Ejecutar migraciones
npm run migration:up

# 5. Deploy de aplicación
npm run build && npm run start:prod
```

## Checklist de Migración

- [ ] Instalar `@mikro-orm/postgresql` y `pg`
- [ ] Crear archivo `.env.postgres` con configuración
- [ ] Actualizar `mikro-orm.config.ts` para PostgreSQL
- [ ] Crear Docker Compose con PostgreSQL y PgBouncer
- [ ] Generar migración inicial
- [ ] Exportar datos de SQLite (si aplica)
- [ ] Importar datos a PostgreSQL
- [ ] Ejecutar tests de integración
- [ ] Actualizar documentación de configuración
- [ ] Configurar backups automáticos de PostgreSQL

## Referencias

- [MikroORM PostgreSQL Driver](https://mikro-orm.io/docs/usage-with-nestjs#postgresql)
- [PostgreSQL 15 Documentation](https://www.postgresql.org/docs/15/)
- [Docker PostgreSQL Best Practices](https://github.com/docker-library/postgres)
- [PgBouncer Configuration](https://www.pgbouncer.org/config.html)
