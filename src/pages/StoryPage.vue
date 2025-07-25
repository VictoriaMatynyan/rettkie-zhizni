<template>
  <div class="story-page">
    <h1 class="story-title">{{ story?.title }}</h1>

    <!-- <img :src="story?.image" :alt="story?.title" class="story-image" /> -->

    <StandardContent
      :paragraphs="story?.content"
      :imageSrc="story?.image"
      :imageSrcModal="story?.image"
      imageAlt="Фотография героя истории"
      imageAltModal="Фотография героя (увеличено)"
      :downloadLink="story?.downloadLink"
      downloadLabel="Скачать дополнительный материал: "
      :downloadLinkName="story?.downloadLinkName"
      :videoUrl="story?.videoUrl"
    />

    <p v-if="!story" class="not-found">История не найдена</p>
  </div>
</template>

<script setup>
import { useRoute } from 'vue-router';
import { computed } from 'vue';
import StandardContent from '../components/StandardContent.vue';
import familyImg from '../assets/family.png';

// имитация базы историй
const stories = [
  {
    id: '1',
    title: 'История семьи Ивановых',
    image: familyImg,
    content: [
      'Это трогательная история семьи, которая столкнулась с синдромом Ретта...',
    ],
    downloadLink: '/files/story-ivanovy.pdf',
    downloadLinkName: 'PDF',
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
  },
  {
    id: '2',
    title: 'История Маши',
    image: familyImg,
    content: ['Маша была активным и весёлым ребёнком до 2 лет...'],
    downloadLink: '',
    downloadLinkName: '',
    videoUrl: '',
  },
  {
    id: '3',
    title: 'История семьи Поповых',
    image: familyImg,
    content: ['История борьбы и надежды одной семьи...'],
    downloadLink: '',
    downloadLinkName: '',
    videoUrl: '',
  },
  {
    id: '4',
    title: 'История 4',
    image: familyImg,
    content: ['История борьбы и надежды одной семьи...'],
    downloadLink: '',
    downloadLinkName: '',
    videoUrl: '',
  },
  {
    id: '5',
    title: 'История 5',
    image: familyImg,
    content: ['История борьбы и надежды одной семьи...'],
    downloadLink: '',
    downloadLinkName: '',
    videoUrl: '',
  },
  {
    id: '6',
    title: 'История 6',
    image: familyImg,
    content: ['История борьбы и надежды одной семьи...'],
    downloadLink: '',
    downloadLinkName: '',
    videoUrl: '',
  },
  {
    id: '7',
    title: 'История 7',
    image: familyImg,
    content: ['История борьбы и надежды одной семьи...'],
    downloadLink: '',
    downloadLinkName: '',
    videoUrl: '',
  },
  {
    id: '8',
    title: 'История 8',
    image: familyImg,
    preview: ['История борьбы и надежды одной семьи...'],
    downloadLink: '',
    downloadLinkName: '',
    videoUrl: '',
  },
  {
    id: '9',
    title: 'История 9',
    image: familyImg,
    content: ['История борьбы и надежды одной семьи...'],
    downloadLink: '',
    downloadLinkName: '',
    videoUrl: '',
  },
  {
    id: '10',
    title: 'История 10',
    image: familyImg,
    content: ['История борьбы и надежды одной семьи...'],
    downloadLink: '',
    downloadLinkName: '',
    videoUrl: '',
  },
  {
    id: '11',
    title: 'История 11',
    image: familyImg,
    content: ['История борьбы и надежды одной семьи...'],
    downloadLink: '',
    downloadLinkName: '',
    videoUrl: '',
  },
];

const route = useRoute();
const story = computed(() => {
  return stories.find((s) => s.id === route.params.id);
});
</script>

<style scoped>
.story-page {
  max-width: 900px;
  margin: 0 auto;
  padding: 32px 16px;
}

.story-title {
  font-size: 28px;
  margin-bottom: 24px;
  text-align: center;
}

.story-image {
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
