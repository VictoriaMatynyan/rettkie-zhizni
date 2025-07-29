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
      <form @submit.prevent="handleSubmit">
        <div class="form-group">
          <label for="name" class="form-label">Имя</label>
          <input
            id="name"
            v-model="form.name"
            class="form-input"
            type="text"
            required
          />
        </div>
        <div class="form-group">
          <label for="email" class="form-label">Email</label>
          <input
            id="email"
            v-model="form.email"
            class="form-input"
            type="email"
            required
          />
        </div>

        <div class="form-group">
          <label for="message" class="form-label">Сообщение</label>
          <textarea
            id="message"
            v-model="form.message"
            class="form-textarea"
            rows="5"
            required
          ></textarea>
        </div>
        <button class="form-button" type="submit">Отправить</button>
        <p v-if="isSubmitted" class="success-message">
          Спасибо! Ваше сообщение отправлено.
        </p>
      </form>
    </section>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import symptomsImg from '../assets/symptoms.png';
import StandardContent from '../components/StandardContent.vue';

const form = ref({
  name: '',
  email: '',
  message: '',
});

const isSubmitted = ref(false);

function handleSubmit() {
  // здесь будет post-запрос на сервер

  console.log('Form submitted:', form.value);
  isSubmitted.value = true;
  form.value = {
    name: '',
    email: '',
    message: '',
  };

  // убираем сообщение об успешной отправке формы
  setTimeout(() => {
    isSubmitted.value = false;
  }, 5000);
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
  width: 100%;
  padding: 8px 12px;
  font-size: 16px;
  border: 1px solid #ccc;
  border-radius: 6px;
}

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
  cursor: pointer;
}

.form-button:hover {
  background-color: rgba(43, 174, 162, 1);
}

.success-message {
  margin-top: 12px;
  color: green;
}
</style>
