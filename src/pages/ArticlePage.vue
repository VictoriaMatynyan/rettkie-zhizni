<template>
  <div class="article-page">
    <p v-if="loading" class="status muted">Загрузка…</p>
    <p v-else-if="error" class="status error">{{ error }}</p>

    <template v-else-if="article">
      <h1 class="article-title">{{ article.title || 'Статья' }}</h1>
      <p class="meta">
        <span v-if="article.created_at">{{ formatDate(article.created_at) }}</span>
        <span v-if="article.category"> • {{ article.category }}</span>
      </p>
      <div class="article-hero" v-if="article.photo">
        <img :src="article.photo" :alt="article.title" />
      </div>
      <article class="article-html" v-html="articleHtml"></article>
    </template>

    <p v-else class="not-found">Статья не найдена</p>
  </div>
</template>

<script setup>
import { useRoute } from 'vue-router';
import { ref, computed, onMounted, watch } from 'vue';
import { api, httpClient } from '../services/api.js';
import articleImg from '../assets/news.jpeg';

const route = useRoute();
const loading = ref(false);
const error = ref('');
const article = ref(null);
const baseURL = (httpClient?.defaults?.baseURL || '').replace(/\/+$/, '');
const fallbackImg = articleImg;

function sanitizeHtml(html) {
  if (!html) return '';
  let out = String(html);
  const scriptRe = new RegExp('<' + 'script[^>]*>[\\s\\S]*?<\\/' + 'script>', 'gi');
  out = out.replace(scriptRe, '');
  out = out.replace(/\son[a-z]+\s*=\s*(?:"[^"]*"|'[^']*'|[^\s>]+)/gi, '');
  out = out.replace(/javascript:/gi, '');
  return out;
}

function absolutize(html) {
  if (!html || !baseURL) return html || '';
  let out = String(html);
  out = out.replace(/\b(src|href)=("|')\/(?!\/)([^"']+)\2/gi, (m, attr, q, rest) => `${attr}=${q}${baseURL}/${rest}${q}`);
  out = out.replace(/url\(\s*(["'])?\/(?!\/)([^\)"']+)\1?\s*\)/gi, (m, q, rest) => {
    const qq = q || '"';
    return `url(${qq}${baseURL}/${rest}${qq})`;
  });
  return out;
}

const articleHtml = computed(() => absolutize(sanitizeHtml(article.value?.announcement)));

async function loadArticle() {
  loading.value = true;
  error.value = '';
  article.value = null;
  try {
    const id = route.params.id;
    const res = await api.accounts.getArticleById(id);
    // { ok, id, title, announcement, created_at, photo, category_id, category }
    article.value = {
      id: res.id,
      title: res.title,
      created_at: res.created_at || '',
      category: res.category || '',
      category_id: res.category_id ?? null,
      photo: res.photo ? (res.photo.startsWith('/') ? `${baseURL}${res.photo}` : res.photo) : '',
      announcement: res.announcement || '',
    };
  } catch (e) {
    error.value = e?.response?.data?.message || e.message || 'Не удалось загрузить статью';
  } finally {
    loading.value = false;
  }
}

function formatDate(d) {
  if (!d) return '';
  try { return new Date(d).toLocaleDateString('ru-RU', { year: 'numeric', month: 'long', day: 'numeric' }); } catch { return d; }
}

onMounted(loadArticle);
watch(() => route.params.id, () => loadArticle());
</script>

<style scoped>
.article-page {
  max-width: 900px;
  margin: 0 auto;
  padding: 32px 16px;
}

.article-title {
  font-size: 28px;
  margin-bottom: 8px;
  text-align: center;
}
.meta { text-align: center; color: #666; margin-bottom: 16px; }

.article-hero { text-align: center; margin-bottom: 16px; }
.article-hero img { max-width: 100%; border-radius: 8px; }

.article-html :deep(h1),
.article-html :deep(h2),
.article-html :deep(h3),
.article-html :deep(h4),
.article-html :deep(h5),
.article-html :deep(h6) { margin: 16px 0 8px; }
.article-html :deep(p) { line-height: 1.7; margin-bottom: 12px; }
.article-html :deep(img) { max-width: 100%; height: auto; border-radius: 6px; }

.status { text-align: center; margin: 16px 0; }
.status.muted { color: #666; }
.status.error { color: #c33; }

.not-found { color: #999; text-align: center; font-style: italic; }
</style>
