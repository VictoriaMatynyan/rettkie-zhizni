<template>
  <div class="child-form">
    <h3 class="child-form-title">
      {{ child ? 'Редактировать анкету' : 'Новая анкета' }}
    </h3>

    <form @submit.prevent="submitForm">
      <div class="form-group">
        <label class="form-label"
          >Фамилия
          <input
            v-model="form.lastName"
            class="form-input"
            type="text"
            required
          />
        </label>
      </div>

      <div class="form-group">
        <label class="form-label"
          >Имя
          <input
            v-model="form.firstName"
            class="form-input"
            type="text"
            required
          />
        </label>
      </div>

      <div class="form-group">
        <label class="form-label"
          >Пол
          <select v-model="form.gender" class="form-select" required>
            <option class="form-option gender" disabled value="">
              Выберите пол
            </option>
            <option class="form-option" value="м">Мужской</option>
            <option class="form-option" value="ж">Женский</option>
          </select>
        </label>
      </div>

      <div class="form-group">
        <label class="form-label"
          >Дата рождения
          <input
            v-model="form.birthDate"
            class="form-input"
            type="date"
            required
          />
        </label>
      </div>

      <div class="form-buttons">
        <button class="btn submit" type="submit">Сохранить</button>
        <button class="btn cancel" type="button" @click="$emit('cancel')">
          Отмена
        </button>
      </div>
    </form>
  </div>
</template>

<script>
export default {
  name: 'ChildForm',
  props: {
    child: Object,
  },
  emits: ['save', 'cancel'],
  data() {
    return {
      form: {
        lastName: '',
        firstName: '',
        gender: '',
        birthDate: '',
      },
    };
  },
  mounted() {
    if (this.child) {
      this.form = { ...this.child };
    }
  },
  methods: {
    submitForm() {
      this.$emit('save', { ...this.form });
    },
  },
};
</script>

<style scoped>
.child-form {
  max-width: 500px;
  background: #ffffff;
  border-radius: 12px;
}

.child-form-title {
  text-align: left;
}

.form-group {
  margin-bottom: 1.2rem;
}

.form-label {
  display: flex;
  flex-direction: column;
  margin-bottom: 0.4rem;
}

.form-input,
.form-select {
  padding: 0.6rem 0.8rem;
  border: none;
  border-bottom: 1px solid #ccc;
  border-radius: 8px;
  font-size: 14px;
  transition: border-color 0.2s ease;
}

input,
select {
  padding: 0.6rem 0.8rem;
  border: 1px solid #ccc;
  border-radius: 8px;
  font-size: 1rem;
  transition: border-color 0.2s ease;
}

input:focus,
select:focus {
  border-color: #8132ad;
  outline: none;
}

.form-buttons {
  display: flex;
  justify-content: space-between;
  gap: 1rem;
  margin-top: 1.5rem;
}

.btn {
  margin-top: 16px;
  background-color: transparent;
  border: none;
  border-bottom: 1px solid #23938c;
  color: black;
  padding: 10px 16px;
  font-size: 16px;
  border-radius: 6px;
  cursor: pointer;
}

.btn.submit:hover {
  background-color: #23938c;
  color: white;
}

.btn.cancel {
  border-bottom: 1px solid rgba(244, 67, 54, 0.5);
}

.btn.cancel:hover {
  background-color: #f44336;
  color: white;
}
</style>
