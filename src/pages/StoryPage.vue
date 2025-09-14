<template>
  <div class="story-page">
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
import { useRoute } from 'vue-router';
import { ref, computed, onMounted, watch } from 'vue';
import familyImg from '../assets/family.png';
import { api } from '../services/api.js';

const route = useRoute();
const story = ref(null);
const loading = ref(false);
const error = ref('');
const fallbackImg = familyImg;

async function loadStory() {
  loading.value = true;
  error.value = '';
  story.value = null;
  try {
    const id = route.params.id;
    const res = await api.accounts.getFamilyStoryById(id);
    // Ответ: { ok, id, title, announcement, created_at, photo }
    story.value = res || null;
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

const storyHtml = computed(() => {
  const raw = story.value?.announcement;
  if (!raw) return '';
  return sanitizeHtml(raw);
});

onMounted(loadStory);
watch(() => route.params.id, () => loadStory());
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
