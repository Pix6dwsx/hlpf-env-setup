## Student

* Name: Лещенко Дмитро
* Group: 232.1

## Практичне заняття №5 — JWT Authentication + Guards + RBAC

---

## Опис

У цьому проєкті реалізовано MiniShop API з повною системою автентифікації та авторизації:
JWT (access token)
bcrypt (хешування паролів)
Guards (JwtAuthGuard, RolesGuard)
RBAC (ролі: user / admin)
Захист ендпоінтів

---

## Структура проекту

```
src/
├── auth/
│   ├── dto/
│   │   ├── login.dto.ts
│   │   └── register.dto.ts
│   ├── auth.controller.ts
│   ├── auth.module.ts
│   └── auth.service.ts
│
├── users/
│   ├── user.entity.ts
│   ├── users.module.ts
│   └── users.service.ts
│
├── common/
│   ├── enums/
│   │   └── role.enum.ts
│   ├── guards/
│   │   ├── jwt-auth.guard.ts
│   │   └── roles.guard.ts
│   ├── decorators/
│   │   ├── current-user.decorator.ts
│   │   └── roles.decorator.ts
│
├── products/
├── categories/
├── migrations/
├── app.module.ts
└── main.ts
```

---

## Запуск проекту

```bash
cp .env.example .env
docker compose up --build
```

---

### API Endpoints

| Method | URL | Auth | Role |
|--------|-----|------|------|
| POST | /auth/register | ❌ | - |
| POST | /auth/login | ❌ | - |
| GET | /api/products | ❌ | - |
| GET | /api/categories | ❌ | - |
| POST | /api/products | ✅ | admin |
| PATCH | /api/products/:id | ✅ | admin |
| DELETE | /api/products/:id | ✅ | admin |
| POST | /api/categories | ✅ | admin |
| PATCH | /api/categories/:id | ✅ | admin |
| DELETE | /api/categories/:id | ✅ | admin |


## 🧪 Тестування

### Реєстрація
```powershell
Invoke-RestMethod -Method POST http://localhost:3000/auth/register `
-Headers @{ "Content-Type" = "application/json" } `
-Body (@{
  email = "admin@test.com"
  password = "password123"
  name = "Admin"
} | ConvertTo-Json)

### Логін
Invoke-RestMethod -Method POST http://localhost:3000/auth/login `
-Headers @{ "Content-Type" = "application/json" } `
-Body (@{
  email = "admin@test.com"
  password = "password123"
} | ConvertTo-Json)

➡️ Відповідь:

{
  "accessToken": "eyJhbGciOiJIUzI1NiIs..."
}
❌ 401 Unauthorized (без токена)
Invoke-RestMethod -Method POST http://localhost:3000/api/products `
-Headers @{ "Content-Type" = "application/json" } `
-Body (@{
  name = "Test"
  price = 10
} | ConvertTo-Json)

➡️ Результат:

{
  "message": "Missing authorization token",
  "statusCode": 401
}
❌ 403 Forbidden (роль user)
Недостатньо прав доступу (Insufficient permissions)
✅ Успішний запит (admin)
Invoke-RestMethod -Method POST http://localhost:3000/api/products `
-Headers @{
  "Content-Type" = "application/json"
  "Authorization" = "Bearer <TOKEN>"
} `
-Body (@{
  name = "MacBook"
  price = 2000
} | ConvertTo-Json)

➡️ Результат:

{
  "id": 1,
  "name": "MacBook",
  "price": 2000
}
✅ Створення категорії (admin)
Invoke-RestMethod -Method POST http://localhost:3000/api/categories `
-Headers @{
  "Content-Type" = "application/json"
  "Authorization" = "Bearer <TOKEN>"
} `
-Body (@{
  name = "Electronics"
} | ConvertTo-Json)
🔐 Безпека
Паролі зберігаються тільки у вигляді хешу (bcrypt)
JWT використовується для авторизації
Ролі обмежують доступ до ресурсів
Захищені ендпоінти: POST / PATCH / DELETE
🧠 Висновок

Було реалізовано повну систему автентифікації та авторизації з використанням JWT, Guards та RBAC. API підтримує розмежування доступу між користувачами та адміністраторами, забезпечуючи безпечну роботу з даними.
