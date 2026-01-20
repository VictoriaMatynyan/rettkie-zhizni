import { createRouter, createWebHistory } from 'vue-router';
import LoginForm from '../components/LoginForm.vue';
import RegisterForm from '../components/RegisterForm.vue';
import AboutRett from '../pages/AboutRett.vue';
import AboutUs from '../pages/AboutUs.vue';
import ArticlePage from '../pages/ArticlePage.vue';
import Articles from '../pages/Articles.vue';
import Contact from '../pages/Contact.vue';
import Doctors from '../pages/Doctors.vue';
import Donate from '../pages/Donate.vue';
import DrugDevelopment from '../pages/DrugDevelopment.vue';
import EventPage from '../pages/EventPage.vue';
import Events from '../pages/Events.vue';
import HomePage from '../pages/HomePage.vue';
import Newbie from '../pages/Newbie.vue';
import News from '../pages/News.vue';
import NewsPage from '../pages/NewsPage.vue';
import PatientMap from '../pages/PatientMap.vue';
import PatientRegistry from '../pages/PatientRegistry.vue';
import PersonalAccount from '../pages/PersonalAccount.vue';
import PrivacyPolicy from '../pages/PrivacyPolicy.vue';
import Rehab from '../pages/Rehab.vue';
import Stories from '../pages/Stories.vue';
import StoryPage from '../pages/StoryPage.vue';
import Support from '../pages/Support.vue';

const routes = [
  { path: '/', name: 'Home', component: HomePage },
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
    meta: { requiresAuth: true },
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
  { path: '/privacy-policy', redirect: '/patient-registry/privacy-policy' },
  { path: '/donate', name: 'Donate', component: Donate },

  { path: '/login', name: 'Login', component: LoginForm },
  { path: '/register', name: 'Register', component: RegisterForm },
  {
    path: '/password-reset',
    name: 'PasswordReset',
    component: () => import('../pages/PasswordReset.vue'),
  },
  {
    path: '/password-reset/confirm/:uid/:token',
    name: 'PasswordResetConfirm',
    component: () => import('../pages/PasswordResetConfirm.vue'),
  },
  { path: '/personal-account', redirect: '/patient-registry/personal-account' },
];

const router = createRouter({
  // Keep router base at root; assets base is configured separately in Vite
  history: createWebHistory('/'),
  routes,
  scrollBehavior() {
    return { top: 0 };
  },
});

import { useAuthStore } from '../stores/auth.js';
router.beforeEach(async (to, from, next) => {
  const auth = useAuthStore();
  if (!auth.isAuthenticated) {
    await auth.initAuth();
  }
  if (to.meta?.requiresAuth && !auth.isAuthenticated) {
    return next({ path: '/login', query: { redirect: to.fullPath } });
  }
  next();
});

export default router;
