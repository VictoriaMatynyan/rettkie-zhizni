<template>
  <div class="personal-account">
    <h1>Личный кабинет</h1>
    <nav class="tabs">
      <div class="tabs-list" role="tablist" aria-label="Навигация личного кабинета">
        <button
          :class="{ active: tab === 'contact' }"
          class="button tab"
          @click="tab = 'contact'"
          role="tab"
          :aria-selected="tab === 'contact'"
        >
          Контактные данные
        </button>
        <button
          :class="{ active: tab === 'children' }"
          class="button tab"
          @click="tab = 'children'"
          role="tab"
          :aria-selected="tab === 'children'"
        >
          Анкеты подопечных
        </button>
        <button
          :class="{ active: tab === 'stats' }"
          class="button tab"
          @click="tab = 'stats'"
          role="tab"
          :aria-selected="tab === 'stats'"
        >
          Статистика
        </button>
        <button class="button logout" @click="handleLogout">Выйти</button>
      </div>
      <div class="tabs-select-container">
        <label for="tabs-select" class="sr-only">Раздел</label>
        <select id="tabs-select" class="tabs-select" v-model="tab">
          <option value="contact">Контактные данные</option>
          <option value="children">Анкеты подопечных</option>
          <option value="stats">Статистика</option>
        </select>
        <button class="button logout" @click="handleLogout">Выйти</button>
      </div>
    </nav>
    <component :is="currentTabComponent" />
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../stores/auth.js';

import ContactForm from '../components/ContactForm.vue';
import ChildrenProfiles from '../components/ChildrenProfiles.vue';
import PersonalStats from '../components/PersonalStats.vue';

const tab = ref('contact');
const router = useRouter();
const authStore = useAuthStore();

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

async function handleLogout() {
  await authStore.logoutRemote();
  router.push('/');
}
</script>

<style scoped>
.personal-account {
  max-width: 1050px;
  margin: 0 auto;
  padding: 0 16px 25px; /* горизонтальные отступы как в App.vue */
}

@media (min-width: 768px) {
  .personal-account { padding: 0 24px 25px; }
}
@media (min-width: 1200px) {
  .personal-account { padding: 0 32px 25px; }
}

.tabs {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 0;
}

.tabs-list {
  display: flex;
  gap: 12px;
  flex: 1;
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
  white-space: nowrap;
  scrollbar-width: thin;
}

.tabs-select-container { display: none; }
.tabs-select {
  flex: 1;
  padding: 8px 10px;
  border: 1px solid rgba(42, 174, 162, 0.5);
  border-radius: 6px;
  background: #fff;
  font-size: 14px;
  outline: none;
}
.sr-only {
  position: absolute;
  width: 1px; height: 1px;
  padding: 0; margin: -1px;
  overflow: hidden; clip: rect(0,0,1px,1px);
  white-space: nowrap; border: 0;
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
  transition: background-color 0.2s ease, color 0.2s ease,
              border-color 0.2s ease, transform 0.2s ease;
  flex: 0 0 auto;
}

.tab:hover {
  background-color: rgba(42, 174, 162, 0.4);
  border-bottom: 1px solid rgba(42, 174, 162, 0.1);
  transform: translateY(0);
}

.logout {
  margin-left: auto;
  background-color: #d4392e;
  border: none;
  border-bottom: 1px solid rgba(244, 67, 54, 0.5);
  font-size: 14px;
  transition: background-color 0.2s ease, color 0.2s ease,
              border-color 0.2s ease, transform 0.2s ease;
}

.logout:hover {
  background-color: #f44336;
  color: white;
  transform: translateY(0);
}

@media (max-width: 992px) {
  .tab, .logout { font-size: 13px; padding: 6px 12px; }
}
@media (max-width: 640px) {
  .tab, .logout { font-size: 12px; padding: 6px 10px; }
  .tabs-list { display: none; }
  .tabs-select-container {
    display: flex;
    align-items: center;
    gap: 10px;
    width: 100%;
    outline: none;
  }
  .tabs-select { font-size: 12px; padding: 6px 10px; }
  .logout { margin-left: 0; }
}
</style>
