<template>
  <div ref="mapContainer" class="yandex-map">
    <div v-if="!isMapLoaded" class="map-loading">Загрузка карты...</div>
  </div>
</template>

<script>
import { initYandexMaps, safeExternalCall } from '../utils/external-apis.js';

export default {
  name: 'YandexMap',
  props: {
    points: {
      type: Array,
      required: true,
    },
  },
  data() {
    return {
      map: null,
      isMapLoaded: false,
    };
  },
  mounted() {
    this.initializeMap();
  },
  beforeUnmount() {
    if (this.map) {
      safeExternalCall(() => this.map.destroy(), 'Ошибка уничтожения карты');
    }
  },
  methods: {
    initializeMap() {
      initYandexMaps(() => {
        this.initMap();
      });
    },
    initMap() {
      const mapInstance = safeExternalCall(() => {
        return new window.ymaps.Map(this.$refs.mapContainer, {
          center: [55.751574, 37.573856], // Центр карты — Москва
          zoom: 5,
          controls: ['zoomControl'],
        });
      }, 'Ошибка создания карты');

      if (mapInstance) {
        this.map = mapInstance;
        this.isMapLoaded = true;
        this.addPointsToMap();
      }
    },
    addPointsToMap() {
      if (!this.points || !this.map) return;

      this.points.forEach((point) => {
        this.addPointToMap(point);
      });
    },
    async addPointToMap(point) {
      if (!window.ymaps || !this.map) return;

      try {
        const result = await window.ymaps.geocode(point.region);
        const firstGeoObject = result.geoObjects.get(0);

        if (firstGeoObject) {
          const coords = firstGeoObject.geometry.getCoordinates();
          const placemark = new window.ymaps.Placemark(coords, {
            balloonContent: `${point.region}: ${point.count} пациентов`,
          });
          this.map.geoObjects.add(placemark);
        }
      } catch (error) {
        // В development режиме логируем ошибки
        if (process.env.NODE_ENV === 'development') {
          console.warn(`Не удалось добавить точку ${point.region}:`, error);
        }
      }
    },
  },
};
</script>

<style scoped>
.yandex-map {
  width: 100%;
  height: 400px;
  margin: 24px 0;
  border-radius: 8px;
  overflow: hidden;
  position: relative;
}

.map-loading {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  background-color: #f5f5f5;
  color: #666;
  font-size: 16px;
}
</style>
