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

function formatQuestionnaireLabel(count) {
  const n = Number(count) || 0;
  const mod100 = Math.abs(n) % 100;
  const mod10 = mod100 % 10;
  let noun = 'анкет';
  if (mod100 < 11 || mod100 > 14) {
    if (mod10 === 1) noun = 'анкета';
    else if (mod10 >= 2 && mod10 <= 4) noun = 'анкеты';
  }
  return `${n} ${noun}`;
}

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
      className: 'bio-marker-icon',
      html: `
        <div class="bio-marker" role="presentation">
          <span class="emoji" aria-hidden="true">🧬</span>
          <span class="count">${Number(p.count) || 0}</span>
        </div>
      `,
      iconSize: [36, 36],
      iconAnchor: [18, 18],
    });

    const marker = L.marker([lat, lon], { icon }).addTo(markersLayer);
    bounds.push([lat, lon]);
    try {
      const el = marker.getElement?.() || marker._icon;
      if (el) {
        const w = el.offsetWidth || 200;
        const h = el.offsetHeight || 60;
        el.style.marginLeft = `${-Math.round(w / 2)}px`;
        el.style.marginTop = `${-Math.round(h / 2)}px`;
      }
    } catch {}

    const tooltipParts = [];
    if (p.name) tooltipParts.push(p.name);
    tooltipParts.push(formatQuestionnaireLabel(p.count));
    if (tooltipParts.length) {
      marker.bindTooltip(tooltipParts.join(' • '), {
        direction: 'top',
        offset: [0, -12],
      });
    }
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

:deep(.bio-marker-icon) {
  pointer-events: none;
}

:deep(.bio-marker) {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  position: relative;
  width: 40px;
  height: 40px;
  /* width: 36px;
  height: 36px; */
  border-radius: 50%;
  background: linear-gradient(135deg, #7dd3fc, #a78bfa);
  color: #fff;
  font-size: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.25);
  animation: bioMarkerFadeIn 0.6s ease-in-out;
}

:deep(.bio-marker .emoji) {
  line-height: 1;
}

:deep(.bio-marker .count) {
  position: absolute;
  bottom: -4px;
  right: -6px;
  background: #fff;
  color: #4f46e5;
  font-size: 12px;
  border-radius: 10px;
  padding: 0px 6px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
  font-weight: 600;
  min-width: 13px;
  text-align: center;
}

@keyframes bioMarkerFadeIn {
  from {
    opacity: 0;
    transform: scale(0.8);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}
</style>
