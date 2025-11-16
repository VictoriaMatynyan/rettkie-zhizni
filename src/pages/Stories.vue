<template>
  <div class="standard-page">
    <h1>Истории семей</h1>
    <StandardContent
      :paragraphs="[
        'Ниже, после стандартного контента, будут представлены истории семей',
      ]"
      :image-src="symptomsImg"
      :image-src-modal="symptomsImg"
      image-alt="Схема симптомов Ретта"
      image-alt-modal="Схема симптомов Ретта"
      download-link="/files/rett-info-brochure.pdf"
      download-label="Скачать памятку по заболеванию: "
      caption-text="Изображение: здесь будет какое-то контекстное изображение"
      download-link-name="Гайд-заглушка (1.2 МБ)"
      video-url="https://rutube.ru/play/embed/someVideoId/"
    >
    </StandardContent>
    <section class="family-stories">
      <h2 class="block-title">Истории семей</h2>
      <p v-if="loading" class="status muted">Загрузка…</p>
      <p v-else-if="error" class="status error">{{ error }}</p>
      <p
        v-else-if="!visibleStories.length"
        class="status muted no-stories"
      >
        Пока здесь нет историй, но совсем скоро мы начнём делиться ими здесь!
      </p>
      <div v-else class="card-list">
        <div
          v-for="story in visibleStories"
          :key="story.id"
          class="story-card"
          @click="goToStory(story.id)"
        >
          <img :src="story.photo || fallbackImg" :alt="story.title" class="story-image" />
          <h3 class="card-title">{{ story.title }}</h3>
          <p class="card-date">{{ formatDate(story.created_at) }}</p>
        </div>
      </div>
      <button v-if="hasMore && visibleStories.length" class="load-more" @click="loadMore">
        Загрузить ещё
      </button>
    </section>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import symptomsImg from '../assets/symptoms.png';
import familyImg from '../assets/family.png';
import StandardContent from '../components/StandardContent.vue';
import { api } from '../services/api.js';

const router = useRouter();

// Истории с бэка
const stories = ref([]);
const loading = ref(false);
const error = ref('');
const fallbackImg = familyImg;

onMounted(loadStories);

async function loadStories() {
  loading.value = true;
  error.value = '';
  try {
    const res = await api.accounts.getFamilyStories();
    const items = Array.isArray(res?.items) ? res.items : [];
    stories.value = items.map(it => ({
      id: it.id,
      title: it.title,
      created_at: it.created_at || it.date || '',
      photo: it.photo || '',
    }));
  } catch (e) {
    error.value = e?.response?.data?.message || e.message || 'Не удалось загрузить истории';
  } finally {
    loading.value = false;
  }
}

// кол-во отображаемых историй
const pageSize = 10;
const currentPage = ref(1);

const sortedStories = computed(() =>
  [...stories.value].sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
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

function formatDate(d) {
  if (!d) return '';
  try {
    const date = new Date(d);
    return date.toLocaleDateString('ru-RU');
  } catch {
    return d;
  }
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

.card-date { color: #666; font-size: 13px; }

.status { text-align: center; margin: 16px 0; }
.status.muted { color: #666; }
.status.error { color: #c33; }
.no-stories { font-style: italic; }

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
