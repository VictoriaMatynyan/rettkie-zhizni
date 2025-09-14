<template>
  <div class="standard-page">
    <h1>Новости</h1>

    <section class="news-block">
      <h2 class="block-title">Последние новости</h2>
      <p v-if="loading" class="status muted">Загрузка новостей…</p>
      <p v-else-if="error" class="status error">{{ error }}</p>
      <div class="news-list">
        <div
          v-for="news in visibleNews"
          :key="news.id"
          class="news-card"
          @click="goToNews(news.id)"
        >
          <div
            class="news-image-wrap"
            :style="{ backgroundImage: `url(${news.image})` }"
          >
            <img :src="news.image" :alt="news.title" class="news-image" />
          </div>
          <p class="date">{{ formatDate(news.date) }}</p>
          <h3 class="card-title">{{ news.title }}</h3>
          <p class="preview">{{ news.preview }}</p>
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
import { api } from '../services/api.js';
import symptomsImg from '../assets/symptoms.png';
import newsImg from '../assets/news.jpeg';
import StandardContent from '../components/StandardContent.vue';

const router = useRouter();

// Данные новостей с backend
const newsArr = ref([]);
const loading = ref(false);
const error = ref('');

// пагинация на клиенте
const pageSize = 9;
const currentPage = ref(1);

const sortedNews = computed(() =>
  [...newsArr.value].sort((a, b) => new Date(b.date) - new Date(a.date))
);

const visibleNews = computed(() =>
  sortedNews.value.slice(0, currentPage.value * pageSize)
);

const hasMore = computed(
  () => visibleNews.value.length < sortedNews.value.length
);

function loadMore() {
  currentPage.value++;
}

function goToNews(id) {
  router.push(`/news/${id}`);
}

function formatDate(dateString) {
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  return new Date(dateString).toLocaleDateString('ru-RU', options);
}

async function fetchNews() {
  loading.value = true;
  error.value = '';
  try {
    const res = await api.accounts.getNews();
    const items = Array.isArray(res?.items) ? res.items : [];
    newsArr.value = items.map(n => ({
      id: n.id,
      title: n.title,
      image: n.photo || newsImg,
      date: n.created_at,
      preview: '',
    }));
  } catch (e) {
    error.value =
      e?.response?.data?.message || e.message || 'Не удалось загрузить новости';
    newsArr.value = [];
  } finally {
    loading.value = false;
  }
}

onMounted(fetchNews);
</script>

<style scoped>
.standard-page {
  /* max-width: 1050px; */
  max-width: 1200px;
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

.news-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 24px;
}

.news-card {
  background-color: #fff;
  border: 1px solid #ddd;
  padding: 16px;
  border-radius: 10px;
  transition: box-shadow 0.3s ease;
  cursor: pointer;
}

.news-card:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.news-image {
  position: relative;
  z-index: 1;
  width: 100%;
  height: 100%;
  display: block;
  object-fit: contain;
}

.date {
  font-size: 14px;
  color: #888;
  margin-bottom: 6px;
}

.card-title {
  font-size: 18px;
  margin: 8px 0;
  font-weight: bold;
}

.preview {
  font-size: 14px;
  color: #444;
}

.news-image-wrap {
  position: relative;
  width: 100%;
  height: 300px;
  overflow: hidden;
  border-radius: 8px;
  background-position: center;
  background-size: cover;
  background-repeat: no-repeat;
  background-color: #f3f4f6;
  margin-bottom: 12px;
}
.news-image-wrap::before {
  content: '';
  position: absolute;
  inset: 0;
  background: inherit;
  background-position: inherit;
  background-size: inherit;
  background-repeat: inherit;
  filter: blur(18px);
  transform: scale(1.12);
}

.load-more {
  margin: 32px auto 0;
  display: block;
  padding: 10px 24px;
  font-size: 16px;
  background-color: transparent;
  border: 1px solid #2aaea2;
  color: #2aaea2;
  border-radius: 8px;
  cursor: pointer;
  transition:
    background-color 0.2s ease,
    color 0.2s ease;
}

.load-more:hover {
  background-color: #2aaea2;
  color: #fff;
}

.status {
  margin: 10px 0 16px;
  font-size: 14px;
}
.status.muted {
  color: #666;
}
.status.error {
  color: #721c24;
  background: #f8d7da;
  border: 1px solid #f5c6cb;
  padding: 8px 10px;
  border-radius: 6px;
}

.no-news {
  margin-top: 24px;
  font-style: italic;
  color: #999;
}
</style>
