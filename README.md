## Student

* Name: Лещенко Дмитро
* Group: 232.1

## Практичне заняття №4 — DTO + class-validator + Pipes

---

## Опис

У цьому проєкті реалізовано валідацію вхідних даних для MiniShop API за допомогою DTO, class-validator та Pipes.

---

## Структура проекту

```
.
├── src/
│   ├── categories/
│   │   ├── dto/
│   │   │   ├── create-category.dto.ts
│   │   │   └── update-category.dto.ts
│   │   ├── category.entity.ts
│   │   ├── categories.module.ts
│   │   ├── categories.service.ts
│   │   └── categories.controller.ts
│   ├── products/
│   │   ├── dto/
│   │   │   ├── create-product.dto.ts
│   │   │   └── update-product.dto.ts
│   │   ├── product.entity.ts
│   │   ├── products.module.ts
│   │   ├── products.service.ts
│   │   └── products.controller.ts
│   ├── common/
│   │   └── pipes/
│   │       └── trim.pipe.ts
│   ├── migrations/
│   ├── data-source.ts
│   ├── main.ts
│   └── app.module.ts
├── Dockerfile
├── docker-compose.yml
└── README.md
```

---

## Запуск проекту

```bash
cp .env.example .env
docker compose up --build
```

---

## Тестування валідації

### ❌ Порожнє ім’я категорії

```bash
POST /api/categories
{ "name": "" }
```

Результат:

```
{
  "message": ["name must be longer than or equal to 2 characters"],
  "error": "Bad Request",
  "statusCode": 400
}
```

---

### ❌ Від’ємна ціна продукту

```bash
POST /api/products
{ "name": "Test", "price": -5 }
```

Результат:

```
"price must not be less than 0.01"
```

---

### ❌ Зайве поле

```bash
POST /api/categories
{ "name": "Test", "isAdmin": true }
```

Результат:

```
"property isAdmin should not exist"
```

---

### ✅ TrimPipe (обрізання пробілів)

```bash
POST /api/categories
{ "name": "  Test  " }
```

Результат:

```
"name": "Test"
```

---

## Особливості

* Використано DTO для типізації та валідації
* Підключено глобальний ValidationPipe
* Заборонені зайві поля (forbidNonWhitelisted)
* Реалізовано кастомний TrimPipe
* Повністю замінено body: any та Partial<>

---
