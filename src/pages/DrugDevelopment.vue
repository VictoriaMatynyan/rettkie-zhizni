<template>
  <div class="standard-page">
    <h1>О разработке лекарства</h1>
    <StandardContent
      :paragraphs="['Здесь будут новости о разработке лекарства']"
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
  </div>
</template>

<script setup>
import symptomsImg from '../assets/symptoms.png';
import StandardContent from '../components/StandardContent.vue';
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
</style>
