<template>
  <div class="home-page">
    <h1 class="home-page-title">Добро пожаловать!</h1>
    <section class="banner-block">
      <img
        src="/src/assets/logo_horizontal.png"
        alt="Логотип на главной странице"
        class="home-page-logo"
      />
    </section>
    <section class="standard-content">
      <StandardContent
        :paragraphs="[
          'Мы стремимся делиться актуальной и полезной информацией с родителями, врачами и всеми, кто хочет помочь.',
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
    </section>

    <section class="latest-news">
      <h2 class="block-title">Последние новости</h2>
      <p v-if="newsLoading" class="status muted">Загрузка…</p>
      <p v-else-if="newsError" class="status error">{{ newsError }}</p>
      <div v-else class="card-list">
        <div
          v-for="n in latestThree"
          :key="n.id"
          class="news-card"
          @click="goToNews(n.id)"
        >
          <div
            class="news-image-wrap"
            :style="{ backgroundImage: `url(${n.image})` }"
          >
            <img :src="n.image" :alt="n.title" class="news-image" />
          </div>
          <p class="date">{{ formatDate(n.date) }}</p>
          <h3 class="card-title">{{ n.title }}</h3>
        </div>
      </div>
    </section>

    <section class="stories-block">
      <h2 class="block-title">Наши истории</h2>
      <p v-if="storiesLoading" class="status muted">Загрузка…</p>
      <p v-else-if="storiesError" class="status error">{{ storiesError }}</p>
      <div v-else class="card-list">
        <div
          v-for="s in latestThreeStories"
          :key="s.id"
          class="story-card"
          @click="goToStory(s.id)"
        >
           <div
            class="story-image-wrap"
            :style="{ backgroundImage: `url(${s.photo || storiesFallbackImg})` }"
          >
            <img :src="s.photo || storiesFallbackImg" :alt="s.title" class="story-image" />
          </div>
          <p class="date">{{ formatDate(s.created_at) }}</p>
          <h3 class="card-title">{{ s.title }}</h3>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { api } from '../services/api.js';
import symptomsImg from '../assets/symptoms.png';
import newsImg from '../assets/news.jpeg';
import familyImg from '../assets/family.png';
import StandardContent from '../components/StandardContent.vue';

const router = useRouter();

const news = ref([]);
const newsLoading = ref(false);
const newsError = ref('');

const sortedNews = computed(() =>
  [...news.value].sort((a, b) => new Date(b.date) - new Date(a.date))
);
const latestThree = computed(() => sortedNews.value.slice(0, 3));

function goToNews(id) {
  router.push(`/news/${id}`);
}

function formatDate(dateString) {
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  return new Date(dateString).toLocaleDateString('ru-RU', options);
}

async function fetchLatestNews() {
  newsLoading.value = true;
  newsError.value = '';
  try {
    const res = await api.accounts.getNews();
    const items = Array.isArray(res?.items) ? res.items : [];
    news.value = items.map(n => ({
      id: n.id,
      title: n.title,
      image: n.photo || newsImg,
      date: n.created_at,
    }));
  } catch (e) {
    newsError.value =
      e?.response?.data?.message || e.message || 'Не удалось загрузить новости';
    news.value = [];
  } finally {
    newsLoading.value = false;
  }
}

onMounted(fetchLatestNews);

// Stories: last 3
const stories = ref([]);
const storiesLoading = ref(false);
const storiesError = ref('');
const storiesFallbackImg = familyImg;

const sortedStories = computed(() =>
  [...stories.value].sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
);
const latestThreeStories = computed(() => sortedStories.value.slice(0, 3));

function goToStory(id) {
  router.push(`/stories/${id}`);
}

async function fetchLatestStories() {
  storiesLoading.value = true;
  storiesError.value = '';
  try {
    const res = await api.accounts.getFamilyStories();
    const items = Array.isArray(res?.items) ? res.items : [];
    stories.value = items.map(s => ({
      id: s.id,
      title: s.title,
      created_at: s.created_at || '',
      photo: s.photo || '',
    }));
  } catch (e) {
    storiesError.value = e?.response?.data?.message || e.message || 'Не удалось загрузить истории';
    stories.value = [];
  } finally {
    storiesLoading.value = false;
  }
}

onMounted(fetchLatestStories);
</script>

<style scoped>
.home-page {
  max-width: 1420px;
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding-bottom: 24px;
  margin: 0 auto;
}

.home-page .home-page-title {
  font-size: 24px;
  margin-bottom: 24px;
}

.home-page-logo {
  max-width: 1420px;
  width: 90%;
}

.banner-block {
  width: 100%;
  text-align: center;
}

.banner-image {
  max-width: 100%;
  height: auto;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.standard-content {
  max-width: 1050px;
}

.card-list {
  display: flex;
  flex-wrap: wrap;
  gap: 24px;
  justify-content: center;
}

.news-card,
.story-card {
  max-width: 300px;
  width: 100%;
  background: #fff;
  padding: 16px;
  border: 1px solid #ddd;
  border-radius: 8px;
  transition: box-shadow 0.2s;
  cursor: pointer;
}

.news-card:hover,
.story-card:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.news-card img,
.story-card img {
  width: 100%;
  border-radius: 6px;
  margin-bottom: 12px;
}

.latest-news .news-card .news-image-wrap {
  position: relative;
  width: 100%;
  height: 300px;
  overflow: hidden;
  border-radius: 6px;
  background-position: center;
  background-size: cover;
  background-repeat: no-repeat;
  background-color: #f3f4f6;
  margin-bottom: 12px;
}

.latest-news .news-card .news-image-wrap::before {
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

.latest-news .news-card .news-image {
  position: relative;
  z-index: 1;
  width: 100%;
  height: 100%;
  display: block;
  object-fit: contain;
  background-color: transparent;
  margin-bottom: 0;
  border-radius: 0;
}

.latest-news .news-card .card-title {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  min-height: 44px;
}

.latest-news .news-card .date {
  margin: 8px 0 6px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.news-card .date {
  font-size: 12px;
  color: #666;
  margin-bottom: 6px;
}

.stories-block .story-card .date {
  font-size: 12px;
  color: #666;
  margin-bottom: 6px;
}

.stories-block .story-card .story-image-wrap {
  position: relative;
  width: 100%;
  height: 300px;
  overflow: hidden;
  border-radius: 6px;
  background-position: center;
  background-size: cover;
  background-repeat: no-repeat;
  background-color: #f3f4f6;
  margin-bottom: 12px;
}
.stories-block .story-card .story-image-wrap::before {
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
.stories-block .story-card .story-image {
  position: relative;
  z-index: 1;
  width: 100%;
  height: 100%;
  display: block;
  object-fit: contain;
  background-color: transparent;
  margin-bottom: 0;
  border-radius: 0;
}
.stories-block .story-card .card-title {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  min-height: 44px;
}

.block-title {
  font-size: 22px;
  margin-bottom: 16px;
}

.status {
  margin: 10px 0 16px;
  font-size: 14px;
}
.status.muted { color: #666; }
.status.error {
  color: #721c24;
  background: #f8d7da;
  border: 1px solid #f5c6cb;
  padding: 8px 10px;
  border-radius: 6px;
}
</style>
