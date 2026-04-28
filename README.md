# 🛒 MiniShop API

**Автор:** Leshchenko Dmytro  
**Група:** 232/1  

Production-ready REST API для інтернет-магазину, реалізований на NestJS з підтримкою автентифікації, ролей доступу, транзакційної бізнес-логіки та кешування.

---

## 📌 Опис

MiniShop API — це масштабований backend для e-commerce платформи з чистою модульною архітектурою та повним набором базового функціоналу:

- 🔐 Автентифікація (JWT)
- 👤 Управління користувачами
- 🗂 Категорії
- 📦 Товари (з Redis кешуванням)
- 🧾 Замовлення (транзакції + бізнес-логіка)

---

## ⚙️ Технології

- **Framework:** NestJS (TypeScript)
- **База даних:** PostgreSQL
- **ORM:** TypeORM (міграції)
- **Кешування:** Redis
- **Автентифікація:** JWT
- **Авторизація:** RBAC (user, admin)
- **Валідація:** class-validator + class-transformer
- **Документація:** Swagger (OpenAPI)
- **Контейнеризація:** Docker

---

## 🚀 Запуск проєкту

```bash
cp .env.example .env
docker compose up --build -d
docker compose run --rm app npm run seed
```
## 🔐 Auth

POST /auth/register — Реєстрація
POST /auth/login — Логін → JWT

🗂 Categories
```
GET /api/categories — Список
GET /api/categories/:id — Одна
POST /api/categories — admin — Створити
PATCH /api/categories/:id — admin — Оновити
DELETE /api/categories/:id — admin — Видалити
```
## 📦 Products
```
GET /api/products — Список + pagination + filter
GET /api/products/:id — Один
POST /api/products — admin — Створити
PATCH /api/products/:id — admin — Оновити
DELETE /api/products/:id — admin — Видалити
```
## 🧾 Orders
```
POST /api/orders — user — Створити замовлення
GET /api/orders — user/admin — Мої / Всі
GET /api/orders/:id — user/admin — Одне (ownership)
PATCH /api/orders/:id/status — admin — Змінити статус
DELETE /api/orders/:id — admin — Видалити
```

## 🧪 Приклад створення замовлення
```
{
  "items": [
    { "productId": 1, "quantity": 2 },
    { "productId": 5, "quantity": 1 }
  ]
}
```

## 🔄 Життєвий цикл замовлення

pending   → confirmed, cancelled
confirmed → shipped, cancelled
shipped   → delivered
delivered → ❌
cancelled → ❌

## 📊 Query параметри (Orders)

page — номер сторінки
pageSize — кількість елементів
status — фільтр за статусом

## 🧪 Тестування (PowerShell)
Створення замовлення
```
Invoke-RestMethod `
  -Method POST `
  -Uri "http://localhost:3000/api/orders" `
  -Headers @{ Authorization = "Bearer TOKEN" } `
  -ContentType "application/json" `
  -Body '{"items":[{"productId":1,"quantity":1}]}'
Ownership check (403)
Invoke-RestMethod `
  -Method GET `
  -Uri "http://localhost:3000/api/orders/1" `
  -Headers @{ Authorization = "Bearer OTHER_USER_TOKEN" }
```
Зміна статусу (Admin)
```
Invoke-RestMethod `
  -Method PATCH `
  -Uri "http://localhost:3000/api/orders/1/status" `
  -Headers @{ Authorization = "Bearer ADMIN_TOKEN" } `
  -ContentType "application/json" `
  -Body '{"status":"confirmed"}'
```
Недостатній stock
```
Invoke-RestMethod `
  -Method POST `
  -Uri "http://localhost:3000/api/orders" `
  -Headers @{ Authorization = "Bearer TOKEN" } `
  -ContentType "application/json" `
  -Body '{"items":[{"productId":1,"quantity":99999}]}'
```
## 🧠 Основні можливості

✅ Транзакції через QueryRunner
✅ Перевірка stock (validation)
✅ Автоматичний підрахунок totalPrice
✅ Ownership check
✅ Пагінація та фільтрація
✅ Контроль переходів статусів
✅ Redis кешування
✅ JWT + RBAC
✅ Swagger документація

## 📦 Структура проєкту
```
src/
├── auth/
├── users/
├── categories/
├── products/
├── orders/
├── common/
└── config/
```
## 🎯 Результат
Реалізовано OrdersModule
Додано транзакційну бізнес-логіку
Реалізовано ownership check
Додано пагінацію та фільтрацію
Повна DTO валідація
Swagger документація
🏁 Висновок

MiniShop API — це приклад production-рівня backend системи:

Чиста модульна архітектура
Масштабованість
Безпечна авторизація
Надійна обробка транзакцій
Оптимізація через кешування
