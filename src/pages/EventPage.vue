<template>
  <div class="event-page">
    <h1 class="event-title">{{ event?.title }}</h1>
    <StandardContent
      :paragraphs="event?.content"
      :image-src="event?.image"
      :image-src-modal="event?.image"
      image-alt="Обложка статьи"
      image-alt-modal="Обложка статьи (увеличено)"
      :download-link="event?.downloadLink"
      download-label="Скачать дополнительный материал: "
      :download-link-name="event?.downloadLinkName"
      :video-url="event?.videoUrl"
    />
    <p v-if="!event" class="not-found">Данные не найдены</p>
  </div>
</template>

<script setup>
import { useRoute } from 'vue-router';
import { computed } from 'vue';
import StandardContent from '../components/StandardContent.vue';
import eventImg from '../assets/news.jpeg';

// имитация базы ивентов
const events = [
  {
    id: '1',
    title: 'Мероприятие 1',
    image: eventImg,
    content: ['Анонс мероприятия'],
    downloadLink: '/files/event-ivanovy.pdf',
    downloadLinkName: 'PDF',
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
  },
  {
    id: '2',
    title: 'Мероприятие 2',
    image: eventImg,
    content: ['Анонс мероприятия'],
    downloadLink: '',
    downloadLinkName: '',
    videoUrl: '',
  },
  {
    id: '3',
    title: 'Мероприятие 3',
    image: eventImg,
    content: ['Анонс мероприятия'],
    downloadLink: '',
    downloadLinkName: '',
    videoUrl: '',
  },
  {
    id: '4',
    title: 'Мероприятие 4',
    image: eventImg,
    content: ['Анонс мероприятия'],
    downloadLink: '',
    downloadLinkName: '',
    videoUrl: '',
  },
  {
    id: '5',
    title: 'Мероприятие 5',
    image: eventImg,
    content: ['Анонс мероприятия'],
    downloadLink: '',
    downloadLinkName: '',
    videoUrl: '',
  },
  {
    id: '6',
    title: 'Мероприятие 6',
    image: eventImg,
    content: ['Анонс мероприятия'],
    downloadLink: '',
    downloadLinkName: '',
    videoUrl: '',
  },
  {
    id: '7',
    title: 'Мероприятие 7',
    image: eventImg,
    content: ['Анонс мероприятия'],
    downloadLink: '',
    downloadLinkName: '',
    videoUrl: '',
  },
  {
    id: '8',
    title: 'Мероприятие 8',
    image: eventImg,
    preview: ['Анонс мероприятия'],
    downloadLink: '',
    downloadLinkName: '',
    videoUrl: '',
  },
  {
    id: '9',
    title: 'Мероприятие 9',
    image: eventImg,
    content: ['Анонс мероприятия'],
    downloadLink: '',
    downloadLinkName: '',
    videoUrl: '',
  },
  {
    id: '10',
    title: 'Мероприятие 10',
    image: eventImg,
    content: ['Анонс мероприятия'],
    downloadLink: '',
    downloadLinkName: '',
    videoUrl: '',
  },
  {
    id: '11',
    title: 'Мероприятие 11',
    image: eventImg,
    content: ['Анонс мероприятия'],
    downloadLink: '',
    downloadLinkName: '',
    videoUrl: '',
  },
];

const route = useRoute();
const event = computed(() => {
  return events.find(a => a.id === route.params.id);
});
</script>

<style scoped>
.event-page {
  max-width: 900px;
  margin: 0 auto;
  padding: 32px 16px;
}

.event-title {
  font-size: 28px;
  margin-bottom: 24px;
  text-align: center;
}

.event-image {
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
