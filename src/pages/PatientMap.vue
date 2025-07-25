<template>
  <div class="patient-registry">
    <h1 class="registry-title">Карта пациентов</h1>
    <StandardContent
      :paragraphs="[
        'На этой карте отображено примерное распределение пациентов с синдромом Ретта по регионам России. Эти данные помогают специалистам и исследователям лучше понимать географию заболевания и разрабатывать более точные меры поддержки.',
        'Количество пациентов отображается на основе данных, внесённых в реестр через Личный кабинет. Чем больше регистраций — тем точнее карта.',
        'Если вы — родитель или опекун ребёнка с синдромом Ретта, зарегистрируйтесь в реестре, чтобы внести вклад в развитие сообщества.'
      ]"
      :imageSrc="symptomsImg"
      :imageSrcModal="symptomsImg"
      imageAlt="Карта пациентов"
      imageAltModal="Карта пациентов(увеличено)"
      downloadLink="/files/rett-about.pdf"
      downloadLabel="Скачать презентацию о сообществе: "
      captionText="Фотография с мероприятия сообщества"
      downloadLinkName="Презентация (1.3 МБ)"
      videoUrl="https://rutube.ru/play/embed/someVideoId/"
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

/* .main-content > .patient-registry .standard-content {
  text-align: justify;
} */

.main-content > .patient-registry > p {
  text-align: justify;
  margin: 0 10px 0;
}

.block-title {
  font-size: 22px;
  margin-top: 40px;
  margin-bottom: 20px;
}

.registry-button {
  text-align: center;
  margin-top: 32px;
}

.btn-register {
  display: inline-block;
  padding: 12px 24px;
  font-size: 16px;
  font-weight: 600;
  background-color: transparent;
  border: 1px solid #2AAEA2;
  border-radius: 8px;
  text-decoration: none;
  transition: background-color 0.3s ease;
}

.btn-register:hover {
  background-color: #2AAEA2;
  color: #fff;
}

</style>