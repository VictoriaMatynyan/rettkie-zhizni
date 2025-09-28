<template>
  <div class="auth-form-container">
    <div class="auth-form">
      <h2 class="auth-title">Восстановление пароля</h2>
      <form @submit.prevent="handleSubmit">
        <div class="form-group">
          <label for="email" class="form-label">
            Укажите e-mail, который вы использовали при регистрации
          </label>
          <input
            id="email"
            v-model="email"
            type="email"
            class="form-input"
            :class="{ invalid: showEmailError }"
            required
            :disabled="loading"
            placeholder="Введите e-mail"
            @input="onEmailInput"
            @blur="emailTouched = true"
          />
          <p
            class="field-error"
            :class="{ visible: showEmailError }"
            :aria-hidden="!showEmailError"
          >
            {{ emailError }}
          </p>
        </div>
        <button type="submit" class="auth-button" :disabled="loading || !!emailError">
          {{ loading ? 'Отправка...' : 'Восстановить пароль' }}
        </button>
      </form>
      <div class="auth-links">
        <router-link to="/login" class="auth-link">Вернуться к входу</router-link>
      </div>
    </div>
  </div>

  <ConfirmModal
    v-model="showSuccessModal"
    title="Письмо отправлено"
    :message="successMessage"
    :cancel-text="successCancelText"
    :show-cancel="showSuccessCancel"
    @confirm="handleSuccessConfirm"
    @cancel="closeSuccessModal"
  >
    <template #message>
      <p>{{ successMessage }}</p>
      <p v-if="emailServiceUrl" class="modal-email-link">
        <a :href="emailServiceUrl" target="_blank" rel="noopener" class="email-link">
          Перейти к почте {{ trimmedEmail }}
        </a>
      </p>
    </template>
  </ConfirmModal>
  
</template>

<script setup>
import { ref, computed } from 'vue'
import { api } from '../services/api.js'
import ConfirmModal from '../components/ConfirmModal.vue'

const email = ref('')
const errorMessage = ref('')
const successMessage = ref('')
const loading = ref(false)
const emailTouched = ref(false)
const showSuccessModal = ref(false)

// Валидация email
const EMAIL_RE = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i
const trimmedEmail = computed(() => email.value.trim())
const emailError = computed(() => {
  if (!trimmedEmail.value) return 'Введите e-mail'
  if (!EMAIL_RE.test(trimmedEmail.value)) return 'Укажите корректный e-mail (например, ivan@example.com)'
  return ''
})
const showEmailError = computed(() => emailTouched.value && !!emailError.value)
function onEmailInput(e) {
  // убираем пробелы по краям и приводим домен к нижнему регистру
  const val = String(e.target.value).replace(/\s+/g, '')
  email.value = val
}

// карта популярных почтовых доменов
const MAIL_SERVICE_MAP = {
  // Яндекс
  'ya.ru': 'https://mail.yandex.ru/',
  'yandex.ru': 'https://mail.yandex.ru/',
  'yandex.com': 'https://mail.yandex.com/',
  'yandex.kz': 'https://mail.yandex.kz/',
  'yandex.by': 'https://mail.yandex.by/',
  'yandex.ua': 'https://mail.yandex.ua/',

  // Mail.ru-группа
  'mail.ru': 'https://e.mail.ru/inbox/',
  'bk.ru':   'https://e.mail.ru/inbox/',
  'inbox.ru':'https://e.mail.ru/inbox/',
  'list.ru': 'https://e.mail.ru/inbox/',

  // Google
  'gmail.com': 'https://mail.google.com/',
  'googlemail.com': 'https://mail.google.com/',

  // Microsoft
  'outlook.com': 'https://outlook.live.com/',
  'hotmail.com': 'https://outlook.live.com/',
  'live.com':    'https://outlook.live.com/',
  'msn.com':     'https://outlook.live.com/',

  // Apple
  'icloud.com': 'https://www.icloud.com/mail',
  'me.com':     'https://www.icloud.com/mail',
  'mac.com':    'https://www.icloud.com/mail',

  // Rambler
  'rambler.ru':     'https://mail.rambler.ru/',
  'autorambler.ru': 'https://mail.rambler.ru/',
  'lenta.ru':       'https://mail.rambler.ru/',
  'myrambler.ru':   'https://mail.rambler.ru/',
  'ro.ru':          'https://mail.rambler.ru/',

  // Прочие популярные
  'yahoo.com':  'https://mail.yahoo.com/',
  'proton.me':  'https://mail.proton.me/',
  'protonmail.com': 'https://mail.proton.me/',
  'zoho.com':   'https://mail.zoho.com/',
  'gmx.com':    'https://www.gmx.com/',
  'gmx.net':    'https://www.gmx.net/',
  'fastmail.com': 'https://app.fastmail.com/'
}

const emailDomain = computed(() => {
  const m = trimmedEmail.value.match(/@([\w.-]+)/)
  return m ? m[1].toLowerCase() : ''
})

function resolveMailUrl(domain) {
  if (!domain) return null
  // 1) точное соответствие
  if (MAIL_SERVICE_MAP[domain]) return MAIL_SERVICE_MAP[domain]

  // 2) эвристики по вхождению
  if (domain.includes('yandex')) return 'https://mail.yandex.ru/'
  if (domain.includes('mail.ru')) return 'https://e.mail.ru/inbox/'
  if (domain.includes('gmail') || domain.includes('googlemail')) return 'https://mail.google.com/'
  if (domain.includes('outlook') || domain.includes('hotmail') || domain.includes('live') || domain.includes('msn')) {
    return 'https://outlook.live.com/'
  }
  if (domain.includes('rambler')) return 'https://mail.rambler.ru/'
  if (domain.includes('yahoo')) return 'https://mail.yahoo.com/'
  if (domain.includes('proton')) return 'https://mail.proton.me/'

  // 3) фолбэк — не открываем корневой домен, возвращаем null
  return null
}

const emailServiceUrl = computed(() => resolveMailUrl(emailDomain.value))

const successCancelText = computed(() =>
  emailServiceUrl.value ? 'Закрыть' : 'Отмена'
)
const showSuccessCancel = computed(() => !!emailServiceUrl.value)
function closeSuccessModal() {
  showSuccessModal.value = false
}
function handleSuccessConfirm() {
  if (emailServiceUrl.value && typeof window !== 'undefined') {
    try {
      window.open(emailServiceUrl.value, '_blank', 'noopener')
    } catch (_) {}
  }
  closeSuccessModal()
}
const handleSubmit = async () => {
  emailTouched.value = true
  if (emailError.value) return
  errorMessage.value = ''
  successMessage.value = ''
  loading.value = true
  try {
    await api.auth.requestPasswordReset({ email: trimmedEmail.value })
    successMessage.value = 'Инструкция по восстановлению отправлена на указанный e-mail.'
    showSuccessModal.value = true
    // Оставим email для отображения ссылки
    // email.value = ''  — НЕ очищаем!
  } catch (e) {
    errorMessage.value = e?.response?.data?.message || 'Произошла ошибка. Пожалуйста, попробуйте ещё раз.'
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.auth-form-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 60vh;
  padding: 20px;
}

.auth-form {
  background: white;
  padding: 32px 40px;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 420px;
}

.auth-title {
  text-align: center;
  margin-bottom: 24px;
  color: #333;
  font-size: 24px;
}

.form-group { margin-bottom: 16px; }
.form-label { display: block; margin-bottom: 8px; color: #555; }
.form-input {
  width: 100%;
  padding: 12px 16px;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 16px;
  transition: border-color 0.3s ease;
  box-sizing: border-box;
}
.form-input:focus {
  outline: none;
  border-color: #8132ad;
  box-shadow: 0 0 0 3px rgba(129, 50, 173, 0.1);
}
.form-input:disabled { background-color: #f5f5f5; cursor: not-allowed; }
.form-input.invalid {
  border-color: #dc3545;
  box-shadow: 0 0 0 3px rgba(220, 53, 69, 0.08);
}
.field-error {
  color: #dc3545;
  font-size: 13px;
  margin-top: 6px;
  min-height: 18px; /* резервируем место под строку ошибки */
  line-height: 18px;
  visibility: hidden; /* по умолчанию скрыто, но место занято */
}
.field-error.visible {
  visibility: visible;
}

.auth-button {
  width: 100%;
  padding: 12px;
  background-color: #8132ad;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.3s ease;
}
.auth-button:hover:not(:disabled) { background-color: #6b2a91; }
.auth-button:disabled { background-color: #ccc; cursor: not-allowed; }

.error-message {
  background-color: #fee;
  color: #c33;
  padding: 12px;
  border-radius: 8px;
  margin-bottom: 16px;
  text-align: center;
  border: 1px solid #fcc;
}
.auth-links { 
  margin-top: 16px;
  text-align: center;
}
.auth-link {
  color: #8132ad;
  text-decoration: none;
}
.auth-link:hover {
  text-decoration: underline;
}

.email-link {
  color: #23938c;
  font-weight: 500;
  text-decoration: none;
}

.email-link:hover {
  text-decoration: underline;
}

.modal-email-link {
  margin-top: 12px;
}
</style>
