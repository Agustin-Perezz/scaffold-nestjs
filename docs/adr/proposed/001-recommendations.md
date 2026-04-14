# ADR-001: Plan de Recomendaciones — Sistema de Alquiler de Autos

## Estado

**Propuesto** — 2026-04-02

## Contexto

El proyecto es un sistema de alquiler de autos construido con **NestJS** y **Clean Architecture**. Actualmente cuenta con:

- **120 archivos fuente** TypeScript
- **3 archivos de test** (e2e)
- **PostgreSQL** como base de datos (migrado recientemente desde SQLite)
- **MikroORM** como ORM
- Arquitectura limpia con separación de capas: `application`, `domain`, `infrastructure`, `presentation`

Las entidades principales son: **Auto**, **Cliente** y **Reserva**, con una máquina de estados para gestionar el ciclo de vida de las reservas.

---

## Recomendaciones

### 1. Testing — Prioridad Alta

#### Situación Actual
- Solo 3 archivos de test e2e para 120 archivos fuente
- Sin tests unitarios ni de integración para use cases
- Sin tests para la máquina de estados de reservas

#### Recomendaciones

| Prioridad | Acción | Descripción |
|-----------|--------|-------------|
| 🔴 Alta | Tests unitarios para Use Cases | Cada use case debe tener tests unitarios con mocks de repositorios |
| 🔴 Alta | Tests para State Machine | La máquina de estados de reservas es crítica — requiere tests exhaustivos |
| 🟡 Media | Tests de integración | Tests que validen el flujo completo con base de datos real (testcontainers) |
| 🟡 Media | Cobertura mínima | Establecer 80% de cobertura para domain y application |

#### Ejemplo de Estructura Sugerida

```
test/
├── unit/
│   ├── application/
│   │   └── use-cases/
│   │       ├── autos/
│   │       ├── clientes/
│   │       └── reservas/
│   └── domain/
│       └── entities/
├── integration/
│   └── infrastructure/
│       └── database/
└── e2e/
    └── controllers/
```

---

### 2. Documentación de API — Prioridad Media

#### Situación Actual
- Swagger está instalado (`@nestjs/swagger`)
- No está claro si todos los endpoints están documentados

#### Recomendaciones

1. **Documentar todos los DTOs** con `@ApiProperty()` incluyendo ejemplos
2. **Documentar códigos de error** posibles en cada endpoint
3. **Agregar descripciones** a todos los controllers y métodos
4. **Generar OpenAPI spec** como artefacto de build
5. **Publicar Swagger UI** en ambiente de staging/producción

```typescript
// Ejemplo de documentación completa
export class CrearReservaRequestDto {
  @ApiProperty({
    description: 'ID del auto a reservar',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  autoId: string;

  @ApiProperty({
    description: 'Fecha de inicio de la reserva',
    example: '2026-04-15T10:00:00Z',
  })
  fechaInicio: Date;
}
```

---

### 3. Logging y Observabilidad — Prioridad Media

#### Situación Actual
- Sin sistema de logging estructurado visible
- Sin métricas de negocio (reservas creadas, autos disponibles, etc.)

#### Recomendaciones

| Componente | Herramienta | Propósito |
|------------|-------------|-----------|
| Logger estructurado | `nestjs-pino` | Logs JSON para análisis centralizado |
| Métricas | `@willsoto/nestjs-prometheus` | Métricas de negocio y técnicas |
| Health Checks | `@nestjs/terminus` | Endpoints de health para orquestación |
| Tracing | OpenTelemetry | Distributed tracing para requests |

#### Métricas de Negocio Sugeridas

```typescript
// Ejemplos de métras a exponer
reservas_creadas_total{estado="confirmada"}
reservas_canceladas_total{motivo="cliente"}
autos_disponibles_gauge{marca="Toyota"}
tiempo_promedio_reserva_hours
```

---

### 4. Seguridad — Prioridad Alta

#### Situación Actual
- Sin autenticación/autorización visible
- Sin rate limiting
- Sin validación de inputs más allá de class-validator

#### Recomendaciones

| Prioridad | Acción | Implementación |
|-----------|--------|----------------|
| 🔴 Alta | Rate Limiting | `@nestjs/throttler` para prevenir abuse |
| 🔴 Alta | Helmet | `helmet` para headers de seguridad HTTP |
| 🔴 Alta | CORS | Configurar CORS explícitamente, no `origin: '*'` |
| 🟡 Media | Input Sanitization | Validar y sanitizar todos los inputs de usuario |
| 🟡 Media | Secrets Management | Usar AWS Secrets Manager o similar, no variables de entorno directas |
| 🟢 Baja | Security Headers | HSTS, CSP, X-Frame-Options |

---

### 5. Validaciones de Dominio — Prioridad Media

#### Situación Actual
- Las validaciones están principalmente en DTOs
- Falta fortalecer las validaciones en las entidades de dominio

#### Recomendaciones

1. **Invariants en Entidades**: Las entidades de dominio deben proteger sus invariantes

```typescript
// Ejemplo: La reserva debe validar fechas en el dominio
export class Reserva {
  constructor(
    private readonly fechaInicio: Date,
    private readonly fechaFin: Date,
  ) {
    if (fechaFin <= fechaInicio) {
      throw new DomainException('La fecha de fin debe ser posterior a la de inicio');
    }
  }
}
```

2. **Value Objects**: Considerar crear value objects para conceptos como `Patente`, `Email`, `Precio`

```typescript
// Ejemplo de Value Object
export class Patente {
  constructor(private readonly valor: string) {
    if (!this.esValida(valor)) {
      throw new DomainException('Patente inválida');
    }
  }

  private esValida(patente: string): boolean {
    // Validación de formato argentino/mercosur
    return /^[A-Z]{2}[0-9]{3}[A-Z]{2}$|^[A-Z]{3}[0-9]{3}$/.test(patente);
  }
}
```

---

### 6. Concurrencia y Transacciones — Prioridad Alta

#### Situación Actual
- El sistema maneja reservas concurrentes del mismo auto
- PostgreSQL ya fue elegido para mejorar concurrencia vs SQLite

#### Recomendaciones

1. **Optimistic Locking**: Agregar versionado a entidades para prevenir race conditions

```typescript
@Entity()
export class Auto {
  @Property({ version: true })
  version: number;
}
```

2. **Transacciones explícitas**: Usar `@Transactional()` de MikroORM en use cases críticos

3. **Índices para bloqueos**: Considerar `SELECT FOR UPDATE` para reservas concurrentes

---

### 7. Manejo de Errores — Prioridad Media

#### Situación Actual
- Existe `DomainException` y `InfrastructureException`
- Se necesita uniformizar el manejo de errores HTTP

#### Recomendaciones

1. **Filtro de Excepciones Global**: Unificar respuestas de error

```typescript
@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const response = host.switchToHttp().getResponse();

    if (exception instanceof DomainException) {
      return response.status(400).json({
        error: 'DomainError',
        message: exception.message,
        code: exception.code,
      });
    }

    if (exception instanceof EntityNotFoundException) {
      return response.status(404).json({
        error: 'NotFound',
        message: exception.message,
      });
    }

    // Error genérico
    return response.status(500).json({
      error: 'InternalServerError',
      message: 'Error interno del servidor',
    });
  }
}
```

2. **Códigos de Error Específicos**: Asignar códigos únicos a cada tipo de error de dominio

```typescript
// Ejemplo de códigos de error
export enum ErrorCodes {
  RESERVA_FECHA_INVALIDA = 'RES001',
  RESERVA_AUTO_NO_DISPONIBLE = 'RES002',
  RESERVA_CLIENTE_INACTIVO = 'RES003',
  AUTO_PATENTE_DUPLICADA = 'AUT001',
  CLIENTE_DNI_DUPLICADO = 'CLI001',
}
```

---

### 8. Performance y Escalabilidad — Prioridad Media

#### Recomendaciones

| Área | Acción | Prioridad |
|------|--------|-----------|
| Caching | Implementar Redis para cache de autos disponibles | Media |
| Pagination | Agregar paginación a listados (limit/offset o cursor) | Alta |
| Query Optimization | Revisar N+1 queries en MikroORM | Alta |
| Connection Pool | Configurar PgBouncer para producción | Alta |
| CDN | Servir assets estáticos (si aplica) | Baja |

#### Ejemplo de Paginación

```typescript
export class ListarAutosRequestDto {
  @IsOptional()
  @IsInt()
  @Min(1)
  pagina?: number = 1;

  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(100)
  porPagina?: number = 20;
}

export class ListarAutosResponseDto {
  data: AutoDto[];
  meta: {
    total: number;
    pagina: number;
    porPagina: number;
    totalPaginas: number;
  };
}
```

---

### 9. Configuración y 12-Factor App — Prioridad Media

#### Recomendaciones

1. **ConfigModule**: Usar `@nestjs/config` para centralizar configuración

```typescript
// config/database.config.ts
export default registerAs('database', () => ({
  host: process.env.DATABASE_HOST || 'localhost',
  port: parseInt(process.env.DATABASE_PORT, 10) || 5432,
  // Validación con joi
}));
```

2. **Validación de Variables**: Usar `joi` para validar configuración al iniciar

3. **Feature Flags**: Considerar sistema de feature flags para deploys graduales

4. **Graceful Shutdown**: Implementar manejo de señales SIGTERM/SIGINT

---

### 10. DevOps y CI/CD — Prioridad Media

#### Recomendaciones

| Componente | Descripción |
|------------|-------------|
| **Dockerfile** | Multi-stage build para producción |
| **docker-compose** | Servicios: app, postgres, redis, pgbouncer |
| **GitHub Actions** | Lint → Test → Build → Deploy |
| **Migrations** | Job separado para ejecutar migraciones antes del deploy |
| **Health Checks** | Endpoint `/health` para readiness/liveness probes |
| **Database Migrations** | Ejecutar como job de Kubernetes/ECS antes del rollout |

#### Pipeline Sugerida

```yaml
# .github/workflows/ci.yml
name: CI
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
      - run: npm ci
      - run: npm run lint
      - run: npm run test:unit
      - run: npm run test:integration
      - run: npm run build
```

---

### 11. Eventos de Dominio (Event Sourcing) — Prioridad Baja

#### Recomendación

Considerar implementar eventos de dominio para desacoplar acciones secundarias:

```typescript
// Cuando una reserva se confirma
export class ReservaConfirmadaEvent {
  constructor(
    public readonly reservaId: string,
    public readonly clienteId: string,
    public readonly autoId: string,
    public readonly fechaInicio: Date,
    public readonly fechaFin: Date,
  ) {}
}

// Handler que envía notificación por email
@EventsHandler(ReservaConfirmadaEvent)
export class EnviarEmailConfirmacionHandler {
  async handle(event: ReservaConfirmadaEvent) {
    // Enviar email al cliente
  }
}
```

Casos de uso:
- Enviar email de confirmación al crear reserva
- Notificar cuando un auto está disponible nuevamente
- Generar reportes de actividad

---

## Roadmap Sugerido

```
Fase 1 (Inmediato - 1-2 semanas)
├── Implementar tests unitarios para use cases críticos
├── Agregar rate limiting y headers de seguridad básicos
└── Configurar GlobalExceptionFilter

Fase 2 (Corto plazo - 1 mes)
├── Completar cobertura de tests (80% domain/application)
├── Implementar paginación en listados
├── Configurar logging estructurado
└── Crear pipeline de CI/CD básica

Fase 3 (Mediano plazo - 2-3 meses)
├── Implementar Redis para caching
├── Agregar métricas Prometheus
├── Crear health checks completos
└── Documentación API completa

Fase 4 (Largo plazo)
├── Implementar eventos de dominio
├── Agregar autenticación/autorización
└── Optimizaciones de performance
```

---

## Referencias

- [NestJS Testing Documentation](https://docs.nestjs.com/fundamentals/testing)
- [MikroORM Performance Tuning](https://mikro-orm.io/docs/performance)
- [OWASP API Security Top 10](https://owasp.org/www-project-api-security/)
- [Twelve-Factor App](https://12factor.net/)
- [Google Cloud API Design Guide](https://cloud.google.com/apis/design)

---

## Notas

Este documento es un punto de partida para discusión. Cada recomendación debe evaluarse según:

1. **Prioridad del negocio**: ¿Qué problemas resuelve?
2. **Costo de implementación**: ¿Cuánto esfuerzo requiere?
3. **Riesgo técnico**: ¿Qué pasa si no lo hacemos?

Se sugiere revisar y actualizar este plan trimestralmente.
