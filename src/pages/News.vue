<template>
  <div class="standard-page">
    <h1>Новости</h1>
    <StandardContent
      :paragraphs="[
        'Добро пожаловать в раздел новостей, где вы найдёте последние события, связанные с синдромом Ретта, нововведения в лечении, а также мероприятия сообщества.',
      ]"
      :imageSrc="symptomsImg"
      :imageSrcModal="symptomsImg"
      imageAlt="Схема симптомов Ретта"
      imageAltModal="Схема симптомов Ретта"
      downloadLink="/files/rett-info-brochure.pdf"
      downloadLabel="Скачать памятку по заболеванию: "
      captionText="Изображение: основные проявления синдрома Ретта"
      downloadLinkName="Гайд-заглушка (1.2 МБ)"
      videoUrl="https://rutube.ru/play/embed/someVideoId/"
    ></StandardContent>

    <section class="news-block">
      <h2 class="block-title">Последние новости</h2>
      <div class="news-list">
        <div
          v-for="news in visibleNews"
          :key="news.id"
          class="news-card"
          @click="goToNews(news.id)"
        >
          <img :src="news.image" :alt="news.title" class="news-image" />
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
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import symptomsImg from '../assets/symptoms.png';
import newsImg from '../assets/news.jpeg';
import StandardContent from '../components/StandardContent.vue';

const router = useRouter();

// массив статей - заглушки; позже будут загружаться с сервера)
const newsArr = [
  {
    id: 1,
    title: 'Новость 1',
    image: newsImg,
    preview: 'Анонс новости',
    date: '2025-06-01',
  },
  {
    id: 2,
    title: 'Новость 2',
    image: newsImg,
    preview: 'Анонс новости',
    date: '2025-05-20',
  },
  {
    id: 3,
    title: 'Новость 3',
    image: newsImg,
    preview: 'Анонс новости',
    date: '2025-05-21',
  },
  {
    id: 4,
    title: 'Новость 4',
    image: newsImg,
    preview: 'Анонс новости',
    date: '2025-05-20',
  },
  {
    id: 5,
    title: 'Новость 5',
    image: newsImg,
    preview: 'Анонс новости',
    date: '2025-05-20',
  },
  {
    id: 6,
    title: 'Новость 6',
    image: newsImg,
    preview: 'Анонс новости',
    date: '2025-05-20',
  },
  {
    id: 7,
    title: 'Новость 7',
    image: newsImg,
    preview: 'Анонс новости',
    date: '2025-05-20',
  },
  {
    id: 8,
    title: 'Новость 8',
    image: newsImg,
    preview: 'Анонс новости',
    date: '2025-05-20',
  },
  {
    id: 9,
    title: 'Новость 9',
    image: newsImg,
    preview: 'Анонс новости',
    date: '2025-05-20',
  },
  {
    id: 10,
    title: 'Новость 10',
    image: newsImg,
    preview: 'Анонс новости',
    date: '2025-05-20',
  },
];

// кол-во отображаемых историй
const pageSize = 9;
const currentPage = ref(1);

const sortedNews = computed(() =>
  [...newsArr].sort((a, b) => new Date(b.date) - new Date(a.date))
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
  width: 100%;
  height: auto;
  border-radius: 8px;
  margin-bottom: 12px;
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

.no-news {
  margin-top: 24px;
  font-style: italic;
  color: #999;
}
</style>
