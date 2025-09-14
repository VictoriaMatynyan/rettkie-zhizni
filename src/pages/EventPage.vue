<template>
  <div class="event-page">
    <p v-if="loading" class="status muted">Загрузка…</p>
    <p v-else-if="error" class="status error">{{ error }}</p>

    <template v-else-if="event">
      <h1 class="event-title">{{ event.title || 'Мероприятие' }}</h1>
      <p class="meta">
        <span v-if="event.event_date">{{ formatDate(event.event_date) }}</span>
        <span v-if="event.location"> • {{ event.location }}</span>
      </p>
      <div class="event-hero" v-if="event.photo">
        <img :src="event.photo" :alt="event.title" />
      </div>
      <article class="event-html" v-html="eventHtml"></article>
    </template>

    <p v-else class="not-found">Данные не найдены</p>
  </div>
</template>

<script setup>
import { useRoute } from 'vue-router';
import { ref, computed, onMounted, watch } from 'vue';
import { api, httpClient } from '../services/api.js';
import eventImg from '../assets/news.jpeg';

const route = useRoute();
const loading = ref(false);
const error = ref('');
const event = ref(null);
const fallbackImg = eventImg;
const baseURL = (httpClient?.defaults?.baseURL || '').replace(/\/+$/, '');

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

const eventHtml = computed(() => absolutize(sanitizeHtml(event.value?.announcement)));

async function loadEvent() {
  loading.value = true;
  error.value = '';
  event.value = null;
  try {
    const id = route.params.id;
    const res = await api.accounts.getEventById(id);
    // Ожидаем: { ok, id, title, announcement, event_date, location, created_at, photo }
    event.value = {
      id: res.id,
      title: res.title,
      event_date: res.event_date || res.created_at || '',
      location: res.location || '',
      photo: res.photo ? (res.photo.startsWith('/') ? `${baseURL}${res.photo}` : res.photo) : '',
      announcement: res.announcement || '',
    };
  } catch (e) {
    error.value = e?.response?.data?.message || e.message || 'Не удалось загрузить мероприятие';
  } finally {
    loading.value = false;
  }
}

function formatDate(d) {
  if (!d) return '';
  try {
    return new Date(d).toLocaleDateString('ru-RU', { year: 'numeric', month: 'long', day: 'numeric' });
  } catch { return d; }
}

onMounted(loadEvent);
watch(() => route.params.id, () => loadEvent());
</script>

<style scoped>
.event-page {
  max-width: 900px;
  margin: 0 auto;
  padding: 32px 16px;
}

.event-title {
  font-size: 28px;
  margin-bottom: 8px;
  text-align: center;
}
.meta { text-align: center; color: #666; margin-bottom: 16px; }

.event-hero { text-align: center; margin-bottom: 16px; }
.event-hero img { max-width: 100%; border-radius: 8px; }

.event-html :deep(h1),
.event-html :deep(h2),
.event-html :deep(h3),
.event-html :deep(h4),
.event-html :deep(h5),
.event-html :deep(h6) { margin: 16px 0 8px; }
.event-html :deep(p) { line-height: 1.7; margin-bottom: 12px; }
.event-html :deep(img) { max-width: 100%; height: auto; border-radius: 6px; }

.status { text-align: center; margin: 16px 0; }
.status.muted { color: #666; }
.status.error { color: #c33; }

.not-found { color: #999; text-align: center; font-style: italic; }
</style>
