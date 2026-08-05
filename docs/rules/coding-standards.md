# Coding Standards

## Constants over magic values

Never inline numbers or strings with semantic meaning. Named constants make intent explicit and changes touch one place.

```ts
// ❌ Bad
if (user.role === "admin") setSessionTimeout(1800);

// ✅ Good
const ADMIN_ROLE = "admin" as const;
const SESSION_TIMEOUT_SECONDS = 1800;
if (user.role === ADMIN_ROLE) setSessionTimeout(SESSION_TIMEOUT_SECONDS);
```

## Short, single-responsibility functions

A function does one thing. If you can describe it with "and", split it. Prefer pure functions over hidden side effects.

```ts
// ❌ Bad — does three things
function processOrder(order: Order): void {
  validateOrder(order);
  order.items.forEach((i) => (i.price *= 0.9));
  saveOrder(order);
  sendEmail(order.email, "Order confirmed");
}

// ✅ Good — each step named, composable
function applyDiscount(item: OrderItem): OrderItem {
  return { ...item, price: item.price * DISCOUNT_RATE };
}

function processOrder(order: Order): void {
  const validated = validateOrder(order);
  const discounted = { ...validated, items: validated.items.map(applyDiscount) };
  saveOrder(discounted);
  notifyCustomer(discounted);
}
```

## Guard clauses over nesting

Return early. The happy path stays at the top level, unindented.

```ts
// ❌ Bad — arrow-shaped, buries the happy path
function getDiscount(user: User): number | null {
  if (user.isActive) {
    if (user.orders.length > 10) {
      if (user.isVip) return VIP_DISCOUNT;
      else return LOYALTY_DISCOUNT;
    } else return null;
  } else return null;
}

// ✅ Good — guard clauses, happy path last and flat
function getDiscount(user: User): number | null {
  if (!user.isActive) return null;
  if (user.orders.length <= MIN_ORDERS_FOR_DISCOUNT) return null;
  if (!user.isVip) return LOYALTY_DISCOUNT;
  return VIP_DISCOUNT;
}
```

## Descriptive names

Names state **what** and **why**, not how. No `data`, `temp`, `info`, `x` outside narrow numeric scope.

```ts
// ❌ Bad
const d = new Date();
const u = users.filter((x) => x.a);

// ✅ Good
const trialStartDate = new Date();
const activeUsers = users.filter((user) => user.isActive);
```

## DRY — extract, don't duplicate

The third time you write the same logic, extract it. Don't pre-extract for hypothetical reuse (YAGNI).

```ts
// ❌ Bad — repeated formatting
formatDate(order.createdAt);
formatDate(invoice.createdAt);
formatDate(report.createdAt);

// ✅ Good — one helper, one truth
function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", DATE_FORMAT_OPTIONS);
}
```
## Boring code on purpose

Prefer plain, step-by-step code over dense one-liners. Named intermediate variables document intent better than chained expressions. Optimize for readability, not line count.

```ts
// ❌ Bad — clever, hard to scan, intent hidden
const totalValue = allTasks
  .filter((task) => task.type === COMPLETED)
  .map((task) => task.value)
  .reduce((sum, value) => sum + value, 0) || 0;

// ✅ Good — boring, obvious, each step explains itself
const completedTasks = allTasks.filter((task) => task.type === COMPLETED);
const totalValue = completedTasks.reduce((sum, task) => sum + task.value, 0);
```
