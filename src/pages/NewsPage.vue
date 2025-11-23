<template>
  <div class="news-page">
    <button class="back-btn" @click="goBack" aria-label="Назад">
      <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M15 18l-6-6 6-6"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
      </svg>
      <span>Назад</span>
    </button>

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
import { useRoute, useRouter } from 'vue-router';
import { ref, computed, onMounted, watch } from 'vue';
import { api, httpClient } from '../services/api.js';

const route = useRoute();
const router = useRouter();
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

function goBack() {
  if (window.history.length > 1) router.back();
  else router.push('/news');
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

.back-btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 12px;
  padding: 8px 12px;
  border: 1px solid #2aaea2;
  border-radius: 8px;
  background: transparent;
  color: #2aaea2;
  cursor: pointer;
  transition: background-color 0.2s ease, color 0.2s ease, border-color 0.2s ease;
}

.back-btn:hover {
  background: rgba(42, 174, 162, 0.08);
  color: #249b91;
  border-color: #249b91;
}

.back-btn svg {
  display: block;
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
