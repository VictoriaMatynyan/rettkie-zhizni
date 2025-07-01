<template>
  <div class="news-page">
    <h1 class="news-title">{{ news?.title }}</h1>

    <!-- <img :src="news?.image" :alt="news?.title" class="news-image" /> -->

    <StandardContent
      :paragraphs="news?.content"
      :imageSrc="news?.image"
      :imageSrcModal="news?.image"
      imageAlt="Обложка новости"
      imageAltModal="Обложка новости (увеличено)"
      :downloadLink="news?.downloadLink"
      downloadLabel="Скачать дополнительный материал: "
      :downloadLinkName="news?.downloadLinkName"
      :videoUrl="news?.videoUrl"
    />

    <p v-if="!news" class="not-found">Новость не найдена</p>
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
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ'
  },
  {
    id: '2',
    title: 'Новость 2',
    image: newsImg,
    content: ['Анонс новости'],
    downloadLink: '',
    downloadLinkName: '',
    videoUrl: ''
  },
  {
    id: '3',
    title: 'Новость 3',
    image: newsImg,
    content: ['Анонс новости'],
    downloadLink: '',
    downloadLinkName: '',
    videoUrl: ''
  },
  {
    id: '4',
    title: 'Новость 4',
    image: newsImg,
    content: ['Анонс новости'],
    downloadLink: '',
    downloadLinkName: '',
    videoUrl: ''
  },
  {
    id: '5',
    title: 'Новость 5',
    image: newsImg,
    content: ['Анонс новости'],
    downloadLink: '',
    downloadLinkName: '',
    videoUrl: ''  },
  {
    id: '6',
    title: 'Новость 6',
    image: newsImg,
    content: ['Анонс новости'],
    downloadLink: '',
    downloadLinkName: '',
    videoUrl: ''
  },
  {
    id: '7',
    title: 'Новость 7',
    image: newsImg,
    content: ['Анонс новости'],
    downloadLink: '',
    downloadLinkName: '',
    videoUrl: ''
  },
  {
    id: '8',
    title: 'Новость 8',
    image: newsImg,
    preview: 'Анонс новости',
    downloadLink: '',
    downloadLinkName: '',
    videoUrl: ''
  },
  {
    id: '9',
    title: 'Новость 9',
    image: newsImg,
    content: ['Анонс новости'],
    downloadLink: '',
    downloadLinkName: '',
    videoUrl: ''
  },
  {
    id: '10',
    title: 'Новость 10',
    image: newsImg,
    content: ['Анонс новости'],
    downloadLink: '',
    downloadLinkName: '',
    videoUrl: ''
  },
   {
    id: '11',
    title: 'Новость 11',
    image: newsImg,
    content: ['Анонс новости'],
    downloadLink: '',
    downloadLinkName: '',
    videoUrl: ''
  },
]

const route = useRoute();
const news = computed(() => {
  return newsArr.find((a) => a.id === route.params.id)
})
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