# JSON Server - Mock API

Этот проект использует JSON Server для создания mock API во время разработки.

## Установка и запуск

### 1. JSON Server уже установлен как dev зависимость

```bash
npm install  # если еще не установлены зависимости
```

### 2. Доступные команды

```bash
# Запустить только JSON Server (порт 3001)
npm run json-server

# Запустить только frontend (порт 5173)
npm run dev

# Запустить одновременно frontend и JSON Server
npm run dev:full
```

## API Endpoints

JSON Server запускается на `http://localhost:3001` и предоставляет следующие endpoints:

### Дети (Children)

- `GET /children` - получить всех детей
- `GET /children/:id` - получить ребенка по ID
- `POST /children` - создать нового ребенка
- `PUT /children/:id` - обновить ребенка
- `DELETE /children/:id` - удалить ребенка

### Новости (News)

- `GET /news` - получить все новости
- `GET /news/:id` - получить новость по ID
- `POST /news` - создать новость
- `PUT /news/:id` - обновить новость
- `DELETE /news/:id` - удалить новость

### Статьи (Articles)

- `GET /articles` - получить все статьи
- `GET /articles/:id` - получить статью по ID
- `POST /articles` - создать статью
- `PUT /articles/:id` - обновить статью
- `DELETE /articles/:id` - удалить статью

### События (Events)

- `GET /events` - получить все события
- `GET /events/:id` - получить событие по ID
- `POST /events` - создать событие
- `PUT /events/:id` - обновить событие
- `DELETE /events/:id` - удалить событие

### Истории (Stories)

- `GET /stories` - получить все истории
- `GET /stories/:id` - получить историю по ID
- `POST /stories` - создать историю
- `PUT /stories/:id` - обновить историю
- `DELETE /stories/:id` - удалить историю

### Врачи (Doctors)

- `GET /doctors` - получить всех врачей
- `GET /doctors/:id` - получить врача по ID
- `POST /doctors` - создать врача
- `PUT /doctors/:id` - обновить врача
- `DELETE /doctors/:id` - удалить врача

### Регионы (Regions)

- `GET /regions` - получить статистику по регионам

### Контакты (Contacts)

- `GET /contacts` - получить все обращения
- `POST /contacts` - создать обращение
- `PUT /contacts/:id` - обновить обращение
- `DELETE /contacts/:id` - удалить обращение

## Использование в коде

```javascript
import { api } from './src/services/api.js';

// Примеры использования:

// Получить всех детей
const children = await api.children.getAll();

// Создать нового ребенка
const newChild = await api.children.create({
  lastName: 'Иванов',
  firstName: 'Петр',
  gender: 'м',
  birthDate: '2020-05-15',
});

// Получить новости
const news = await api.news.getAll();

// Создать новость
const newNews = await api.news.create({
  title: 'Заголовок новости',
  excerpt: 'Краткое описание',
  content: 'Полный текст новости',
  date: '2025-01-29',
  author: 'Автор',
});
```

## Возможности JSON Server

### Фильтрация

```
GET /children?gender=м
GET /news?author=Команда врачей
```

### Пагинация

```
GET /children?_page=1&_limit=10
```

### Сортировка

```
GET /children?_sort=firstName&_order=asc
GET /news?_sort=date&_order=desc
```

### Поиск

```
GET /children?q=Иванов
```

### Полнотекстовый поиск

```
GET /news?q=реабилитация
```

## Файлы конфигурации

- `db.json` - база данных JSON Server
- `json-server.json` - конфигурация JSON Server
- `routes.json` - пользовательские маршруты
- `src/services/api.js` - API сервис для приложения

## Дополнительные возможности

JSON Server поддерживает:

- CORS по умолчанию
- Автоматическое сохранение изменений в `db.json`
- Hot reload при изменениях в `db.json`
- Middleware для дополнительной логики

## Интерфейс JSON Server

После запуска `npm run json-server` откройте в браузере:
`http://localhost:3001` - увидите список всех доступных endpoints.
