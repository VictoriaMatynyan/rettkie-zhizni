<template>
  <div class="standard-page">
    <h1>Мероприятия</h1>
    <StandardContent
      :paragraphs="[
        'Добро пожаловать в раздел мероприятий, где вы можете узнать о предстоящих мероприятиях',
      ]"
      :image-src="symptomsImg"
      :image-src-modal="symptomsImg"
      image-alt="Схема симптомов Ретта"
      image-alt-modal="Схема симптомов Ретта"
      download-link="/files/rett-info-brochure.pdf"
      download-label="Скачать памятку по заболеванию: "
      caption-text="Изображение: основные проявления синдрома Ретта"
      download-link-name="Гайд-заглушка (1.2 МБ)"
      video-url="https://rutube.ru/play/embed/someVideoId/"
    >
    </StandardContent>

    <section class="events-block">
      <h2 class="block-title">Мероприятия</h2>
      <p v-if="loading" class="status muted">Загрузка…</p>
      <p v-else-if="error" class="status error">{{ error }}</p>
      <div class="event-list">
        <div
          v-for="event in visibleEvents"
          :key="event.id"
          class="event-card"
          @click="goToEvent(event.id)"
        >
          <img :src="event.photo || fallbackImg" :alt="event.title" class="event-image" />
          <p class="date">{{ formatDate(event.event_date) }} <span v-if="event.location">• {{ event.location }}</span></p>
          <h3 class="card-title">{{ event.title }}</h3>
        </div>
      </div>
      <button v-if="hasMore" class="load-more" @click="loadMore">
        Загрузить ещё
      </button>
    </section>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { api, httpClient } from '../services/api.js';
import symptomsImg from '../assets/symptoms.png';
import eventImg from '../assets/news.jpeg';
import StandardContent from '../components/StandardContent.vue';

const router = useRouter();
// Данные мероприятий с бэка
const events = ref([]);
const loading = ref(false);
const error = ref('');
const fallbackImg = eventImg;
const baseURL = (httpClient?.defaults?.baseURL || '').replace(/\/+$/, '');

function absUrl(url) {
  if (!url) return '';
  if (/^https?:\/\//i.test(url)) return url;
  if (url.startsWith('/')) return `${baseURL}${url}`;
  return url;
}

async function loadEvents() {
  loading.value = true;
  error.value = '';
  try {
    const res = await api.accounts.getEvents();
    const items = Array.isArray(res?.items) ? res.items : [];
    events.value = items.map(e => ({
      id: e.id,
      title: e.title,
      event_date: e.event_date || e.created_at || '',
      location: e.location || '',
      photo: absUrl(e.photo || ''),
    }));
  } catch (e) {
    error.value = e?.response?.data?.message || e.message || 'Не удалось загрузить мероприятия';
  } finally {
    loading.value = false;
  }
}

// кол-во отображаемых историй
const pageSize = 10;
const currentPage = ref(1);

const sortedEvents = computed(() =>
  [...events.value].sort((a, b) => new Date(b.event_date) - new Date(a.event_date))
);

const visibleEvents = computed(() =>
  sortedEvents.value.slice(0, currentPage.value * pageSize)
);

const hasMore = computed(
  () => visibleEvents.value.length < sortedEvents.value.length
);

function loadMore() {
  currentPage.value++;
}

function goToEvent(id) {
  router.push(`/events/${id}`);
}

function formatDate(d) {
  if (!d) return '';
  try {
    return new Date(d).toLocaleDateString('ru-RU', { year: 'numeric', month: 'long', day: 'numeric' });
  } catch { return d; }
}

onMounted(loadEvents);
</script>

<style scoped>
.standard-page {
  max-width: 1050px;
  margin: 0 auto;
  padding: 32px 16px;
}

.standard-page h1 {
  font-size: 28px;
  margin-bottom: 24px;
  text-align: center;
}

.family-stories {
  margin-top: 48px;
}

.block-title {
  font-size: 22px;
  margin-bottom: 20px;
}

.event-list {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.event-card {
  display: flex;
  flex-direction: column;
  cursor: pointer;
  border: 1px solid #ddd;
  padding: 16px;
  border-radius: 8px;
  transition: box-shadow 0.3s ease;
}

.event-card:hover {
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.15);
}

.card-title {
  font-size: 18px;
  margin: 8px 0;
}

.date { font-size: 12px; color: #666; margin-bottom: 6px; }

.status { text-align: center; margin: 16px 0; }
.status.muted { color: #666; }
.status.error { color: #c33; }

.load-more {
  margin: 24px auto 0;
  display: block;
  padding: 10px 20px;
  font-size: 16px;
  color: #2aaea2;
  background-color: transparent;
  border: 1px solid #2aaea2;
  border-radius: 6px;
  cursor: pointer;
}

.load-more:hover {
  background-color: #2aaea2;
  border: 1px solid #2aaea2;
  color: #fff;
}

.filter {
  display: flex;
  flex-direction: column;
  margin: 0;
}

.filter-buttons {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
  border-radius: 8px;
  padding: 20px 10px;
}

.filter-buttons button {
  padding: 6px 12px;
  border: 1px solid #ccc;
  background-color: transparent;
  border-radius: 8px;
  cursor: pointer;
}
.filter-buttons .active {
  background: #2aaea2;
  color: #fff;
}

.clear-button {
  margin-left: auto;
}

.clear-button:hover {
  background-color: rgba(129, 50, 173, 0.3);
}

.event-card {
  width: 800px;
  border: 1px solid #ccc;
  padding: 16px;
  margin-bottom: 16px;
  cursor: pointer;
}

.event-card img {
  width: 100%;
  max-width: 50%;
  height: auto;
  align-self: center;
}

.category {
  font-size: 12px;
  color: #888;
}

.no-articles {
  margin-top: 24px;
  font-style: italic;
  color: #999;
}
</style>
