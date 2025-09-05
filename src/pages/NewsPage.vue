<template>
  <div class="news-page">
    <p v-if="loading" class="status muted">Загрузка…</p>
    <p v-else-if="error" class="status error">{{ error }}</p>

    <template v-if="news">
      <h1 class="news-title">{{ news.title }}</h1>
      <img v-if="news.photo" :src="news.photo" :alt="news.title" class="news-image" />
      <div class="news-body" v-html="news.body"></div>
    </template>
    <p v-else-if="!loading && !error" class="not-found">Новость не найдена</p>
  </div>
  
</template>

<script setup>
import { useRoute } from 'vue-router';
import { ref, onMounted, watch } from 'vue';
import { api } from '../services/api.js';

const route = useRoute();
const loading = ref(false);
const error = ref('');
const news = ref(null);

async function fetchNewsItem(id) {
  loading.value = true;
  error.value = '';
  news.value = null;
  try {
    const res = await api.accounts.getNewsById(id);
    // Ожидаем структуру: { ok, id, title, body (HTML), created_at, photo }
    news.value = {
      id: res.id,
      title: res.title,
      body: res.body || '',
      createdAt: res.created_at,
      photo: res.photo || '',
    };
  } catch (e) {
    error.value = e?.response?.data?.message || e.message || 'Не удалось загрузить новость';
  } finally {
    loading.value = false;
  }
}

onMounted(() => fetchNewsItem(route.params.id));
watch(() => route.params.id, id => {
  if (id) fetchNewsItem(id);
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

.news-body :deep(h1),
.news-body :deep(h2),
.news-body :deep(h3),
.news-body :deep(h4),
.news-body :deep(h5),
.news-body :deep(h6) {
  margin: 16px 0 8px;
}
.news-body :deep(p) {
  line-height: 1.7;
  margin-bottom: 12px;
}
.news-body :deep(img) {
  max-width: 100%;
  height: auto;
  border-radius: 6px;
}
.status {
  margin: 10px 0 16px;
  font-size: 14px;
}
.status.muted { color: #666; }
.status.error {
  color: #721c24;
  background: #f8d7da;
  border: 1px solid #f5c6cb;
  padding: 8px 10px;
  border-radius: 6px;
}

.not-found {
  color: #999;
  text-align: center;
  font-style: italic;
}
</style>
