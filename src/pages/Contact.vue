<template>
  <div class="standard-page">
    <h1>Обратиться в сообщество</h1>
    <StandardContent
      :paragraphs="['Здесь будет гайд как обратиться в сообщество']"
      :image-src="symptomsImg"
      :image-src-modal="symptomsImg"
      image-alt="Схема симптомов Ретта"
      image-alt-modal="Схема симптомов Ретта"
      download-link="/files/rett-info-brochure.pdf"
      download-label="Скачать памятку по заболеванию: "
      caption-text="Изображение: основные проявления синдрома Ретта"
      download-link-name="Гайд-заглушка (1.2 МБ)"
      video-url="https://rutube.ru/play/embed/someVideoId/"
    >
    </StandardContent>
    <section class="feedback-form">
      <h2 class="feedback-form-title">Форма обратной связи</h2>
      <form @submit.prevent="handleSubmit" novalidate>
        <div class="form-group">
          <label for="name" class="form-label">Имя</label>
          <input
            id="name"
            v-model="form.name"
            class="form-input"
            :class="{ invalid: nameTouched && !!nameError }"
            type="text"
            autocomplete="name"
            required
            @blur="nameTouched = true; trimField('name')"
          />
          <p class="field-error" :class="{ visible: nameTouched && !!nameError }">{{ nameError }}</p>
        </div>
        <div class="form-group">
          <label for="email" class="form-label">Email</label>
          <input
            id="email"
            v-model="form.email"
            class="form-input"
            :class="{ invalid: emailTouched && !!emailError }"
            type="email"
            autocomplete="email"
            required
            @input="onEmailInput"
            @blur="emailTouched = true; trimField('email')"
          />
          <p class="field-error" :class="{ visible: emailTouched && !!emailError }">{{ emailError }}</p>
        </div>

        <div class="form-group">
          <label for="message" class="form-label">Сообщение</label>
          <textarea
            id="message"
            v-model="form.message"
            class="form-textarea"
            :class="{ invalid: messageTouched && !!messageError }"
            rows="5"
            required
            @blur="messageTouched = true; trimField('message')"
          ></textarea>
          <p class="field-error" :class="{ visible: messageTouched && !!messageError }">{{ messageError }}</p>
        </div>
        <button class="form-button" type="submit" :disabled="loading || !isFormValid">
          <span v-if="!loading">Отправить</span>
          <span v-else>Отправка…</span>
        </button>
        <p v-if="error" class="error-message">{{ error }}</p>
      </form>
    </section>
    <SuccessModal
      v-model="showSuccessModal"
      :title="'Спасибо за обращение!'"
      :message="successMessage"
      :links="socialLinks"
      action-label="До связи!"
    />
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { api } from '../services/api.js';
import symptomsImg from '../assets/symptoms.png';
import StandardContent from '../components/StandardContent.vue';
import SuccessModal from '../components/SuccessModal.vue';

const form = ref({
  name: '',
  email: '',
  message: '',
});

const loading = ref(false);
const error = ref('');
const showSuccessModal = ref(false);
const successMessage =
  'Мы получили ваше сообщение и скоро свяжемся с вами. Если вопрос срочный, напишите нам на почту или в соцсети:';
const socialLinks = [
  { label: 'ВКонтакте', href: '#', iconSrc: '/src/assets/vk_logo.svg', alt: 'лого ВК' },
  { label: 'Telegram', href: '#', iconSrc: '/src/assets/telegram_logo.svg', alt: 'лого Телеграм' },
  { label: 'WhatsApp', href: '#', iconSrc: '/src/assets/whatsapp_logo.png', alt: 'лого WhatsApp' },
];

// Validation state
const nameTouched = ref(false);
const emailTouched = ref(false);
const messageTouched = ref(false);

const trimmedEmail = computed(() => (form.value.email || '').trim());
const EMAIL_RE = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;

const nameError = computed(() => {
  if (!form.value.name) return 'Введите имя';
  return '';
});
const emailError = computed(() => {
  if (!trimmedEmail.value) return 'Введите e-mail для связи с Вами';
  if (!EMAIL_RE.test(trimmedEmail.value))
    return 'Укажите корректный e-mail (например, ivan@example.com)';
  return '';
});
const messageError = computed(() => {
  if (!form.value.message) return 'Нужно что-то написать...';
  if ((form.value.message || '').trim().length < 5) return 'Сообщение слишком короткое';
  return '';
});

const isFormValid = computed(() => !(nameError.value || emailError.value || messageError.value));

function onEmailInput(e) {
  form.value.email = String(e.target.value || '').replace(/\s+/g, '');
}
function trimField(field) {
  form.value[field] = (form.value[field] || '').trim();
}

async function handleSubmit() {
  if (loading.value) return;
  error.value = '';
  nameTouched.value = true;
  emailTouched.value = true;
  messageTouched.value = true;

  if (!isFormValid.value) return;

  const payload = {
    name: (form.value.name || '').trim(),
    email: (form.value.email || '').trim(),
    message: (form.value.message || '').trim(),
  };

  try {
    loading.value = true;
    await api.accounts.sendFeedback(payload);
    form.value = { name: '', email: '', message: '' };
    nameTouched.value = false;
    emailTouched.value = false;
    messageTouched.value = false;
    showSuccessModal.value = true;
  } catch (e) {
    const detail =
      e?.response?.data?.detail ||
      e?.response?.data?.message ||
      e?.message;
    error.value = detail
      ? `Не удалось отправить сообщение: ${String(detail)}`
      : 'Не удалось отправить сообщение. Попробуйте позже.';
  } finally {
    loading.value = false;
  }
}
</script>

<style scoped>
.standard-page {
  max-width: 1050px;
  margin: 0 auto;
  padding: 32px 16px;
}

.standard-page h1 {
  font-size: 28px;
  margin-bottom: 24px;
  text-align: center;
}

.feedback-form {
  margin-top: 48px;
}

.feedback-form-title {
  font-size: 24px;
  margin-bottom: 20px;
}

.form-group {
  display: flex;
  flex-direction: column;
  margin-bottom: 6px;
}

.form-label {
  display: block;
  margin-bottom: 6px;
  font-weight: 500;
}

.form-input,
.form-textarea {
  padding: 8px 12px;
  font-size: 16px;
  border: 1px solid #ccc;
  border-radius: 6px;
}

.form-input.invalid,
.form-textarea.invalid {
  border-color: #dc3545;
  box-shadow: 0 0 0 3px rgba(220, 53, 69, 0.08);
}

.form-input {max-width: 400px;}
.form-textarea {max-width: 700px;}

.form-input:focus,
.form-textarea:focus {
  outline: 1px solid rgba(129, 50, 173, 0.8);
}

.form-button {
  background-color: rgba(43, 174, 162, 0.8);
  color: white;
  padding: 10px 20px;
  font-size: 16px;
  border: none;
  border-radius: 6px;
  margin-top: 10px;
}

.form-button:hover {
  background-color: rgba(43, 174, 162, 1);
}

.form-button[disabled] {
  opacity: 0.7;
  cursor: not-allowed;
}

.success-message {
  margin-top: 12px;
  color: green;
}

.error-message {
  margin-top: 12px;
  color: #b00020;
}

.field-error {
  color: #dc3545;
  font-size: 13px;
  margin-top: 6px;
  min-height: 18px;
  line-height: 18px;
  visibility: hidden;
}
.field-error.visible { visibility: visible; }

@media (max-width: 768px) {
  .standard-page {
    padding: 24px 12px;
  }
  .standard-page h1 {
    font-size: 24px;
  }
  .feedback-form-title {
    font-size: 20px;
  }
}

@media (max-width: 480px) {
  .standard-page {
    padding: 20px 10px;
  }
  .standard-page h1 {
    font-size: 20px;
  }
  .form-input,
  .form-textarea {
    font-size: 15px;
    padding: 10px 12px;
  }
  .form-button {
    width: 100%;
    padding: 12px 16px;
    font-size: 16px;
  }
}
</style>
