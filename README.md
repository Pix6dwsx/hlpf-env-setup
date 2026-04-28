## Student
- Name: Leshchenko Dmytro
- Group: 232/1

## Практичне заняття №7 — Redis + Pagination + Filtering

### Запуск проекту
```bash
cp .env.example .env
docker compose up --build -d
docker compose run --rm app npm run seed
```

## API: GET /api/products

| Параметр   | Тип    | Default     | Опис |
|------------|--------|------------|------|
| page       | number | 1          | Номер сторінки |
| pageSize   | number | 10         | Елементів на сторінку (max 100) |
| sort       | string | createdAt  | Поле сортування |
| order      | asc/desc | desc     | Напрямок сортування |
| categoryId | number | -          | Фільтр за категорією |
| minPrice   | number | -          | Мінімальна ціна |
| maxPrice   | number | -          | Максимальна ціна |
| search     | string | -          | Пошук за назвою |

## Приклад відповіді

```json
{
  "data": {
    "items": [
      {
        "id": 30,
        "name": "Hoodie NestJS v3",
        "price": "75.00"
      }
    ],
    "meta": {
      "page": 1,
      "pageSize": 5,
      "total": 30,
      "totalPages": 6
    }
  },
  "statusCode": 200,
  "timestamp": "2026-04-28T13:05:06.168Z"
}
```

## Тест пагінації

```bash
Invoke-RestMethod "http://localhost:3000/api/products?page=1&pageSize=5"
```

## Тест фільтрації

```bash
Invoke-RestMethod "http://localhost:3000/api/products?categoryId=1"
Invoke-RestMethod "http://localhost:3000/api/products?minPrice=100&maxPrice=1000"
```

## Тест пошуку

```bash
Invoke-RestMethod "http://localhost:3000/api/products?search=iphone"
```

## Тест сортування

```bash
Invoke-RestMethod "http://localhost:3000/api/products?sort=price&order=asc"
```

## Тест кешування (Redis)

```bash
docker compose exec redis redis-cli KEYS "products:*"
```

## Тест інвалідації кешу

1. Виконати GET запит  
2. Виконати POST /api/products  
3. Перевірити кеш:

```bash
docker compose exec redis redis-cli KEYS "products:*"
```

Очікується:

```text
(empty array)
```

## Swagger

http://localhost:3000/api/docs

## Результат

- Реалізована пагінація (page, pageSize)
- Додано сортування (sort, order)
- Реалізована фільтрація (categoryId, minPrice, maxPrice)
- Додано пошук (ILIKE)
- Використано QueryBuilder
- Реалізовано кешування через Redis
- Додано інвалідацію кешу
- Створено seed-скрипт (30 продуктів)
