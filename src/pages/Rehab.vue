<template>
  <div class="standard-page">
    <h1>Реабилитация</h1>
    <StandardContent
      :paragraphs="[
        'Здесь будет информация о методах реабилитации при синдроме Ретта, а также подборка рекомендованных материалов.',
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
    <section class="rehab-articles">
      <h2 class="block-title">Рекомендованные статьи</h2>
      <ul class="article-list">
        <li
          v-for="article in rehabArticles"
          :key="article.id"
          class="article-item"
        >
          <RouterLink :to="`/articles/${article.id}`">{{
            article.title
          }}</RouterLink>
        </li>
      </ul>
    </section>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { RouterLink } from 'vue-router';
import symptomsImg from '../assets/symptoms.png';
import StandardContent from '../components/StandardContent.vue';
import articleImg from '../assets/news.jpeg';

// массив статей - заглушки; позже будут загружаться с сервера)
const articles = [
  {
    id: 1,
    title: 'Статья 1',
    image: articleImg,
    preview: 'Анонс статьи',
    category: 'Медицина',
    date: '2025-06-01',
  },
  {
    id: 2,
    title: 'Статья 2',
    image: articleImg,
    preview: 'Анонс статьи',
    category: 'Истории',
    date: '2025-05-20',
  },
  {
    id: 3,
    title: 'Статья 3',
    image: articleImg,
    preview: 'Анонс статьи',
    category: 'Медицина',
    date: '2025-05-21',
  },
  {
    id: 4,
    title: 'Статья 4',
    image: articleImg,
    preview: 'Анонс статьи',
    category: 'Истории',
    date: '2025-05-20',
  },
  {
    id: 5,
    title: 'Статья 5',
    image: articleImg,
    preview: 'Анонс статьи',
    category: 'Медицина',
    date: '2025-05-20',
  },
  {
    id: 6,
    title: 'Статья 6',
    image: articleImg,
    preview: 'Анонс статьи',
    category: 'Реабилитация',
    date: '2025-05-20',
  },
  {
    id: 7,
    title: 'Статья 7',
    image: articleImg,
    preview: 'Анонс статьи',
    category: 'Истории',
    date: '2025-05-20',
  },
  {
    id: 8,
    title: 'Статья 8',
    image: articleImg,
    preview: 'Анонс статьи',
    category: 'Реабилитация',
    date: '2025-05-20',
  },
  {
    id: 9,
    title: 'Статья 9',
    image: articleImg,
    preview: 'Анонс статьи',
    category: 'Медицина',
    date: '2025-05-20',
  },
  {
    id: 10,
    title: 'Статья 10',
    image: articleImg,
    preview: 'Анонс статьи',
    category: 'Медицина',
    date: '2025-05-20',
  },
  {
    id: 11,
    title: 'Статья 11',
    image: articleImg,
    preview: 'Анонс статьи',
    category: 'Реабилитация',
    date: '2025-05-20',
  },
];

const rehabArticles = computed(() =>
  articles.filter(article => article.category === 'Реабилитация')
);
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

.block-title {
  font-size: 24px;
  margin-bottom: 20px;
  font-weight: 700;
  border-left: 6px solid #1976d2;
  padding-left: 12px;
}

.article-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding-left: 0;
  list-style: none;
}

.article-item {
  margin-bottom: 10px;
  font-size: 16px;
}

.rehab-articles a {
  display: inline-block;
  padding: 12px 16px;
  background-color: #f4f6fb;
  border: 1px solid #d0d7e2;
  border-radius: 8px;
  color: #1976d2;
  font-size: 16px;
  font-weight: 500;
  text-decoration: none;
  transition: all 0.25s ease;
}
.rehab-articles a:hover {
  background-color: #e3edfb;
  box-shadow: 0 2px 8px rgba(25, 118, 210, 0.15);
  transform: translateY(-2px);
}
</style>
