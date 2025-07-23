import { createApp } from 'vue';
// import './style.css'
import App from './App.vue';
import router from './router';
import '/fonts/font-awesome.css'
import { VueMaskDirective } from 'v-mask';

const app = createApp(App)
app.use(router)
app.directive('mask', VueMaskDirective)
app.mount('#app')

// createApp(App).use(router).mount('#app')
