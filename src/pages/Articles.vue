<template>
  
  <div class="standard-page">
    <h1>Статьи</h1>
    <StandardContent
      :paragraphs="[
        'Добро пожаловать в раздел статей, где вы найдёте полезные материалы о синдроме Ретта.'
        ]"
      :imageSrc="symptomsImg"
      :imageSrcModal="symptomsImg"
      imageAlt="Схема симптомов Ретта"
      imageAltModal="Схема симптомов Ретта"
      downloadLink="/files/rett-info-brochure.pdf"
      downloadLabel="Скачать памятку по заболеванию: "
      captionText="Изображение: основные проявления синдрома Ретта"
      downloadLinkName="Гайд-заглушка (1.2 МБ)"
      videoUrl="https://rutube.ru/play/embed/someVideoId/"
      >
    </StandardContent>

    <section class="filter">
      <h2>Фильтр по категориям</h2>
      <div class="filter-buttons">
        <button
          v-for="category in categories"
          :key="category"
          @click="filterByCategory(category)"
          :class="{ active: selectedCategories.includes(category) }"
        >
          {{ category }}
        </button>
        <button v-if="selectedCategories.length" @click="clearFilters" class="clear-button">Сбросить фильтр</button>
      </div>
    </section>

    <section class="articles-block">
      <h2 class="block-title">Статьи</h2>
      <div class="article-list">
        <div
          class="article-card"
          v-for="article in visibleArticles"
          :key="article.id"
          @click="goToArticle(article.id)"
        >
          <img :src="article.image" :alt="article.title" class="article-image" />
          <p class="category"> {{ article.category }}</p>
          <h3 class="card-title">{{ article.title }}</h3>
          <p>{{ article.preview }}</p>
        </div>
      </div>
      <button v-if="hasMore" @click="loadMore" class="load-more">
        Загрузить ещё
      </button>
      <p v-if="!visibleArticles.length" class="no-articles">
        Нет статей по выбранным категориям.
      </p>
    </section>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import symptomsImg from '../assets/symptoms.png';
import articleImg from '../assets/news.jpeg';
import StandardContent from '../components/StandardContent.vue';

const router = useRouter()

// массив статей - заглушки; позже будут загружаться с сервера)
const articles = ref([
  {
    id: 1,
    title: 'Статья 1',
    image: articleImg,
    preview: 'Анонс статьи',
    category: 'Медицина',
    date: '2025-06-01'
  },
  {
    id: 2,
    title: 'Статья 2',
    image: articleImg,
    preview: 'Анонс статьи',
    category: 'Истории',
    date: '2025-05-20'
  },
  {
    id: 3,
    title: 'Статья 3',
    image: articleImg,
    preview: 'Анонс статьи',
    category: 'Медицина',
    date: '2025-05-21'
  },
  {
    id: 4,
    title: 'Статья 4',
    image: articleImg,
    preview: 'Анонс статьи',
    category: 'Истории',
    date: '2025-05-20'
  },
  {
    id: 5,
    title: 'Статья 5',
    image: articleImg,
    preview: 'Анонс статьи',
    category: 'Медицина',
    date: '2025-05-20'
  },
  {
    id: 6,
    title: 'Статья 6',
    image: articleImg,
    preview: 'Анонс статьи',
    category: 'Рекомендации',
    date: '2025-05-20'
  },
  {
    id: 7,
    title: 'Статья 7',
    image: articleImg,
    preview: 'Анонс статьи',
    category: 'Истории',
    date: '2025-05-20'
  },
  {
    id: 8,
    title: 'Статья 8',
    image: articleImg,
    preview: 'Анонс статьи',
    category: 'Рекомендации',
    date: '2025-05-20'
  },
  {
    id: 9,
    title: 'Статья 9',
    image: articleImg,
    preview: 'Анонс статьи',
    category: 'Медицина',
    date: '2025-05-20'
  },
  {
    id: 10,
    title: 'Статья 10',
    image: articleImg,
    preview: 'Анонс статьи',
    category: 'Медицина',
    date: '2025-05-20'
  },
   {
    id: 11,
    title: 'Статья 11',
    image: articleImg,
    preview: 'Анонс статьи',
    category: 'Рекомендации',
    date: '2025-05-20'
  },
])

// кол-во отображаемых историй
const pageSize = 10;
const currentPage = ref(1);

const categories = computed(() => 
// получаем массив уникальных (set) категорий статей
  [...new Set(articles.value.map(article => article.category))]
);
// категории, кот. выбрал пользователь
const selectedCategories = ref([]);

const filteredArticles = computed(() => {
  if (!selectedCategories.value.length) return articles.value;
  return articles.value.filter(article => selectedCategories.value.includes(article.category));
});

const sortedArticles = computed(() =>
  [...filteredArticles.value].sort((a, b) => new Date(b.date) - new Date(a.date))
);

const visibleArticles = computed(() =>
  sortedArticles.value.slice(0, currentPage.value * pageSize)
);
const hasMore = computed(() => visibleArticles.value.length < sortedArticles.value.length);

function filterByCategory(category) {
  const index = selectedCategories.value.indexOf(category);
  if (index > -1) {
    selectedCategories.value.splice(index, 1)
  } else {
    selectedCategories.value.push(category)
  }
};

function clearFilters() {
  selectedCategories.value = [];
  currentPage.value = 1;
}

function loadMore() {
  currentPage.value++
};

function goToArticle(id) {
  router.push(`/articles/${id}`)
};
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
}

.article-list {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.article-card {
  display: flex;
  flex-direction: column;
  cursor: pointer;
  border: 1px solid #ddd;
  padding: 16px;
  border-radius: 8px;
  transition: box-shadow 0.3s ease;
}

.article-card:hover {
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.15);
}

.article-card img {
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
  color:  #2AAEA2;
  background-color: transparent;
  border: 1px solid #2AAEA2;
  border-radius: 6px;
  cursor: pointer;
}

.load-more:hover {
  background-color: #2AAEA2;
  border: 1px solid #2AAEA2;
  color: #fff;
}

.filter {
  display: flex;
  flex-direction: column;
  margin: 0;
}

.filter-buttons {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
  border-radius: 8px;
  padding: 20px 10px;
}

.filter-buttons button {
  padding: 6px 12px;
  border: 1px solid #ccc;
  background-color: transparent;
  border-radius: 8px;
  cursor: pointer;
}
.filter-buttons .active {
  background: #2AAEA2;
  color: #fff;
}

.clear-button {
  margin-left: auto;
}

.clear-button:hover {
  background-color: rgba(129, 50, 173, 0.3);
}

.article-card {
  border: 1px solid #ccc;
  padding: 16px;
  margin-bottom: 16px;
  cursor: pointer;
}

.article-card img {
  width: 100%;
  max-width: 100%;
  height: auto;
}

.category {
  font-size: 12px;
  color: #888;
}

.no-articles {
  margin-top: 24px;
  font-style: italic;
  color: #999;
}
</style>