<template>
  <div class="contact-form">
    <h2>Изменить контактные данные</h2>

    <form @submit.prevent="handleSubmit">
      <div class="form-group">
        <label>
          Имя
          <span v-if="showHelp.first_name" class="help-text"
            >Изменить ваше имя</span
          >
          <input
            v-model="form.first_name"
            type="text"
            class="form-input"
            :class="{ invalid: touched.first_name && !!firstNameError }"
            @blur="onBlur('first_name')"
          />
          <p
            class="field-error"
            :class="{ visible: touched.first_name && !!firstNameError }"
          >
            {{ firstNameError }}
          </p>
        </label>
      </div>

      <div class="form-group">
        <label>
          Фамилия
          <span v-if="showHelp.last_name" class="help-text"
            >Изменить вашу фамилию</span
          >
          <input
            v-model="form.last_name"
            type="text"
            class="form-input"
            :class="{ invalid: touched.last_name && !!lastNameError }"
            @blur="onBlur('last_name')"
          />
          <p
            class="field-error"
            :class="{ visible: touched.last_name && !!lastNameError }"
          >
            {{ lastNameError }}
          </p>
        </label>
      </div>

      <div class="form-group">
        <label>
          E-mail
          <span v-if="showHelp.email" class="help-text"
            >Используется для связи и уведомлений</span
          >
          <input
            v-model="form.email"
            type="email"
            class="form-input"
            :class="{ invalid: touched.email && !!emailError }"
            @input="onEmailInput"
            @blur="onBlur('email')"
          />
          <p
            class="field-error"
            :class="{ visible: touched.email && !!emailError }"
          >
            {{ emailError }}
          </p>
        </label>
      </div>

      <div class="form-group">
        <label>
          Телефон
          <span v-if="showHelp.phone" class="help-text"
            >В формате +7 (999) 999-99-99</span
          >
          <input
            id="phone"
            v-model="form.phone"
            v-mask="'+7 (###) ###-##-##'"
            name="phone"
            type="tel"
            class="form-input"
            :class="{ invalid: touched.phone && !!phoneError }"
            inputmode="numeric"
            placeholder="+7 (___) ___-__-__"
            autocomplete="tel"
            @blur="onBlur('phone')"
          />
          <p
            class="field-error"
            :class="{ visible: touched.phone && !!phoneError }"
          >
            {{ phoneError }}
          </p>
        </label>
      </div>
      <div class="form-group notications">
        <label>
          <input
            id="email_notifications"
            v-model="form.email_notifications"
            type="checkbox"
            name="email_notifications"
            @change="onEmailNotificationsChange"
          />

          <span v-if="showHelp.email_notifications" class="label-text">
            Получать важные новости на почту
          </span>
        </label>
      </div>

      <button type="submit" class="save-button" :disabled="!canSave">
        Сохранить
      </button>
    </form>

    <div v-if="submitted" class="success-message">
      Данные успешно сохранены!
    </div>

    <div v-if="showError" class="error-message">
      Произошла ошибка при сохранении данных. Попробуйте еще раз.
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue';
import { useAuthStore } from '../stores/auth.js';

const authStore = useAuthStore();

const form = ref({
  email_notifications: true,
  first_name: '',
  last_name: '',
  email: '',
  phone: '',
});

const submitted = ref(false);
const showError = ref(false);

const touched = ref({
  first_name: false,
  last_name: false,
  email: false,
  phone: false,
  email_notifications: false,
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
  if (typeof u.receive_news === 'boolean') {
    form.value.email_notifications = u.receive_news;
  } else if (typeof u.email_notifications === 'boolean') {
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

const EMAIL_RE = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
const trimmedEmail = computed(() => (form.value.email || '').trim());
const digitsPhone = computed(() =>
  String(form.value.phone || '').replace(/\D/g, '')
);

const original = computed(() => ({
  first_name: (
    authStore.user?.first_name ??
    authStore.user?.firstName ??
    ''
  ).trim(),
  last_name: (
    authStore.user?.last_name ??
    authStore.user?.lastName ??
    ''
  ).trim(),
  email: (authStore.user?.email || '').trim(),
  phone: (authStore.user?.phone || '').trim(),
  email_notifications: !!(
    authStore.user?.receive_news ?? authStore.user?.email_notifications
  ),
}));

const dirty = computed(() => ({
  first_name:
    (form.value.first_name || '').trim() !== original.value.first_name,
  last_name: (form.value.last_name || '').trim() !== original.value.last_name,
  email: trimmedEmail.value !== original.value.email,
  phone: (form.value.phone || '').trim() !== original.value.phone,
  email_notifications:
    touched.value.email_notifications &&
    !!form.value.email_notifications !== original.value.email_notifications,
}));

const firstNameError = computed(() => {
  if (!dirty.value.first_name) return '';
  if (!form.value.first_name?.trim()) return 'Введите имя';
  return '';
});
const lastNameError = computed(() => {
  if (!dirty.value.last_name) return '';
  if (!form.value.last_name?.trim()) return 'Введите фамилию';
  return '';
});
const emailError = computed(() => {
  if (!dirty.value.email) return '';
  if (!trimmedEmail.value) return 'Введите e-mail';
  if (!EMAIL_RE.test(trimmedEmail.value))
    return 'Укажите e-mail в формате имя@домен (например, ivan@example.com)';
  return '';
});
const phoneError = computed(() => {
  if (!dirty.value.phone) return '';
  if (!digitsPhone.value) return 'Введите номер телефона';
  if (digitsPhone.value.length !== 11 || !/^7\d{10}$/.test(digitsPhone.value)) {
    return 'Введите номер в формате +7 (999) 999-99-99';
  }
  return '';
});
const hasErrors = computed(
  () =>
    !!(
      firstNameError.value ||
      lastNameError.value ||
      emailError.value ||
      phoneError.value
    )
);
const isDirty = computed(() => Object.values(dirty.value).some(Boolean));
const canSave = computed(() => isDirty.value && !hasErrors.value);

function onEmailInput(e) {
  form.value.email = String(e.target.value).replace(/\s+/g, '');
}
function onBlur(field) {
  touched.value[field] = true;
  if (
    field === 'first_name' ||
    field === 'last_name' ||
    field === 'email' ||
    field === 'phone'
  ) {
    form.value[field] = (form.value[field] || '').trim();
  }
}

function onEmailNotificationsChange() {
  touched.value.email_notifications = true;
}

async function handleSubmit() {
  try {
    authStore.clearError();
    const payload = {};
    if (dirty.value.first_name)
      payload.first_name = form.value.first_name.trim();
    if (dirty.value.last_name) payload.last_name = form.value.last_name.trim();
    if (dirty.value.email) payload.email = trimmedEmail.value;
    if (dirty.value.phone) payload.phone = form.value.phone.trim();
    if (dirty.value.email_notifications)
      payload.receive_news = !!form.value.email_notifications;

    await authStore.updateProfile(payload);
    submitted.value = true;
    setTimeout(() => (submitted.value = false), 5000);
  } catch (e) {
    showError.value = true;
    setTimeout(() => (showError.value = false), 5000);
  }
}
</script>

<style scoped>
.contact-form {
  display: flex;
  flex-direction: column;
  max-width: 720px;
  margin: 0 auto 40px;
  padding: 0 clamp(16px, 5vw, 40px) clamp(16px, 5vw, 30px);
  border-radius: 12px;
  background: #fff;
  box-shadow: 0 10px 30px rgba(25, 118, 210, 0.05);
  gap: clamp(12px, 2vw, 20px);
}

.contact-form h2 {
  font-size: clamp(22px, 3.2vw, 30px);
  margin: 0;
}

.contact-form form {
  display: grid;
  row-gap: clamp(10px, 3vw, 12px);
  column-gap: clamp(12px, 3vw, 25px);
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: clamp(6px, 1.5vw, 10px);
}

.form-group label {
  display: flex;
  flex-direction: column;
  gap: clamp(6px, 1.5vw, 10px);
  font-size: clamp(14px, 2.1vw, 14px);
}

.notications {
  grid-column: 1 / -1;
  margin-top: clamp(4px, 1vw, 12px);
}

.notications label {
  flex-direction: row;
  align-items: center;
  gap: clamp(8px, 2vw, 10px);
}

.label-text {
  font-weight: 600;
  display: inline-flex;
  align-items: center;
}

input[type='text'],
input[type='email'],
input[type='tel'] {
  padding: clamp(10px, 2.6vw, 10px);
  font-size: clamp(15px, 2.2vw, 15px);
  border: 1px solid #c7cfda;
  border-radius: 8px;
  transition:
    border-color 0.2s ease,
    box-shadow 0.2s ease;
}

input[type='text']:focus,
input[type='email']:focus,
input[type='tel']:focus {
  outline: none;
  border-color: #2aaea2;
  box-shadow: 0 0 0 3px rgba(42, 174, 162, 0.12);
}

.form-input.invalid {
  border-color: #dc3545;
  box-shadow: 0 0 0 3px rgba(220, 53, 69, 0.08);
}

.field-error {
  color: #dc3545;
  font-size: 12px;
  margin: 2px 0 0;
  min-height: 16px;
  line-height: 1.3;
  visibility: hidden;
}
.field-error.visible {
  visibility: visible;
}

.save-button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.help-text {
  display: block;
  font-size: clamp(11px, 1.8vw, 13px);
  color: #6b7485;
}

.save-button {
  grid-column: 1 / -1;
  justify-self: start;
  background-color: #2aaea2;
  color: #fff;
  border: none;
  padding: clamp(10px, 3vw, 12px) clamp(18px, 4vw, 24px);
  margin-top: 10px;
  font-size: clamp(15px, 2.3vw, 17px);
  border-radius: 8px;
  cursor: pointer;
  transition:
    background-color 0.2s ease,
    box-shadow 0.2s ease;
}

.save-button:hover {
  background-color: #23938c;
  box-shadow: 0 4px 12px rgba(42, 174, 162, 0.25);
}

.success-message {
  margin-top: clamp(10px, 2vw, 16px);
  color: #2aaea2;
  font-weight: 500;
}

.error-message {
  margin-top: clamp(10px, 2vw, 16px);
  color: #dc3545;
  font-weight: 500;
}

input[type='checkbox'] {
  margin: 0;
  cursor: pointer;
  width: clamp(16px, 3vw, 16px);
  height: clamp(16px, 3vw, 16px);
}

@media (max-width: 690px) {
  .contact-form {
    padding: clamp(16px, 6vw, 28px);
    padding-left: 0;
    box-shadow: none;
  }

  .notications label {
    align-items: flex-start;
  }

  .save-button {
    width: 100%;
    justify-self: stretch;
    text-align: center;
  }
}

@media (min-width: 920px) {
  .contact-form {
    max-width: 820px;
  }

  .contact-form form {
    grid-template-columns: repeat(2, minmax(280px, 1fr));
  }
}
</style>
