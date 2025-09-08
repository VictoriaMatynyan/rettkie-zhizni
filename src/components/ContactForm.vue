<template>
  <div class="contact-form">
    <h2>Изменить контактные данные</h2>

    <form @submit.prevent="handleSubmit">
      <div class="form-group">
        <label class="with-action">
          Имя
          <span v-if="showHelp.first_name" class="help-text"
            >Изменить ваше имя</span
          >
          <div class="input-row">
            <input
              v-model="form.first_name"
              type="text"
              required
              :disabled="!active.first_name"
            />
            <button
              type="button"
              class="edit-icon"
              :aria-pressed="active.first_name"
              :title="
                active.first_name ? 'Завершить редактирование' : 'Редактировать'
              "
              @click="toggleActive('first_name')"
            ></button>
          </div>
        </label>
      </div>

      <div class="form-group">
        <label class="with-action">
          Фамилия
          <span v-if="showHelp.last_name" class="help-text"
            >Изменить вашу фамилию</span
          >
          <div class="input-row">
            <input
              v-model="form.last_name"
              type="text"
              required
              :disabled="!active.last_name"
            />
            <button
              type="button"
              class="edit-icon"
              :aria-pressed="active.last_name"
              :title="
                active.last_name ? 'Завершить редактирование' : 'Редактировать'
              "
              @click="toggleActive('last_name')"
            ></button>
          </div>
        </label>
      </div>

      <div class="form-group">
        <label class="with-action">
          E-mail
          <span v-if="showHelp.email" class="help-text"
            >Используется для связи и уведомлений</span
          >
          <div class="input-row">
            <input
              v-model="form.email"
              type="email"
              required
              :disabled="!active.email"
            />
            <button
              type="button"
              class="edit-icon"
              :aria-pressed="active.email"
              :title="
                active.email ? 'Завершить редактирование' : 'Редактировать'
              "
              @click="toggleActive('email')"
            ></button>
          </div>
        </label>
      </div>

      <div class="form-group">
        <label class="with-action">
          Телефон
          <span v-if="showHelp.phone" class="help-text"
            >В формате +7 (999) 999-99-99</span
          >
          <div class="input-row">
            <input
              id="phone"
              v-model="form.phone"
              v-mask="'+7 (###) ###-##-##'"
              name="phone"
              type="tel"
              required
              inputmode="numeric"
              placeholder="+7 (___) ___-__-__"
              autocomplete="tel"
              :disabled="!active.phone"
            />
            <button
              type="button"
              class="edit-icon"
              :aria-pressed="active.phone"
              :title="
                active.phone ? 'Завершить редактирование' : 'Редактировать'
              "
              @click="toggleActive('phone')"
            ></button>
          </div>
        </label>
      </div>
      <div class="form-group notications">
        <label>
          <input
            id="email_notifications"
            :checked="form.email_notifications"
            type="checkbox"
            name="email_notifications"
            :disabled="emailNotifLoading"
            aria-busy="emailNotifLoading"
            @change="onEmailNotifToggle"
          />

          <span v-if="showHelp.email_notifications" class="label-text">
            Получать важные новости на почту
          </span>
        </label>
      </div>

      <button type="submit" class="save-button">Сохранить</button>
    </form>

    <div v-if="submitted" class="success-message">
      Данные успешно сохранены!
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue';
import { useAuthStore } from '../stores/auth.js';

const authStore = useAuthStore();

const form = ref({
  email_notifications: false,
  first_name: '',
  last_name: '',
  email: '',
  phone: '',
});

const submitted = ref(false);
const emailNotifLoading = ref(false);
const active = ref({
  first_name: false,
  last_name: false,
  email: false,
  phone: false,
});

const showHelp = {
  email_notifications: true,
  first_name: true,
  last_name: true,
  email: true,
  phone: true,
};

function syncFormFromUser() {
  const u = authStore.user || {};
  form.value.first_name = u.first_name ?? u.firstName ?? '';
  form.value.last_name = u.last_name ?? u.lastName ?? '';
  form.value.email = u.email || '';
  form.value.phone = u.phone || '';
  if (typeof u.email_notifications === 'boolean') {
    form.value.email_notifications = u.email_notifications;
  }
}

watch(
  () => authStore.user,
  () => syncFormFromUser(),
  { immediate: true }
);

onMounted(async () => {
  if (authStore.isAuthenticated && !authStore.user) {
    try {
      await authStore.fetchUserProfile();
    } catch {}
  }
  syncFormFromUser();
});

function toggleActive(key) {
  active.value[key] = !active.value[key];
}

function buildActivePayload(extra = {}) {
  const payload = { ...extra };
  if (active.value.first_name) payload.first_name = form.value.first_name;
  if (active.value.last_name) payload.last_name = form.value.last_name;
  if (active.value.email) payload.email = form.value.email;
  if (active.value.phone) payload.phone = form.value.phone;
  return payload;
}

async function handleSubmit() {
  try {
    authStore.clearError();
    const payload = buildActivePayload();
    if (Object.keys(payload).length === 0) {
      console.debug('[ContactForm] handleSubmit: no active fields');
      return;
    }
    console.debug('[ContactForm] handleSubmit payload', payload);
    await authStore.updateProfile(payload, { force: true });
    submitted.value = true;
    setTimeout(() => (submitted.value = false), 5000);
  } catch (e) {
    console.error('[ContactForm] handleSubmit error', e);
  }
}

async function onEmailNotifToggle(e) {
  const desired = e?.target?.checked ?? !form.value.email_notifications;
  emailNotifLoading.value = true;
  try {
    const payload = buildActivePayload({ email_notifications: desired });
    const user = await authStore.updateProfile(payload, { force: true });
    form.value.email_notifications = !!(user && user.email_notifications);
  } catch (err) {
    if (e && e.target) e.target.checked = form.value.email_notifications;
  } finally {
    emailNotifLoading.value = false;
  }
}
</script>

<style scoped>
.contact-form {
  display: flex;
  flex-direction: column;
  max-width: 600px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.input-row {
  display: flex;
  align-items: center;
  gap: 4px;
}

.notications {
  margin-top: 15px;
}

.label-text {
  font-weight: 600;
  margin-bottom: 4px;
}

input[type='text'],
input[type='email'],
input[type='tel'] {
  padding: 8px;
  font-size: 16px;
  border: 1px solid #ccc;
  border-radius: 6px;
}

input[disabled] {
  background: #f7f7f7;
  color: #777;
}

.help-text {
  display: block;
  font-size: 12px;
  color: #666;
  margin-bottom: 4px;
}

.save-button {
  margin-top: 16px;
  background-color: #2aaea2;
  color: white;
  border: none;
  padding: 10px 16px;
  font-size: 16px;
  border-radius: 6px;
  cursor: pointer;
}

.save-button:hover {
  background-color: #23938c;
}

.success-message {
  margin-top: 12px;
  color: #2aaea2;
  font-weight: 500;
}

input[type='checkbox'] {
  margin: 0;
  cursor: pointer;
}

.edit-icon {
  width: 24px;
  height: 24px;
  border: none;
  padding: 0;
  background: url('../assets/edit-icon.png') no-repeat center/16px 16px;
  cursor: pointer;
}
.edit-icon:hover,
.edit-icon[aria-pressed='true'] {
  background-image: url('../assets/edit-icon-hover.png');
  background-color: #23938c;
  border-radius: 4px;
}
</style>
