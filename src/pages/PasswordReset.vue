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

        <div v-if="errorMessage" class="error-message">{{ errorMessage }}</div>
        <div v-if="successMessage" class="success-message">{{ successMessage }}</div>

        <button type="submit" class="auth-button" :disabled="loading">
          {{ loading ? 'Отправка...' : 'Отправить инструкцию' }}
        </button>
      </form>

      <div class="auth-links">
        <router-link to="/login" class="auth-link">Вернуться к входу</router-link>
      </div>
    </div>
  </div>
  
</template>

<script setup>
import { ref } from 'vue'
import { api } from '../services/api.js'

const email = ref('')
const errorMessage = ref('')
const successMessage = ref('')
const loading = ref(false)

const handleSubmit = async () => {
  errorMessage.value = ''
  successMessage.value = ''
  loading.value = true
  try {
    // Вызов API для запроса восстановления пароля
    await api.auth.requestPasswordReset({ email: email.value })
    successMessage.value = 'Инструкция по восстановлению отправлена на указанный e-mail.'
    email.value = ''
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
</style>
