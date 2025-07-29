<!-- Пример использования API в Vue компоненте -->
<template>
  <div class="api-example">
    <h3>Пример работы с API</h3>

    <!-- Загрузка -->
    <div v-if="loading" class="loading">Загрузка...</div>

    <!-- Ошибка -->
    <div v-else-if="error" class="error">Ошибка: {{ error }}</div>

    <!-- Данные -->
    <div v-else>
      <h4>Дети из API:</h4>
      <ul v-if="children.length">
        <li v-for="child in children" :key="child.id">
          {{ child.firstName }} {{ child.lastName }} ({{ child.gender }})
        </li>
      </ul>
      <p v-else>Нет данных</p>
    </div>

    <!-- Тестовые кнопки -->
    <div class="actions">
      <button @click="loadChildren">Обновить данные</button>
      <button @click="addTestChild">Добавить тестового ребенка</button>
    </div>
  </div>
</template>

<script>
import { api } from '../services/api.js';

export default {
  name: 'ApiExample',
  data() {
    return {
      children: [],
      loading: false,
      error: null,
    };
  },
  async mounted() {
    await this.loadChildren();
  },
  methods: {
    async loadChildren() {
      this.loading = true;
      this.error = null;

      try {
        this.children = await api.children.getAll();
      } catch (error) {
        this.error = error.message;
        console.error('Ошибка загрузки детей:', error);
      } finally {
        this.loading = false;
      }
    },

    async addTestChild() {
      const newChild = {
        lastName: 'Тестов',
        firstName: 'Тест',
        gender: 'м',
        birthDate: '2020-01-01',
      };

      try {
        await api.children.create(newChild);
        await this.loadChildren(); // Обновляем список
      } catch (error) {
        this.error = error.message;
        console.error('Ошибка создания ребенка:', error);
      }
    },
  },
};
</script>

<style scoped>
.api-example {
  padding: 20px;
  border: 1px solid #ddd;
  border-radius: 8px;
  margin: 20px 0;
}

.loading {
  color: #666;
  font-style: italic;
}

.error {
  color: red;
  font-weight: bold;
}

.actions {
  margin-top: 15px;
}

.actions button {
  margin-right: 10px;
  padding: 8px 16px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.actions button:hover {
  background-color: #0056b3;
}
</style>
