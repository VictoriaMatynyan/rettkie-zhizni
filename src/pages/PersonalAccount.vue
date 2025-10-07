<template>
  <div class="personal-account">
    <h1>Личный кабинет</h1>
    <nav class="tabs">
      <div
        class="tabs-list"
        role="tablist"
        aria-label="Навигация личного кабинета"
      >
        <button
          :class="{ active: tab === 'contact' }"
          class="button tab"
          role="tab"
          :aria-selected="tab === 'contact'"
          @click="tab = 'contact'"
        >
          Контактные данные
        </button>
        <button
          :class="{ active: tab === 'children' }"
          class="button tab"
          role="tab"
          :aria-selected="tab === 'children'"
          @click="tab = 'children'"
        >
          Анкеты подопечных
        </button>
        <button
          v-if="showConsentTab"
          :class="{ active: tab === 'consent' }"
          class="button tab"
          @click="
            tab = 'consent';
            loadConsentStatus();
          "
        >
          Согласие
          <span
            v-if="showConsentDot"
            class="notification-dot"
            aria-label="Требуется действие"
          ></span>
        </button>
        <button
          :class="{ active: tab === 'stats' }"
          class="button tab"
          role="tab"
          :aria-selected="tab === 'stats'"
          @click="tab = 'stats'"
        >
          Статистика
        </button>
        <button class="button logout" @click="requestLogout">Выйти</button>
      </div>
      <div class="tabs-select-container">
        <label for="tabs-select" class="sr-only">Раздел</label>
        <select id="tabs-select" v-model="tab" class="tabs-select">
          <option value="contact">Контактные данные</option>
          <option value="children">Анкеты подопечных</option>
          <option v-if="showConsentTab" value="consent">
            Согласие{{ showConsentDot ? ' •' : '' }}
          </option>
          <option value="stats">Статистика</option>
        </select>
        <button class="button logout" @click="requestLogout">Выйти</button>
      </div>
    </nav>
    <component :is="currentTabComponent" />
    <ConfirmModal
      v-model="showLogoutConfirm"
      title="Подтвердите выход"
      message="Вы действительно хотите выйти из аккаунта?"
      confirm-text="Да"
      cancel-text="Отмена"
      @confirm="handleLogout"
      @cancel="cancelLogout"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted, provide } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../stores/auth.js';
import { api } from '../services/api.js';

import ContactForm from '../components/ContactForm.vue';
import ChildrenProfiles from '../components/ChildrenProfiles.vue';
import PersonalStats from '../components/PersonalStats.vue';
import ConsentTab from '../components/ConsentTab.vue';
import ConfirmModal from '../components/ConfirmModal.vue';

const tab = ref('contact');
const router = useRouter();
const authStore = useAuthStore();
const showConsentTab = ref(false);
const showLogoutConfirm = ref(false);
const consentStatus = ref('none'); // 'none' | 'pending' | 'active'

const currentTabComponent = computed(() => {
  switch (tab.value) {
    case 'contact':
      return ContactForm;
    case 'children':
      return ChildrenProfiles;
    case 'consent':
      return ConsentTab;
    case 'stats':
      return PersonalStats;
    default:
      return ContactForm;
  }
});

const showConsentDot = computed(() => {
  return showConsentTab.value && consentStatus.value === 'none';
});

function updateConsentStatus(newStatus) {
  consentStatus.value = newStatus;
}

provide('updateConsentStatus', updateConsentStatus);

async function loadConsentStatus() {
  try {
    const data = await api.accounts.getConsentStatus?.();
    if (data && typeof data.status === 'string') {
      const s = data.status.toLowerCase();
      consentStatus.value =
        s === 'active' ? 'active' : s === 'pending' ? 'pending' : 'none';
    }
  } catch {
    consentStatus.value = 'none';
  }
}

onMounted(async () => {
  try {
    const res = await api.accounts.getMyQuestionnaires();
    const items = Array.isArray(res)
      ? res
      : Array.isArray(res?.items)
        ? res.items
        : [];
    showConsentTab.value = items.length > 0;

    if (showConsentTab.value) {
      await loadConsentStatus();
    }
  } catch (e) {
    showConsentTab.value = false;
  }
});

function requestLogout() {
  showLogoutConfirm.value = true;
}

async function handleLogout() {
  try {
    await authStore.logoutRemote();
  } finally {
    router.push('/');
  }
}

function cancelLogout() {
  showLogoutConfirm.value = false;
}
</script>

<style scoped>
.personal-account {
  max-width: 1050px;
  margin: 0 auto;
  padding: 0 16px 25px;
}

@media (min-width: 768px) {
  .personal-account {
    padding: 0 24px 25px;
  }
}
@media (min-width: 1200px) {
  .personal-account {
    padding: 0 32px 25px;
  }
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
  -webkit-overflow-scrolling: touch;
  white-space: nowrap;
  scrollbar-width: thin;
}

.tabs-select-container {
  display: none;
}
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
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 1px, 1px);
  white-space: nowrap;
  border: 0;
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
  transition:
    background-color 0.2s ease,
    color 0.2s ease,
    border-color 0.2s ease,
    transform 0.2s ease;
  flex: 0 0 auto;
  position: relative;
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
  transition:
    background-color 0.2s ease,
    color 0.2s ease,
    border-color 0.2s ease,
    transform 0.2s ease;
}

.logout:hover {
  background-color: #f44336;
  color: white;
  transform: translateY(0);
}

@media (max-width: 992px) {
  .tab,
  .logout {
    font-size: 13px;
    padding: 6px 12px;
  }
}
@media (max-width: 640px) {
  .tab,
  .logout {
    font-size: 12px;
    padding: 6px 10px;
  }
  .tabs-list {
    display: none;
  }
  .tabs-select-container {
    display: flex;
    align-items: center;
    gap: 10px;
    width: 100%;
    outline: none;
  }
  .tabs-select {
    font-size: 12px;
    padding: 6px 10px;
  }
  .logout {
    margin-left: 0;
  }
}

.notification-dot {
  position: absolute;
  top: -4px;
  right: -4px;
  width: 10px;
  height: 10px;
  background-color: #dc3545;
  border-radius: 50%;
  box-shadow: 0 0 0 2px #fff;
  z-index: 1;
}
</style>
