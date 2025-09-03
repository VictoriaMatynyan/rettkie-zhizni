<template>
  <div ref="mapContainer" class="yandex-map"></div>
</template>

<script>
const YMAPS_SRC =
  'https://api-maps.yandex.ru/2.1/?lang=ru_RU&apikey=e1f0e596-6014-42ab-82b8-508387983afc';

export default {
  name: 'YandexMap',
  props: {
    points: {
      type: Array,
      required: true,
    },
  },
  mounted() {
    // В dev не загружаем внешние скрипты, чтобы избежать предупреждений
    const enable = import.meta.env.PROD;
    if (!enable) return;

    if (window.ymaps) {
      ymaps.ready(this.initMap);
      return;
    }

    // Ленивая загрузка API Яндекс.Карт только на страницах, где нужна карта
    let script = document.querySelector('script[data-ymaps]');
    if (!script) {
      script = document.createElement('script');
      script.src = YMAPS_SRC;
      script.async = true;
      script.defer = true;
      script.type = 'text/javascript';
      script.setAttribute('data-ymaps', 'true');
      script.onload = () => {
        if (window.ymaps) ymaps.ready(this.initMap);
      };
      document.head.appendChild(script);
    } else {
      // Если скрипт уже подключается, ждём загрузки
      script.addEventListener('load', () => {
        if (window.ymaps) ymaps.ready(this.initMap);
      }, { once: true });
    }
  },
  methods: {
    initMap() {
      this.map = new ymaps.Map(this.$refs.mapContainer, {
        center: [55.751574, 37.573856], // Центр карты — Москва
        zoom: 5,
        controls: ['zoomControl'],
      });

      this.points.forEach(point => {
        ymaps.geocode(point.region).then(res => {
          const coords = res.geoObjects.get(0)?.geometry.getCoordinates();
          if (coords) {
            const placemark = new ymaps.Placemark(coords, {
              balloonContent: `${point.region}: ${point.count} пациентов`,
            });
            this.map.geoObjects.add(placemark);
          }
        });
      });
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
}
</style>
