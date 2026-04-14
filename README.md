# hlpf-env-setup

## Student
- Name: Лещенко Дмитро
- Group: 232.1

## Практичне заняття №2 — NestJS + PostgreSQL + Redis

## Структура репозиторію

.
├── src/
├── Dockerfile
├── docker-compose.yml
├── .env.example
└── README.md


## Запуск проекту
```bash
docker compose up --build
```
## Перевірка сервісів
```text
NAME                          IMAGE                       COMMAND                  SERVICE    STATUS                    PORTS
hlpf-env-setup-app-1          hlpf-env-setup-app          "docker-entrypoint.s…"   app        running                   0.0.0.0:3000->3000/tcp
hlpf-env-setup-postgres-1     postgres:16-alpine          "docker-entrypoint.s…"   postgres   running (healthy)         0.0.0.0:5432->5432/tcp
hlpf-env-setup-redis-1        redis:7-alpine              "docker-entrypoint.s…"   redis      running (healthy)         0.0.0.0:6379->6379/tcp
```

## Перевірка PostgreSQL
```text
List of databases
   Name    |  Owner   | Encoding
-----------+----------+----------
 nestdb    | nestuser | UTF8
 postgres  | postgres | UTF8
 template0 | postgres | UTF8
 template1 | postgres | UTF8
```
## Перевірка Redis
```text
PONG
```
## Перевірка застосунку
```text
Hello World!
http://localhost:3000
```
## Логи NestJS (фрагмент)
```text
[Nest] LOG [NestFactory] Starting Nest application...
[Nest] LOG [InstanceLoader] AppModule dependencies initialized
[Nest] LOG [TypeOrmModule] TypeORM initialized successfully
[Nest] LOG [NestApplication] Nest application successfully started
```
