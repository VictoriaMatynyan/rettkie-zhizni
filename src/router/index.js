import { createRouter, createWebHistory } from "vue-router";
import HomePage from '../pages/HomePage.vue';
import AboutRett from '../pages/AboutRett.vue';

const routes = [
    {path: '/rettkie-zhizni', name: 'Home', component: HomePage},
    {path: '/about-rett', name: 'AboutRett', component: AboutRett},
]

export default createRouter({
    history: createWebHistory(),
    routes,
    // автоматически прокручивает страницу вверх после перехода на другую
    scrollBehavior(){
        return {top: 0}
    }
})