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

const touched = ref({
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
  // Настройка уведомлений: используем только email_notifications с бэкенда
  if (typeof u.email_notifications === 'boolean') {
    form.value.email_notifications = u.email_notifications;
  }
}

// Обновляем поля, когда меняется пользователь
watch(
  () => authStore.user,
  () => syncFormFromUser(),
  { immediate: true }
);

onMounted(async () => {
  // На всякий случай подтягиваем профиль, если есть токен, а пользователя ещё нет
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

// Оригинальные значения из профиля для сравнения
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
  email_notifications: !!authStore.user?.email_notifications,
}));

const dirty = computed(() => ({
  first_name:
    (form.value.first_name || '').trim() !== original.value.first_name,
  last_name: (form.value.last_name || '').trim() !== original.value.last_name,
  email: trimmedEmail.value !== original.value.email,
  phone: (form.value.phone || '').trim() !== original.value.phone,
  email_notifications:
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
  // Ожидаем 11 цифр: 7XXXXXXXXXX
  if (!digitsPhone.value) return 'Введите номер телефона';
  if (digitsPhone.value.length !== 11 || !/^7\d{10}$/.test(digitsPhone.value)) {
    return 'Введите номер в формате +7 (999) 999-99-99';
  }
  return '';
});
// Чекбокс необязателен, поэтому ошибок для него нет
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
  // Убираем пробелы внутри/по краям
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
// чекбокс необязательный — отдельной обработки не требуется

async function handleSubmit() {
  try {
    authStore.clearError();
    // Отправляем только изменённые поля
    const payload = {};
    if (dirty.value.first_name)
      payload.first_name = form.value.first_name.trim();
    if (dirty.value.last_name) payload.last_name = form.value.last_name.trim();
    if (dirty.value.email) payload.email = trimmedEmail.value;
    if (dirty.value.phone) payload.phone = form.value.phone.trim();
    if (dirty.value.email_notifications)
      payload.email_notifications = !!form.value.email_notifications;

    await authStore.updateProfile(payload);
    submitted.value = true;
    setTimeout(() => (submitted.value = false), 5000);
  } catch (e) {
    // Ошибка уже хранится в authStore.error, можно дополнительно показать alert
  }
}
</script>

<style scoped>
.contact-form {
  display: flex;
  flex-direction: column;
  max-width: 800px;
  margin: 0 auto;
}

.form-group {
  display: flex;
  flex-direction: column;
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

.form-input.invalid {
  border-color: #dc3545;
  box-shadow: 0 0 0 3px rgba(220, 53, 69, 0.08);
}

.field-error {
  color: #dc3545;
  font-size: 12px;
  margin: 5px 0;
  min-height: 10px;
  line-height: 12px;
  visibility: hidden;
}
.field-error.visible {
  visibility: visible;
}

.save-button:disabled {
  opacity: 0.7;
  cursor: not-allowed;
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
</style>
