import { createRouter, createWebHistory } from "vue-router";
import HomePage from '../pages/HomePage.vue';
// import AboutPage from '../pages/AboutPage.vue';

const routes = [
    {path: '/rettkie-zhizni', name: 'Home', component: HomePage},
    // {path: '/about', name: 'About', component: AboutPage},
]

export default createRouter({
    history: createWebHistory(),
    routes,
    // автоматически прокручивает страницу вверх после перехода на другую
    scrollBehavior(){
        return {top: 0}
    }
})