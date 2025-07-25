import { createRouter, createWebHistory } from 'vue-router';
import HomePage from '../pages/HomePage.vue';
import AboutRett from '../pages/AboutRett.vue';
import Doctors from '../pages/Doctors.vue';
import Newbie from '../pages/Newbie.vue';
import DrugDevelopment from '../pages/DrugDevelopment.vue';
import Support from '../pages/Support.vue';
import Stories from '../pages/Stories.vue';
import StoryPage from '../pages/StoryPage.vue';
import Articles from '../pages/Articles.vue';
import ArticlePage from '../pages/ArticlePage.vue';
import Contact from '../pages/Contact.vue';
import Rehab from '../pages/Rehab.vue';
import News from '../pages/News.vue';
import NewsPage from '../pages/NewsPage.vue';
import Events from '../pages/Events.vue';
import EventPage from '../pages/EventPage.vue';
import AboutUs from '../pages/AboutUs.vue';
import PatientRegistry from '../pages/PatientRegistry.vue';
import PersonalAccount from '../pages/PersonalAccount.vue';
import PatientMap from '../pages/PatientMap.vue';
import PrivacyPolicy from '../pages/PrivacyPolicy.vue';
import Donate from '../pages/Donate.vue';

const routes = [
  { path: '/rettkie-zhizni', name: 'Home', component: HomePage },
  { path: '/about-rett', name: 'AboutRett', component: AboutRett },
  { path: '/doctors', name: 'Doctors', component: Doctors },
  { path: '/patients/newbie', name: 'Newbie', component: Newbie },
  {
    path: '/patients/drug-development',
    name: 'DrugDevelopment',
    component: DrugDevelopment,
  },
  { path: '/patients/support', name: 'Support', component: Support },
  { path: '/patients/stories', name: 'Stories', component: Stories },
  { path: '/stories/:id', name: 'StoryPage', component: StoryPage },
  { path: '/patients/articles', name: 'Articles', component: Articles },
  { path: '/articles/:id', name: 'ArticlePage', component: ArticlePage },
  { path: '/patients/contact', name: 'Contact', component: Contact },
  { path: '/patients/rehab', name: 'Rehab', component: Rehab },
  { path: '/news', name: 'News', component: News },
  { path: '/news/:id', name: 'NewsPage', component: NewsPage },
  { path: '/events', name: 'Events', component: Events },
  { path: '/events/:id', name: 'EventPage', component: EventPage },
  { path: '/about-us', name: 'AboutUs', component: AboutUs },
  {
    path: '/patient-registry',
    name: 'PatientRegistry',
    component: PatientRegistry,
  },
  {
    path: '/patient-registry/personal-account',
    name: 'PersonalAccount',
    component: PersonalAccount,
  },
  {
    path: '/patient-registry/patient-map',
    name: 'PatientMap',
    component: PatientMap,
  },
  {
    path: '/patient-registry/privacy-policy',
    name: 'PrivacyPolicy',
    component: PrivacyPolicy,
  },
  // Редирект для старого пути
  {
    path: '/privacy-policy',
    redirect: '/patient-registry/privacy-policy',
  },
  { path: '/donate', name: 'Donate', component: Donate },
];

export default createRouter({
  history: createWebHistory(),
  routes,
  // автоматически прокручивает страницу вверх после перехода на другую
  scrollBehavior() {
    return { top: 0 };
  },
});
