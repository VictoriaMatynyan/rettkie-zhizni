<template>
  <div class="personal-stats">
    <h2 class="block-title">Статистика</h2>

    <div class="chart-section card">
      <h3>Статистика по мутациям</h3>
      <p v-if="usingMocks" class="muted">
        Показаны демонстрационные данные (моки)
      </p>

      <div class="chart-controls">
        <label>
          Количество отображаемых мутаций:
          <input
            v-model.number="displayLimit"
            type="number"
            min="2"
            :max="maxDisplayLimit"
            :disabled="selectedIds.length > 0"
          />
          <span class="control-hint">от 2 до {{ maxDisplayLimit }}</span>
        </label>
        <p v-if="selectedIds.length > 0" class="muted small">
          При выбранных мутациях ограничение по количеству не применяется
        </p>
      </div>

      <div class="chart-filters">
        <label class="chk-inline">
          <input v-model="includeOthers" type="checkbox" />
          <span>Добавить столбец «Прочие»</span>
        </label>
        <div class="mutations-select">
          <div class="select-actions">
            <button type="button" class="btn ghost" @click="selectAll">
              Выбрать все
            </button>
            <button type="button" class="btn ghost" @click="clearSelection">
              Сбросить
            </button>
          </div>
          <div class="checkbox-list">
            <label
              v-for="m in sortedMutations"
              :key="'chk-' + m.id"
              class="chk"
            >
              <input v-model="selectedIds" type="checkbox" :value="m.id" />
              <span :class="{ self: userMutationId === m.id }">{{
                m.shortName || m.gene
              }}</span>
              <span class="muted small"> ({{ m.count }})</span>
            </label>
          </div>
        </div>
      </div>

      <div v-if="chartItems.length" class="bar-chart">
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

    <div class="table-section card">
      <h3>Подробная статистика</h3>
      <p v-if="usingMocks" class="muted">
        Показаны демонстрационные данные (моки)
      </p>
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

    <div class="map-section">
      <h3>География пациентов</h3>
      <OSMMap :points="points" />
    </div>
  </div>
</template>

<script>
import OSMMap from '../components/OSMMap.vue';
import { api } from '../services/api.js';

/**
 * @typedef {{id:number|string,name:string,lat:number,lon:number,count:number}} CityPoint
 */

const MOCK_MUTATIONS = [
  {
    id: 101,
    gene: 'MECP2',
    short_name: 'R106W',
    alt_names: 'Arg106Trp',
    type: 'missense',
    link: 'https://www.ncbi.nlm.nih.gov/clinvar/variation/17601/',
    description: 'Заменa аминокислоты (Arg→Trp) в MECP2',
  },
  {
    id: 102,
    gene: 'MECP2',
    short_name: 'T158M',
    alt_names: 'Thr158Met',
    type: 'missense',
    link: 'https://www.ncbi.nlm.nih.gov/clinvar/variation/11821/',
    description: 'Заменa аминокислоты (Thr→Met) в MECP2',
  },
  {
    id: 103,
    gene: 'MECP2',
    short_name: 'R168X',
    alt_names: 'Arg168Ter, R168*',
    type: 'nonsense',
    link: 'https://www.ncbi.nlm.nih.gov/clinvar/variation/16376/',
    description: 'Нонсенс‑мутация (стоп‑кодон) в MECP2',
  },
  {
    id: 104,
    gene: 'MECP2',
    short_name: 'R255X',
    alt_names: 'Arg255Ter, R255*',
    type: 'nonsense',
    link: 'https://www.ncbi.nlm.nih.gov/clinvar/variation/16377/',
    description: 'Нонсенс‑мутация (стоп‑кодон) в MECP2',
  },
  {
    id: 105,
    gene: 'MECP2',
    short_name: 'R270X',
    alt_names: 'Arg270Ter, R270*',
    type: 'nonsense',
    link: 'https://www.ncbi.nlm.nih.gov/clinvar/variation/16378/',
    description: 'Нонсенс‑мутация (стоп‑кодон) в MECP2',
  },
  {
    id: 201,
    gene: 'CDKL5',
    short_name: 'c.404_405del',
    alt_names: 'p.Glu135Valfs*20',
    type: 'frameshift',
    link: 'https://www.ncbi.nlm.nih.gov/clinvar/?term=CDKL5%20c.404_405del',
    description: 'Сдвиг рамки считывания в CDKL5',
  },
  {
    id: 202,
    gene: 'FOXG1',
    short_name: 'c.460C>T',
    alt_names: 'p.Arg154Cys',
    type: 'missense',
    link: 'https://www.ncbi.nlm.nih.gov/clinvar/?term=FOXG1%20c.460C%3ET',
    description: 'Замена аминокислоты в FOXG1',
  },
  {
    id: 301,
    gene: 'Другой',
    short_name: 'Индел',
    alt_names: 'Реже встречающиеся варианты',
    type: 'indel',
    link: '',
    description: 'Прочие редкие варианты вне основных генов',
  },
  {
    id: 302,
    gene: 'MECP2',
    short_name: 'ΔExon4',
    alt_names: 'Deletion Exon 4',
    type: 'deletion',
    link: 'https://www.ncbi.nlm.nih.gov/clinvar/?term=MECP2%20exon%204%20deletion',
    description: 'Делеция экзона 4 в MECP2',
  },
];

const MOCK_COUNTS = {
  101: 22,
  102: 18,
  103: 15,
  104: 10,
  105: 7,
  201: 6,
  202: 4,
  301: 3,
  302: 2,
};

export default {
  name: 'PersonalStats',
  components: { OSMMap },
  data() {
    return {
      /** @type {CityPoint[]} */
      points: [],
      mapError: '',
      mapLoading: false,

      displayLimit: 5,
      dict: [],
      countsByMutation: {},
      userMutationId: null,
      dictLoading: false,
      dictError: '',
      usingMocks: false,
      forceMocks: false,
      selectedIds: [],
      includeOthers: true,
    };
  },
  computed: {
    maxDisplayLimit() {
      const MAX_TOP = 10;
      const available = Math.max(2, this.sortedMutations.length);
      return Math.min(MAX_TOP, available);
    },
    totalPatients() {
      const vals = Object.values(this.countsByMutation);
      return vals.reduce((a, b) => a + (Number(b) || 0), 0) || 0;
    },
    enriched() {
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
      const selectedSet = new Set((this.selectedIds || []).map(v => String(v)));

      let chosen = [];
      if (selectedSet.size > 0) {
        chosen = list.filter(m => selectedSet.has(String(m.id)));
      } else {
        const limitRaw = Number(this.displayLimit) || 5;
        const limit = Math.min(Math.max(2, limitRaw), this.maxDisplayLimit);
        chosen = list.slice(0, limit - 1);
      }

      const chosenIds = new Set(chosen.map(m => String(m.id)));
      const rest = list.filter(m => !chosenIds.has(String(m.id)));
      const others = {
        key: 'others',
        id: null,
        short: 'Прочие',
        tooltip: 'Прочие мутации',
        count: rest.reduce((s, x) => s + x.count, 0),
      };
      const bars = chosen.map(m => ({
        key: `m-${m.id}`,
        id: m.id,
        short: m.shortName || m.gene || String(m.id),
        tooltip: m.description || m.shortName || m.gene,
        count: m.count,
      }));

      if (this.includeOthers && others.count > 0) return [...bars, others];
      return bars;
    },
    maxCount() {
      return this.chartItems.reduce((mx, b) => Math.max(mx, b.count), 0) || 1;
    },
  },
  watch: {
    displayLimit(val) {
      const n = Number(val) || 5;
      const clamped = Math.min(Math.max(2, n), this.maxDisplayLimit);
      if (clamped !== this.displayLimit) this.displayLimit = clamped;
    },
  },
  mounted() {
    try {
      const fromEnv =
        (import.meta && import.meta.env && import.meta.env.VITE_USE_MOCKS) ===
        '1';
      const fromQuery =
        new URLSearchParams(window.location.search).get('useMocks') === '1';
      this.forceMocks = !!(fromEnv || fromQuery);
    } catch (_) {
      this.forceMocks = false;
    }
    this.fetchMapPoints();
    this.fetchMutationsDictAndStats();
    this.fetchUserMutation();
  },
  methods: {
    selectAll() {
      this.selectedIds = this.sortedMutations.map(m => m.id);
    },
    clearSelection() {
      this.selectedIds = [];
    },
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
        const raw = Array.isArray(res)
          ? res
          : Array.isArray(res?.items)
            ? res.items
            : Array.isArray(res?.results)
              ? res.results
              : Array.isArray(res?.data)
                ? res.data
                : [];

        const toNumber = v => {
          const n = Number(v);
          return Number.isFinite(n) ? n : 0;
        };
        const getCount = i =>
          toNumber(
            i.count ??
              i.total ??
              i.value ??
              i.num ??
              i.qty ??
              i.questionnaires_count ??
              i.cnt
          );
        const getLat = i =>
          toNumber(
            i.lat ??
              i.latitude ??
              i.city?.lat ??
              i.city?.latitude ??
              i.geo?.lat ??
              i.coords?.lat
          );
        const getLon = i =>
          toNumber(
            i.lon ??
              i.lng ??
              i.longitude ??
              i.city?.lon ??
              i.city?.lng ??
              i.city?.longitude ??
              i.geo?.lon ??
              i.coords?.lon
          );
        const getName = i =>
          i.name ?? i.city_name ?? i.city?.name ?? i.title ?? '';
        const getId = i => i.id ?? i.city_id ?? i.city?.id ?? getName(i);

        this.points = raw
          .filter(
            i => i && (getLat(i) || getLon(i) || getCount(i) || getName(i))
          )
          .map(i => ({
            id: getId(i),
            name: getName(i),
            lat: getLat(i),
            lon: getLon(i),
            count: getCount(i),
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
      if (this.forceMocks) {
        this.dict = MOCK_MUTATIONS;
        this.countsByMutation = { ...MOCK_COUNTS };
        this.usingMocks = true;
        this.dictLoading = false;
        return;
      }
      try {
        const dictRes = await api.accounts.getMutationGenes();
        this.dict = Array.isArray(dictRes?.items) ? dictRes.items : [];

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
          this.countsByMutation = {};
        }

        const hasCounts = Object.values(this.countsByMutation || {}).some(
          n => Number(n) > 0
        );
        if (!this.dict.length || !hasCounts) {
          this.dict = MOCK_MUTATIONS;
          this.countsByMutation = { ...MOCK_COUNTS };
          this.usingMocks = true;
        }
      } catch (e) {
        this.dictError =
          e?.response?.data?.message ||
          e.message ||
          'Не удалось загрузить справочник мутаций';
        this.dict = MOCK_MUTATIONS;
        this.countsByMutation = { ...MOCK_COUNTS };
        this.usingMocks = true;
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
        this.userMutationId = this.usingMocks ? 102 : null;
      }
    },
  },
};
</script>

<style scoped>
.personal-stats {
  max-width: 800px;
  margin: 0 auto;
}

.block-title {
  text-align: center;
}

.card {
  background: #fff;
  border: 1px solid #ececec;
  border-radius: 12px;
  padding: 16px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.04);
  margin: 0 0 24px;
}

.chart-section.card,
.table-section.card {
  max-width: 650px;
  margin-left: auto;
  margin-right: auto;
  font-size: 13px;
  padding: 12px;
  min-width: 280px;
}

.chart-section h3,
.table-section h3 {
  font-size: 18px;
  margin-bottom: 10px;
  margin-top: 0;
}

.chart-controls {
  margin-top: 6px;
  font-size: 12px;
}
.chart-controls input {
  width: 60px;
  padding: 4px 6px;
  border: 1px solid #ddd;
  border-radius: 4px;
  margin-left: 6px;
  font-size: 12px;
}
.control-hint {
  margin-left: 6px;
  color: #777;
  font-size: 11px;
}

.small {
  font-size: 11px;
}

.chart-filters {
  margin-top: 10px;
  display: grid;
  grid-template-columns: 1fr;
  gap: 6px;
  font-size: 12px;
}
.chk-inline {
  display: inline-flex;
  align-items: center;
  gap: 6px;
}
.mutations-select {
  border: 1px dashed #e3e7ea;
  border-radius: 6px;
  padding: 6px;
}
.select-actions {
  display: flex;
  gap: 6px;
  margin-bottom: 6px;
}
.btn.ghost {
  background: #fff;
  color: #23938c;
  border: 1px solid #23938c;
  padding: 4px 8px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 11px;
}
.btn.ghost:hover {
  background: #23938c;
  color: #fff;
}
.checkbox-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: 3px 8px;
  max-height: 150px;
  overflow: auto;
  font-size: 11px;
}
.chk {
  display: inline-flex;
  align-items: center;
  gap: 4px;
}

.bar-chart {
  display: flex;
  align-items: flex-end;
  gap: 8px;
  height: 240px;
  margin-top: 12px;
  border-left: 1px solid #e5e7eb;
  border-bottom: 1px solid #e5e7eb;
  padding: 6px 6px 0 6px;
}
.bar {
  position: relative;
  flex: 1 1 0;
  min-width: 35px;
  background: linear-gradient(180deg, #28b0a5, #23938c);
  border-radius: 4px 4px 0 0;
  display: flex;
  align-items: flex-end;
  justify-content: center;
  transition:
    transform 0.2s ease,
    opacity 0.2s ease;
}
.bar:hover {
  opacity: 0.95;
  transform: translateY(-2px);
}
.bar-value {
  position: absolute;
  top: -18px;
  font-size: 11px;
  color: #333;
}
.bar-label {
  position: absolute;
  bottom: -35px;
  width: 100%;
  text-align: center;
  font-size: 10px;
  color: #333;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.bar-label.self {
  font-weight: 700;
  color: #23938c;
}

.highlight {
  background-color: #f0f9ff;
  font-weight: 600;
}
.muted {
  color: #666;
}

table {
  width: 100%;
  border-collapse: collapse;
}
thead th {
  background: #f8fafb;
  color: #333;
  font-weight: 600;
  font-size: 12px;
}
th,
td {
  padding: 8px 10px;
  border-bottom: 1px solid #eee;
  text-align: left;
  font-size: clamp(8px, 1.8vw, 12px);
}
tbody tr:hover {
  background: #fafafa;
}

.map-section {
  margin-top: 32px;
  margin-bottom: 24px;
}

.map-section h3 {
  font-size: 22px;
  margin-bottom: 16px;
}

@media (max-width: 768px) {
  .bar-chart {
    height: 200px;
    gap: 6px;
  }
  .bar {
    min-width: 28px;
  }
  .bar-label {
    bottom: -30px;
    font-size: 9px;
  }
  .bar-value {
    font-size: 10px;
  }
}

@media (max-width: 664px) {
th,
td {
  word-break: break-all;
}

}
</style>
