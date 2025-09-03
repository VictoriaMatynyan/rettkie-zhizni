<template>
  <div class="auth-form-container">
    <div class="auth-form">
      <h2 class="auth-title">Регистрация</h2>

      <form @submit.prevent="handleRegister">
        <div class="form-row">
          <div class="form-group">
            <label for="first_name" class="form-label">Имя *</label>
            <input
              id="first_name"
              v-model="form.first_name"
              type="text"
              class="form-input"
              required
              :disabled="loading"
              placeholder="Ваше имя"
            />
          </div>

          <div class="form-group">
            <label for="last_name" class="form-label">Фамилия *</label>
            <input
              id="last_name"
              v-model="form.last_name"
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
          <label for="region_id" class="form-label">Регион *</label>
          <select
            id="region_id"
            v-model.number="form.region_id"
            class="form-input"
            required
            :disabled="loading || dictLoading"
          >
            <option value="">Выберите регион</option>
            <option
              v-for="region in regions"
              :key="region.id"
              :value="region.id"
            >
              {{ region.name }}
            </option>
          </select>
        </div>

        <div class="form-group">
          <label for="user_type_id" class="form-label">Кто вы? *</label>
          <select
            id="user_type_id"
            v-model.number="form.user_type_id"
            class="form-input"
            required
            :disabled="loading || dictLoading"
          >
            <option value="">Выберите роль</option>
            <option v-for="type in userTypes" :key="type.id" :value="type.id">
              {{ type.name }}
            </option>
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
              v-model="form.password_confirm"
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
              v-model="form.consent"
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

        <div v-if="registrationSuccess" class="success-message">
          Регистрация прошла успешно! Пожалуйста, проверьте вашу электронную
          почту для подтверждения аккаунта.
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
import { api } from '../services/api.js';

export default {
  name: 'RegisterForm',
  data() {
    return {
      form: {
        first_name: '',
        last_name: '',
        email: '',
        phone: '',
        region_id: '',
        user_type_id: '',
        password: '',
        password_confirm: '',
        consent: false,
      },
      regions: [],
      userTypes: [],
      dictLoading: false,
      dictError: '',
      registrationSuccess: false,
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
        this.form.first_name &&
        this.form.last_name &&
        this.form.email &&
        this.form.region_id &&
        this.form.user_type_id &&
        this.form.password &&
        this.form.password_confirm &&
        this.form.password === this.form.password_confirm &&
        this.form.consent
      );
    },
    registrationComplete() {
      return this.authStore.registrationSuccess;
    },
  },
  async mounted() {
    this.authStore.clearError();
    await this.loadDictionaries();
  },
  methods: {
    async loadDictionaries() {
      this.dictError = '';
      this.dictLoading = true;
      try {
        const [regionsRes, userTypesRes] = await Promise.all([
          api.accounts.getRegions(),
          api.accounts.getUserTypes(),
        ]);
        this.regions = Array.isArray(regionsRes?.items) ? regionsRes.items : [];
        this.userTypes = Array.isArray(userTypesRes?.items)
          ? userTypesRes.items
          : [];
      } catch (e) {
        this.dictError = e?.response?.data?.message || e.message || 'Ошибка загрузки списков';
      } finally {
        this.dictLoading = false;
      }
    },
    resetForm() {
      this.form = {
        first_name: '',
        last_name: '',
        email: '',
        phone: '',
        region_id: '',
        user_type_id: '',
        password: '',
        password_confirm: '',
        consent: false,
      };
    },
    async handleRegister() {
      if (!this.isFormValid) {
        return;
      }

      if (this.form.password !== this.form.password_confirm) {
        this.authStore.error = 'Пароли не совпадают';
        return;
      }

      try {
        await this.authStore.register(this.form);

        // Показываем сообщение об успешной регистрации
        this.registrationSuccess = true;

        // Очищаем поля формы
        this.resetForm();

        // Перенаправляем на страницу подтверждения email
        this.$router.push({
          name: 'registration-success',
          query: { email: this.form.email },
        });
      } catch (error) {
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
