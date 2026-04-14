# Arquitectura - Clean Architecture

## Visión General

```mermaid
graph TB
    subgraph C1["Capa de Presentación (Controllers)"]
        CTRL[Controllers<br/>DTOs<br/>Filters]
    end

    subgraph C2["Capa de Aplicación (Use Cases)"]
        UC[Use Cases<br/>Repository Interfaces<br/>DTOs]
    end

    subgraph C3["Capa de Dominio (Domain)"]
        ENTITY[Entities<br/>Value Objects<br/>Domain Services]
    end

    subgraph C4["Capa de Infraestructura (Infrastructure)"]
        REPO[Repository Implementations<br/>Database Entities<br/>External Services]
    end

    C1 --> C2
    C2 --> C3
    C4 --> C3
    C2 --> C4
```

## Principios Fundamentales

### 1. Separación de Responsabilidades

| Capa | Responsabilidad | Ejemplo |
|------|----------------|---------|
| **Presentación** | HTTP, DTOs, Swagger | Controllers, Filters |
| **Aplicación** | Lógica de negocio, Orquestación | Use Cases |
| **Dominio** | Entidades puras, Reglas de negocio | Auto, Cliente, Reserva |
| **Infraestructura** | Persistencia, Servicios externos | Repositories, MikroORM |

### 2. Estructura de Carpetas

```
src/
├── domain/
│   ├── entities/
│   │   ├── auto.entity.ts          # Entidad pura (sin decoradores)
│   │   ├── cliente.entity.ts
│   │   ├── reserva.entity.ts
│   │   ├── reserva.state-machine.ts # Máquina de estados
│   │   └── reserva.constants.ts     # Constantes compartidas
│   └── exceptions/
│       └── reserva.exceptions.ts     # Excepciones de dominio
│
├── application/
│   └── use-cases/
│       ├── autos/
│       │   ├── crear-auto/
│       │   ├── obtener-auto/
│       │   ├── listar-autos/
│       │   ├── actualizar-auto/
│       │   └── eliminar-auto/
│       ├── clientes/
│       │   └── [misma estructura]
│       └── reservas/
│           └── [misma estructura]
│
├── infrastructure/
│   ├── database/
│   │   └── postgres/
│   │       ├── entities/               # Entidades MikroORM
│   │       └── repositories/           # Implementaciones
│   └── exceptions/
│       └── reserva.exception-filters.ts
│
└── presentation/
    └── controllers/
        ├── autos.controller.ts
        ├── clientes.controller.ts
        └── reservas.controller.ts
```

### 3. Flujo de Datos

```mermaid
sequenceDiagram
    participant Client
    participant Controller
    participant UseCase
    participant Repository
    participant DomainEntity
    participant Database

    Client->>Controller: HTTP Request
    Controller->>UseCase: execute(DTO)
    UseCase->>Repository: operation(entity)
    Repository->>DomainEntity: map to/from
    DomainEntity->>Repository: return entity
    Repository->>Database: SQL query
    Database-->>Repository: result
    Repository-->>UseCase: return entity
    UseCase-->>Controller: return ResponseDTO
    Controller-->>Client: HTTP Response
```

## Reglas de Arquitectura

### Dominio Puro

```typescript
// ✅ CORRECTO - Entidad sin decoradores
export class Auto {
    private readonly _id: string;
    private _marca: string;

    static create(params: CrearAutoParams): Auto { ... }
    get marca(): string { return this._marca; }
}

// ❌ INCORRECTO - Entidad con decoradores MikroORM
@Entity()
export class Auto {
    @PrimaryKey()
    id: string;
}
```

### Repository por Operación

```typescript
// ✅ CORRECTO - Repository específico por operación
export interface ICrearAutoRepository {
    crear(auto: Auto): Promise<Auto>;
    existePorPatente(patente: string): Promise<boolean>;
}

// ❌ INCORRECTO - Fat Repository
export interface IAutoRepository {
    crear(auto: Auto): Promise<Auto>;
    obtener(id: string): Promise<Auto>;
    listar(): Promise<Auto[]>;
    // ... 15 métodos más
}
```

### Transacciones Obligatorias

```typescript
// ✅ CORRECTO
async crear(auto: Auto): Promise<Auto> {
    return this.orm.em.transactional(async (em) => {
        await em.persist(auto).flush();
        return auto;
    });
}

// ❌ INCORRECTO
async crear(auto: Auto): Promise<Auto> {
    await this.em.persist(auto).flush(); // Sin transacción
    return auto;
}
```

## Inyección de Dependencias

```mermaid
graph LR
    subgraph Module
        PROVIDER[Providers]
        CONTROLLER[Controllers]
    end

    PROVIDER -->|injects| CONTROLLER
    CONTROLLER -->|uses| USECASE[Use Cases]
    USECASE -->|uses| REPO[Repositories]
```

### Registro de Providers

```typescript
// alquiler-autos.module.ts
providers: [
    {
        provide: 'ICrearAutoRepository',
        useClass: CrearAutoRepository,
    },
    CrearAutoUseCase,
    // ...
]
```

## Configuración de MikroORM

```mermaid
graph TB
    subgraph AppModule
        A[MikroOrmModule.forRoot]
    end

    subgraph AlquilerAutosModule
        B[MikroOrmModule.forFeature]
    end

    subgraph Entities
        C[AutoEntity]
        D[ClienteEntity]
        E[ReservaEntity]
    end

    A --> B
    B --> C
    B --> D
    B --> E
```

## Excepciones y Filtros

```mermaid
graph TB
    subgraph ExceptionFilters
        FILTER1[ReservaNoEncontradaFilter]
        FILTER2[AutoNoDisponibleFilter]
        FILTER3[ClienteNoEncontradoFilter]
        FILTER4[OperacionReservaInvalidaFilter]
        FILTER5[ReservaSolapadaFilter]
        FILTER6[AutoNoEncontradoFilter]
    end

    subgraph Exceptions
        EXC1[ReservaNoEncontradaException]
        EXC2[AutoNoDisponibleException]
        EXC3[ClienteNoEncontradoException]
        EXC4[OperacionReservaInvalidaException]
        EXC5[ReservaSolapadaException]
        EXC6[AutoNoEncontradoException]
    end

    EXC1 --> FILTER1
    EXC2 --> FILTER2
    EXC3 --> FILTER3
    EXC4 --> FILTER4
    EXC5 --> FILTER5
    EXC6 --> FILTER6
```

## Build y Ejecución

```bash
# Build con NestJS CLI
node ./node_modules/.bin/nest build

# Ejecutar
node dist/main.js

# Verificar tipos
npx tsc --noEmit
```
