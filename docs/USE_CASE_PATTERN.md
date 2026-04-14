# Guía de Arquitectura de Casos de Uso

> Entendiendo el enfoque de Clean Architecture para casos de uso
---

## Tabla de Contenidos

1. [Resumen](#resumen)
2. [Patrón de Aislamiento de Casos de Uso](#patrón-de-aislamiento-de-casos-de-uso)
3. [Estructura de Carpetas](#estructura-de-carpetas)
4. [Organización de Archivos](#organización-de-archivos)
5. [Repository por Operación](#repository-por-operación)
6. [Diseño Guiado por el Dominio](#diseño-guiado-por-el-dominio)
7. [Objetos de Transferencia de Datos (DTOs)](#objetos-de-transferencia-de-datos-dtos)
8. [Patrón Transaccional](#patrón-transaccional)
9. [Protección de Límites](#protección-de-límites)
10. [Documentación por Caso de Uso](#documentación-por-caso-de-uso)

---

## Resumen

Esta arquitectura sigue el **Aislamiento de Casos de Uso** — un patrón estricto de Clean Architecture donde cada operación de negocio se encapsula en su propia carpeta aislada con archivos dedicados para la implementación del caso de uso, objetos de transferencia de datos (DTOs) e interfaces de repository.

### Principios Clave

| Principio | Descripción |
|-----------|-------------|
| **Responsabilidad Única** | Cada caso de uso hace exactamente una cosa |
| **Aislamiento** | No hay repositories compartidos entre casos de uso |
| **Testabilidad** | Cada caso de uso puede probarse independientemente |
| **Descubribilidad** | La documentación del caso de uso vive junto al código |

### Por Qué la Documentación Vive con el Código

Co-ubicar archivos README.md junto a las implementaciones de casos de uso asegura:
- **La documentación se mantiene actual**: Cuando el código cambia, el README adyacente es un recordatorio visible para actualizar la documentación
- **Sin adivinar**: Al mirar la carpeta inmediatamente sabés qué está implementado y documentado
- **Las revisiones de código incluyen documentación**: Los revisores de PR ven los cambios de documentación junto con los cambios de código
- **Disponibilidad offline**: Sin dependencia de sistemas de documentación externos

---

## Patrón de Aislamiento de Casos de Uso

### La Regla: Una Operación = Una Carpeta

Cada operación CRUD (y operación de negocio) tiene su propia carpeta:

```
application/use-cases/{dominio}/{acción}-{entidad}/
├── {acción}-{entidad}.use-case.ts              # Implementación
├── {acción}-{entidad}.request.dto.ts           # Validación de entrada
├── {acción}-{entidad}.response.dto.ts          # Estructura de salida
├── {acción}-{entidad}.repository.interface.ts  # Contrato de repository
└── README.md                                  # Documentación del caso de uso
```

### Por Qué No Fat Repositories?

Los fat repositories pueden parecer convenientes, pero crean problemas arquitectónicos significativos:

**Problemas de Rendimiento**: Los fat repositories fomentan el uso cruzado entre casos de uso, donde operaciones no relacionadas se agrupan. Esto lleva a:
- **Sobre-carga**: Cargando datos que casos de uso específicos no necesitan
- **Consultas extra a la base de datos**: Los métodos genéricos a menudo requieren múltiples viajes para satisfacer casos de uso específicos
- **Contención de locks**: Las transacciones amplias mantienen locks por más tiempo del necesario

**Mala Descubribilidad**: Cuando algo se rompe, tenés que adivinar cuál de los 15 métodos del fat repository podría estar involucrado. Con repositories aislados, empezás a buscar en exactamente un lugar: la carpeta del caso de uso.

**Acoplamiento Oculto**: "Solo reutilicemos el repository existente" parece eficiente, pero acopla casos de uso no relacionados a través de patrones de acceso a datos compartidos. Los cambios para un caso de uso arriesgan romper otros.

**Casos de Uso como Servicios de Aplicación**: Cada caso de uso es esencialmente un Servicio de Aplicación con una responsabilidad única. Repository por operación mantiene los límites del servicio limpios y previene abstracciones que filtran.

**❌ NO Permitido:**
```typescript
// Fat repository — acopla casos de uso juntos
// Si necesitás optimizar cómo se listan los contactos,
// arriesgás romper create, update y delete
export interface IContactRepository {
    create(contact: Contact): Promise<Contact>;
    get(id: string): Promise<Contact | null>;
    list(userId: string): Promise<Contact[]>;        // Genérico — a menudo sobre-carga
    update(contact: Contact): Promise<Contact>;
    delete(id: string): Promise<void>;
}
```

**✅ Correcto:**
```typescript
// ICreateContactRepository.ts — hiper-específico para esta operación
// Solo consultas necesarias para la creación de contactos
export interface ICreateContactRepository {
    create(contact: Contact): Promise<Contact>;
    existsByEmail(userId: string, email: string): Promise<boolean>;
}

// IGetContactRepository.ts — archivo separado, preocupaciones separadas
// Puede optimizarse independientemente sin afectar la lógica de creación
export interface IGetContactRepository {
    getById(id: string): Promise<Contact | null>;
}
```

---

## Estructura de Carpetas

### Organización por Dominio

Organizá los casos de uso por dominio (contexto delimitado), con cada operación en su propia carpeta:

```
application/use-cases/
├── auth/
│   ├── sign-up/
│   ├── sign-in/
│   └── complete-auth/
├── users/
│   ├── create-user/
│   ├── get-user/
│   └── list-users/
├── orders/
│   ├── create-order/
│   ├── get-order/
│   └── list-orders/
└── [tu-dominio]/
    ├── [acción]-[entidad]/
    └── ...
```

---

## Organización de Archivos

### Archivos Estándar por Caso de Uso

Cada carpeta de caso de uso contiene estos archivos:

| Archivo | Propósito | Ejemplo |
|---------|-----------|---------|
| `{nombre}.use-case.ts` | Lógica central del caso de uso | `create-contact.use-case.ts` |
| `{nombre}.request.dto.ts` | Validación de entrada | `create-contact.request.dto.ts` |
| `{nombre}.response.dto.ts` | Estructura de salida | `create-contact.response.dto.ts` |
| `{nombre}.repository.interface.ts` | Contrato de repository | `create-contact.repository.interface.ts` |
| `README.md` | Documentación | Ver [Documentación por Caso de Uso](#documentación-por-caso-de-uso) |

### Ejemplo: Caso de Uso Create Contact

```typescript
// create-contact.use-case.ts
import Contact from '../../../../domain/entities/contact.entity';
import {CreateContactRequestDto} from './create-contact.request.dto';
import {CreateContactResponseDto} from './create-contact.response.dto';
import {ICreateContactRepository} from './create-contact.repository.interface';

export class CreateContactUseCase {
    constructor(
        private readonly repository: ICreateContactRepository,
    ) {}

    async execute(userId: string, request: CreateContactRequestDto): Promise<CreateContactResponseDto> {
        // Chequeos de duplicados
        if (request.email) {
            const existsByEmail = await this.repository.existsByEmail(
                userId,
                request.email
            );
            if (existsByEmail) {
                throw new Error(`Ya existe un contacto con ese email`);
            }
        }

        // Crear entidad de dominio
        const contact = Contact.create({
            userId,
            name: request.name,
            email: request.email ?? null,
            notes: request.notes ?? null,
        });

        // Persistir
        const saved = await this.repository.create(contact);
        return this.toResponseDto(saved);
    }

    private toResponseDto(contact: Contact): CreateContactResponseDto {
        // Mapear entidad de dominio a DTO de respuesta
        return {
            id: contact.id,
            name: contact.name,
            // ... otros campos
        };
    }
}
```

---

## Repository por Operación

### Ubicación de la Interfaz de Repository

El caso de uso **posee** su interfaz de repository:

```typescript
// create-contact.repository.interface.ts
export interface ICreateContactRepository {
    create(contact: Contact): Promise<Contact>;
    existsByEmail(userId: string, email: string): Promise<boolean>;
}
```

### Ubicación de la Implementación de Repository

Las implementaciones viven en la capa de Infraestructura:

```
infrastructure/database/repositories/{dominio}/
├── create-{entidad}.repository.ts
├── get-{entidad}.repository.ts
├── list-{entidad}s.repository.ts
├── update-{entidad}.repository.ts
└── delete-{entidad}.repository.ts
```

### Registro en el Módulo

Registrá cada implementación de repository con su token de interfaz:

```typescript
// Registro de inyección de dependencias
container.register('ICreateContactRepository', CreateContactRepository);
container.register('IGetContactRepository', GetContactRepository);
// ... registro por caso de uso
```

O usando un enfoque basado en módulos:

```typescript
// module.ts
export const useCaseProviders = [
    { token: 'ICreateContactRepository', implementation: CreateContactRepository },
    { token: 'IGetContactRepository', implementation: GetContactRepository },
    // ... registro por caso de uso
];
```

---

## Diseño Guiado por el Dominio

### Por Qué Entidades de Dominio Puras?

Las entidades de dominio sin dependencias de framework:
- **Testables sin infraestructura**: Ejecutá tests unitarios sin base de datos ni ningún framework
- **Lógica portable**: Las reglas de negocio pueden moverse entre frameworks (Express, Fastify, etc.)
- **Intención de negocio explícita**: Métodos como `blacklist()` expresan conceptos de dominio, no operaciones técnicas
- **Cambios de estado inmutables**: Los cambios de estado ocurren a través de métodos, no asignación directa de propiedades

### Uso de Entidades de Dominio

Los casos de usos operan sobre entidades de dominio puras:

```typescript
// Entidad de dominio — sin decoradores de framework
export class Contact {
    private readonly _id: string;
    private _name: string;
    private _isBlacklisted: boolean;
    private _updatedAt: Date;

    static create(props: { name: string }): Contact {
        return new Contact(
            generateId(),
            props.name,
            false,
            new Date()
        );
    }

    // Comportamiento de dominio expresado como métodos, no setters de propiedades
    blacklist(): void {
        this._isBlacklisted = true;
        this._updatedAt = new Date();
    }

    // Propiedades de solo lectura expuestas vía getters
    get id(): string { return this._id; }
    get name(): string { return this._name; }
    get isBlacklisted(): boolean { return this._isBlacklisted; }
}
```

### Patrón Factory

Siempre usá métodos factory, nunca constructores:

```typescript
// ✅ Correcto
const contact = Contact.create({...});

// ❌ Mal — el constructor es privado
const contact = new Contact(...);
```

### Por Qué Métodos Factory?

Los métodos factory proveen beneficios arquitectónicos que los constructores no pueden:

**Construcción Nombrada**: `Contact.createVerified()` vs `new Contact(..., true, ...)` — la intención es clara desde el nombre del método, no de flags booleanos. Los constructores siempre se nombran según la clase; los factories pueden tener nombres descriptivos para cada escenario de creación.

**Testabilidad**: Podés stubbear o espiar `Contact.create` en tests, lo cual es imposible con el operador `new`. Esto permite a los tests controlar la creación de objetos sin frameworks de inyección de dependencias.

### Por Qué Comportamiento a Través de Métodos?

El comportamiento de dominio se expresa como métodos, no setters de propiedades:

```typescript
// ✅ La intención de negocio es clara
contact.blacklist();
contact.activate();
contact.mergeWith(otherContact);

// ❌ No queda claro qué significan estas operaciones
contact.isBlacklisted = true;
contact.status = 'active';
```

**Encapsulación**: Los métodos ocultan cambios de estado internos. `blacklist()` podría setear un flag, loguear una entrada de auditoría y actualizar un timestamp — quienes llaman no necesitan saberlo.

**Verificación de Invariantes**: Los métodos validan antes de cambiar el estado. `setEmail()` puede chequear formato y unicidad; la asignación directa no puede.

**Lenguaje de Dominio**: Métodos nombrados según conceptos de negocio (`suspend()`, `promote()`, `archive()`) hacen el código legible para expertos del dominio.

**Efectos Secundarios**: Eventos de dominio (ej. "ContactWasBlacklisted") pueden emitirse desde métodos, no de asignaciones de propiedades.

### Por Qué Getters?

Exponiendo propiedades de solo lectura vía getters:

```typescript
get id(): string { return this._id; }
```

**Acceso de Solo Lectura**: El código externo puede observar el estado pero no corromperlo mediante asignación directa.

**Encapsulación**: La representación interna puede cambiar (ej. `_id` se convierte en un Value Object) sin afectar quienes llaman.

**Propiedades Computadas**: Los getters pueden derivar valores bajo demanda sin almacenar estado redundante.

**Copia Defensiva**: Los getters pueden retornar copias de objetos mutables (arrays, fechas) para prevenir modificación externa.

---

## Objetos de Transferencia de Datos (DTOs)

### Por Qué DTOs?

Los DTOs desacoplan los modelos internos de dominio de las interfaces externas:

```typescript
// DTO de Request — lo que el llamador provee
export class CreateContactRequestDto {
    name: string;
    email?: string;
}

// DTO de Response — lo que el caso de uso devuelve
export class CreateContactResponseDto {
    id: string;
    name: string;
    email: string | null;
    createdAt: Date;
}
```

**Separación de Validación**: Los DTOs de request validan en el límite (usando librerías de validación) antes de que los datos lleguen a la lógica de dominio. Las entradas inválidas se rechazan temprano.

**Estabilidad de Contrato**: El contrato de la API (DTOs) puede permanecer estable mientras el modelo de dominio evoluciona. Agregar un campo a la entidad Contact no lo expone automáticamente a quienes llaman.

**Seguridad**: Los DTOs previenen filtración accidental de datos. Campos sensibles (contraseñas, IDs internos) no se exponen a menos que se incluyan explícitamente en el DTO de respuesta.

**Desacoplamiento**: Los cambios al dominio (ej. dividir `name` en `firstName` y `lastName`) no requieren cambios a quienes llaman si el DTO permanece compatible.

### Capas de Mapeo

Los casos de uso actúan como la capa de mapeo entre DTOs y entidades de dominio:

```typescript
// DTO de Request → Entidad de Dominio
const contact = Contact.create({
    name: request.name,
    email: request.email ?? null,
});

// Entidad de Dominio → DTO de Response
return {
    id: contact.id,
    name: contact.name,
    email: contact.email,
    createdAt: contact.createdAt,
};
```

---

## Patrón Transaccional

### Por Qué las Transacciones Son Mandatorias

Sin transacciones explícitas:
- **Fallos parciales**: Las operaciones de base de datos pueden completarse parcialmente, dejando datos en estados inconsistentes
- **Fugas de conexión**: Trabajo no commiteado mantiene conexiones de base de datos abiertas por más tiempo
- **Condiciones de carrera**: Operaciones concurrentes ven estados intermedios
- **Rollback imposible**: Errores después de escrituras parciales no pueden deshacerse limpiamente

### Todas las Operaciones de DB Deben ser Transaccionales

```typescript
// ✅ Correcto
async create(contact: Contact): Promise<Contact> {
    return await this.transactionManager.execute(async (trx) => {
        const saved = await this.repository.create(contact, trx);
        return saved;
    });
    // Transacción automáticamente commiteada en éxito,
    // hecha rollback en error
}

// ❌ Mal — nunca fuera de transacción
await this.repository.create(contact);
// Si esto falla, la entidad puede estar parcialmente persistida
// sin forma de hacer rollback
```

---

## Protección de Límites

### Repositories Trabajan con Entidades

Los repositories son el puente entre dominio e infraestructura. Aceptan y devuelven entidades de dominio, no filas de base de datos u objetos ORM:

```typescript
// ✅ El repository acepta y devuelve entidades de dominio
export interface ICreateContactRepository {
    create(contact: Contact): Promise<Contact>;
}

// La implementación mapea entre entidad y modelo de persistencia
class CreateContactRepository implements ICreateContactRepository {
    async create(contact: Contact): Promise<Contact> {
        const row = {
            id: contact.id,
            name: contact.name,
            email: contact.email,
        };
        await db.insert('contacts', row);
        return contact;  // Devolver la entidad, no la fila
    }
}
```

**Integridad de Dominio**: El modelo de dominio permanece puro. El repository maneja el mapeo complicado entre entidades y estructuras de persistencia.

**Infraestructura Intercambiable**: Podés cambiar de SQL a MongoDB sin tocar casos de uso — solo cambian las implementaciones de repository.

**Testabilidad**: Los repositories pueden mockearse con implementaciones en memoria que trabajen con entidades, sin base de datos requerida.

**Sin Abstracciones que Filtran**: Quienes llaman nunca ven específicos de base de datos (nombres de tablas, tipos de columnas, JOINs). Trabajan solo con conceptos de dominio.

### Casos de Uso No se Llaman Entre Sí

Cada caso de uso es un punto de entrada standalone. Nunca se invocan directamente entre sí:

```typescript
// ❌ MAL — casos de uso llamándose entre sí
export class CreateOrderUseCase {
    constructor(
        private readonly getProductUseCase: GetProductUseCase,  // No hagas esto
    ) {}

    async execute(request: CreateOrderRequest) {
        const product = await this.getProductUseCase.execute({  // ¡Acoplamiento fuerte!
            id: request.productId,
        });
        // ...
    }
}
```

```typescript
// ✅ CORRECTO — el caso de uso orquesta, el repository provee acceso a datos
export class CreateOrderUseCase {
    constructor(
        private readonly repository: ICreateOrderRepository,
    ) {}

    async execute(request: CreateOrderRequest) {
        // Reglas de negocio que requieren acceso a datos
        const productIds = request.items.map(item => item.productId);

        const existenceMap = await this.repository.productsExist(productIds);
        const missingProducts = productIds.filter(id => !existenceMap[id]);
        if (missingProducts.length > 0) {
            throw new ProductNotFoundError(`Productos no encontrados: ${missingProducts.join(', ')}`);
        }

        // NOTA: Podría haber una condición de carrera aquí, en un escenario real chequearíamos niveles de stock,
        // reservaríamos el stock, y luego crearíamos la orden.
        const stockLevels = await this.repository.getStockForProducts(productIds);
        for (const item of request.items) {
            const available = stockLevels[item.productId] ?? 0;
            if (available < item.quantity) {
                throw new InsufficientStockError(`Stock insuficiente para el producto ${item.productId}`);
            }
        }

        // Delegar a la entidad de dominio para reglas de negocio puras
        // Order.create valida: items no vacíos, cantidades positivas, precios no negativos
        const order = Order.create({
            items: request.items,
        });

        return this.repository.create(order);
    }
}

// Interfaz de repository — provee datos, no lógica de negocio
interface ICreateOrderRepository {
    productsExist(productIds: string[]): Promise<Record<string, boolean>>;
    getStockForProducts(productIds: string[]): Promise<Record<string, number>>;
    create(order: Order): Promise<Order>;
}

// Implementación — solo consultas SQL, sin decisiones de negocio
class CreateOrderRepository implements ICreateOrderRepository {
    constructor(private readonly db: Database) {}

    async productsExist(productIds: string[]): Promise<Record<string, boolean>> {
        const results = await this.db.query(
            'SELECT id FROM products WHERE id IN (?)',
            [productIds]
        );
        const existingIds = new Set(results.map((r: any) => r.id));
        const existenceMap: Record<string, boolean> = {};
        for (const id of productIds) {
            existenceMap[id] = existingIds.has(id);
        }
        return existenceMap;
    }

    async getStockForProducts(productIds: string[]): Promise<Record<string, number>> {
        const results = await this.db.query(
            'SELECT product_id, stock FROM inventory WHERE product_id IN (?)',
            [productIds]
        );
        // Devolver mapeo de productId a nivel de stock
        const stockMap: Record<string, number> = {};
        for (const row of results) {
            stockMap[row.product_id] = row.stock;
        }
        return stockMap;
    }

    async create(order: Order): Promise<Order> {
        // Persistir orden e items...
    }
}
```

**Punto de Entrada Único**: Cada caso de uso representa una intención de usuario. Si necesitás la misma lógica en dos lugares, extraé la lógica de dominio compartida en la entidad o un servicio de dominio, no en un caso de uso.

**Límites de Transacción**: Cada caso de uso define su propio alcance transaccional. Llamar a otro caso de uso podría commitear o hacer rollback de datos inesperadamente.

**Testabilidad**: Los casos de uso sin dependencias en otros casos de uso son más fáciles de probar en aislamiento.

**Claridad**: Cuando ves un caso de uso siendo invocado, sabés que es una operación de nivel superior iniciada por un usuario o sistema externo, no un detalle interno.

**Reusabilidad a Través del Dominio**: La lógica compartida pertenece al dominio (entidades, value objects, servicios de dominio), no en casos de uso. Los casos de uso orquestan; los dominios encapsulan reglas de negocio.

---

## Documentación por Caso de Uso

### Dónde Encontrar la Documentación

Cada carpeta de caso de uso contiene un `README.md` con:
- ID de caso de uso y descripción
- Actores y stakeholders
- Precondiciones y postcondiciones
- Flujo principal y flujos alternativos
- Reglas de negocio
- Diagramas de secuencia
- Escenarios de error

### Estructura de Ejemplo

```markdown
# UC-CON-001: Crear Contacto

## Resumen
Información de descripción y trigger

## Actores
- Primario: Usuario
- Secundario: Sistema

## Precondiciones
- P1: Usuario autenticado
- P2: Formato de email válido (si se provee)

## Postcondiciones
- PS1: Contacto persistido
- PS2: ID devuelto

## Flujo Principal
1. Validar input
2. Chequear email duplicado
3. Crear entidad
4. Persistir
5. Devolver respuesta

## Flujos Alternativos
- FA-1: Email duplicado
- FA-2: Formato de email inválido

## Diagrama de Secuencia
```mermaid
...
```
```

### Accediendo a la Documentación del Caso de Uso

Navegá a cualquier carpeta de caso de uso para encontrar su documentación:

```bash
cd application/use-cases/{dominio}/{acción}-{entidad}/
cat README.md
```

---

## Agregando un Nuevo Caso de Uso

1. **Crear carpeta** en el dominio apropiado
2. **Crear 4 archivos**: caso-de-uso, dto-request, dto-response, interfaz-repository
3. **Crear README.md** con documentación
4. **Implementar repository** en la capa de infraestructura
5. **Registrar en el módulo** de providers

### Checklist

- [ ] Carpeta creada: `application/use-cases/{dominio}/{acción}-{entidad}/`
- [ ] DTO de request valida el input
- [ ] DTO de response define la forma de salida
- [ ] Interfaz de repository definida en la carpeta del caso de uso
- [ ] Implementación de repository en la capa de infraestructura
- [ ] README.md con documentación completa
- [ ] Registrado en el contenedor de inyección de dependencias
