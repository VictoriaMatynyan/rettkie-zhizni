<template>
  <div ref="mapEl" class="osm-map"></div>
</template>

<script setup>
import { ref, watch, onMounted, onBeforeUnmount, nextTick } from 'vue';

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
let ro = null; // ResizeObserver
let waitTimer = null;

function ensureLeaflet() {
  const L = window.L;
  return L || null;
}

function createMap() {
  const L = ensureLeaflet();
  if (!L) {
    waitTimer = setTimeout(createMap, 80);
    return;
  }
  if (!mapEl.value) return;

  mapInstance = L.map(mapEl.value, {
    center: [55.751244, 37.618423], // Москва по умолчанию
    zoom: 5,
    minZoom: 2,
    attributionControl: true,
  });
  try {
    mapInstance.attributionControl.setPrefix('');
  } catch {}

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors',
    maxZoom: 19,
  }).addTo(mapInstance);

  markersLayer = L.layerGroup().addTo(mapInstance);
  nextTick(() => {
    if (mapInstance) {
      mapInstance.invalidateSize(true);
    }
  });
  ro = new ResizeObserver(() => mapInstance && mapInstance.invalidateSize());
  ro.observe(mapEl.value);

  updateMarkers();
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

    const icon = L.divIcon({
      className: 'city-marker-wrapper',
      html: `
        <div class="city-marker">
          <div class="city-marker__bubble">
            <div class="city-marker__name">${p.name ?? ''}</div>
            <div class="city-marker__count">Анкет: ${Number(p.count) || 0}</div>
          </div>
          <div class="city-marker__pin"></div>
        </div>`,
      iconSize: [200, 70],
      iconAnchor: [100, 70],
    });

    const marker = L.marker([lat, lon], { icon }).addTo(markersLayer);
    bounds.push([lat, lon]);
    try {
      const el = marker.getElement?.() || marker._icon;
      if (el) {
        const w = el.offsetWidth || 200;
        const h = el.offsetHeight || 60;
        el.style.marginLeft = `${-Math.round(w / 2)}px`;
        el.style.marginTop = `${-Math.round(h)}px`;
      }
    } catch {}
  });

  // Центрирование/зум:
  if (bounds.length === 1) {
    mapInstance.setView(bounds[0], 8);
  } else if (bounds.length > 1) {
    mapInstance.fitBounds(bounds, { padding: [24, 24] });
  } else {
    mapInstance.setView([55.751244, 37.618423], 5);
  }

  nextTick(() => mapInstance && mapInstance.invalidateSize());
}

onMounted(() => {
  createMap();
});

onBeforeUnmount(() => {
  if (waitTimer) clearTimeout(waitTimer);
  try {
    ro && ro.disconnect();
  } catch {}
  try {
    mapInstance?.remove();
  } catch {}
  mapInstance = null;
  markersLayer = null;
});

watch(
  () => props.points,
  () => updateMarkers(),
  { deep: true }
);
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

:deep(.leaflet-container),
:deep(.leaflet-pane),
:deep(.leaflet-map-pane),
:deep(.leaflet-tile-pane),
:deep(.leaflet-objects-pane) {
  width: 100%;
  height: 520px;
  z-index: 0;
}

:deep(.leaflet-control),
:deep(.leaflet-top, .leaflet-bottom) {
  z-index: 0;
}

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
  background: #f1fbf9;
  border: 1px solid rgba(42, 174, 162, 0.25);
  border-radius: 6px;
  padding: 8px 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
}
:deep(.city-marker__name) {
  font-size: 16px;
  font-weight: 800;
  color: #123;
  white-space: nowrap;
}
:deep(.city-marker__count) {
  font-size: 15px;
  font-weight: 700;
  color: #2b6;
}
:deep(.city-marker__pin) {
  width: 0;
  height: 0;
  border-left: 7px solid transparent;
  border-right: 7px solid transparent;
  border-top: 8px solid #f1fbf9;
  filter: drop-shadow(0 2px 2px rgba(0, 0, 0, 0.15));
  margin-top: -1px;
}
</style>
