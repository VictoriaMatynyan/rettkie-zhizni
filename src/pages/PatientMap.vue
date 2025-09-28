<template>
  <div class="patient-registry">
    <div class="map-section">
      <h3 class="block-title">География пациентов</h3>
      <p v-if="loading" class="status muted">Загрузка карты…</p>
      <p v-else-if="error" class="status error">{{ error }}</p>
      <OSMMap v-else :points="points" />
    </div>
  </div>
</template>

<script setup>
// import StandardContent from '../components/StandardContent.vue';
import OSMMap from '../components/OSMMap.vue';
import { ref, onMounted } from 'vue';
import { api } from '../services/api.js';

const loading = ref(false);
const error = ref('');
const points = ref([]);

async function fetchStats() {
  loading.value = true;
  error.value = '';
  points.value = [];
  try {
    const res = await api.accounts.getQuestionnaireStatsByCity();
    const items = Array.isArray(res?.items) ? res.items : [];
    points.value = items
      .filter(i => i && (i.count || i.count === 0))
      .map(i => ({
        id: i.id,
        name: i.name,
        lat: Number(i.lat),
        lon: Number(i.lon),
        count: Number(i.count) || 0,
      }));
  } catch (e) {
    error.value =
      e?.response?.data?.message ||
      e.message ||
      'Не удалось загрузить статистику по городам';
  } finally {
    loading.value = false;
  }
}

onMounted(fetchStats);
</script>

<style scoped>
.patient-registry {
  width: 100%;
  margin: 0 auto;
  padding: 0 0 32px;
  box-sizing: border-box;
}

.registry-title {
  font-size: 28px;
  margin-bottom: 24px;
  text-align: center;
}

.main-content > .patient-registry > p {
  text-align: justify;
  margin: 0 10px 0;
}

.block-title {
  font-size: 22px;
  margin-top: 40px;
  margin-bottom: 20px;
  text-align: center;
}

.map-section {
  width: 90vw;
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
  border: 1px solid #2aaea2;
  border-radius: 8px;
  text-decoration: none;
  transition: background-color 0.3s ease;
}

.btn-register:hover {
  background-color: #2aaea2;
  color: #fff;
}

.status {
  margin: 10px 0 16px;
  font-size: 14px;
}
.status.muted {
  color: #666;
}
.status.error {
  color: #721c24;
  background: #f8d7da;
  border: 1px solid #f5c6cb;
  padding: 8px 10px;
  border-radius: 6px;
}
</style>
