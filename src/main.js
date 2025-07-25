import { VueMaskDirective } from 'v-mask';
import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import './style.css';
import '/fonts/font-awesome.css';

const app = createApp(App);

// Глобальная обработка ошибок
app.config.errorHandler = (err, instance, info) => {
  // В production не выводим в консоль
  if (process.env.NODE_ENV === 'development') {
    console.error('Ошибка приложения:', err);
    console.error('Компонент:', instance);
    console.error('Информация:', info);
  }
};

// Обработка неперехваченных ошибок
window.addEventListener('error', (event) => {
  if (process.env.NODE_ENV === 'development') {
    console.error('Глобальная ошибка:', event.error);
  }
});

// Обработка неперехваченных Promise
window.addEventListener('unhandledrejection', (event) => {
  if (process.env.NODE_ENV === 'development') {
    console.error('Неперехваченный Promise:', event.reason);
  }
  // Предотвращаем вывод ошибки в консоль браузера
  event.preventDefault();
});

app.use(router);
app.directive('mask', VueMaskDirective);
app.mount('#app');

// createApp(App).use(router).mount('#app')
