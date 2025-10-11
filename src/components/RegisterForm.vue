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
              :class="{ invalid: firstNameTouched && !!firstNameError }"
              required
              :disabled="loading || isLocked"
              placeholder="Ваше имя"
              @blur="
                firstNameTouched = true;
                trimField('first_name');
              "
            />
            <p
              class="field-error"
              :class="{ visible: firstNameTouched && !!firstNameError }"
            >
              {{ firstNameError }}
            </p>
          </div>

          <div class="form-group">
            <label for="last_name" class="form-label">Фамилия *</label>
            <input
              id="last_name"
              v-model="form.last_name"
              type="text"
              class="form-input"
              :class="{ invalid: lastNameTouched && !!lastNameError }"
              required
              :disabled="loading || isLocked"
              placeholder="Ваша фамилия"
              @blur="
                lastNameTouched = true;
                trimField('last_name');
              "
            />
            <p
              class="field-error"
              :class="{ visible: lastNameTouched && !!lastNameError }"
            >
              {{ lastNameError }}
            </p>
          </div>
        </div>

        <div class="form-group">
          <label for="email" class="form-label">Email *</label>
          <input
            id="email"
            v-model="form.email"
            type="email"
            class="form-input"
            :class="{ invalid: emailTouched && !!emailError }"
            required
            :disabled="loading || isLocked"
            placeholder="Ваш email адрес"
            @input="onEmailInput"
            @blur="
              emailTouched = true;
              trimField('email');
            "
          />
          <p
            class="field-error"
            :class="{ visible: emailTouched && !!emailError }"
          >
            {{ emailError }}
          </p>
        </div>

        <div class="form-group">
          <label for="phone" class="form-label">Телефон</label>
          <input
            id="phone"
            v-model="form.phone"
            v-mask="'+7 ### ###-##-##'"
            type="tel"
            class="form-input"
            :disabled="loading || isLocked"
            placeholder="+7 999 123-45-67"
            @blur="trimField('phone')"
          />
        </div>
        <div class="form-group">
          <label for="region_id" class="form-label">Регион *</label>
          <select
            id="region_id"
            v-model.number="form.region_id"
            class="form-input"
            :class="{ invalid: regionTouched && !!regionError }"
            required
            :disabled="loading || dictLoading || isLocked"
            @blur="regionTouched = true"
          >
            <option value="">
              {{ dictLoading ? 'Загрузка...' : 'Выберите регион' }}
            </option>
            <option
              v-for="region in regions"
              :key="region.id"
              :value="region.id"
            >
              {{ region.name }}
            </option>
          </select>
          <p v-if="dictLoading" class="field-info">Загрузка регионов...</p>
          <p
            v-else-if="regions.length === 0 && !dictLoading"
            class="field-info"
          >
            Регионы не загружены ({{ regions.length }})
          </p>
          <p
            class="field-error"
            :class="{ visible: regionTouched && !!regionError }"
          >
            {{ regionError }}
          </p>
        </div>
        <div class="form-group">
          <label for="user_type_id" class="form-label">Кто вы? *</label>
          <select
            id="user_type_id"
            v-model.number="form.user_type_id"
            class="form-input"
            :class="{ invalid: userTypeTouched && !!userTypeError }"
            required
            :disabled="loading || dictLoading || isLocked"
            @blur="userTypeTouched = true"
          >
            <option value="">
              {{ dictLoading ? 'Загрузка...' : 'Выберите роль' }}
            </option>
            <option v-for="type in userTypes" :key="type.id" :value="type.id">
              {{ type.name }}
            </option>
          </select>
          <p v-if="dictLoading" class="field-info">
            Загрузка типов пользователей...
          </p>
          <p
            v-else-if="userTypes.length === 0 && !dictLoading"
            class="field-info"
          >
            Типы пользователей не загружены ({{ userTypes.length }})
          </p>
          <p
            class="field-error"
            :class="{ visible: userTypeTouched && !!userTypeError }"
          >
            {{ userTypeError }}
          </p>
        </div>
        <div class="form-row">
          <div class="form-group">
            <label for="password" class="form-label">Пароль *</label>
            <div class="password-input">
              <input
                id="password"
                v-model="form.password"
                :type="showPassword ? 'text' : 'password'"
                class="form-input"
                :class="{ invalid: passwordTouched && !!passwordError }"
                required
                :disabled="loading || isLocked"
                placeholder="Минимум 6 символов"
                minlength="6"
                @blur="passwordTouched = true"
              />
              <button
                type="button"
                class="password-toggle"
                :aria-label="showPassword ? 'Скрыть пароль' : 'Показать пароль'"
                @click="showPassword = !showPassword"
              >
                <img :src="hideIcon" alt="" />
              </button>
            </div>
            <p
              class="field-error"
              :class="{ visible: passwordTouched && !!passwordError }"
            >
              {{ passwordError }}
            </p>
          </div>
          <div class="form-group">
            <label for="confirmPassword" class="form-label"
              >Повторите пароль *</label
            >
            <div class="password-input">
              <input
                id="confirmPassword"
                v-model="form.password_confirm"
                :type="showConfirmPassword ? 'text' : 'password'"
                class="form-input"
                :class="{ invalid: confirmTouched && !!confirmError }"
                required
                :disabled="loading || isLocked"
                placeholder="Повторите пароль"
                @blur="confirmTouched = true"
              />
              <button
                type="button"
                class="password-toggle"
                :aria-label="
                  showConfirmPassword ? 'Скрыть пароль' : 'Показать пароль'
                "
                @click="showConfirmPassword = !showConfirmPassword"
              >
                <img :src="hideIcon" alt="" />
              </button>
            </div>
            <p
              class="field-error"
              :class="{ visible: confirmTouched && !!confirmError }"
            >
              {{ confirmError }}
            </p>
          </div>
        </div>
        <div class="form-group">
          <label class="checkbox-label">
            <input
              v-model="form.consent"
              type="checkbox"
              required
              :disabled="loading || isLocked"
            />
            <span class="checkbox-text">
              Я даю согласие на обработку персональных данных в соответствии с
              <a href="/privacy-policy" target="_blank"
                >Политикой конфиденциальности</a
              >
            </span>
          </label>
          <p
            class="field-error"
            :class="{ visible: consentTouched && !!consentError }"
          >
            {{ consentError }}
          </p>
        </div>
        <div class="form-group">
          <label class="checkbox-label">
            <input
              v-model="form.receive_news"
              type="checkbox"
              :disabled="loading || isLocked"
            />
            <span class="checkbox-text"> Подписаться на важные новости </span>
          </label>
        </div>
        <div v-if="dictError" class="error-message">
          {{ dictError }}
        </div>
        <div v-if="error" class="error-message">
          {{ error }}
        </div>
        <button
          type="submit"
          class="auth-button"
          :disabled="loading || !isFormValid || isLocked"
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
  <ConfirmModal
    v-model="showSuccessModal"
    :title="successModalTitle"
    :cancel-text="successCancelText"
    :show-cancel="true"
    @confirm="handleSuccessConfirm"
    @cancel="closeSuccessModal"
  >
    <template #message>
      <p>
        Регистрация прошла успешно. Мы отправили письмо для подтверждения. Если
        его нет, загляните в папку «Спам».
      </p>
      <p v-if="emailServiceUrl" class="modal-email-link">
        <a
          :href="emailServiceUrl"
          target="_blank"
          rel="noopener"
          class="email-link"
        >
          Перейти к почте {{ submittedEmail || trimmedEmail }}
        </a>
      </p>
      <p v-if="isLocked" class="modal-muted">
        Форма регистрации будет снова доступна через {{ lockRemaining }} сек.
      </p>
    </template>
  </ConfirmModal>
</template>

<script>
import { useAuthStore } from '../stores/auth.js';
import { api } from '../services/api.js';
import ConfirmModal from './ConfirmModal.vue';
import hideIcon from '../assets/hide.png';

export default {
  name: 'RegisterForm',
  components: { ConfirmModal },
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
        receive_news: true,
      },
      // Сохраняем email, использованный при регистрации, для ссылки на почту
      submittedEmail: '',
      regions: [],
      userTypes: [],
      dictLoading: false,
      dictError: '',
      registrationSuccess: false,
      // touched flags
      firstNameTouched: false,
      lastNameTouched: false,
      emailTouched: false,
      regionTouched: false,
      userTypeTouched: false,
      passwordTouched: false,
      confirmTouched: false,
      consentTouched: false,
      // success lock
      isLocked: false,
      lockRemaining: 0,
      lockIntervalId: null,
      successLockSeconds: 30,
      submittedFirstName: '',
      showSuccessModal: false,
      showPassword: false,
      showConfirmPassword: false,
      hideIcon,
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
    // домен email для построения ссылки на почтовый сервис
    emailDomain() {
      const e = this.submittedEmail || this.form.email || '';
      const m = e.match(/@([\w.-]+)/);
      return m ? m[1].toLowerCase() : '';
    },
    emailServiceUrl() {
      return this.resolveMailUrl(this.emailDomain);
    },
    trimmedEmail() {
      return (this.form.email || '').trim();
    },
    firstNameError() {
      if (!this.form.first_name) return 'Введите имя';
      return '';
    },
    lastNameError() {
      if (!this.form.last_name) return 'Введите фамилию';
      return '';
    },
    emailError() {
      const EMAIL_RE = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
      if (!this.trimmedEmail) return 'Введите e-mail';
      if (!EMAIL_RE.test(this.trimmedEmail))
        return 'Укажите корректный e-mail (например, ivan@example.com)';
      return '';
    },
    regionError() {
      if (!this.form.region_id) return 'Выберите регион';
      return '';
    },
    userTypeError() {
      if (!this.form.user_type_id) return 'Выберите роль';
      return '';
    },
    passwordError() {
      if (!this.form.password) return 'Введите пароль';
      if (this.form.password.length < 8) return 'Минимум 8 символов';
      return '';
    },
    confirmError() {
      if (!this.form.password_confirm) return 'Повторите пароль';
      if (this.form.password_confirm !== this.form.password)
        return 'Пароли не совпадают';
      return '';
    },
    consentError() {
      if (!this.form.consent) return 'Требуется согласие';
      return '';
    },
    isFormValid() {
      return !(
        this.firstNameError ||
        this.lastNameError ||
        this.emailError ||
        this.regionError ||
        this.userTypeError ||
        this.passwordError ||
        this.confirmError ||
        this.consentError
      );
    },
    registrationComplete() {
      return this.authStore.registrationSuccess;
    },
    successModalTitle() {
      const name = this.submittedFirstName || this.form.first_name || '';
      return name ? `Добро пожаловать, ${name}!` : 'Добро пожаловать, друг';
    },
    // successConfirmText() {
    //   return this.emailServiceUrl ? 'Перейти к почте' : 'Хорошо';
    // },
    successCancelText() {
      return this.emailServiceUrl ? 'Закрыть' : 'Отмена';
    },
  },
  async mounted() {
    this.authStore.clearError();
    await this.loadDictionaries();
  },
  beforeUnmount() {
    if (this.lockIntervalId) clearInterval(this.lockIntervalId);
  },
  methods: {
    onEmailInput(e) {
      this.form.email = String(e.target.value).replace(/\s+/g, '');
    },
    trimField(field) {
      this.form[field] = (this.form[field] || '').trim();
    },
    startSuccessLock() {
      this.isLocked = true;
      this.lockRemaining = this.successLockSeconds;
      if (this.lockIntervalId) clearInterval(this.lockIntervalId);
      this.lockIntervalId = setInterval(() => {
        if (this.lockRemaining > 0) this.lockRemaining -= 1;
        if (this.lockRemaining <= 0) {
          clearInterval(this.lockIntervalId);
          this.lockIntervalId = null;
          this.isLocked = false;
        }
      }, 1000);
    },
    closeSuccessModal() {
      this.showSuccessModal = false;
    },
    handleSuccessConfirm() {
      if (this.emailServiceUrl && typeof window !== 'undefined') {
        try {
          window.open(this.emailServiceUrl, '_blank', 'noopener');
        } catch (_) {}
      }
      this.closeSuccessModal();
    },
    clearTouched() {
      this.firstNameTouched = false;
      this.lastNameTouched = false;
      this.emailTouched = false;
      this.regionTouched = false;
      this.userTypeTouched = false;
      this.passwordTouched = false;
      this.confirmTouched = false;
      this.consentTouched = false;
    },
    // Определяем ссылку на почтовый сервис по домену
    resolveMailUrl(domain) {
      if (!domain) return null;
      const MAP = {
        'ya.ru': 'https://mail.yandex.ru/',
        'yandex.ru': 'https://mail.yandex.ru/',
        'yandex.com': 'https://mail.yandex.com/',
        'yandex.kz': 'https://mail.yandex.kz/',
        'yandex.by': 'https://mail.yandex.by/',
        'yandex.ua': 'https://mail.yandex.ua/',
        'mail.ru': 'https://e.mail.ru/inbox/',
        'bk.ru': 'https://e.mail.ru/inbox/',
        'inbox.ru': 'https://e.mail.ru/inbox/',
        'list.ru': 'https://e.mail.ru/inbox/',
        'gmail.com': 'https://mail.google.com/',
        'googlemail.com': 'https://mail.google.com/',
        'outlook.com': 'https://outlook.live.com/',
        'hotmail.com': 'https://outlook.live.com/',
        'live.com': 'https://outlook.live.com/',
        'msn.com': 'https://outlook.live.com/',
        'icloud.com': 'https://www.icloud.com/mail',
        'me.com': 'https://www.icloud.com/mail',
        'mac.com': 'https://www.icloud.com/mail',
        'rambler.ru': 'https://mail.rambler.ru/',
        'autorambler.ru': 'https://mail.rambler.ru/',
        'lenta.ru': 'https://mail.rambler.ru/',
        'myrambler.ru': 'https://mail.rambler.ru/',
        'ro.ru': 'https://mail.rambler.ru/',
        'yahoo.com': 'https://mail.yahoo.com/',
        'proton.me': 'https://mail.proton.me/',
        'protonmail.com': 'https://mail.proton.me/',
        'zoho.com': 'https://mail.zoho.com/',
        'gmx.com': 'https://www.gmx.com/',
        'gmx.net': 'https://www.gmx.net/',
        'fastmail.com': 'https://app.fastmail.com/',
      };
      if (MAP[domain]) return MAP[domain];
      if (domain.includes('yandex')) return 'https://mail.yandex.ru/';
      if (domain.includes('mail.ru')) return 'https://e.mail.ru/inbox/';
      if (domain.includes('gmail') || domain.includes('googlemail'))
        return 'https://mail.google.com/';
      if (
        domain.includes('outlook') ||
        domain.includes('hotmail') ||
        domain.includes('live') ||
        domain.includes('msn')
      ) {
        return 'https://outlook.live.com/';
      }
      if (domain.includes('rambler')) return 'https://mail.rambler.ru/';
      if (domain.includes('yahoo')) return 'https://mail.yahoo.com/';
      if (domain.includes('proton')) return 'https://mail.proton.me/';
      return null;
    },
    async loadDictionaries() {
      this.dictError = '';
      this.dictLoading = true;
      try {
        const [regionsRes, userTypesRes] = await Promise.all([
          api.accounts.getRegions(),
          api.accounts.getUserTypes(),
        ]);

        // Проверяем структуру ответа
        if (
          regionsRes &&
          typeof regionsRes === 'object' &&
          'items' in regionsRes
        ) {
          this.regions = Array.isArray(regionsRes.items)
            ? regionsRes.items
            : [];
        } else {
          console.warn('Неожиданная структура ответа регионов:', regionsRes);
          this.regions = [];
        }

        if (
          userTypesRes &&
          typeof userTypesRes === 'object' &&
          'items' in userTypesRes
        ) {
          this.userTypes = Array.isArray(userTypesRes.items)
            ? userTypesRes.items
            : [];
        } else {
          console.warn(
            'Неожиданная структура ответа типов пользователей:',
            userTypesRes
          );
          this.userTypes = [];
        }
      } catch (e) {
        console.error('Ошибка загрузки справочников:', e);
        this.dictError =
          e?.response?.data?.message || e.message || 'Ошибка загрузки списков';
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
        receive_news: true,
      };
    },
    async handleRegister() {
      // показать ошибки
      this.firstNameTouched = true;
      this.lastNameTouched = true;
      this.emailTouched = true;
      this.regionTouched = true;
      this.userTypeTouched = true;
      this.passwordTouched = true;
      this.confirmTouched = true;
      this.consentTouched = true;
      if (!this.isFormValid) return;

      try {
        await this.authStore.register({
          ...this.form,
          email: this.trimmedEmail,
        });
        // Сохраняем email для ссылки на почту
        this.submittedEmail = this.form.email;
        this.submittedFirstName = (this.form.first_name || '').trim();
        this.registrationSuccess = true;
        this.showSuccessModal = true;
        this.showPassword = false;
        this.showConfirmPassword = false;
        // Очищаем поля формы (email уже сохранен отдельно)
        this.resetForm();
        // Сбрасываем состояния ошибок, чтобы не отвлекать пользователя
        this.clearTouched();
        // Блокируем повторный сабмит на 60с
        this.startSuccessLock();
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

.password-input {
  position: relative;
  display: flex;
  align-items: center;
}

.password-input .form-input {
  padding-right: 44px;
}

.password-toggle {
  position: absolute;
  right: 12px;
  background: transparent;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0;
  height: 100%;
}

.password-toggle:focus-visible {
  outline: 2px solid rgba(129, 50, 173, 0.6);
  outline-offset: 2px;
}

.password-toggle img {
  width: 22px;
  height: 22px;
  pointer-events: none;
  opacity: 0.75;
  transition: opacity 0.2s ease;
}

.password-toggle:hover img {
  opacity: 1;
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
  min-height: 18px;
  line-height: 18px;
  visibility: hidden;
}
.field-error.visible {
  visibility: visible;
}

.field-info {
  color: #666;
  font-size: 13px;
  margin-top: 6px;
  min-height: 18px;
  line-height: 18px;
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

.modal-email-link {
  margin-top: 12px;
}

.modal-muted {
  margin-top: 12px;
  color: #666;
  font-size: 13px;
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

.muted {
  color: #666;
  font-size: 13px;
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
