<template>
  <div class="auth-form-container">
    <div class="auth-form">
      <h2 class="auth-title">Сброс пароля</h2>

      <div v-if="!hasTokens" class="error-message">
        Отсутствуют параметры для сброса пароля. Пожалуйста, перейдите по ссылке из письма
        или запросите восстановление ещё раз.
      </div>

      <form @submit.prevent="handleSubmit">
        <div class="form-group">
          <label for="password" class="form-label">Новый пароль</label>
          <input
            id="password"
            v-model.trim="password"
            :type="showPassword ? 'text' : 'password'"
            class="form-input"
            :disabled="loading || !hasTokens"
            placeholder="Введите новый пароль"
            required
            minlength="8"
            autocomplete="new-password"
          />
        </div>

        <div class="form-group">
          <label for="password2" class="form-label">Подтверждение пароля</label>
          <input
            id="password2"
            v-model.trim="password2"
            :type="showPassword ? 'text' : 'password'"
            class="form-input"
            :disabled="loading || !hasTokens"
            placeholder="Повторите пароль"
            required
            minlength="8"
            autocomplete="new-password"
          />
        </div>

        <div class="form-group" style="margin-top:-8px;">
          <label class="form-label" style="display:flex;align-items:center;gap:8px;cursor:pointer;user-select:none;">
            <input type="checkbox" v-model="showPassword" /> Показать пароль
          </label>
        </div>

        <div v-if="localValidationError" class="error-message">{{ localValidationError }}</div>
        <div v-if="errorMessage" class="error-message">{{ errorMessage }}</div>
        <div v-if="successMessage" class="success-message">{{ successMessage }}</div>

        <button type="submit" class="auth-button" :disabled="loading || !hasTokens">
          {{ loading ? 'Сохранение...' : 'Сохранить новый пароль' }}
        </button>
      </form>

      <div class="auth-links">
        <router-link v-if="successMessage" to="/login" class="auth-link">
          Перейти ко входу
        </router-link>
        <router-link v-else to="/password-reset" class="auth-link">
          Запросить ссылку ещё раз
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRoute } from 'vue-router'
import { api } from '../services/api.js'

// поддерживаем оба варианта: params и query
const route = useRoute()
const uid = ref(route.params.uid || route.query.uid || '')
const token = ref(route.params.token || route.query.token || '')

const password = ref('')
const password2 = ref('')
const showPassword = ref(false)
const loading = ref(false)
const errorMessage = ref('')
const successMessage = ref('')
const localValidationError = ref('')

const hasTokens = computed(() => !!uid.value && !!token.value)

function validate() {
  localValidationError.value = ''
  if (password.value.length < 8) {
    localValidationError.value = 'Пароль должен содержать не менее 8 символов.'
    return false
  }
  // При желании можно усилить требования:
  // if (!/[A-ZА-Я]/.test(password.value) || !/[a-zа-я]/.test(password.value) || !/\d/.test(password.value)) { ... }

  if (password.value !== password2.value) {
    localValidationError.value = 'Пароли не совпадают.'
    return false
  }
  return true
}

async function handleSubmit() {
  errorMessage.value = ''
  successMessage.value = ''
  if (!validate()) return
  if (!hasTokens.value) {
    errorMessage.value = 'Отсутствуют данные для сброса пароля.'
    return
  }
  loading.value = true
  try {
    const payload = {
      uid: uid.value,
      token: token.value,
      password: password.value,
      password_confirm: password2.value, // если бек не требует — уберём
    }

    await api.auth.confirmPasswordReset(payload)

    successMessage.value = 'Пароль успешно обновлён. Теперь вы можете войти.'
    password.value = ''
    password2.value = ''
  } catch (e) {
    // обработаем типичные ответы
    const serverMsg = e?.response?.data?.message
      || e?.response?.data?.detail
      || e?.response?.data?.errors
      || e?.message

    // возможные кейсы: "invalid token", "token expired", "uid invalid"
    if (typeof serverMsg === 'string') {
      errorMessage.value = serverMsg
    } else if (serverMsg && typeof serverMsg === 'object') {
      // если бек вернул объект с полями ошибок
      errorMessage.value = Object.values(serverMsg).flat().join(', ')
    } else {
      errorMessage.value = 'Не удалось обновить пароль. Попробуйте ещё раз.'
    }
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

.auth-links { margin-top: 16px; text-align: center; }
.auth-link { color: #8132ad; text-decoration: none; }
.auth-link:hover { text-decoration: underline; }
</style>