<template>
  <div class="standard-page">
    <h1>Для новичков</h1>
    <StandardContent
      :paragraphs="['Здесь будет информация для новичков']"
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
