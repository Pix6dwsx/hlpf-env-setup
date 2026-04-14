## Student
- Name: Лещенко Дмитро
- Group: 232.1

## Практичне заняття №3 — CRUD REST API (NestJS + PostgreSQL + Docker)

---

## Опис
Реалізовано REST API для MiniShop з використанням NestJS, PostgreSQL, Docker та TypeORM.

---

## Структура проекту

```
.
├── src/
│   ├── categories/
│   ├── products/
│   ├── migrations/
│   ├── data-source.ts
│   └── app.module.ts
├── docker-compose.yml
├── Dockerfile
└── README.md
```

---

## Запуск проекту

```bash
cp .env.example .env
docker compose up --build
```

---

## API Endpoints

### Categories
- GET /api/categories
- GET /api/categories/:id
- POST /api/categories
- PATCH /api/categories/:id
- DELETE /api/categories/:id

### Products
- GET /api/products
- GET /api/products/:id
- POST /api/products
- PATCH /api/products/:id
- DELETE /api/products/:id

---

## Міграції

```bash
docker compose exec app npm run migration:run
```

---

## Перевірка БД

```bash
docker compose exec postgres psql -U nestuser -d nestdb -c "\dt"
```

---

## Тест API (приклад)

```powershell
Invoke-RestMethod -Method POST `
-Uri http://localhost:3000/api/categories `
-ContentType "application/json" `
-Body '{"name":"Electronics"}'
```

---

## Особливості

- synchronize: false
- Використані міграції (ручна + згенерована)
- CRUD для categories та products
- Docker запуск з нуля
- Зв’язок ManyToOne (Product → Category)
