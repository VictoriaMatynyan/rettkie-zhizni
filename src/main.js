import { VueMaskDirective } from 'v-mask';
import { createApp, nextTick } from 'vue';
import App from './App.vue';
import router from './router';
import './style.css';
import { initYandexMetrika } from './utils/external-apis.js';
import '/fonts/font-awesome.css';

const app = createApp(App);

// Глобальная обработка ошибок
app.config.errorHandler = (err, instance, info) => {
  // В production не выводим в консоль
  if (import.meta.env.DEV) {
    console.error('Ошибка приложения:', err);
    console.error('Компонент:', instance);
    console.error('Информация:', info);
  }
};

// Обработка неперехваченных ошибок
window.addEventListener('error', (event) => {
  if (import.meta.env.DEV) {
    console.error('Глобальная ошибка:', event.error);
  }
});

// Обработка неперехваченных Promise
window.addEventListener('unhandledrejection', (event) => {
  if (import.meta.env.DEV) {
    console.error('Неперехваченный Promise:', event.reason);
  }
  // Предотвращаем вывод ошибки в консоль браузера
  event.preventDefault();
});

app.use(router);
app.directive('mask', VueMaskDirective);
app.mount('#app');

// Инициализируем метрику после монтирования приложения
nextTick(() => {
  const metrikaId = import.meta.env.VITE_YANDEX_METRIKA_ID;
  if (metrikaId) {
    initYandexMetrika(metrikaId);
  }
});

// createApp(App).use(router).mount('#app')
