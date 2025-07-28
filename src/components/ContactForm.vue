<template>
  <div class="contact-form">
    <h2>Контактные данные</h2>

    <form @submit.prevent="handleSubmit">
      <div class="form-group">
        <label>
          Имя
          <span v-if="showHelp.name" class="help-text"
            >Введите ваше полное имя</span
          >
          <input v-model="form.name" type="text" required />
        </label>
      </div>

      <div class="form-group">
        <label>
          E-mail
          <span v-if="showHelp.email" class="help-text"
            >Используется для связи и уведомлений</span
          >
          <input v-model="form.email" type="email" required />
        </label>
      </div>

      <div class="form-group">
        <label>
          Телефон
          <span v-if="showHelp.phone" class="help-text"
            >В формате +7 (999) 999-99-99</span
          >
          <input
            id="phone"
            v-model="form.phone"
            v-mask="'+7 (###) ###-##-##'"
            name="phone"
            type="tel"
            required
            inputmode="numeric"
            placeholder="+7 (___) ___-__-__"
            autocomplete="tel"
          />
        </label>
      </div>
      <div class="form-group notications">
        <label>
          <input
            id="notifications"
            v-model="form.notifications"
            type="checkbox"
            name="notifications"
          />

          <span v-if="showHelp.notifications" class="label-text">
            Получать важные новости на почту
          </span>
        </label>
      </div>

      <button type="submit" class="save-button">Сохранить</button>
    </form>

    <div v-if="submitted" class="success-message">
      Данные успешно сохранены!
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const form = ref({
  notifications: true,
  name: '',
  email: '',
  phone: '',
});

const submitted = ref(false);

const showHelp = {
  notifications: true,
  name: true,
  email: true,
  phone: true,
};

function handleSubmit() {
  // здесь будет API-запрос на POST/UPDATE
  submitted.value = true;
  setTimeout(() => {
    console.log('Form submitted:', form.value);
    submitted.value = false;
  }, 5000);
}
</script>

<style scoped>
.contact-form {
  display: flex;
  flex-direction: column;
  max-width: 600px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.notications {
  margin-top: 15px;
}

.label-text {
  font-weight: 600;
  margin-bottom: 4px;
}

input[type='text'],
input[type='email'],
input[type='tel'] {
  padding: 8px;
  font-size: 16px;
  border: 1px solid #ccc;
  border-radius: 6px;
}

.help-text {
  display: block;
  font-size: 12px;
  color: #666;
  margin-bottom: 4px;
}

.save-button {
  margin-top: 16px;
  background-color: #2aaea2;
  color: white;
  border: none;
  padding: 10px 16px;
  font-size: 16px;
  border-radius: 6px;
  cursor: pointer;
}

.save-button:hover {
  background-color: #23938c;
}

.success-message {
  margin-top: 12px;
  color: #2aaea2;
  font-weight: 500;
}

input[type='checkbox'] {
  margin: 0;
  cursor: pointer;
}
</style>
