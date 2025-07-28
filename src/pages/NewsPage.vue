<template>
  <div class="news-page">
    <h1 class="news-title">{{ news?.title }}</h1>
    <template v-if="news">
      <StandardContent
        :paragraphs="news?.content"
        :image-src="news?.image"
        :image-src-modal="news?.image"
        image-alt="Обложка новости"
        image-alt-modal="Обложка новости (увеличено)"
        :download-link="news?.downloadLink"
        download-label="Скачать дополнительный материал: "
        :download-link-name="news?.downloadLinkName"
        :video-url="news?.videoUrl"
      />
    </template>
    <p v-if="!news" class="not-found">Данные не найдены</p>
  </div>
</template>

<script setup>
import { useRoute } from 'vue-router';
import { computed } from 'vue';
import StandardContent from '../components/StandardContent.vue';
import newsImg from '../assets/news.jpeg';

// имитация базы статей
const newsArr = [
  {
    id: '1',
    title: 'Новость 1',
    image: newsImg,
    content: ['Анонс новости'],
    downloadLink: '/files/news-rett.pdf',
    downloadLinkName: 'PDF',
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
  },
  {
    id: '2',
    title: 'Новость 2',
    image: newsImg,
    content: ['Анонс новости'],
    downloadLink: '',
    downloadLinkName: '',
    videoUrl: '',
  },
  {
    id: '3',
    title: 'Новость 3',
    image: newsImg,
    content: ['Анонс новости'],
    downloadLink: '',
    downloadLinkName: '',
    videoUrl: '',
  },
  {
    id: '4',
    title: 'Новость 4',
    image: newsImg,
    content: ['Анонс новости'],
    downloadLink: '',
    downloadLinkName: '',
    videoUrl: '',
  },
  {
    id: '5',
    title: 'Новость 5',
    image: newsImg,
    content: ['Анонс новости'],
    downloadLink: '',
    downloadLinkName: '',
    videoUrl: '',
  },
  {
    id: '6',
    title: 'Новость 6',
    image: newsImg,
    content: ['Анонс новости'],
    downloadLink: '',
    downloadLinkName: '',
    videoUrl: '',
  },
  {
    id: '7',
    title: 'Новость 7',
    image: newsImg,
    content: ['Анонс новости'],
    downloadLink: '',
    downloadLinkName: '',
    videoUrl: '',
  },
  {
    id: '8',
    title: 'Новость 8',
    image: newsImg,
    content: ['Анонс новости'],
    downloadLink: '',
    downloadLinkName: '',
    videoUrl: '',
  },
  {
    id: '9',
    title: 'Новость 9',
    image: newsImg,
    content: ['Анонс новости'],
    downloadLink: '',
    downloadLinkName: '',
    videoUrl: '',
  },
  {
    id: '10',
    title: 'Новость 10',
    image: newsImg,
    content: ['Анонс новости'],
    downloadLink: '',
    downloadLinkName: '',
    videoUrl: '',
  },
];

const route = useRoute();
const news = computed(() => {
  return newsArr.find(a => a.id === route.params.id?.toString());
});
</script>

<style scoped>
.news-page {
  max-width: 900px;
  margin: 0 auto;
  padding: 32px 16px;
}

.news-title {
  font-size: 28px;
  margin-bottom: 24px;
  text-align: center;
}

.news-image {
  max-width: 100%;
  border-radius: 8px;
  margin-bottom: 24px;
}

.not-found {
  color: #999;
  text-align: center;
  font-style: italic;
}
</style>
