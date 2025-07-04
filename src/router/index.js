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
import Contact from "../pages/Contact.vue";
import Rehab from "../pages/Rehab.vue";
import News from "../pages/News.vue";
import NewsPage from "../pages/NewsPage.vue";

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
    {path: '/patients/contact', name: 'Contact', component: Contact},
    {path: '/patients/rehab', name: 'Rehab', component: Rehab},
    {path: '/news', name: 'News', component: News},
    {path: '/news/:id', name: 'NewsPage', component: NewsPage},
]

export default createRouter({
    history: createWebHistory(),
    routes,
    // автоматически прокручивает страницу вверх после перехода на другую
    scrollBehavior(){
        return {top: 0}
    }
})