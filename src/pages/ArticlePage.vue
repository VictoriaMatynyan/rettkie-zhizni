<template>
  <div class="article-page">
    <h1 class="article-title">{{ article?.title }}</h1>

    <!-- <img :src="article?.image" :alt="article?.title" class="article-image" /> -->

    <StandardContent
      :paragraphs="article?.content"
      :image-src="article?.image"
      :image-src-modal="article?.image"
      image-alt="Обложка статьи"
      image-alt-modal="Обложка статьи (увеличено)"
      :download-link="article?.downloadLink"
      download-label="Скачать дополнительный материал: "
      :download-link-name="article?.downloadLinkName"
      :video-url="article?.videoUrl"
    />

    <p v-if="!article" class="not-found">Статья не найдена</p>
  </div>
</template>

<script setup>
import { useRoute } from 'vue-router';
import { computed } from 'vue';
import StandardContent from '../components/StandardContent.vue';
import articleImg from '../assets/news.jpeg';

// имитация базы статей
const articles = [
  {
    id: '1',
    title: 'Статья 1',
    image: articleImg,
    content: ['Анонс статьи'],
    downloadLink: '/files/article-ivanovy.pdf',
    downloadLinkName: 'PDF',
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
  },
  {
    id: '2',
    title: 'Статья 2',
    image: articleImg,
    content: ['Анонс статьи'],
    downloadLink: '',
    downloadLinkName: '',
    videoUrl: '',
  },
  {
    id: '3',
    title: 'Статья 3',
    image: articleImg,
    content: ['Анонс статьи'],
    downloadLink: '',
    downloadLinkName: '',
    videoUrl: '',
  },
  {
    id: '4',
    title: 'Статья 4',
    image: articleImg,
    content: ['Анонс статьи'],
    downloadLink: '',
    downloadLinkName: '',
    videoUrl: '',
  },
  {
    id: '5',
    title: 'Статья 5',
    image: articleImg,
    content: ['Анонс статьи'],
    downloadLink: '',
    downloadLinkName: '',
    videoUrl: '',
  },
  {
    id: '6',
    title: 'Статья 6',
    image: articleImg,
    content: ['Анонс статьи'],
    downloadLink: '',
    downloadLinkName: '',
    videoUrl: '',
  },
  {
    id: '7',
    title: 'Статья 7',
    image: articleImg,
    content: ['Анонс статьи'],
    downloadLink: '',
    downloadLinkName: '',
    videoUrl: '',
  },
  {
    id: '8',
    title: 'Статья 8',
    image: articleImg,
    preview: ['Анонс статьи'],
    downloadLink: '',
    downloadLinkName: '',
    videoUrl: '',
  },
  {
    id: '9',
    title: 'Статья 9',
    image: articleImg,
    content: ['Анонс статьи'],
    downloadLink: '',
    downloadLinkName: '',
    videoUrl: '',
  },
  {
    id: '10',
    title: 'Статья 10',
    image: articleImg,
    content: ['Анонс статьи'],
    downloadLink: '',
    downloadLinkName: '',
    videoUrl: '',
  },
  {
    id: '11',
    title: 'Статья 11',
    image: articleImg,
    content: ['Анонс статьи'],
    downloadLink: '',
    downloadLinkName: '',
    videoUrl: '',
  },
];

const route = useRoute();
const article = computed(() => {
  return articles.find(a => a.id === route.params.id);
});
</script>

<style scoped>
.article-page {
  max-width: 900px;
  margin: 0 auto;
  padding: 32px 16px;
}

.article-title {
  font-size: 28px;
  margin-bottom: 24px;
  text-align: center;
}

.article-image {
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
