<template>
  <div class="standard-page">
    <h1>Реабилитация</h1>
    <StandardContent
      :paragraphs="[
        'Здесь будет информация о методах реабилитации при синдроме Ретта, а также подборка рекомендованных материалов.',
      ]"
      :image-src="symptomsImg"
      :image-src-modal="symptomsImg"
      image-alt="Схема симптомов Ретта"
      image-alt-modal="Схема симптомов Ретта"
      download-link="/files/rett-info-brochure.pdf"
      download-label="Скачать памятку по заболеванию: "
      caption-text="Изображение: основные проявления синдрома Ретта"
      download-link-name="Гайд-заглушка (1.2 МБ)"
      video-url="https://rutube.ru/play/embed/someVideoId/"
    >
    </StandardContent>
    <section class="rehab-articles">
      <h2 class="block-title">Рекомендованные статьи</h2>
      <p v-if="loading" class="status muted">Загрузка…</p>
      <p v-else-if="error" class="status error">{{ error }}</p>
      <ul v-else-if="rehabArticles.length" class="article-list">
        <li
          v-for="article in rehabArticles"
          :key="article.id"
          class="article-item"
        >
          <RouterLink :to="`/articles/${article.id}`" class="article-card">
            <div class="article-thumb">
              <img
                :src="article.photo || fallbackImg"
                :alt="article.title"
                loading="lazy"
              />
            </div>
            <div class="article-content">
              <p class="article-meta">
                <span v-if="article.created_at">{{ formatDate(article.created_at) }}</span>
                <span v-if="article.category"> • {{ article.category }}</span>
              </p>
              <h3 class="article-title">{{ article.title }}</h3>
              <div
                v-if="article.previewHtml"
                class="article-preview"
                v-html="article.previewHtml"
              ></div>
            </div>
          </RouterLink>
        </li>
      </ul>
      <p v-else class="no-articles">Пока нет статей на эту тему, но скоро они здесь появятся!</p>
    </section>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { RouterLink } from 'vue-router';
import symptomsImg from '../assets/symptoms.png';
import StandardContent from '../components/StandardContent.vue';
import articleImg from '../assets/news.jpeg';
import { api, httpClient } from '../services/api.js';

const loading = ref(false);
const error = ref('');
const articles = ref([]);
const fallbackImg = articleImg;
const baseURL = (httpClient?.defaults?.baseURL || '').replace(/\/+$/, '');
const targetCategory = 'Реабилитация';

function absUrl(url) {
  if (!url) return '';
  if (/^https?:\/\//i.test(url)) return url;
  if (url.startsWith('/')) return `${baseURL}${url}`;
  return url;
}

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

function formatDate(d) {
  if (!d) return '';
  try { return new Date(d).toLocaleDateString('ru-RU', { year: 'numeric', month: 'long', day: 'numeric' }); } catch { return d; }
}

async function loadArticles() {
  loading.value = true;
  error.value = '';
  try {
    const res = await api.accounts.getArticles();
    const items = Array.isArray(res?.items) ? res.items : [];
    articles.value = items.map(a => ({
      id: a.id,
      title: a.title,
      created_at: a.created_at || '',
      photo: absUrl(a.photo || ''),
      category: a.category || '',
      announcement: a.announcement || '',
    }));
  } catch (e) {
    error.value = e?.response?.data?.message || e.message || 'Не удалось загрузить статьи';
  } finally {
    loading.value = false;
  }
}

const rehabArticles = computed(() => {
  return articles.value
    .filter(article => article.category === targetCategory)
    .map(article => ({
      ...article,
      previewHtml: absolutize(sanitizeHtml(article.announcement)),
    }))
    .sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
});

onMounted(loadArticles);
</script>

<style scoped>
.standard-page {
  max-width: 1080px;
  margin: 0 auto;
  padding: clamp(24px, 5vw, 48px) clamp(16px, 6vw, 56px);
}

.standard-page h1 {
  font-size: clamp(26px, 4vw, 36px);
  margin-bottom: clamp(20px, 4vw, 40px);
  text-align: center;
}

.block-title {
  font-size: clamp(20px, 3.2vw, 28px);
  margin-bottom: clamp(16px, 3.5vw, 28px);
  font-weight: 700;
  border-left: 6px solid #1976d2;
  padding-left: clamp(10px, 2vw, 16px);
}

.article-list {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: clamp(16px, 4vw, 28px);
  padding-left: 0;
  list-style: none;
}

.article-item {
  margin: 0;
}

.article-card {
  display: flex;
  gap: clamp(12px, 2.5vw, 20px);
  padding: clamp(14px, 3vw, 20px);
  background-color: #f4f6fb;
  border: 1px solid #d0d7e2;
  border-radius: 12px;
  color: inherit;
  text-decoration: none;
  transition: all 0.25s ease;
}

.article-card:hover {
  background-color: #e3edfb;
  box-shadow: 0 2px 10px rgba(25, 118, 210, 0.15);
  transform: translateY(-2px);
}

.article-thumb {
  flex: 0 0 140px;
  height: clamp(100px, 18vw, 160px);
  border-radius: 10px;
  overflow: hidden;
  background: #d0d7e2;
  display: flex;
  align-items: center;
  justify-content: center;
}

.article-thumb img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.article-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.article-meta {
  margin: 0;
  color: #53627b;
  font-size: clamp(13px, 1.8vw, 15px);
}

.article-title {
  margin: 0;
  font-size: clamp(17px, 2.5vw, 20px);
  font-weight: 600;
  color: #1976d2;
}

.article-preview {
  color: #39445a;
  font-size: clamp(14px, 2vw, 16px);
  line-height: 1.55;
}

.article-preview :deep(p) {
  margin: 0;
}

.status {
  margin: clamp(10px, 2.5vw, 14px) 0;
  font-size: clamp(14px, 2.1vw, 16px);
  text-align: left;
}

.status.muted {
  color: #53627b;
}

.status.error {
  color: #c33;
}

.no-articles {
  color: #53627b;
  font-size: clamp(14px, 2.2vw, 16px);
}

@media (max-width: 900px) {
  .article-card {
    flex-direction: column;
    align-items: stretch;
  }

  .article-thumb {
    flex-basis: auto;
    width: 100%;
    max-width: none;
    height: clamp(160px, 35vw, 220px);
  }
}

@media (max-width: 600px) {
  .standard-page {
    padding: clamp(20px, 7vw, 32px) clamp(14px, 8vw, 28px);
  }

  .article-list {
    grid-template-columns: 1fr;
  }

  .block-title {
    border-left-width: 4px;
  }

  .article-card {
    padding: clamp(12px, 4vw, 18px);
  }
}
</style>
