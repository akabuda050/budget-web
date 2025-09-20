# Balance Web

Проста веб-апка на Vue 3 (script setup) + Tailwind, що показує поточний баланс, тижневий та денний ліміти. Дані бере з локального API у `cs_transactions_syncer`.

## Запуск

- Запустіть sync/API сервіс у `cs_transactions_syncer` (MongoDB має бути доступним; API слухає `API_PORT`, дефолт 3301).
- У цій папці: `npm install` і `npm run dev`, тоді відкрийте `http://localhost:5173`.

Під час dev всі запити на `/api` проксійні на `VITE_API_BASE_URL` (див. `.env.development`).

## Налаштування періоду

За замовчуванням використовується перший і останній день поточного місяця. Можна змінити у UI і натиснути "Оновити".

