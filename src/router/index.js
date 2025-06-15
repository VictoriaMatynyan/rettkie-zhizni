import { createRouter, createWebHistory } from "vue-router";
import HomePage from '../pages/HomePage.vue';
import AboutRett from '../pages/AboutRett.vue';
import Doctors from "../pages/Doctors.vue";
import Newbie from "../pages/Newbie.vue";
import DrugDevelopment from "../pages/DrugDevelopment.vue";
import Support from "../pages/Support.vue";
import Stories from "../pages/Stories.vue";
import StoryPage from "../pages/StoryPage.vue";
import Articles from "../pages/Articles.vue";
import ArticlePage from "../pages/ArticlePage.vue";

const routes = [
    {path: '/rettkie-zhizni', name: 'Home', component: HomePage},
    {path: '/about-rett', name: 'AboutRett', component: AboutRett},
    {path: '/doctors', name: 'Doctors', component: Doctors},
    {path: '/patients/newbie', name: 'Newbie', component: Newbie},
    {path: '/patients/drug-development', name: 'DrugDevelopment', component: DrugDevelopment},
    {path: '/patients/support', name: 'Support', component: Support},
    {path: '/patients/stories', name: 'Stories', component: Stories},
    {path: '/stories/:id', name: 'StoryPage', component: StoryPage},
    {path: '/patients/articles', name: 'Articles', component: Articles},
    {path: '/articles/:id', name: 'ArticlePage', component: ArticlePage},
]

export default createRouter({
    history: createWebHistory(),
    routes,
    // автоматически прокручивает страницу вверх после перехода на другую
    scrollBehavior(){
        return {top: 0}
    }
})