<template>
  <div class="auth-form-container">
    <div class="auth-form">
      <h2 class="auth-title">Вход в личный кабинет</h2>

      <form @submit.prevent="handleLogin">
        <div class="form-group">
          <label for="email" class="form-label">Email</label>
          <input
            id="email"
            v-model="form.email"
            type="email"
            class="form-input"
            required
            :disabled="loading"
            placeholder="Введите ваш email"
          />
        </div>

        <div class="form-group">
          <label for="password" class="form-label">Пароль</label>
          <input
            id="password"
            v-model="form.password"
            type="password"
            class="form-input"
            required
            :disabled="loading"
            placeholder="Введите пароль"
          />
        </div>

        <div v-if="error" class="error-message">
          {{ error }}
        </div>

        <button type="submit" class="auth-button" :disabled="loading">
          {{ loading ? 'Вход...' : 'Войти' }}
        </button>
      </form>

      <div class="auth-links">
        <router-link to="/register" class="auth-link">
          Нет аккаунта? Зарегистрироваться
        </router-link>
        <a href="#" class="auth-link" @click.prevent="handleForgotPassword">
          Забыли пароль?
        </a>
      </div>

      <div class="test-accounts">
        <h4>Тестовые аккаунты:</h4>
        <div class="test-account" @click="fillTestAdmin">
          <strong>Администратор:</strong> admin@rett.ru / admin123
        </div>
        <div class="test-account" @click="fillTestParent">
          <strong>Родитель:</strong> parent@example.com / parent123
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { useAuthStore } from '../stores/auth.js';

export default {
  name: 'LoginForm',
  data() {
    return {
      form: {
        email: '',
        password: '',
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
  },
  mounted() {
    // Очищаем ошибки при монтировании компонента
    this.authStore.clearError();
  },
  methods: {
    async handleLogin() {
      try {
        await this.authStore.login(this.form);

        // Перенаправляем в личный кабинет
        this.$router.push('/personal-account');
      } catch (error) {
        // Ошибка уже обработана в store
        console.error('Login failed:', error);
      }
    },

    handleForgotPassword() {
      alert('Функция восстановления пароля будет добавлена позже');
    },

    fillTestAdmin() {
      this.form.email = 'admin@rett.ru';
      this.form.password = 'admin123';
    },

    fillTestParent() {
      this.form.email = 'parent@example.com';
      this.form.password = 'parent123';
    },
  },
};
</script>

<style scoped>
.auth-form-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 70vh;
  padding: 20px;
}

.auth-form {
  background: white;
  padding: 40px;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 400px;
}

.auth-title {
  text-align: center;
  margin-bottom: 30px;
  color: #333;
  font-size: 24px;
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
  display: block;
  margin: 10px 0;
  color: #8132ad;
  text-decoration: none;
  font-size: 14px;
}

.auth-link:hover {
  text-decoration: underline;
}

.test-accounts {
  margin-top: 30px;
  padding: 20px;
  background-color: #f8f9fa;
  border-radius: 8px;
  border: 1px solid #e9ecef;
}

.test-accounts h4 {
  margin: 0 0 15px 0;
  color: #495057;
  font-size: 14px;
}

.test-account {
  margin: 8px 0;
  padding: 8px;
  background-color: white;
  border-radius: 4px;
  cursor: pointer;
  font-size: 13px;
  transition: background-color 0.2s ease;
}

.test-account:hover {
  background-color: #e9ecef;
}

@media (max-width: 480px) {
  .auth-form {
    padding: 20px;
  }

  .auth-title {
    font-size: 20px;
  }
}
</style>
