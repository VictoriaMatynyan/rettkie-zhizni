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
    <OSMMap :points="points" />
  </div>
</template>

<script setup>
import StandardContent from '../components/StandardContent.vue';
import symptomsImg from '../assets/symptoms.png';
import { ref, onMounted } from 'vue';
import OSMMap from '../components/OSMMap.vue';
import { api } from '../services/api.js';

const points = ref([]);
const regionData = ref([]);

const FALLBACK_POINTS = [
  {
    id: 'moscow',
    region: 'Москва',
    name: 'Москва',
    lat: 55.7558,
    lon: 37.6173,
    count: 25,
  },
  {
    id: 'moscow-region',
    region: 'Московская область',
    name: 'Московская область',
    lat: 55.5044,
    lon: 38.0358,
    count: 18,
  },
  {
    id: 'petersburg',
    region: 'Санкт-Петербург',
    name: 'Санкт-Петербург',
    lat: 59.9311,
    lon: 30.3609,
    count: 22,
  },
  {
    id: 'novosibirsk',
    region: 'Новосибирская область',
    name: 'Новосибирск',
    lat: 55.0084,
    lon: 82.9357,
    count: 10,
  },
  {
    id: 'krasnodar',
    region: 'Краснодарский край',
    name: 'Краснодар',
    lat: 45.0355,
    lon: 38.9753,
    count: 15,
  },
  {
    id: 'tatarstan',
    region: 'Татарстан',
    name: 'Казань',
    lat: 55.7958,
    lon: 49.1066,
    count: 9,
  },
];

async function loadMapPoints() {
  try {
    const res = await api.accounts.getQuestionnaireStatsByCity?.();
    const items = Array.isArray(res?.items)
      ? res.items
      : Array.isArray(res)
        ? res
        : [];

    const normalize = item => {
      if (!item) return null;
      const lat = Number(
        item.lat ?? item.latitude ?? item.coords?.lat ?? item.city?.lat
      );
      const lon = Number(
        item.lon ?? item.longitude ?? item.coords?.lon ?? item.city?.lon
      );
      if (!Number.isFinite(lat) || !Number.isFinite(lon)) return null;
      const count = Number(
        item.count ??
          item.total ??
          item.value ??
          item.questionnaires_count ??
          item.cnt ??
          0
      );
      const name =
        item.name ?? item.city_name ?? item.city?.name ?? item.region ?? '';

      return {
        id: item.id ?? name,
        region: item.region ?? name,
        name,
        lat,
        lon,
        count: count >= 0 ? count : 0,
      };
    };

    const normalized = items
      .map(normalize)
      .filter(Boolean)
      .filter(p => p.lat || p.lon);

    if (normalized.length) {
      points.value = normalized;
      regionData.value = normalized.map(({ region, count }) => ({
        region,
        count,
      }));
      return;
    }
  } catch (e) {
    console.warn('Failed to load map points for registry:', e);
  }

  // fallback demo data to keep marker visible
  points.value = FALLBACK_POINTS.map(({ id, name, lat, lon, count }) => ({
    id,
    name,
    lat,
    lon,
    count,
  }));
  regionData.value = FALLBACK_POINTS.map(({ region, count }) => ({
    region,
    count,
  }));
}

onMounted(() => {
    loadMapPoints();
});
</script>

<style scoped>
.patient-registry {
  /* max-width: 1050px; */
  margin: 0 auto;
  padding: 32px 16px;
  box-sizing: border-box;
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
