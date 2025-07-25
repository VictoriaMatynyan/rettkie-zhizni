<template>
  <div class="personal-account">
    <h1>Личный кабинет</h1>
    <nav class="tabs">
      <button
        :class="{ active: tab === 'contact' }"
        class="button tab"
        @click="tab = 'contact'"
      >
        Контактные данные
      </button>
      <button
        :class="{ active: tab === 'children' }"
        class="button tab"
        @click="tab = 'children'"
      >
        Анкеты подопечных
      </button>
      <button
        :class="{ active: tab === 'stats' }"
        class="button tab"
        @click="tab = 'stats'"
      >
        Статистика
      </button>
      <button class="button logout" @click="logout">Выйти</button>
    </nav>
    <component :is="currentTabComponent" />
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import ContactForm from '../components/ContactForm.vue';
import ChildrenProfiles from '../components/ChildrenProfiles.vue';
import PersonalStats from '../components/PersonalStats.vue';

const tab = ref('contact');

const currentTabComponent = computed(() => {
  switch (tab.value) {
    case 'contact':
      return ContactForm;
    case 'children':
      return ChildrenProfiles;
    case 'stats':
      return PersonalStats;
    default:
      return ContactForm;
  }
});

function logout() {
  // заглушка: тут будет удаление токена, редирект и т.д.
  alert('Выход из аккаунта...');
}
</script>

<style scoped>
.personal-account {
  max-width: 1050px;
  width: 100vw;
  margin: 0 auto;
  padding: 0;
}

.tabs {
  display: flex;
  gap: 12px;
  margin-bottom: 0;
  flex-wrap: wrap;
}

.tabs .button {
  padding: 8px 16px;
  background: transparent;
  border-radius: 6px;
  cursor: pointer;
}

.tabs .button.active {
  background-color: #2aaea2;
  color: white;
}

.tab {
  border: none;
  border-bottom: 1px solid rgba(42, 174, 162, 0.5);
  font-size: 14px;
}

.tab:hover {
  background-color: rgba(42, 174, 162, 0.4);
  border-bottom: 1px solid rgba(42, 174, 162, 0.1);
}

.logout {
  margin-left: auto;
  background-color: #f44336;
  border: none;
  border-bottom: 1px solid rgba(244, 67, 54, 0.5);
  font-size: 14px;
}

.logout:hover {
  background-color: #f44336;
  color: white;
}
</style>
