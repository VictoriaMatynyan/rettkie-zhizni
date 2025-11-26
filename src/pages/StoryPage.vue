<template>
  <div class="story-page">
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
    <h1 class="story-title">{{ story?.title || 'История семьи' }}</h1>

    <p v-if="loading" class="status muted">Загрузка…</p>
    <p v-else-if="error" class="status error">{{ error }}</p>

    <template v-else-if="story">
      <div class="story-hero" v-if="story.photo || fallbackImg">
        <img :src="story.photo || fallbackImg" :alt="story.title || 'Фото'" />
      </div>
      <article class="story-html" v-html="storyHtml"></article>
    </template>

    <p v-else class="not-found">История не найдена</p>
  </div>
  
</template>

<script setup>
import { useRoute, useRouter } from 'vue-router';
import { ref, computed, onMounted, watch } from 'vue';
import familyImg from '../assets/family.png';
import { api, httpClient } from '../services/api.js';

const route = useRoute();
const router = useRouter();
const story = ref(null);
const loading = ref(false);
const error = ref('');
const fallbackImg = familyImg;
const baseURL = (httpClient?.defaults?.baseURL || '').replace(/\/+$/, '');

async function loadStory() {
  loading.value = true;
  error.value = '';
  story.value = null;
  try {
    const id = route.params.id;
    const res = await api.accounts.getFamilyStoryById(id);
    // Ответ: { ok, id, title, announcement, created_at, photo }
    story.value = res
      ? {
          ...res,
          photo: res.photo ? (res.photo.startsWith('/') ? `${baseURL}${res.photo}` : res.photo) : '',
          announcement: res.announcement || '',
        }
      : null;
  } catch (e) {
    error.value = e?.response?.data?.message || e.message || 'Не удалось загрузить историю';
  } finally {
    loading.value = false;
  }
}

// Санитайзер: убираем теги script, on* атрибуты и javascript: ссылки
function sanitizeHtml(html) {
  if (!html) return '';
  let out = String(html);
  // Удаляем теги <scr"+"ipt>… (без прямого написания закрывающего тега)
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

const storyHtml = computed(() => absolutize(sanitizeHtml(story.value?.announcement)));

function goBack() {
  if (window.history.length > 1) router.back();
  else router.push('/stories');
}

onMounted(loadStory);
watch(() => route.params.id, () => loadStory());
</script>

<style scoped>
.story-page {
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

.story-title {
  font-size: 28px;
  margin-bottom: 24px;
  text-align: center;
}

.story-hero { text-align: center; margin-bottom: 16px; }
.story-hero img { max-width: 100%; border-radius: 8px; }

.not-found {
  color: #999;
  text-align: center;
  font-style: italic;
}

.status { text-align: center; margin: 16px 0; }
.status.muted { color: #666; }
.status.error { color: #c33; }

.story-html :deep(p) { line-height: 1.7; margin: 12px 0; }
.story-html :deep(h2),
.story-html :deep(h3) { margin: 18px 0 10px; }
.story-html :deep(img) { max-width: 100%; height: auto; border-radius: 6px; }
.story-html :deep(a) { color: #23938c; }
</style>
