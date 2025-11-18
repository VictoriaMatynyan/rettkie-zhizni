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
      <h2 class="block-title" :showBlockTitle="true">Последние новости</h2>
      <p v-if="newsLoading" class="status muted">Загрузка…</p>
      <p v-else-if="newsError" class="status error">{{ newsError }}</p>
      <p v-else-if="!sortedNews.length" class="status muted no-news">
        Пока новостей нет, но мы готовим для вас новые материалы!
      </p>
      <div v-else class="carousel-container">
        <button
          v-if="sortedNews.length > 3"
          class="carousel-btn carousel-btn-prev"
          aria-label="Предыдущие новости"
          @click="scrollNews('prev')"
        >
          ‹
        </button>
        <div ref="newsCarousel" class="carousel-wrapper">
          <div class="card-list">
            <div
              v-for="n in sortedNews"
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
        </div>
        <button
          v-if="sortedNews.length > 3"
          class="carousel-btn carousel-btn-next"
          aria-label="Следующие новости"
          @click="scrollNews('next')"
        >
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M9 18l6-6-6-6"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
        </button>
      </div>
    </section>

    <section class="stories-block">
      <h2 class="block-title">Наши истории</h2>
      <p v-if="storiesLoading" class="status muted">Загрузка…</p>
      <p v-else-if="storiesError" class="status error">{{ storiesError }}</p>
      <p v-else-if="!sortedStories.length" class="status muted no-stories">
        Пока здесь нет историй, но совсем скоро мы начнём делиться ими здесь!
      </p>
      <div v-else class="carousel-container">
        <button
          v-if="sortedStories.length > 3"
          class="carousel-btn carousel-btn-prev"
          aria-label="Предыдущие истории"
          @click="scrollStories('prev')"
        >
          ‹
        </button>
        <div ref="storiesCarousel" class="carousel-wrapper">
          <div class="card-list">
            <div
              v-for="s in sortedStories"
              :key="s.id"
              class="story-card"
              @click="goToStory(s.id)"
            >
              <div
                class="story-image-wrap"
                :style="{
                  backgroundImage: `url(${s.photo || storiesFallbackImg})`,
                }"
              >
                <img
                  :src="s.photo || storiesFallbackImg"
                  :alt="s.title"
                  class="story-image"
                />
              </div>
              <p class="date">{{ formatDate(s.created_at) }}</p>
              <h3 class="card-title">{{ s.title }}</h3>
            </div>
          </div>
        </div>
        <button
          v-if="sortedStories.length > 3"
          class="carousel-btn carousel-btn-next"
          aria-label="Следующие истории"
          @click="scrollStories('next')"
        >
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M9 18l6-6-6-6"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
        </button>
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
const newsCarousel = ref(null);

const sortedNews = computed(() =>
  [...news.value].sort((a, b) => new Date(b.date) - new Date(a.date))
);

function goToNews(id) {
  router.push(`/news/${id}`);
}

function formatDate(dateString) {
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  return new Date(dateString).toLocaleDateString('ru-RU', options);
}

function scrollNews(direction) {
  if (!newsCarousel.value) return;
  const cardWidth = 324; // 300px card + 24px gap
  const containerWidth = newsCarousel.value.clientWidth;
  const visibleCards = Math.floor(containerWidth / cardWidth) || 1;
  const scrollAmount = cardWidth * visibleCards;
  const currentScroll = newsCarousel.value.scrollLeft;
  const newScroll =
    direction === 'next'
      ? currentScroll + scrollAmount
      : currentScroll - scrollAmount;
  newsCarousel.value.scrollTo({
    left: newScroll,
    behavior: 'smooth',
  });
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

// Stories
const stories = ref([]);
const storiesLoading = ref(false);
const storiesError = ref('');
const storiesFallbackImg = familyImg;
const storiesCarousel = ref(null);

const sortedStories = computed(() =>
  [...stories.value].sort(
    (a, b) => new Date(b.created_at) - new Date(a.created_at)
  )
);

function goToStory(id) {
  router.push(`/stories/${id}`);
}

function scrollStories(direction) {
  if (!storiesCarousel.value) return;
  const cardWidth = 324; // 300px card + 24px gap
  const containerWidth = storiesCarousel.value.clientWidth;
  const visibleCards = Math.floor(containerWidth / cardWidth) || 1;
  const scrollAmount = cardWidth * visibleCards;
  const currentScroll = storiesCarousel.value.scrollLeft;
  const newScroll =
    direction === 'next'
      ? currentScroll + scrollAmount
      : currentScroll - scrollAmount;
  storiesCarousel.value.scrollTo({
    left: newScroll,
    behavior: 'smooth',
  });
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
    storiesError.value =
      e?.response?.data?.message || e.message || 'Не удалось загрузить истории';
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
  max-width: 1420px;
  text-align: center;
  margin: 0 auto;
}

.banner-image {
  max-width: 100%;
  height: auto;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.standard-content {
  max-width: 1050px;
  width: 100%;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 0;
  box-sizing: border-box;
}

.carousel-container {
  position: relative;
  width: 100%;
  max-width: 1050px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  gap: 16px;
}

.carousel-wrapper {
  flex: 1;
  overflow-x: auto;
  overflow-y: hidden;
  scroll-behavior: smooth;
  scrollbar-width: none;
  -ms-overflow-style: none;
}

.carousel-wrapper::-webkit-scrollbar {
  display: none;
}

.card-list {
  display: flex;
  gap: 24px;
  padding: 8px 0;
  width: max-content;
}

.news-card,
.story-card {
  max-width: 330px;
  width: 100%;
  background: #fff;
  padding: 16px;
  border: 1px solid #ddd;
  border-radius: 8px;
  transition: box-shadow 0.2s;
  cursor: pointer;
}

.carousel-btn {
  flex-shrink: 0;
  width: 48px;
  height: 48px;
  border-radius: 8px;
  border: 2px solid #2aaea2;
  background: #fff;
  color: #2aaea2;
  font-size: 32px;
  line-height: 1;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
  z-index: 1;
  outline: none;
}

.carousel-btn svg {
  width: 24px;
  height: 24px;
  display: block;
}

.carousel-btn:hover {
  background: #2aaea2;
  color: #fff;
}

.carousel-btn:focus-visible {
  outline: none;
  box-shadow: 0 0 0 3px rgba(42, 174, 162, 0.4);
}

.carousel-btn:active {
  transform: scale(0.95);
}

.carousel-btn-prev {
  order: -1;
}

.carousel-btn-next {
  order: 1;
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

.latest-news, .stories-block {
  max-width: 1050px;
  width: 100%;
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
  line-clamp: 2;
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
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  min-height: 44px;
}

.latest-news,
.stories-block {
  width: 100%;
  max-width: 1050px;
  margin: 0 auto;
  padding: 0 16px;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.block-title {
  font-size: 22px;
  margin-bottom: 16px;
  text-align: center;
}

.status {
  margin: 10px 0 16px;
  font-size: 14px;
  text-align: center;
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

@media (max-width: 1129px) {
  .banner-block {
    max-width: 95%;
  }

  .carousel-container {
    max-width: 900px;
  }

  .latest-news,
  .stories-block {
    max-width: 900px;
  }
}

@media (max-width: 980px) {
  .home-page {
    padding: 0 16px;
    box-sizing: border-box;
  }
  .banner-block {
    width: 90%;
    max-width: 90%;
    padding: 0;
    box-sizing: border-box;
  }

  .home-page-logo {
    max-width: 100%;
    width: 100%;
    box-sizing: border-box;
  }

  .standard-content {
    width: 100%;
    max-width: 100%;
    padding: 0;
    box-sizing: border-box;
  }

  .carousel-container {
    width: 100%;
    max-width: 730px;
    margin: 0 auto;
    box-sizing: border-box;
    flex-direction: row;
    align-items: center;
    gap: 12px;
  }

  .carousel-wrapper {
    overflow-x: auto;
  }

  .card-list {
    width: max-content;
    max-width: none;
    gap: 16px;
    flex-wrap: nowrap;
    justify-content: flex-start;
  }

  .news-card,
  .story-card {
    flex: 0 0 300px;
    width: 300px;
    max-width: 300px;
  }

  .carousel-btn {
    display: flex;
  }
  .latest-news,
  .stories-block {
    width: 100%;
    max-width: 730px;
    padding: 0;
    margin: 0 auto;
    box-sizing: border-box;
  }
}

@media (max-width: 810px) {
  .carousel-container {
    max-width: 630px;
  }

  .latest-news,
  .stories-block {
    max-width: 630px;
  }
}

@media (max-width: 980px) and (min-width: 750px) {
  .stories-block {
    max-width: 730px;
  }
}

@media (max-width: 1024px) {
  .banner-block {
    max-width: 85%;
    width: 85%;
  }

  .news-card,
  .story-card {
    flex: 0 0 280px;
    width: 280px;
  }

  .carousel-container {
    gap: 12px;
  }

  .carousel-btn {
    width: 40px;
    height: 40px;
    font-size: 28px;
    border-radius: 6px;
  }
}

@media (max-width: 768px) {
  .banner-block {
    max-width: 80%;
    width: 80%;
  }
  .news-card,
  .story-card {
    flex: 0 0 260px;
    width: 260px;
  }

  .carousel-container {
    gap: 8px;
  }

  .carousel-btn {
    width: 36px;
    height: 36px;
    font-size: 24px;
    border-radius: 6px;
  }

  .carousel-container {
    flex-direction: column;
    align-items: stretch;
  }

  .carousel-wrapper {
    overflow-x: visible;
  }

  .card-list {
    width: 100%;
    max-width: 100%;
    flex-wrap: wrap;
    justify-content: center;
  }

  .news-card,
  .story-card {
    flex: 1 1 100%;
    width: 100%;
    max-width: 100%;
  }

  .carousel-btn {
    display: none;
  }

  .latest-news,
  .stories-block {
    padding: 0 12px;
  }
}

@media (max-width: 600px) {
  .banner-block {
    max-width: 75%;
    width: 75%;
  }

  .latest-news,
  .stories-block {
    padding: 0 16px;
  }
}

@media (max-width: 480px) {
  .banner-block {
    max-width: 70%;
    width: 70%;
  }

  .news-card,
  .story-card {
    flex: 0 0 100%;
    width: 100%;
    max-width: 400px;
    margin: 0 auto;
  }

  .card-list {
    gap: 16px;
  }

  .latest-news,
  .stories-block {
    padding: 0 20px;
  }
}
</style>
