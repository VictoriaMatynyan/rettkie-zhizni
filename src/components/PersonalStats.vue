<template>
  <div class="personal-stats">
    <h2 class="block-title">Статистика</h2>
    <StandardContent
      :paragraphs="paragraphs"
      :image-src="symptomsImg"
      :image-src-modal="symptomsImg"
      :show-map="true"
      :map-points="points"
      map-title="География пациентов"
      image-alt="Схема симптомов Ретта"
      image-alt-modal="Схема симптомов Ретта"
      download-link="/files/rett-info-brochure.pdf"
      download-label="Скачать памятку по заболеванию: "
      caption-text="Изображение: основные проявления синдрома Ретта"
      download-link-name="Гайд-заглушка (1.2 МБ)"
    />

    <div class="chart-section">
      <h3>Статистика по мутациям</h3>

      <div class="chart-controls">
        <label>
          Количество отображаемых мутаций:
          <input v-model.number="displayLimit" type="number" min="2" />
        </label>
      </div>

      <div class="bar-chart" v-if="chartItems.length">
        <div
          v-for="bar in chartItems"
          :key="bar.key"
          class="bar"
          :style="{ height: barHeight(bar.count) }"
          :title="bar.tooltip"
        >
          <span class="bar-value">{{ bar.count }}</span>
          <span class="bar-label" :class="{ self: userMutationId === bar.id }">
            {{ bar.short }}
          </span>
        </div>
      </div>
      <p v-else class="muted">Нет данных для построения диаграммы</p>
    </div>

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
            v-for="m in sortedMutations"
            :key="m.id"
            :class="{ highlight: userMutationId === m.id }"
          >
            <td>{{ m.gene }}</td>
            <td>{{ m.shortName }}</td>
            <td>{{ m.altNames || '-' }}</td>
            <td>{{ m.type || '-' }}</td>
            <td>
              <a v-if="m.link" :href="m.link" target="_blank">Ссылка</a>
              <span v-else>-</span>
            </td>
            <td>{{ m.count }}</td>
            <td>{{ percent(m.count) }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
import StandardContent from '../components/StandardContent.vue';
import symptomsImg from '../assets/symptoms.png';
import { api } from '../services/api.js';

/**
 * @typedef {{id:number|string,name:string,lat:number,lon:number,count:number}} CityPoint
 */

export default {
  name: 'PersonalStats',
  components: { StandardContent },
  data() {
    return {
      paragraphs: [
        'На этой странице собрана агрегированная статистика по географии и мутациям.',
      ],
      symptomsImg: symptomsImg,

      // Карта
      /** @type {CityPoint[]} */
      points: [],
      mapError: '',
      mapLoading: false,

      // Диаграмма / таблица
      displayLimit: 5,
      dict: [], // справочник мутаций
      countsByMutation: {}, // { [id]: count }
      userMutationId: null,
      dictLoading: false,
      dictError: '',
    };
  },
  computed: {
    totalPatients() {
      const vals = Object.values(this.countsByMutation);
      return vals.reduce((a, b) => a + (Number(b) || 0), 0) || 0;
    },
    enriched() {
      // объединяем справочник с количествами
      return (this.dict || []).map(item => {
        const count = Number(this.countsByMutation?.[item.id]) || 0;
        return {
          id: item.id,
          gene: item.gene || item.name || '',
          shortName: item.short_name || item.shortName || item.name || '',
          altNames: item.alt_names || item.altNames || '',
          type: item.type || item.mutation_type || '',
          link: item.link || item.url || '',
          description: item.description || item.full_name || item.name || '',
          count,
        };
      });
    },
    sortedMutations() {
      return [...this.enriched].sort((a, b) => b.count - a.count);
    },
    chartItems() {
      const list = this.sortedMutations;
      if (!list.length) return [];
      const limit = Math.max(2, Number(this.displayLimit) || 5);
      const top = list.slice(0, limit - 1);
      const rest = list.slice(limit - 1);
      const others = {
        key: 'others',
        id: null,
        short: 'Прочие',
        tooltip: 'Прочие мутации',
        count: rest.reduce((s, x) => s + x.count, 0),
      };
      const bars = top.map(m => ({
        key: `m-${m.id}`,
        id: m.id,
        short: m.shortName || m.gene || String(m.id),
        tooltip: m.description || m.shortName || m.gene,
        count: m.count,
      }));
      return [...bars, others];
    },
    maxCount() {
      return this.chartItems.reduce((mx, b) => Math.max(mx, b.count), 0) || 1;
    },
  },
  mounted() {
    this.fetchMapPoints();
    this.fetchMutationsDictAndStats();
    this.fetchUserMutation();
  },
  methods: {
    percent(n) {
      const t = this.totalPatients || 1;
      return `${(((Number(n) || 0) * 100) / t).toFixed(1)}%`;
    },
    barHeight(n) {
      const max = this.maxCount || 1;
      const pct = Math.round(((Number(n) || 0) / max) * 100);
      return `${Math.max(2, pct)}%`;
    },
    async fetchMapPoints() {
      this.mapLoading = true;
      this.mapError = '';
      this.points = [];
      try {
        const res = await api.accounts.getQuestionnaireStatsByCity();
        const items = Array.isArray(res?.items) ? res.items : [];
        this.points = items
          .filter(i => i && (i.count || i.count === 0))
          .map(i => ({
            id: i.id,
            name: i.name,
            lat: Number(i.lat),
            lon: Number(i.lon),
            count: Number(i.count) || 0,
          }));
      } catch (e) {
        this.mapError =
          e?.response?.data?.message ||
          e.message ||
          'Не удалось загрузить данные для карты';
      } finally {
        this.mapLoading = false;
      }
    },
    async fetchMutationsDictAndStats() {
      this.dictLoading = true;
      this.dictError = '';
      try {
        const dictRes = await api.accounts.getMutationGenes();
        this.dict = Array.isArray(dictRes?.items) ? dictRes.items : [];

        // Попробуем получить статистику по мутациям с сервера (если есть)
        try {
          const statsRes =
            await api.accounts.getQuestionnaireStatsByMutation?.();
          const items = Array.isArray(statsRes?.items) ? statsRes.items : [];
          this.countsByMutation = items.reduce((acc, it) => {
            const id = it.id ?? it.mutation_id ?? it.gene_id;
            const count = Number(it.count) || 0;
            if (id != null) acc[id] = count;
            return acc;
          }, {});
        } catch (_) {
          // Фолбэк: если отдельной статистики нет — заполним нулями
          this.countsByMutation = {};
        }
      } catch (e) {
        this.dictError =
          e?.response?.data?.message ||
          e.message ||
          'Не удалось загрузить справочник мутаций';
        this.dict = [];
        this.countsByMutation = {};
      } finally {
        this.dictLoading = false;
      }
    },
    async fetchUserMutation() {
      try {
        const res = await api.accounts.getMyQuestionnaires();
        const items = Array.isArray(res?.items) ? res.items : [];
        const withGene = items.find(x => x?.mutation_gene?.id != null);
        this.userMutationId = withGene?.mutation_gene?.id ?? null;
      } catch (_) {
        this.userMutationId = null;
      }
    },
  },
};
</script>

<style scoped>
.block-title {
  text-align: center;
}

.chart-section,
.table-section {
  margin-bottom: 2rem;
}

.chart-controls {
  margin-top: 1rem;
}

.bar-chart {
  display: flex;
  align-items: flex-end;
  gap: 10px;
  height: 280px;
  margin-top: 16px;
  border-left: 1px solid #ccc;
  border-bottom: 1px solid #ccc;
  padding: 8px 8px 0 8px;
}
.bar {
  position: relative;
  flex: 1 1 0;
  min-width: 40px;
  background: linear-gradient(180deg, #2aaea2, #1e9086);
  border-radius: 4px 4px 0 0;
  display: flex;
  align-items: flex-end;
  justify-content: center;
  transition: opacity 0.2s ease;
}
.bar:hover {
  opacity: 0.9;
}
.bar-value {
  position: absolute;
  top: -20px;
  font-size: 12px;
  color: #333;
}
.bar-label {
  position: absolute;
  bottom: -40px;
  width: 100%;
  text-align: center;
  font-size: 12px;
  color: #333;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.bar-label.self {
  font-weight: 700;
  color: #123;
}

.highlight {
  background-color: #f0f9ff;
  font-weight: bold;
}

.muted {
  color: #666;
}

table {
  width: 100%;
  border-collapse: collapse;
}
th,
td {
  padding: 8px 10px;
  border-bottom: 1px solid #eee;
  text-align: left;
}
thead th {
  background: #f7f7f7;
}
</style>
