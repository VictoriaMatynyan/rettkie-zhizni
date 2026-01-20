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
            :class="{ invalid: touched.lastName && !!lastNameError }"
            type="text"
            required
            @blur="onBlur('lastName')"
          />
          <p
            class="field-error"
            :class="{ visible: touched.lastName && !!lastNameError }"
          >
            {{ lastNameError }}
          </p>
        </label>
      </div>

      <div class="form-group">
        <label class="form-label"
          >Имя
          <input
            v-model="form.firstName"
            class="form-input"
            :class="{ invalid: touched.firstName && !!firstNameError }"
            type="text"
            required
            @blur="onBlur('firstName')"
          />
          <p
            class="field-error"
            :class="{ visible: touched.firstName && !!firstNameError }"
          >
            {{ firstNameError }}
          </p>
        </label>
      </div>

      <div class="form-group">
        <label class="form-label"
          >Отчество
          <input
            v-model="form.middleName"
            class="form-input"
            :class="{ invalid: touched.middleName && !!middleNameError }"
            type="text"
            required
            @blur="onBlur('middleName')"
          />
          <p
            class="field-error"
            :class="{ visible: touched.middleName && !!middleNameError }"
          >
            {{ middleNameError }}
          </p>
        </label>
      </div>

      <div class="form-group">
        <label class="form-label"
          >Пол
          <select
            v-model="form.gender"
            class="form-select"
            :class="{ invalid: touched.gender && !!genderError }"
            required
            @blur="onBlur('gender')"
          >
            <option class="form-option gender" disabled value="">
              Выберите пол
            </option>
            <option class="form-option" value="м">Мужской</option>
            <option class="form-option" value="ж">Женский</option>
          </select>
          <p
            class="field-error"
            :class="{ visible: touched.gender && !!genderError }"
          >
            {{ genderError }}
          </p>
        </label>
      </div>

      <div class="form-group">
        <label class="form-label"
          >Дата рождения
          <input
            v-model="form.birthDate"
            class="form-input"
            :class="{ invalid: touched.birthDate && !!birthDateError }"
            type="date"
            required
            @blur="onBlur('birthDate')"
          />
          <p
            class="field-error"
            :class="{ visible: touched.birthDate && !!birthDateError }"
          >
            {{ birthDateError }}
          </p>
        </label>
      </div>

      <!-- Гражданство -->
      <div class="form-group">
        <label class="form-label"
          >Гражданство
          <select
            v-model="form.citizenship"
            class="form-select"
            :class="{ invalid: touched.citizenship && !!citizenshipError }"
            required
            @blur="onBlur('citizenship')"
          >
            <option disabled value="">Выберите</option>
            <option value="РФ">РФ</option>
            <option value="Другое">Другое</option>
          </select>
        </label>
        <p
          class="field-error"
          :class="{ visible: touched.citizenship && !!citizenshipError }"
        >
          {{ citizenshipError }}
        </p>
        <p v-if="isCitizenshipOther" class="alert alert-warning">
          Для гражданства «Другое» сохранение анкеты недоступно.
        </p>
      </div>

      <!-- Страна проживания / город -->
      <div class="form-group">
        <label class="form-label"
          >Страна проживания
          <select
            v-model="form.countryOfResidence"
            class="form-select"
            :class="{ invalid: touched.countryOfResidence && !!countryError }"
            required
            @blur="onBlur('countryOfResidence')"
          >
            <option disabled value="">Выберите</option>
            <option value="Россия">Россия</option>
            <option value="Другая страна">Другая страна</option>
          </select>
          <p
            class="field-error"
            :class="{ visible: touched.countryOfResidence && !!countryError }"
          >
            {{ countryError }}
          </p>
        </label>
      </div>

      <div v-if="isRussia" class="form-group">
        <label class="form-label"
          >Город / Населенный пункт
          <select
            v-model="form.cityId"
            class="form-select"
            :class="{ invalid: touched.cityId && !!cityError }"
            :disabled="regionsLoading || !!regionsError"
            required
            @blur="onBlur('cityId')"
          >
            <option disabled value="">
              {{
                regionsLoading
                  ? 'Загрузка городов…'
                  : regionsError
                    ? 'Не удалось загрузить'
                    : 'Выберите город'
              }}
            </option>
            <option v-for="c in regions" :key="c.id" :value="c.id">
              {{ c.name }}
            </option>
          </select>
        </label>
        <p
          class="field-error"
          :class="{ visible: touched.cityId && !!cityError }"
        >
          {{ cityError }}
        </p>
        <p v-if="regionsError" class="alert alert-error">{{ regionsError }}</p>
      </div>

      <!-- Генетический анализ -->
      <div class="form-group">
        <label class="form-label"
          >Синдром Ретта подтвержден генетическим тестом?
          <select
            v-model="form.geneticTestConfirmed"
            class="form-select"
            :class="{
              invalid:
                touched.geneticTestConfirmed && !!geneticTestConfirmedError,
            }"
            required
            @blur="onBlur('geneticTestConfirmed')"
          >
            <option disabled value="">Выберите</option>
            <option value="да">да</option>
            <option value="нет">нет</option>
          </select>
          <p
            class="field-error"
            :class="{
              visible:
                touched.geneticTestConfirmed && !!geneticTestConfirmedError,
            }"
          >
            {{ geneticTestConfirmedError }}
          </p>
        </label>
      </div>

      <div v-if="isGeneticConfirmed" class="form-group">
        <label class="form-label"
          >Ген с мутацией
          <select
            v-model="form.geneId"
            class="form-select"
            :class="{ invalid: touched.geneId && !!geneIdError }"
            :disabled="mutationGenesLoading || !!mutationGenesError"
            required
            @blur="onBlur('geneId')"
          >
            <option disabled value="">
              {{
                mutationGenesLoading
                  ? 'Загрузка…'
                  : mutationGenesError
                    ? 'Не удалось загрузить'
                    : 'Выберите'
              }}
            </option>
            <option v-for="g in mutationGenes" :key="g.id" :value="g.id">
              {{ g.name }}
            </option>
          </select>
          <p
            class="field-error"
            :class="{ visible: touched.geneId && !!geneIdError }"
          >
            {{ geneIdError }}
          </p>
        </label>
        <p v-if="mutationGenesError" class="alert alert-error">
          {{ mutationGenesError }}
        </p>
      </div>

      <div v-if="isGeneticConfirmed && isGeneOther" class="form-group">
        <label class="form-label"
          >Укажите ген
          <input
            v-model="form.geneOther"
            class="form-input"
            :class="{ invalid: touched.geneOther && !!geneOtherError }"
            type="text"
            required
            @blur="onBlur('geneOther')"
          />
          <p
            class="field-error"
            :class="{ visible: touched.geneOther && !!geneOtherError }"
          >
            {{ geneOtherError }}
          </p>
        </label>
      </div>

      <div v-if="isGeneticConfirmed" class="form-group">
        <label class="form-label"
          >Скан/фото генетического анализа (PDF/JPG/PNG)
          <div class="file-upload">
            <input
              id="genetic-file"
              ref="fileInput"
              class="file-input-hidden"
              type="file"
              accept="application/pdf,image/*"
              @change="onFileChange"
            />
            <button type="button" class="file-button" @click="openFileDialog">
              Выбрать файл
            </button>
            <span class="file-chosen">{{ fileChosenText }}</span>
          </div>
        </label>
        <p v-if="fileError" class="alert alert-error">{{ fileError }}</p>
      </div>

      <div v-if="isGeneticNotConfirmed" class="form-group">
        <label class="form-label"
          >Опишите, как, кем и когда поставлен диагноз
          <textarea
            v-model="form.diagnosisDescription"
            class="form-input textarea"
            :class="{
              invalid: touched.diagnosisDescription && !!diagnosisError,
            }"
            :maxlength="2000"
            required
            @blur="onBlur('diagnosisDescription')"
          />
          <p
            class="field-error"
            :class="{
              visible: touched.diagnosisDescription && !!diagnosisError,
            }"
          >
            {{ diagnosisError }}
          </p>
        </label>
        <div class="muted">
          Осталось символов:
          {{ 2000 - (form.diagnosisDescription?.length || 0) }}
        </div>
      </div>

      <!-- Законный представитель -->
      <div class="form-group">
        <label class="checkbox-label">
          <input
            v-model="form.isLegalRepresentative"
            type="checkbox"
            @change="onBlur('isLegalRepresentative')"
          />
          <span class="checkbox-text"
            >Я являюсь законным представителем несовершеннолетнего
            ребенка/подопечного (родитель, опекун, попечитель)</span
          >
        </label>
        <p
          class="field-error"
          :class="{
            visible: touched.isLegalRepresentative && !!isLegalRepError,
          }"
        >
          {{ isLegalRepError }}
        </p>
      </div>

      <div class="form-buttons">
        <button class="btn submit" type="submit" :disabled="!canSubmit">
          Сохранить
        </button>
        <button class="btn cancel" type="button" @click="$emit('cancel')">
          Отмена
        </button>
      </div>
    </form>
  </div>
</template>

<script>
import { api } from '../services/api.js';
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
        citizenship: '',
        countryOfResidence: '',
        cityId: '',
        geneticTestConfirmed: '',
        geneId: '',
        geneOther: '',
        geneticTestFile: null,
        diagnosisDescription: '',
        isLegalRepresentative: false,
      },
      touched: {
        lastName: false,
        firstName: false,
        middleName: false,
        gender: false,
        birthDate: false,
        citizenship: false,
        countryOfResidence: false,
        cityId: false,
        geneticTestConfirmed: false,
        geneId: false,
        geneOther: false,
        diagnosisDescription: false,
        isLegalRepresentative: false,
      },
      regions: [],
      regionsLoading: false,
      regionsError: '',
      mutationGenes: [],
      mutationGenesLoading: false,
      mutationGenesError: '',
      triedSubmit: false,
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
    isGeneOther() {
      if (!this.form.geneId) return false;
      const g = this.mutationGenes.find(
        x => String(x.id) === String(this.form.geneId)
      );
      const name = (g?.name || '').toLowerCase();
      return name === 'другое' || name === 'другой';
    },
    fileChosenText() {
      const f = this.form.geneticTestFile;
      if (f && f.name) {
        return f.size ? `${f.name} (${this.prettySize(f.size)})` : f.name;
      }
      return 'Файл не выбран';
    },
    // Ошибки по полям
    lastNameError() {
      if (!this.form.lastName?.trim()) return 'Введите фамилию';
      return '';
    },
    firstNameError() {
      if (!this.form.firstName?.trim()) return 'Введите имя';
      return '';
    },
    middleNameError() {
      if (!this.form.middleName?.trim()) return 'Введите отчество';
      return '';
    },
    genderError() {
      if (!this.form.gender) return 'Выберите пол';
      return '';
    },
    birthDateError() {
      if (!this.form.birthDate) return 'Укажите дату рождения';
      return '';
    },
    citizenshipError() {
      if (!this.form.citizenship) return 'Выберите гражданство';
      if (this.isCitizenshipOther)
        return 'Для гражданства «Другое» сохранение недоступно';
      return '';
    },
    countryError() {
      if (!this.form.countryOfResidence) return 'Выберите страну проживания';
      return '';
    },
    cityError() {
      if (this.isRussia && !this.form.cityId) return 'Выберите город';
      return '';
    },
    geneticTestConfirmedError() {
      if (!this.form.geneticTestConfirmed)
        return 'Укажите подтверждение генетического теста';
      return '';
    },
    geneIdError() {
      if (this.isGeneticConfirmed && !this.form.geneId) return 'Выберите ген';
      return '';
    },
    geneOtherError() {
      if (
        this.isGeneticConfirmed &&
        this.isGeneOther &&
        !this.form.geneOther?.trim()
      )
        return 'Укажите название гена';
      return '';
    },
    diagnosisError() {
      const text = (this.form.diagnosisDescription || '').trim();
      if (this.isGeneticNotConfirmed && !text)
        return 'Опишите, кем и когда поставлен диагноз';
      if (text.length > 2000)
        return 'Описание не должно превышать 2000 символов';
      return '';
    },
    isLegalRepError() {
      if (!this.form.isLegalRepresentative)
        return 'Подтвердите, что вы законный представитель';
      return '';
    },
    isFormValid() {
      return !(
        this.lastNameError ||
        this.firstNameError ||
        this.middleNameError ||
        this.genderError ||
        this.birthDateError ||
        this.citizenshipError ||
        this.countryError ||
        this.cityError ||
        this.geneticTestConfirmedError ||
        this.geneIdError ||
        this.geneOtherError ||
        this.diagnosisError ||
        this.isLegalRepError
      );
    },
    canSubmit() {
      return this.isFormValid && !this.fileError;
    },
  },
  mounted() {
    if (this.child) {
      this.form = { ...this.form, ...this.child };
    }
    this.fetchRegions();
    this.fetchMutationGenes();
  },
  methods: {
    openFileDialog() {
      this.$refs.fileInput?.click();
    },
    onBlur(field) {
      if (field in this.touched) this.touched[field] = true;
      // Тримим текстовые поля
      if (
        [
          'lastName',
          'firstName',
          'middleName',
          'geneOther',
          'diagnosisDescription',
        ].includes(field)
      ) {
        this.form[field] = (this.form[field] || '').trim();
      }
    },
    async fetchRegions() {
      this.regionsLoading = true;
      this.regionsError = '';
      try {
        const res = await api.accounts.getRegions();
        this.regions = Array.isArray(res?.items) ? res.items : [];
      } catch (e) {
        this.regionsError =
          e?.response?.data?.message ||
          e.message ||
          'Не удалось загрузить список городов';
        this.regions = [];
      } finally {
        this.regionsLoading = false;
      }
    },
    async fetchMutationGenes() {
      this.mutationGenesLoading = true;
      this.mutationGenesError = '';
      try {
        const res = await api.accounts.getMutationGenes();
        this.mutationGenes = Array.isArray(res?.items) ? res.items : [];
        // Автосопоставление ранее сохраненного текстового поля gene к id
        if (!this.form.geneId && this.child && this.child.gene) {
          const childGene = String(this.child.gene).toLowerCase();
          const match = this.mutationGenes.find(
            g => String(g.name).toLowerCase() === childGene
          );
          if (match) this.form.geneId = match.id;
        }
      } catch (e) {
        this.mutationGenesError =
          e?.response?.data?.message ||
          e.message ||
          'Не удалось загрузить список генов';
        this.mutationGenes = [];
      } finally {
        this.mutationGenesLoading = false;
      }
    },
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
        file,
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
    submitForm() {
      this.triedSubmit = true;
      // Показать ошибки под всеми активными полями
      const toTouch = [
        'lastName',
        'firstName',
        'middleName',
        'gender',
        'birthDate',
        'citizenship',
        'countryOfResidence',
      ];
      if (this.isRussia) toTouch.push('cityId');
      toTouch.push('geneticTestConfirmed');
      if (this.isGeneticConfirmed) {
        toTouch.push('geneId');
        if (this.isGeneOther) toTouch.push('geneOther');
      } else if (this.isGeneticNotConfirmed) {
        toTouch.push('diagnosisDescription');
      }
      toTouch.push('isLegalRepresentative');
      toTouch.forEach(f => (this.touched[f] = true));
      if (!this.isFormValid) return;
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
  margin-bottom: 1.2rem;
}

.child-form-title {
  text-align: left;
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

/* Ошибки и состояния валидации */
.form-input.invalid,
.form-select.invalid {
  border-color: #dc3545;
}
.field-error {
  color: #dc3545;
  font-size: 12px;
  margin: 5px 0;
  min-height: 12px;
  line-height: 12px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  visibility: hidden;
}
.field-error.visible {
  visibility: visible;
}

.form-buttons {
  display: flex;
  justify-content: space-between;
  gap: 1rem;
  margin-top: 1.5rem;
}

.btn {
  margin: 0;
  background-color: transparent;
  border: none;
  border-bottom: 1px solid #23938c;
  color: black;
  padding: 10px 16px;
  font-size: 16px;
  border-radius: 6px;
  cursor: pointer;
  transition:
    background-color 0.2s ease,
    color 0.2s ease,
    border-color 0.2s ease;
}

.btn:disabled,
.btn[disabled] {
  border-color: rgba(35, 147, 140, 0.4);
  color: rgba(0, 0, 0, 0.4);
  cursor: not-allowed;
}

.btn.submit:hover {
  background-color: #23938c;
  color: white;
}

.btn.submit:disabled,
.btn.submit[disabled] {
  background-color: rgba(35, 147, 140, 0.4);
  color: rgba(255, 255, 255, 0.85);
  box-shadow: none;
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

/* Стили для загрузки файла */
.file-upload {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-top: 6px;
}
.file-input-hidden {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}
.file-button {
  background-color: transparent;
  border: 1px solid #23938c;
  color: #23938c;
  padding: 8px 12px;
  font-size: 14px;
  border-radius: 6px;
  cursor: pointer;
}
.file-button:hover {
  background-color: #23938c;
  color: white;
}
.file-chosen {
  font-size: 14px;
  color: #555;
}
</style>
