<template>
  <div class="standard-page">
    <h1>Статьи</h1>
    <StandardContent
      :paragraphs="[
        'Добро пожаловать в раздел статей, где вы найдёте полезные материалы о синдроме Ретта.',
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

    <section class="filter">
      <h2>Фильтр по категориям</h2>
      <div class="filter-buttons">
        <button
          v-for="category in categories"
          :key="category"
          :class="{ active: selectedCategories.includes(category) }"
          @click="filterByCategory(category)"
        >
          {{ category }}
        </button>
        <button
          v-if="selectedCategories.length"
          class="clear-button"
          @click="clearFilters"
        >
          Сбросить фильтр
        </button>
      </div>
    </section>

    <section class="articles-block">
      <h2 class="block-title">Статьи</h2>
      <p v-if="loading" class="status muted">Загрузка…</p>
      <p v-else-if="error" class="status error">{{ error }}</p>
      <div class="article-list">
        <div
          v-for="article in visibleArticles"
          :key="article.id"
          class="article-card"
          @click="goToArticle(article.id)"
        >
          <div
            class="article-image-wrap"
            :style="{ backgroundImage: `url(${article.photo || fallbackImg})` }"
          >
            <img :src="article.photo || fallbackImg" :alt="article.title" class="article-image" />
          </div>
          <p class="category">{{ article.category }}</p>
          <p class="date">{{ formatDate(article.created_at) }}</p>
          <h3 class="card-title">{{ article.title }}</h3>
        </div>
      </div>
      <button v-if="hasMore" class="load-more" @click="loadMore">
        Загрузить ещё
      </button>
      <p v-if="!visibleArticles.length" class="no-articles">
        Нет статей по выбранным категориям.
      </p>
    </section>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { api, httpClient } from '../services/api.js';
import symptomsImg from '../assets/symptoms.png';
import articleImg from '../assets/news.jpeg';
import StandardContent from '../components/StandardContent.vue';

const router = useRouter();

// Данные с бэка
const articles = ref([]);
const loading = ref(false);
const error = ref('');
const fallbackImg = articleImg;
const baseURL = (httpClient?.defaults?.baseURL || '').replace(/\/+$/, '');

function absUrl(url) {
  if (!url) return '';
  if (/^https?:\/\//i.test(url)) return url;
  if (url.startsWith('/')) return `${baseURL}${url}`;
  return url;
}

async function loadArticles() {
  loading.value = true;
  error.value = '';
  try {
    const res = await api.accounts.getArticles();
    const items = Array.isArray(res?.items) ? res.items : [];
    articles.value = items.map(a => ({
      id: a.id,
      title: a.title,
      created_at: a.created_at || '',
      photo: absUrl(a.photo || ''),
      category: a.category || '',
      category_id: a.category_id ?? null,
    }));
  } catch (e) {
    error.value = e?.response?.data?.message || e.message || 'Не удалось загрузить статьи';
  } finally {
    loading.value = false;
  }
}

// кол-во отображаемых историй
const pageSize = 10;
const currentPage = ref(1);

const categories = ref([]);
const selectedCategories = ref([]);

const filteredArticles = computed(() => {
  if (!selectedCategories.value.length) return articles.value;
  return articles.value.filter(article =>
    selectedCategories.value.includes(article.category)
  );
});

const sortedArticles = computed(() =>
  [...filteredArticles.value].sort(
    (a, b) => new Date(b.created_at) - new Date(a.created_at)
  )
);

const visibleArticles = computed(() =>
  sortedArticles.value.slice(0, currentPage.value * pageSize)
);
const hasMore = computed(
  () => visibleArticles.value.length < sortedArticles.value.length
);

function filterByCategory(category) {
  const index = selectedCategories.value.indexOf(category);
  if (index > -1) {
    selectedCategories.value.splice(index, 1);
  } else {
    selectedCategories.value.push(category);
  }
}

function clearFilters() {
  selectedCategories.value = [];
  currentPage.value = 1;
}

function loadMore() {
  currentPage.value++;
}

function goToArticle(id) {
  router.push(`/articles/${id}`);
}

function formatDate(d) {
  if (!d) return '';
  try { return new Date(d).toLocaleDateString('ru-RU'); } catch { return d; }
}

async function loadCategories() {
  try {
    const res = await api.accounts.getArticleCategories();
    const items = Array.isArray(res?.items) ? res.items : [];
    categories.value = items.map(i => i.name).filter(Boolean);
  } catch { categories.value = []; }
}

onMounted(async () => {
  await Promise.all([loadCategories(), loadArticles()]);
});
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

.article-list {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.article-card {
  width: 800px;
  display: flex;
  flex-direction: column;
  cursor: pointer;
  border: 1px solid #ddd;
  padding: 16px;
  border-radius: 8px;
  transition: box-shadow 0.3s ease;
}

.article-card:hover {
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.15);
}

.articles-block .article-card .article-image-wrap {
  position: relative;
  width: 100%;
  height: 400px;
  overflow: hidden;
  border-radius: 8px;
  background-position: center;
  background-size: cover;
  background-repeat: no-repeat;
  background-color: #f3f4f6;
  margin-bottom: 12px;
}
.articles-block .article-card .article-image-wrap::before {
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
.articles-block .article-card .article-image {
  position: relative;
  z-index: 1;
  width: 100%;
  height: 100%;
  object-fit: contain; /* не режем саму картинку */
  display: block;
  background: transparent;
}

.card-title {
  font-size: 18px;
  margin: 8px 0;
}

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

.article-card {
  border: 1px solid #ccc;
  padding: 16px;
  margin-bottom: 16px;
  cursor: pointer;
}

.category {
  font-size: 12px;
  color: #888;
}

.date { font-size: 12px; color: #666; margin: 4px 0 6px; }

.status { text-align: center; margin: 16px 0; }
.status.muted { color: #666; }
.status.error { color: #c33; }

.no-articles {
  margin-top: 24px;
  font-style: italic;
  color: #999;
}
</style>
