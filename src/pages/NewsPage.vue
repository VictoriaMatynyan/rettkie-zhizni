<template>
  <div class="news-page">
    <p v-if="loading" class="status muted">Загрузка…</p>
    <p v-else-if="error" class="status error">{{ error }}</p>

    <template v-else-if="news">
      <h1 class="news-title">{{ news.title || 'Новость' }}</h1>
      <p class="date" v-if="news.createdAt">{{ formatDate(news.createdAt) }}</p>
      <div class="news-hero" v-if="news.photo">
        <img :src="news.photo" :alt="news.title" />
      </div>
      <article class="news-html" v-html="newsHtml"></article>
    </template>
    <p v-else class="not-found">Новость не найдена</p>
  </div>
  
</template>

<script setup>
import { useRoute } from 'vue-router';
import { ref, computed, onMounted, watch } from 'vue';
import { api, httpClient } from '../services/api.js';

const route = useRoute();
const loading = ref(false);
const error = ref('');
const news = ref(null);
const baseURL = (httpClient?.defaults?.baseURL || '').replace(/\/+$/, '');

// Безопасный рендер HTML: удаляем <script>, on* и javascript:, а также делаем относительные URL абсолютными
function sanitizeHtml(html) {
  if (!html) return '';
  let out = String(html);
  // Удаляем теги <scr"+"ipt>… (без прямого написания закрывающего тега)
  const scriptRe = new RegExp('<' + 'script[^>]*>[\\s\\S]*?<\\/' + 'script>', 'gi');
  out = out.replace(scriptRe, '');
  // Удаляем инлайновые обработчики событий on*
  out = out.replace(/\son[a-z]+\s*=\s*(?:"[^"]*"|'[^']*'|[^\s>]+)/gi, '');
  // Убираем javascript: в ссылках
  out = out.replace(/javascript:/gi, '');
  return out;
}

function absolutizeUrls(html) {
  if (!html || !baseURL) return html || '';
  let out = String(html);
  // src|href="/path" -> src|href="{baseURL}/path"
  out = out.replace(/\b(src|href)=("|')\/(?!\/)([^"']+)\2/gi, (m, attr, q, rest) => {
    return `${attr}=${q}${baseURL}/${rest}${q}`;
  });
  // url(/path) в style
  out = out.replace(/url\(\s*(["'])?\/(?!\/)([^\)"']+)\1?\s*\)/gi, (m, q, rest) => {
    const qq = q || '"';
    return `url(${qq}${baseURL}/${rest}${qq})`;
  });
  return out;
}

const newsHtml = computed(() => absolutizeUrls(sanitizeHtml(news.value?.html)));

async function fetchNewsItem(id) {
  loading.value = true;
  error.value = '';
  news.value = null;
  try {
    const res = await api.accounts.getNewsById(id);
    // Ожидаем: { ok, id, title, body (HTML), created_at, photo }
    news.value = {
      id: res.id,
      title: res.title,
      html: res.body || res.announcement || '',
      createdAt: res.created_at,
      photo: res.photo || '',
    };
  } catch (e) {
    error.value = e?.response?.data?.message || e.message || 'Не удалось загрузить новость';
  } finally {
    loading.value = false;
  }
}

function formatDate(dateString) {
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  return new Date(dateString).toLocaleDateString('ru-RU', options);
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

.news-hero { text-align: center; margin-bottom: 16px; }
.news-hero img { max-width: 100%; border-radius: 8px; }

.news-html :deep(h1),
.news-html :deep(h2),
.news-html :deep(h3),
.news-html :deep(h4),
.news-html :deep(h5),
.news-html :deep(h6) {
  margin: 16px 0 8px;
}
.news-html :deep(p) {
  line-height: 1.7;
  margin-bottom: 12px;
}
.news-html :deep(img) {
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
