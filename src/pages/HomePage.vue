<template>
  <div class="home-page">
    <h1 class="home-page-title">Добро пожаловать!</h1>
    <section class="banner-block">
      <img
        src="/src/assets/logo_horizontal.png"
        alt="Логотип на главной странице"
        class="home-page-logo"
      />
    </section>
    <section class="standard-content">
      <StandardContent
        :paragraphs="[
          'Мы стремимся делиться актуальной и полезной информацией с родителями, врачами и всеми, кто хочет помочь.',
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
      ></StandardContent>
    </section>

    <section class="latest-news">
      <h2 class="block-title">Последние новости</h2>
      <div class="card-list">
        <!-- <div v-for="(news, index) in newsList" :key="news.id">
          <h3>Новость №{{ index + 1 }}</h3>
        </div> -->
        <div v-for="n in 3" :key="n" class="news-card">
          <img src="/src/assets/news.jpeg" alt="Изображение новости" />
          <p class="date">01.06.2025</p>
          <h3 class="card-title">Заголовок новости №{{ n }}</h3>
          <p>Анонс новости с кратким описанием и переходом по клику</p>
        </div>
      </div>
    </section>

    <section class="stories-block">
      <h2 class="block-title">Наши истории</h2>
      <div class="card-list">
        <div v-for="s in 3" :key="s" class="story-card">
          <img src="/src/assets/patient_history.jpeg" alt="История пациента" />
          <h3 class="card-title">История №{{ s }}</h3>
          <p>
            Краткий анонс истории семьи / пациента, который можно будет открыть
            подробнее
          </p>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import symptomsImg from '../assets/symptoms.png';
import StandardContent from '../components/StandardContent.vue';
</script>

<style scoped>
.home-page {
  max-width: 1420px;
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  /* TODO: убрать padding (= 0)  */
  padding: 24px;
}

.home-page .home-page-title {
  font-size: 24px;
  margin-bottom: 24px;
}

.home-page-logo {
  max-width: 1420px;
  width: 90%;
}

.banner-block {
  width: 100%;
  text-align: center;
}

.banner-image {
  max-width: 100%;
  height: auto;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.standard-content {
  max-width: 1050px;
}

.card-list {
  display: flex;
  flex-wrap: wrap;
  gap: 24px;
  justify-content: center;
}

.news-card,
.story-card {
  width: 300px;
  background: #fff;
  padding: 16px;
  border: 1px solid #ddd;
  border-radius: 8px;
  transition: box-shadow 0.2s;
  cursor: pointer;
}

.news-card:hover,
.story-card:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.news-card img,
.story-card img {
  width: 100%;
  border-radius: 6px;
  margin-bottom: 12px;
}

.news-card .date {
  font-size: 12px;
  color: #666;
  margin-bottom: 6px;
}

.block-title {
  font-size: 22px;
  margin-bottom: 16px;
}
</style>
