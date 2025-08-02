<template>
  <div class="auth-form-container">
    <div class="auth-form">
      <h2 class="auth-title">Регистрация</h2>

      <form @submit.prevent="handleRegister">
        <div class="form-row">
          <div class="form-group">
            <label for="firstName" class="form-label">Имя *</label>
            <input
              id="firstName"
              v-model="form.firstName"
              type="text"
              class="form-input"
              required
              :disabled="loading"
              placeholder="Ваше имя"
            />
          </div>

          <div class="form-group">
            <label for="lastName" class="form-label">Фамилия *</label>
            <input
              id="lastName"
              v-model="form.lastName"
              type="text"
              class="form-input"
              required
              :disabled="loading"
              placeholder="Ваша фамилия"
            />
          </div>
        </div>

        <div class="form-group">
          <label for="email" class="form-label">Email *</label>
          <input
            id="email"
            v-model="form.email"
            type="email"
            class="form-input"
            required
            :disabled="loading"
            placeholder="Ваш email адрес"
          />
        </div>

        <div class="form-group">
          <label for="phone" class="form-label">Телефон</label>
          <input
            id="phone"
            v-model="form.phone"
            v-mask="'+7 ### ###-##-##'"
            type="tel"
            class="form-input"
            :disabled="loading"
            placeholder="+7 999 123-45-67"
          />
        </div>

        <div class="form-group">
          <label for="region" class="form-label">Регион *</label>
          <select
            id="region"
            v-model="form.region"
            class="form-input"
            required
            :disabled="loading"
          >
            <option value="">Выберите регион</option>
            <option value="Москва">Москва</option>
            <option value="Санкт-Петербург">Санкт-Петербург</option>
            <option value="Екатеринбург">Екатеринбург</option>
            <option value="Новосибирск">Новосибирск</option>
            <option value="Краснодар">Краснодар</option>
            <option value="Другой">Другой регион</option>
          </select>
        </div>

        <div class="form-group">
          <label for="role" class="form-label">Кто вы? *</label>
          <select
            id="role"
            v-model="form.role"
            class="form-input"
            required
            :disabled="loading"
          >
            <option value="">Выберите роль</option>
            <option value="parent">Родитель/Опекун</option>
            <option value="doctor">Врач/Специалист</option>
            <option value="researcher">Исследователь</option>
          </select>
        </div>

        <div class="form-row">
          <div class="form-group">
            <label for="password" class="form-label">Пароль *</label>
            <input
              id="password"
              v-model="form.password"
              type="password"
              class="form-input"
              required
              :disabled="loading"
              placeholder="Минимум 6 символов"
              minlength="6"
            />
          </div>

          <div class="form-group">
            <label for="confirmPassword" class="form-label"
              >Повторите пароль *</label
            >
            <input
              id="confirmPassword"
              v-model="form.confirmPassword"
              type="password"
              class="form-input"
              required
              :disabled="loading"
              placeholder="Повторите пароль"
            />
          </div>
        </div>

        <div class="form-group">
          <label class="checkbox-label">
            <input
              v-model="form.hasConsentToDataProcessing"
              type="checkbox"
              required
              :disabled="loading"
            />
            <span class="checkbox-text">
              Я даю согласие на обработку персональных данных в соответствии с
              <a href="/privacy-policy" target="_blank"
                >Политикой конфиденциальности</a
              >
            </span>
          </label>
        </div>

        <div v-if="error" class="error-message">
          {{ error }}
        </div>

        <button
          type="submit"
          class="auth-button"
          :disabled="loading || !isFormValid"
        >
          {{ loading ? 'Регистрация...' : 'Зарегистрироваться' }}
        </button>
      </form>

      <div class="auth-links">
        <router-link to="/login" class="auth-link">
          Уже есть аккаунт? Войти
        </router-link>
      </div>
    </div>
  </div>
</template>

<script>
import { useAuthStore } from '../stores/auth.js';

export default {
  name: 'RegisterForm',
  data() {
    return {
      form: {
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        region: '',
        role: '',
        password: '',
        confirmPassword: '',
        hasConsentToDataProcessing: false,
      },
    };
  },
  computed: {
    authStore() {
      return useAuthStore();
    },
    loading() {
      return this.authStore.loading;
    },
    error() {
      return this.authStore.error;
    },
    isFormValid() {
      return (
        this.form.firstName &&
        this.form.lastName &&
        this.form.email &&
        this.form.region &&
        this.form.role &&
        this.form.password &&
        this.form.confirmPassword &&
        this.form.password === this.form.confirmPassword &&
        this.form.hasConsentToDataProcessing
      );
    },
  },
  mounted() {
    // Очищаем ошибки при монтировании компонента
    this.authStore.clearError();
  },
  methods: {
    async handleRegister() {
      if (!this.isFormValid) {
        return;
      }

      if (this.form.password !== this.form.confirmPassword) {
        this.authStore.error = 'Пароли не совпадают';
        return;
      }

      try {
        // Создаем объект пользователя без confirmPassword
        const userData = { ...this.form };
        delete userData.confirmPassword;

        await this.authStore.register(userData);

        // Перенаправляем в личный кабинет
        this.$router.push('/personal-account');
      } catch (error) {
        // Ошибка уже обработана в store
        console.error('Registration failed:', error);
      }
    },
  },
};
</script>

<style scoped>
.auth-form-container {
  display: flex;
  justify-content: center;
  align-items: flex-start;
  min-height: 70vh;
  padding: 20px;
}

.auth-form {
  background: white;
  padding: 40px;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 600px;
}

.auth-title {
  text-align: center;
  margin-bottom: 30px;
  color: #333;
  font-size: 24px;
}

.form-row {
  display: flex;
  gap: 15px;
}

.form-row .form-group {
  flex: 1;
}

.form-group {
  margin-bottom: 20px;
}

.form-label {
  display: block;
  margin-bottom: 8px;
  font-weight: 500;
  color: #555;
}

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

.form-input:disabled {
  background-color: #f5f5f5;
  cursor: not-allowed;
}

.checkbox-label {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  cursor: pointer;
}

.checkbox-text {
  font-size: 14px;
  line-height: 1.4;
  color: #555;
}

.checkbox-text a {
  color: #8132ad;
  text-decoration: none;
}

.checkbox-text a:hover {
  text-decoration: underline;
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

.auth-button:hover:not(:disabled) {
  background-color: #6b2a91;
}

.auth-button:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}

.error-message {
  background-color: #fee;
  color: #c33;
  padding: 12px;
  border-radius: 8px;
  margin-bottom: 20px;
  text-align: center;
  border: 1px solid #fcc;
}

.auth-links {
  margin-top: 20px;
  text-align: center;
}

.auth-link {
  color: #8132ad;
  text-decoration: none;
  font-size: 14px;
}

.auth-link:hover {
  text-decoration: underline;
}

@media (max-width: 768px) {
  .form-row {
    flex-direction: column;
    gap: 0;
  }

  .auth-form {
    padding: 20px;
  }

  .auth-title {
    font-size: 20px;
  }
}
</style>
