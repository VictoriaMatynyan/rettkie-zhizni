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
            :class="{ invalid: emailTouched && !!emailError }"
            required
            :disabled="loading"
            placeholder="Введите ваш email"
            @input="onEmailInput"
            @blur="emailTouched = true; trimEmail()"
          />
          <p
            class="field-error"
            :class="{ visible: emailTouched && !!emailError }"
            :aria-hidden="!(emailTouched && !!emailError)"
          >
            {{ emailError }}
          </p>
        </div>

        <div class="form-group">
          <label for="password" class="form-label">Пароль</label>
          <input
            id="password"
            v-model="form.password"
            type="password"
            class="form-input"
            :class="{ invalid: passwordTouched && !!passwordError }"
            required
            :disabled="loading"
            placeholder="Введите пароль"
            @input="onPasswordInput"
            @blur="passwordTouched = true"
          />
          <p
            class="field-error"
            :class="{ visible: passwordTouched && !!passwordError }"
            :aria-hidden="!(passwordTouched && !!passwordError)"
          >
            {{ passwordError }}
          </p>
        </div>

        <div v-if="error" class="error-message">
          {{ error }}
        </div>

        <button
          type="submit"
          class="auth-button"
          :disabled="loading || !!emailError || !!passwordError"
        >
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
      emailTouched: false,
      passwordTouched: false,
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
    trimmedEmail() {
      return (this.form.email || '').trim();
    },
    emailError() {
      const EMAIL_RE = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
      if (!this.trimmedEmail) return 'Введите e-mail';
      if (!EMAIL_RE.test(this.trimmedEmail)) return 'Укажите корректный e-mail (например, ivan@example.com)';
      return '';
    },
    passwordError() {
      if (!this.form.password) return 'Введите пароль';
      if (this.form.password.length < 6) return 'Минимум 6 символов';
      return '';
    },
  },
  mounted() {
    // Очищаем ошибки при монтировании компонента
    this.authStore.clearError();
  },
  methods: {
    onEmailInput(e) {
      this.form.email = String(e.target.value).replace(/\s+/g, '');
    },
    onPasswordInput(e) {
      this.form.password = String(e.target.value);
    },
    trimEmail() {
      this.form.email = this.trimmedEmail;
    },
    async handleLogin() {
      this.emailTouched = true;
      this.passwordTouched = true;
      if (this.emailError || this.passwordError) return;
      try {
        await this.authStore.login({
          email: this.trimmedEmail,
          password: this.form.password,
        });

        // Перенаправляем в личный кабинет
        this.$router.push('/personal-account');
      } catch (error) {
        // Ошибка уже обработана в store
        console.error('Login failed:', error);
      }
    },

    handleForgotPassword() {
      this.$router.push('/password-reset');
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

.form-input.invalid {
  border-color: #dc3545;
  box-shadow: 0 0 0 3px rgba(220, 53, 69, 0.08);
}

.field-error {
  color: #dc3545;
  font-size: 13px;
  margin-top: 6px;
  min-height: 18px; /* фиксируем место под сообщение */
  line-height: 18px;
  visibility: hidden;
}
.field-error.visible { visibility: visible; }

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

@media (max-width: 480px) {
  .auth-form {
    padding: 20px;
  }

  .auth-title {
    font-size: 20px;
  }
}
</style>
