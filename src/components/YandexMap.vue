<template>
  <div ref="mapContainer" class="yandex-map"></div>
</template>

<script>
export default {
  name: 'YandexMap',
  props: {
    points: {
      type: Array,
      required: true,
    }
  },
  mounted() {
    if (window.ymaps) {
      ymaps.ready(this.initMap);
    }
  },
  methods: {
    initMap() {
      this.map = new ymaps.Map(this.$refs.mapContainer, {
        center: [55.751574, 37.573856], // Центр карты — Москва
        zoom: 5,
        controls: ['zoomControl']
      });

      this.points.forEach(point => {
        ymaps.geocode(point.region).then(res => {
          const coords = res.geoObjects.get(0)?.geometry.getCoordinates();
          if (coords) {
            const placemark = new ymaps.Placemark(coords, {
              balloonContent: `${point.region}: ${point.count} пациентов`
            });
            this.map.geoObjects.add(placemark);
          }
        });
      });
    }
  }
};
</script>

<style scoped>
.yandex-map {
  width: 100%;
  height: 400px;
  margin: 24px 0;
  border-radius: 8px;
  overflow: hidden;
}
</style>
