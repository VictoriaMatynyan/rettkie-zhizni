<template>
  <div class="standard-page">
    <h1>Истории семей</h1>
    <StandardContent
      :paragraphs="[
        'Ниже, после стандартного контента, будут представлены истории семей',
      ]"
      :imageSrc="symptomsImg"
      :imageSrcModal="symptomsImg"
      imageAlt="Схема симптомов Ретта"
      imageAltModal="Схема симптомов Ретта"
      downloadLink="/files/rett-info-brochure.pdf"
      downloadLabel="Скачать памятку по заболеванию: "
      captionText="Изображение: здесь будет какое-то контекстное изображение"
      downloadLinkName="Гайд-заглушка (1.2 МБ)"
      videoUrl="https://rutube.ru/play/embed/someVideoId/"
    ></StandardContent>
    <section class="family-stories">
      <h2 class="block-title">Истории семей</h2>
      <div class="card-list">
        <div
          v-for="story in visibleStories"
          :key="story.id"
          class="story-card"
          @click="goToStory(story.id)"
        >
          <img :src="story.image" :alt="story.title" class="story-image" />
          <h3 class="card-title">{{ story.title }}</h3>
          <p>{{ story.preview }}</p>
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
import familyImg from '../assets/family.png';
import StandardContent from '../components/StandardContent.vue';

const router = useRouter();

// массив историй - заглушки; позже будут загружаться с сервера)
const stories = ref([
  {
    id: 1,
    title: 'История семьи Ивановых',
    image: familyImg,
    preview: 'История борьбы и надежды одной семьи...',
    date: '2025-06-01',
  },
  {
    id: 2,
    title: 'История Маши',
    image: familyImg,
    preview: 'Как маленькая Маша училась жить с диагнозом...',
    date: '2025-05-20',
  },
  {
    id: 3,
    title: 'История семьи Поповых',
    image: familyImg,
    preview: 'История борьбы и надежды одной семьи...',
    date: '2025-05-21',
  },
  {
    id: 4,
    title: 'История 4',
    image: familyImg,
    preview: 'История борьбы и надежды одной семьи...',
    date: '2025-05-20',
  },
  {
    id: 5,
    title: 'История 5',
    image: familyImg,
    preview: 'История борьбы и надежды одной семьи...',
    date: '2025-05-20',
  },
  {
    id: 6,
    title: 'История 6',
    image: familyImg,
    preview: 'История борьбы и надежды одной семьи...',
    date: '2025-05-20',
  },
  {
    id: 7,
    title: 'История 7',
    image: familyImg,
    preview: 'История борьбы и надежды одной семьи...',
    date: '2025-05-20',
  },
  {
    id: 8,
    title: 'История 8',
    image: familyImg,
    preview: 'История борьбы и надежды одной семьи...',
    date: '2025-05-20',
  },
  {
    id: 9,
    title: 'История 9',
    image: familyImg,
    preview: 'История борьбы и надежды одной семьи...',
    date: '2025-05-20',
  },
  {
    id: 10,
    title: 'История 10',
    image: familyImg,
    preview: 'История борьбы и надежды одной семьи...',
    date: '2025-05-20',
  },
  {
    id: 11,
    title: 'История 11',
    image: familyImg,
    preview: 'История борьбы и надежды одной семьи...',
    date: '2025-05-20',
  },
]);

// кол-во отображаемых историй
const pageSize = 10;
const currentPage = ref(1);

const sortedStories = computed(() =>
  [...stories.value].sort((a, b) => new Date(b.date) - new Date(a.date))
);
const visibleStories = computed(() =>
  sortedStories.value.slice(0, currentPage.value * pageSize)
);
const hasMore = computed(
  () => visibleStories.value.length < sortedStories.value.length
);

function loadMore() {
  currentPage.value++;
}

function goToStory(id) {
  router.push(`/stories/${id}`);
}
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
  text-align: center;
}

.card-list {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.story-card {
  display: flex;
  flex-direction: column;
  cursor: pointer;
  border: 1px solid #ddd;
  padding: 16px;
  border-radius: 8px;
  transition: box-shadow 0.3s ease;
}

.story-card:hover {
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.15);
}

.story-card img {
  max-width: 100%;
  height: auto;
  border-radius: 6px;
  margin-bottom: 12px;
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
</style>
