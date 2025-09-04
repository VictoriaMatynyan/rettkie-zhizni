<template>
  <div class="patient-registry">
    <h1 class="registry-title">Реестр пациентов</h1>
    <StandardContent
      :paragraphs="[
        'Реестр пациентов — это добровольная база данных, в которой собирается информация о детях и взрослых с синдромом Ретта. Это помогает врачам и исследователям лучше понимать заболевание, разрабатывать эффективные подходы к лечению и реабилитации.',
      ]"
      :image-src="symptomsImg"
      :image-src-modal="symptomsImg"
      image-alt="Реестр пациентов"
      image-alt-modal="Реестр пациентов(увеличено)"
      download-link="/files/rett-about.pdf"
      download-label="Скачать презентацию о сообществе: "
      caption-text="Фотография с мероприятия сообщества"
      download-link-name="Презентация (1.3 МБ)"
      video-url="https://rutube.ru/play/embed/someVideoId/"
    />
    <div class="map-section">
      <h3 class="block-title">География пациентов</h3>
      <YandexMap :points="regionData" />
    </div>
  </div>
</template>

<script setup>
import StandardContent from '../components/StandardContent.vue';
import symptomsImg from '../assets/symptoms.png';
import YandexMap from '../components/YandexMap.vue';
import { ref, onMounted } from 'vue';
const regionData = ref([]);

onMounted(() => {
  // симуляция получения данных из БД
  regionData.value = [
    { region: 'Москва', count: 25 },
    { region: 'Московская область', count: 18 },
    { region: 'Санкт-Петербург', count: 22 },
    { region: 'Новосибирская область', count: 10 },
    { region: 'Краснодарский край', count: 15 },
    { region: 'Татарстан', count: 9 },
  ];
});
</script>

<style scoped>
.patient-registry {
  max-width: 1050px;
  margin: 0 auto;
  padding: 32px 16px;
}

.registry-title {
  font-size: 28px;
  margin-bottom: 24px;
  text-align: center;
}

.block-title {
  font-size: 22px;
  margin-top: 40px;
  margin-bottom: 20px;
}
</style>
