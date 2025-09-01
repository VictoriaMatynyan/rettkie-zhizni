import { createPinia } from 'pinia';
import { VueMaskDirective } from 'v-mask';
import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import './style.css';
import '/fonts/font-awesome.css';

const app = createApp(App);
const pinia = createPinia();

app.use(pinia);
app.use(router);
app.directive('mask', VueMaskDirective);
app.mount('#app');

// createApp(App).use(router).mount('#app')
