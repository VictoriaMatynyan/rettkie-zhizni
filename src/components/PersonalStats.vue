<template>
  <div class="personal-stats">
    <StandardContent
      :paragraphs="[
        'Здесь будет информация о статистике'
        ]"
      :imageSrc="symptomsImg"
      :imageSrcModal="symptomsImg"
      imageAlt="Схема симптомов Ретта"
      imageAltModal="Схема симптомов Ретта"
      downloadLink="/files/rett-info-brochure.pdf"
      downloadLabel="Скачать памятку по заболеванию: "
      captionText="Изображение: основные проявления синдрома Ретта"
      downloadLinkName="Гайд-заглушка (1.2 МБ)"
      videoUrl="https://rutube.ru/play/embed/someVideoId/"
      >
    </StandardContent>

    <!-- Карта -->
    <div class="map-section">
      <h3>География пациентов</h3>
      <YandexMap :points="regionData" />
    </div>

    <!-- Диаграмма -->
    <!-- <div class="chart-section">
      <h3>Статистика по мутациям</h3>
      <MutationBarChart
        :mutations="visibleMutations"
        :others-count="othersCount"
      />

      <div class="chart-controls">
        <label>Количество отображаемых мутаций:
          <input type="number" v-model.number="displayLimit" min="1" />
        </label>
      </div>
    </div> -->

    <!-- Таблица -->
    <div class="table-section">
      <h3>Подробная статистика</h3>
      <table>
        <thead>
          <tr>
            <th>Ген</th>
            <th>Краткое наименование</th>
            <th>Прочие названия</th>
            <th>Тип мутации</th>
            <th>Ссылка</th>
            <th>Кол-во пациентов</th>
            <th>% от общего</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="mutation in sortedMutations"
            :key="mutation.id"
            :class="{ highlight: userMutationId === mutation.id }"
          >
            <td>{{ mutation.gene }}</td>
            <td>{{ mutation.shortName }}</td>
            <td>{{ mutation.altNames }}</td>
            <td>{{ mutation.type }}</td>
            <td>
              <a :href="mutation.link" target="_blank">Ссылка</a>
            </td>
            <td>{{ mutation.count }}</td>
            <td>{{ ((mutation.count / totalPatients) * 100).toFixed(1) }}%</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
import StandardContent from '../components/StandardContent.vue';
import symptomsImg from '../assets/symptoms.png';
import YandexMap from '../components/YandexMap.vue';
// import MutationBarChart from '@/components/MutationBarChart.vue';

export default {
  name: 'PersonalStats',
  components: {
    StandardContent,
    YandexMap,
    // MutationBarChart
  },
  data() {
    return {
      displayLimit: 5,
      mutations: [], // из БД
      regionData: [], // из БД
      userMutationId: null,
    };
  },
  computed: {
    sortedMutations() {
      return [...this.mutations].sort((a, b) => b.count - a.count);
    },
    visibleMutations() {
      return this.sortedMutations.slice(0, this.displayLimit);
    },
    othersCount() {
      return this.sortedMutations
        .slice(this.displayLimit)
        .reduce((sum, m) => sum + m.count, 0);
    },
    totalPatients() {
      return this.mutations.reduce((sum, m) => sum + m.count, 0);
    },
  },
  mounted() {
    // Здесь можно симулировать получение данных из БД
    this.mutations = this.fetchMutations();
    this.regionData = this.fetchRegionStats();
    this.userMutationId = 'MECP2'; // симуляция
  },
  methods: {
    fetchMutations() {
      return [
        { id: 'MECP2', gene: 'MECP2', shortName: 'MECP2', altNames: '', type: 'миссенс-мутация', link: '', count: 15 },
        { id: 'CDKL5', gene: 'CDKL5', shortName: 'CDKL5', altNames: '', type: 'делеция', link: '', count: 5 },
        { id: 'FOXG1', gene: 'FOXG1', shortName: 'FOXG1', altNames: '', type: 'нонсенс-мутация', link: '', count: 3 },
        { id: 'other1', gene: 'N/A', shortName: '...', altNames: '', type: '', link: '', count: 1 },
      ];
    },
    fetchRegionStats() {
      return [
        { region: 'Москва', count: 10 },
        { region: 'Московская область', count: 7 },
        { region: 'Петербург', count: 3 },
        { region: 'Татарстан', count: 4 },
      ];
    }
  }
};
</script>

<style scoped>
.map-section,
.chart-section,
.table-section {
  margin-bottom: 2rem;
}

.chart-controls {
  margin-top: 1rem;
}

.highlight {
  background-color: #f0f9ff;
  font-weight: bold;
}
</style>