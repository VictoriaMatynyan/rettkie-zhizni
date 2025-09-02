<template>
  <div class="child-form">
    <h3 class="child-form-title">
      {{ child ? 'Редактировать анкету' : 'Новая анкета' }}
    </h3>

    <form @submit.prevent="submitForm">
      <!-- Основные данные -->
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
          >Отчество
          <input
            v-model="form.middleName"
            class="form-input"
            type="text"
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

      <!-- Гражданство -->
      <div class="form-group">
        <label class="form-label"
          >Гражданство
          <select v-model="form.citizenship" class="form-select" required>
            <option disabled value="">Выберите</option>
            <option value="РФ">РФ</option>
            <option value="Другое">Другое</option>
          </select>
        </label>
        <p v-if="isCitizenshipOther" class="alert alert-warning">
          Для гражданства «Другое» сохранение анкеты недоступно.
        </p>
      </div>

      <!-- Страна проживания / город -->
      <div class="form-group">
        <label class="form-label"
          >Страна проживания
          <select v-model="form.countryOfResidence" class="form-select" required>
            <option disabled value="">Выберите</option>
            <option value="Россия">Россия</option>
            <option value="Другая страна">Другая страна</option>
          </select>
        </label>
      </div>

      <div v-if="isRussia" class="form-group">
        <label class="form-label"
          >Город / Населенный пункт
          <select v-model="form.city" class="form-select" required>
            <option disabled value="">Выберите город</option>
            <option v-for="c in russianCities" :key="c" :value="c">{{ c }}</option>
          </select>
        </label>
      </div>

      <!-- Генетический анализ -->
      <div class="form-group">
        <label class="form-label"
          >Синдром Ретта подтвержден генетическим тестом?
          <select v-model="form.geneticTestConfirmed" class="form-select" required>
            <option disabled value="">Выберите</option>
            <option value="да">да</option>
            <option value="нет">нет</option>
          </select>
        </label>
      </div>

      <div v-if="isGeneticConfirmed" class="form-group">
        <label class="form-label"
          >Ген с мутацией
          <select v-model="form.gene" class="form-select" required>
            <option disabled value="">Выберите</option>
            <option value="MECP2">MECP2</option>
            <option value="CDKL5">CDKL5</option>
            <option value="FOXG1">FOXG1</option>
            <option value="другой">другой</option>
          </select>
        </label>
      </div>

      <div v-if="isGeneticConfirmed && form.gene === 'другой'" class="form-group">
        <label class="form-label"
          >Укажите ген
          <input v-model="form.geneOther" class="form-input" type="text" required />
        </label>
      </div>

      <div v-if="isGeneticConfirmed" class="form-group">
        <label class="form-label"
          >Скан/фото генетического анализа (PDF/JPG/PNG)
          <input
            class="form-input"
            type="file"
            accept="application/pdf,image/*"
            @change="onFileChange"
          />
        </label>
        <p v-if="form.geneticTestFile && form.geneticTestFile.name" class="file-info">
          Файл: {{ form.geneticTestFile.name }} ({{ prettySize(form.geneticTestFile.size) }})
        </p>
        <p v-if="fileError" class="alert alert-error">{{ fileError }}</p>
      </div>

      <div v-if="isGeneticNotConfirmed" class="form-group">
        <label class="form-label"
          >Опишите, как, кем и когда поставлен диагноз
          <textarea
            v-model="form.diagnosisDescription"
            class="form-input textarea"
            :maxlength="2000"
            required
          />
        </label>
        <div class="muted">Осталось символов: {{ 2000 - (form.diagnosisDescription?.length || 0) }}</div>
      </div>

      <!-- Законный представитель -->
      <div class="form-group">
        <label class="checkbox-label">
          <input type="checkbox" v-model="form.isLegalRepresentative" />
          <span class="checkbox-text">Я являюсь законным представителем несовершеннолетнего ребенка/подопечного (родитель, опекун, попечитель)</span>
        </label>
        <p v-if="!form.isLegalRepresentative && triedSubmit" class="alert alert-error">
          Подтверждение законного представителя обязательно.
        </p>
      </div>

      <p v-if="formError" class="alert alert-error">{{ formError }}</p>

      <div class="form-buttons">
        <button class="btn submit" type="submit" :disabled="!canSubmit">Сохранить</button>
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
        middleName: '',
        gender: '',
        birthDate: '',
        citizenship: '', // РФ / Другое
        countryOfResidence: '', // Россия / Другая страна
        city: '',
        geneticTestConfirmed: '', // да / нет
        gene: '',
        geneOther: '',
        geneticTestFile: null, // { name, type, size, dataUrl }
        diagnosisDescription: '',
        isLegalRepresentative: false,
      },
      russianCities: [
        'Москва',
        'Санкт-Петербург',
        'Новосибирск',
        'Екатеринбург',
        'Нижний Новгород',
        'Казань',
        'Челябинск',
        'Самара',
        'Омск',
        'Ростов-на-Дону',
        'Уфа',
        'Красноярск',
        'Воронеж',
        'Пермь',
        'Волгоград',
        'Краснодар',
      ],
      triedSubmit: false,
      formError: '',
      fileError: '',
    };
  },
  computed: {
    isRussia() {
      return this.form.countryOfResidence === 'Россия';
    },
    isCitizenshipOther() {
      return this.form.citizenship === 'Другое';
    },
    isGeneticConfirmed() {
      return this.form.geneticTestConfirmed === 'да';
    },
    isGeneticNotConfirmed() {
      return this.form.geneticTestConfirmed === 'нет';
    },
    canSubmit() {
      // Базовая блокировка кнопки, чтобы UX был понятен
      if (this.isCitizenshipOther) return false;
      if (!this.form.isLegalRepresentative) return false;
      if (!this.form.lastName || !this.form.firstName || !this.form.gender || !this.form.birthDate) return false;
      if (!this.form.citizenship || !this.form.countryOfResidence) return false;
      if (this.isRussia && !this.form.city) return false;
      if (!this.form.geneticTestConfirmed) return false;
      if (this.isGeneticConfirmed) {
        if (!this.form.gene) return false;
        if (this.form.gene === 'другой' && !this.form.geneOther) return false;
      }
      if (this.isGeneticNotConfirmed && !this.form.diagnosisDescription) return false;
      if ((this.form.diagnosisDescription || '').length > 2000) return false;
      return true;
    },
  },
  mounted() {
    if (this.child) {
      // Заполняем форму, сохраняя значения по умолчанию для новых полей
      this.form = { ...this.form, ...this.child };
    }
  },
  methods: {
    async onFileChange(e) {
      this.fileError = '';
      const file = e.target.files?.[0];
      if (!file) {
        this.form.geneticTestFile = null;
        return;
      }
      const maxSize = 5 * 1024 * 1024; // 5MB
      const allowed = /^(application\/pdf|image\/)/;
      if (!allowed.test(file.type)) {
        this.fileError = 'Допустимы только PDF или изображения';
        e.target.value = '';
        return;
      }
      if (file.size > maxSize) {
        this.fileError = 'Размер файла не должен превышать 5 МБ';
        e.target.value = '';
        return;
      }
      const dataUrl = await this.readAsDataURL(file);
      this.form.geneticTestFile = {
        name: file.name,
        type: file.type,
        size: file.size,
        dataUrl,
      };
    },
    readAsDataURL(file) {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });
    },
    prettySize(size) {
      if (!size && size !== 0) return '';
      const units = ['Б', 'КБ', 'МБ', 'ГБ'];
      let i = 0;
      let s = size;
      while (s >= 1024 && i < units.length - 1) {
        s /= 1024;
        i++;
      }
      return `${s.toFixed(1)} ${units[i]}`;
    },
    validate() {
      this.formError = '';
      // Блокирующие условия
      if (this.isCitizenshipOther) {
        this.formError = 'Нельзя сохранить анкету при гражданстве «Другое»';
        return false;
      }
      if (!this.form.isLegalRepresentative) {
        this.formError = 'Необходимо подтвердить, что вы законный представитель';
        return false;
      }
      if (!this.form.lastName || !this.form.firstName || !this.form.gender || !this.form.birthDate) {
        this.formError = 'Заполните все обязательные поля';
        return false;
      }
      if (!this.form.citizenship || !this.form.countryOfResidence) {
        this.formError = 'Укажите гражданство и страну проживания';
        return false;
      }
      if (this.isRussia && !this.form.city) {
        this.formError = 'Выберите город проживания';
        return false;
      }
      if (!this.form.geneticTestConfirmed) {
        this.formError = 'Укажите подтверждение генетического теста';
        return false;
      }
      if (this.isGeneticConfirmed) {
        if (!this.form.gene) {
          this.formError = 'Укажите ген';
          return false;
        }
        if (this.form.gene === 'другой' && !this.form.geneOther) {
          this.formError = 'Укажите название гена';
          return false;
        }
        // файл не обязателен, но если выбран, уже проверен
      } else if (this.isGeneticNotConfirmed) {
        if (!this.form.diagnosisDescription) {
          this.formError = 'Опишите, кем и когда поставлен диагноз';
          return false;
        }
        if (this.form.diagnosisDescription.length > 2000) {
          this.formError = 'Описание не должно превышать 2000 символов';
          return false;
        }
      }
      return true;
    },
    submitForm() {
      this.triedSubmit = true;
      if (!this.validate()) return;
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

.checkbox-label {
  display: flex;
  align-items: flex-start;
  gap: 10px;
}

.checkbox-text {
  font-size: 14px;
  line-height: 1.4;
}

.alert {
  margin-top: 6px;
  font-size: 13px;
  border-radius: 6px;
  padding: 8px 10px;
}
.alert-warning {
  background-color: #fff3cd;
  color: #856404;
  border: 1px solid #ffeeba;
}
.alert-error {
  background-color: #f8d7da;
  color: #721c24;
  border: 1px solid #f5c6cb;
}
.muted {
  color: #666;
  font-size: 12px;
}
.file-info {
  font-size: 13px;
  color: #333;
}
.textarea {
  min-height: 120px;
  resize: vertical;
}
</style>
