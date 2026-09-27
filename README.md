# Vibe 2.0

Социальное приложение для поиска людей с похожим вкусом. Пользователь подключает сервисы, которыми уже пользуется, а Vibe собирает из них профиль. На этом этапе готов только технический фундамент: аккаунт, профиль и контракт интеграций.

## Стек

- Frontend: Next.js (App Router), TypeScript, Tailwind CSS
- Backend: NestJS, TypeScript, Prisma, PostgreSQL

Firebase, Supabase и другие backend-платформы не используются.

## Структура

```
frontend/     Next.js
backend/      NestJS API
```

Backend собран из независимых модулей:

| Модуль | Сейчас |
| --- | --- |
| health | проверка API и PostgreSQL |
| auth | регистрация, вход, выход, httpOnly-сессия |
| users | профиль текущего пользователя |
| vibe | чтение Vibe-элементов |
| integrations | контракт провайдера, реестр, шифрование токенов, запись нормализованных элементов |

Модули `match`, `discover`, `connections`, `qr` и `chat` в этот этап не входят. Их можно добавить отдельными Nest-модулями в `backend/src` и подключить в `AppModule`.

`VibeItem` не привязан к конкретному сервису. `category` и `source` — строки, поэтому Spotify (`music`), AniList (`anime`) и Steam (`games`) смогут писать в одну категорию одновременно. Общий вес элемента — число от 0 до 1. Рейтинг конкретного сервиса остаётся в `metadata`.

## Безопасность токенов

Access token и refresh token внешнего сервиса обрабатываются только на backend:

- в API их нет, выборка подключённых аккаунтов явно исключает эти поля;
- перед записью в PostgreSQL они шифруются `AES-256-GCM` ключом `TOKEN_ENCRYPTION_KEY`;
- сессия приложения — JWT в cookie `vibe_session` с `HttpOnly`. Frontend не читает ни сессию, ни OAuth-токены.

Секреты в репозиторий не коммитятся. Локальный пароль PostgreSQL из `docker-compose.yml` предназначен только для разработки.

## 1. Установка зависимостей

Нужен Node.js 22+.

```bash
cd backend && npm install
cd ../frontend && npm install
```

## 2. Настройка .env

Сгенерируйте секреты:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

Первое значение — `JWT_SECRET`, второе — `TOKEN_ENCRYPTION_KEY` (ровно 32 байта в base64).

```bash
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env
```

Подставьте сгенерированные значения в `backend/.env`. `frontend/.env` можно оставить как в примере: браузер ходит на `/api`, а Next.js проксирует запросы на backend.

## 3. Запуск PostgreSQL

Через Docker:

```bash
docker compose up -d
```

Локальная база: пользователь `vibe`, пароль `vibe`, база `vibe`, порт `5432`. Эти значения совпадают с `DATABASE_URL` в `.env.example`.

Без Docker подойдёт любой PostgreSQL 16 с той же строкой подключения.

## 4. Запуск Prisma

```bash
cd backend
npx prisma generate
npx prisma migrate dev
```

`prisma generate` создаёт клиент. `prisma migrate dev` применяет миграции к локальной базе. На уже подготовленной базе достаточно `npx prisma migrate deploy`.

## 5. Запуск backend

```bash
cd backend
npm run start:dev
```

API слушает `http://localhost:4000`. Префикс маршрутов — `/api`.

## 6. Запуск frontend

В другом терминале:

```bash
cd frontend
npm run dev
```

Приложение открывается на `http://localhost:3000`.

## 7. Проверка соединения frontend ↔ backend

1. Откройте `http://localhost:3000`. Внизу главной должно быть: «Frontend подключён к backend. База данных доступна.»
2. Либо проверьте оба конца напрямую:

```bash
curl http://localhost:4000/api/health
curl http://localhost:3000/api/health
```

Оба ответа:

```json
{ "status": "ok", "service": "vibe-api", "database": "up" }
```

Второй запрос идёт через прокси Next.js. Страницы `/login`, `/onboarding`, `/discover`, `/vibe` и `/profile` доступны из шапки.

Регистрация: `/login` → «Создать профиль». Сессия сохраняется в httpOnly-cookie. Ответ API не содержит пароль и OAuth-токены.

## Полезные маршруты API

- `POST /api/auth/register`
- `POST /api/auth/login`
- `POST /api/auth/logout`
- `GET /api/auth/me`
- `GET /api/users/me`
- `PATCH /api/users/me`
- `GET /api/integrations/providers`
- `GET /api/integrations/accounts`
- `POST /api/integrations/:provider/sync`
- `GET /api/vibe/me`
- `GET /api/health`

## Что сознательно не реализовано

Spotify OAuth, AniList OAuth, Steam, алгоритм match, чат, QR, уведомления, сложные фильтры, AI, платежи, подписки, лента, stories, лайки и комментарии.

Провайдеры `SpotifyIntegration`, `AniListIntegration` и `SteamIntegration` только занимают контракт `IntegrationProvider` и возвращают `501`. Когда появится реальная интеграция, она должна получить данные у внешнего сервиса, преобразовать их в `NormalizedVibeItem` и передать в `VibeIngestionService`. Общая логика Vibe не знает деталей Spotify.
