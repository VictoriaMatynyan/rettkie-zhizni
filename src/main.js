import { VueMaskDirective } from 'v-mask';
import { createApp, nextTick } from 'vue';
import App from './App.vue';
import router from './router';
import './style.css';
import { initYandexMetrika } from './utils/external-apis.js';
import '/fonts/font-awesome.css';

const app = createApp(App);

// Проверка наличия обязательных переменных окружения
if (import.meta.env.DEV) {
  const requiredEnvVars = [
    'VITE_YANDEX_MAPS_API_KEY',
    'VITE_YANDEX_METRIKA_ID',
  ];

  const missingVars = requiredEnvVars.filter(
    (varName) =>
      !import.meta.env[varName] || import.meta.env[varName].includes('your_')
  );

  if (missingVars.length > 0) {
    console.warn(
      '⚠️  Отсутствуют переменные окружения:',
      missingVars.join(', '),
      '\n📖 Скопируйте .env.example в .env.development и заполните реальными значениями'
    );
  }
}

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
  if (metrikaId && !metrikaId.includes('your_')) {
    initYandexMetrika(metrikaId);
  }

  // Загружаем Yandex Maps API динамически
  const mapsApiKey = import.meta.env.VITE_YANDEX_MAPS_API_KEY;
  if (mapsApiKey && !mapsApiKey.includes('your_')) {
    const script = document.createElement('script');
    script.src = `https://api-maps.yandex.ru/2.1/?lang=ru_RU&apikey=${mapsApiKey}`;
    script.type = 'text/javascript';
    script.async = true;
    document.head.appendChild(script);
  } else if (import.meta.env.DEV) {
    console.warn('🗺️ Yandex Maps API ключ не настроен');
  }
});

// createApp(App).use(router).mount('#app')
