# Cómo Usar Este Proyecto con IA

> Guía para entender la estructura de Rentadora Autos y cómo se usa la IA en el desarrollo

## Introducción

Este proyecto fue construido completamente con asistencia de IA. Este documento explica:
1. La estructura del proyecto
2. Cómo se usó la IA durante el desarrollo
3. Cómo continuar trabajando con IA en este proyecto
4. Mejores prácticas para desarrollo asistido por IA

---

## Estructura del Proyecto

### Layout del Proyecto

```
rentadora-autos/
├── src/
│   ├── domain/
│   │   └── entities/           # Entidades puras de dominio
│   ├── application/
│   │   └── use-cases/         # Casos de uso
│   │       ├── autos/         # Caso de uso de autos
│   │       ├── clientes/      # Caso de uso de clientes
│   │       └── reservas/      # Caso de uso de reservas
│   ├── infrastructure/
│   │   ├── database/
│   │   │   ├── entities/     # Entidades MikroORM
│   │   │   └── repositories/ # Implementaciones de repositorio
│   │   └── config/           # Configuración
│   └── presentation/
│       └── controllers/       # Controladores REST
├── package.json
├── tsconfig.json
└── nest-cli.json
```

---

## Clean Architecture

### Estructura de Capas

```
┌─────────────────────────────────────────────────────────────────┐
│                     Presentation Layer                           │
│        (Controllers, DTOs, Pipes, Filters, Swagger)            │
└─────────────────────────────────────────────────────────────────┘
                               │
                               ▼
┌─────────────────────────────────────────────────────────────────┐
│                     Application Layer                            │
│          (Use Cases, Repository Interfaces, DTOs)               │
└─────────────────────────────────────────────────────────────────┘
                               │
                               ▼
┌─────────────────────────────────────────────────────────────────┐
│                        Domain Layer                              │
│           (Entidades Puras - SIN Decoradores de Framework)      │
└─────────────────────────────────────────────────────────────────┘
                               ▲
                               │
┌─────────────────────────────────────────────────────────────────┐
│                    Infrastructure Layer                          │
│    (Implementaciones de Repositorio, MikroORM, Servicios)       │
└─────────────────────────────────────────────────────────────────┘
```

### Reglas Clave

1. **Domain Layer** - Sin decoradores de framework, TypeScript puro
2. **Application Layer** - Casos de uso con interfaces de repositorio
3. **Infrastructure Layer** - Implementaciones de repositorio, servicios externos
4. **Presentation Layer** - Controladores, validación, Swagger

---

## Cómo se Usó la IA

### Enfoque de Desarrollo

Este proyecto fue desarrollado usando Claude Code con el siguiente flujo de trabajo:

1. **Fase de Planificación**
   - La IA analizó los requerimientos
   - Generó propuestas de arquitectura
   - Creó documentación primero

2. **Fase de Implementación**
   - La IA generó código basado en la arquitectura
   - Desarrollo incremental de features
   - Actualización continua de documentación

3. **Fase de Revisión**
   - La IA revisó el código por consistencia
   - Verificó cumplimiento arquitectural
   - Generó casos de prueba

### Componentes Generados por IA

| Componente | Generado por IA | Notas |
|------------|-----------------|-------|
| Entidades de Dominio | ✅ 100% | TypeScript puro con factory methods |
| Casos de Uso | ✅ 100% | Patrón por operación |
| Repositorios | ✅ 100% | Patrón por caso de uso |
| Entidades MikroORM | ✅ 100% | Con decoradores |
| Controladores | ✅ 100% | Con Swagger |
| DTOs | ✅ 100% | Con class-validator |
| Documentación | ✅ 100% | Este archivo |

---

## Trabajando con IA en Este Proyecto

### Empezando

1. **Leer AGENTS.md Primero**
   ```bash
   cat AGENTS.md
   ```
   Este archivo contiene restricciones críticas y patrones.

2. **Leer Documentación Relevante**
   - Revisar ADR-0001 a ADR-0009 en chepibe/docs/adr/

3. **Entender la Arquitectura**
   - Clean Architecture con 4 capas
   - Repositorio por caso de uso
   - Transacciones obligatorias con MikroORM

### Agregando Nuevas Features

#### Paso 1: Entidad de Dominio

```typescript
// src/domain/entities/[entidad].entity.ts
export class [Entidad] {
    private readonly _id: string;
    // ... otras propiedades privadas

    static create(props: { ... }): [Entidad] {
        return new [Entidad](uuidv7(), ...);
    }

    static reconstruct(props: { ... }): [Entidad] {
        return new [Entidad](...);
    }

    // Métodos de dominio
}
```

#### Paso 2: Caso de Uso

```typescript
// src/application/use-cases/[dominio]/[accion]-[entidad]/
// [accion]-[entidad].use-case.ts
@Injectable()
export class [Accion][Entidad]UseCase {
    constructor(
        @Inject('I[Accion][Entidad]Repository')
        private readonly repository: I[Accion][Entidad]Repository,
    ) {}

    async execute(request: [Accion][Entidad]RequestDto): Promise<[Accion][Entidad]ResponseDto> {
        // Implementación
    }
}

// [accion]-[entidad].repository.interface.ts
export interface I[Accion][Entidad]Repository {
    [accion](entidad: [Entidad]): Promise<[Entidad]>;
}
```

#### Paso 3: Implementación del Repositorio

```typescript
// src/infrastructure/database/repositories/[dominio]/[accion]-[entidad].repository.ts
@Injectable()
export class [Accion][Entidad]Repository implements I[Accion][Entidad]Repository {
    constructor(
        @InjectRepository([Entidad]Entity)
        private readonly repository: EntityRepository<[Entidad]Entity>,
        private readonly orm: MikroORM,
    ) {}

    async [accion](entidad: [Entidad]): Promise<[Entidad]> {
        return this.orm.em.transactional(async (em) => {
            // Implementación
        });
    }
}
```

#### Paso 4: Registro en Módulo

```typescript
// src/rentadora-autos.module.ts
providers: [
    {
        provide: 'I[Accion][Entidad]Repository',
        useClass: [Accion][Entidad]Repository,
    },
]
```

#### Paso 5: Controlador

```typescript
// src/presentation/controllers/[dominio]/
@ApiTags('[dominio]')
@Controller('[dominio]')
export class [Dominio]Controller {
    constructor(
        private readonly [accion][Entidad]UseCase: [Accion][Entidad]UseCase,
    ) {}

    @Post()
    async [accion](@Body() dto: [Accion][Entidad]RequestDto) {
        return this.[accion][Entidad]UseCase.execute(dto);
    }
}
```

---

## Patrones de IA

### 1. Siempre Referenciar AGENTS.md

Las restricciones en AGENTS.md son críticas:
- No crear repositorios "gordos"
- No crear archivos barrel
- No contaminar el dominio con decorators
- Usar transacciones siempre
- UUIDv7 para IDs

### 2. Documentar Primero, Codificar Después

Antes de implementar, documentar:
- Agregar caso de uso a USE_CASES.md
- Actualizar entidades en DOMAIN_ENTITIES.md
- Crear ADR si hay decisión arquitectural

### 3. Verificar Incrementablemente

```bash
# Verificar tipos
npx tsc --noEmit

# Verificar lint
npm run lint

# Verificar compilación
npm run build
```

### 4. Usar Imports Directos

```typescript
// CORRECTO
import { Auto } from '../../../../domain/entities/auto.entity';

// INCORRECTO - No usar barrel files
import { Entities } from '../../domain';
```

### 5. Mantener el Dominio Puro

```typescript
// CORRECTO - Sin decoradores
export class Auto {
    private readonly _id: string;
}

// INCORRECTO
@Entity()  // ❌ No en dominio
export class Auto {}
```

### 6. Repositorio Por Operación

```typescript
// CORRECTO
export interface ICrearAutoRepository { }
export interface IObtenerAutoRepository { }

// INCORRECTO
export interface IAutoRepository {  // ❌ Repositorio gordo
    crear();
    obtener();
    listar();
    actualizar();
    eliminar();
}
```

### 7. Usar Transacciones

```typescript
// CORRECTO
return this.orm.em.transactional(async (em) => {
    await em.persist(entity).flush();
});

// INCORRECTO
await this.repository.getEntityManager().persist(entity).flush();
```

---

## Tareas Comunes

### Agregar un Nuevo Dominio

1. Crear entidad en `domain/entities/`
2. Crear entidad MikroORM en `infrastructure/database/entities/`
3. Crear casos de uso en `application/use-cases/[dominio]/`
4. Crear repositorios en `infrastructure/database/repositories/[dominio]/`
5. Crear controlador en `presentation/controllers/[dominio]/`
6. Actualizar `RentadoraAutosModule` con repositorios
7. Actualizar `RentadoraAutosModule` con casos de uso

### Modificando una Entidad

1. Actualizar entidad de dominio
2. Actualizar entidad MikroORM
3. Actualizar repositorios que la usan
4. Verificar que todo compile

### Comandos Útiles

```bash
# Desarrollo
npm run start:dev        # Iniciar en modo desarrollo
npm run build            # Compilar

# Verificación
npx tsc --noEmit         # Verificar tipos
```

---

## Recursos

### Documentación
- `AGENTS.md` - Restricciones y patrones de IA
- Documentación de chepibe/docs/ - Arquitectura completa

### Ubicaciones de Código
- `src/domain/entities/` - Entidades de dominio
- `src/application/use-cases/` - Casos de uso
- `src/infrastructure/` - Servicios externos y repositorios
- `src/presentation/` - Controladores

### Comandos
```bash
# Desarrollo
npm run start            # Iniciar
npm run start:dev        # Iniciar en watch mode
npm run build            # Compilar

# Verificación
npx tsc --noEmit         # Verificar tipos
```

---

## Consejos para Trabajar con IA

1. **Ser Específico** - No decir "arreglalo", decir "arreglar el error de tipo en línea 45"
2. **Proveer Contexto** - Referenciar código similar, docs, patrones
3. **Iterar** - Empezar pequeño, revisar, luego expandir
4. **Verificar** - Siempre revisar el código generado por IA
5. **Documentar** - Actualizar docs mientras se avanza
6. **Testear** - Verificar que los cambios funcionen
7. **Commit Frecuentemente** - Commits pequeños y focalizados

---

*Este proyecto es un testimonio del desarrollo asistido por IA. La combinación de Clean Architecture, documentación comprehensiva, y herramientas de IA permite desarrollo rápido y mantenible.*

*Última Actualización: Abril 2026*
