<template>
  <div ref="mapEl" class="osm-map"></div>
</template>

<script setup>
import { ref, watch, onMounted, onBeforeUnmount } from 'vue';

const props = defineProps({
  points: {
    type: Array,
    default: () => [],
  },
});

const mapEl = ref(null);
let mapInstance = null;
let markersLayer = null;
let leafletWaitTimer = null;

function ensureLeaflet() {
  const L = window.L;
  return L || null;
}

function createMap() {
  const L = ensureLeaflet();
  if (!L) {
    // Подождём, пока Leaflet загрузится (через CDN в index.html)
    leafletWaitTimer = setTimeout(createMap, 100);
    return;
  }
  mapInstance = L.map(mapEl.value, {
    center: [55.751244, 37.618423],
    zoom: 4,
    minZoom: 2,
    attributionControl: true,
  });
  // Убираем «Leaflet» и любые символы из префикса атрибуции
  try {
    mapInstance.attributionControl.setPrefix('');
  } catch (_) {}
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors',
    maxZoom: 19,
  }).addTo(mapInstance);
  markersLayer = L.layerGroup().addTo(mapInstance);
}

function updateMarkers() {
  if (!mapInstance || !markersLayer) return;
  const L = ensureLeaflet();
  markersLayer.clearLayers();
  const bounds = [];

  (props.points || []).forEach(p => {
    const lat = Number(p.lat);
    const lon = Number(p.lon);
    if (Number.isNaN(lat) || Number.isNaN(lon)) return;

    const count = Number(p.count) || 0;
    const name = p.name || '';

    const iconHtml = `
      <div class="city-marker">
        <div class="city-marker__bubble">
          <div class="city-marker__name">${name}</div>
          <div class="city-marker__count">Анкет: ${count}</div>
        </div>
        <div class="city-marker__pin"></div>
      </div>`;
    const icon = L.divIcon({
      className: 'city-marker-wrapper',
      html: iconHtml,
      iconSize: [200, 70],
      iconAnchor: [100, 70],
    });

    const marker = L.marker([lat, lon], { icon });
    marker.addTo(markersLayer);
    try {
      const el = marker.getElement ? marker.getElement() : marker._icon;
      if (el) {
        // Центрируем баббл по ширине и привязываем нижний край к координате
        const w = el.offsetWidth || 200;
        const h = el.offsetHeight || 60;
        el.style.marginLeft = `${-Math.round(w / 2)}px`;
        el.style.marginTop = `${-Math.round(h)}px`;
      }
    } catch (_) {}
    bounds.push([lat, lon]);
  });

  // Fit bounds if we have at least one point
  if (bounds.length > 0) {
    try {
      mapInstance.fitBounds(bounds, { padding: [30, 30] });
    } catch (_) {
      // ignore
    }
  }
}

onMounted(() => {
  createMap();
  updateMarkers();
});

onBeforeUnmount(() => {
  try {
    mapInstance?.remove();
  } catch (_) {}
  mapInstance = null;
  markersLayer = null;
  if (leafletWaitTimer) {
    clearTimeout(leafletWaitTimer);
    leafletWaitTimer = null;
  }
});

watch(
  () => props.points,
  () => updateMarkers(),
  { deep: true }
);

// панель больше не используется — вся информация на маркере
</script>

<style scoped>
.osm-map {
  width: 100%;
  height: 520px;
  border-radius: 6px;
  overflow: hidden;
  border: 1px solid #e0e0e0;
  position: relative;
}

/* City marker bubble */
:deep(.city-marker) {
  display: flex;
  flex-direction: column;
  align-items: center;
}
:deep(.city-marker__bubble) {
  display: inline-flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  background: #f1fbf9; /* светлый фон */
  border: 1px solid rgba(42, 174, 162, 0.25);
  border-radius: 6px;
  padding: 8px 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
}
:deep(.city-marker__name) {
  font-size: 16px; /* крупнее */
  font-weight: 800;
  color: #123;
  white-space: nowrap;
}
:deep(.city-marker__count) {
  font-size: 15px; /* крупнее */
  font-weight: 700;
  color: #2b6;
}
:deep(.city-marker__pin) {
  width: 0;
  height: 0;
  border-left: 7px solid transparent;
  border-right: 7px solid transparent;
  border-top: 8px solid #f1fbf9; /* фон треугольника как у баббла */
  filter: drop-shadow(0 2px 2px rgba(0, 0, 0, 0.15));
  margin-top: -1px;
}
</style>
