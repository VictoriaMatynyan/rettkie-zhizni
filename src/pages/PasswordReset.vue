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
            required
            :disabled="loading"
            placeholder="Введите e-mail"
          />
        </div>
        <div v-if="successMessage" class="success-message">
          {{ successMessage }}
          <div v-if="emailServiceUrl" class="go-to-email">
            <a :href="emailServiceUrl" target="_blank" rel="noopener" class="email-link">
              Перейти к почте {{ email }}
            </a>
          </div>
        </div>
        <button type="submit" class="auth-button" :disabled="loading">
          {{ loading ? 'Отправка...' : 'Восстановить пароль' }}
        </button>
      </form>
      <div class="auth-links">
        <router-link to="/login" class="auth-link">Вернуться к входу</router-link>
      </div>
    </div>
  </div>
  
</template>

<script setup>
import { ref, computed } from 'vue'
import { api } from '../services/api.js'

const email = ref('')
const errorMessage = ref('')
const successMessage = ref('')
const loading = ref(false)

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
  const m = email.value.match(/@([\w.-]+)/)
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
const handleSubmit = async () => {
  errorMessage.value = ''
  successMessage.value = ''
  loading.value = true
  try {
    await api.auth.requestPasswordReset({ email: email.value })
    successMessage.value = 'Инструкция по восстановлению отправлена на указанный e-mail.'
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
.success-message {
  background-color: #e8f8f2;
  color: #0f8a66;
  padding: 12px;
  border-radius: 8px;
  margin-bottom: 16px;
  text-align: center;
  border: 1px solid #bde9dc;
}

.open-mail { margin-top: 10px; }

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

.go-to-email {
  margin-top: 12px;
}

.email-link {
  color: #23938c;
  font-weight: 500;
  text-decoration: none;
}

.email-link:hover {
  text-decoration: underline;
}
</style>
