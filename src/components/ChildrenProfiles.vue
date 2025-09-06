<template>
  <div class="children-profiles">
    <h2>Анкеты подопечных</h2>

    <div v-if="children.length === 0" class="empty-message">
      Пока нет ни одной анкеты. Добавьте первую!
    </div>

    <ul v-else class="children-list">
      <li v-for="(child, index) in children" :key="child.id" class="child-card">
        <div class="child-info">
          <p>
            <strong>{{ child.lastName }} {{ child.firstName }}</strong> ({{
              child.gender
            }})
          </p>
          <p>Дата рождения: {{ child.birthDate }}</p>
        </div>
        <div class="child-actions">
          <button class="menu-button edit-button" @click="editChild(index)">
            Редактировать
          </button>
          <button class="menu-button delete-button" @click="deleteChild(index)">
            Удалить
          </button>
        </div>
      </li>
    </ul>

    <button class="add-button" @click="showForm = true">Добавить анкету</button>

    <ChildForm
      v-if="showForm"
      :child="editedChild"
      @save="saveChild"
      @cancel="cancelEdit"
    />
  </div>
</template>

<script>
import ChildForm from './ChildForm.vue';
import { api } from '../services/api.js';
import { useAuthStore } from '../stores/auth.js';

export default {
  name: 'ChildrenProfiles',
  components: { ChildForm },
  data() {
    return {
      children: [], // список анкет текущего пользователя
      showForm: false,
      editedIndex: null,
      loading: false,
      error: null,
    };
  },
  computed: {
    editedChild() {
      return this.editedIndex !== null
        ? { ...this.children[this.editedIndex] }
        : null;
    },
    authStore() {
      return useAuthStore();
    },
  },
  async mounted() {
    await this.loadChildren();
  },
  methods: {
    async loadChildren() {
      this.loading = true;
      this.error = null;
      try {
        // Обеспечим наличие токена/пользователя
        if (!this.authStore.isAuthenticated || !this.authStore.user) {
          await this.authStore.initAuth();
        }
        // Загружаем анкеты текущего пользователя с backend
        const res = await api.accounts.getMyQuestionnaires();
        const items = Array.isArray(res?.items) ? res.items : [];
        // Приводим к внутреннему формату полей, совместимому с ChildForm
        this.children = items.map(item => ({
          id: item.id,
          userId: item.user_id,
          lastName: item.last_name || '',
          firstName: item.first_name || '',
          middleName: item.middle_name || '',
          gender: item.gender === 'женский' ? 'ж' : item.gender === 'мужской' ? 'м' : (item.gender || ''),
          birthDate: item.birth_date || '',
          citizenship: item.citizenship === 'Россия' ? 'РФ' : (item.citizenship || ''),
          countryOfResidence: item.country_of_residence || '',
          cityId: item.city?.id ?? '',
          geneticTestConfirmed: item.rett_confirmed || '',
          diagnosisDescription: item.diagnosis_details || '',
          geneId: item.mutation_gene?.id ?? '',
          geneOther: item.mutation_gene_other || '',
          isLegalRepresentative: !!item.is_legal_representative,
          // Показываем в плейсхолдере название файла, если пришёл URL
          geneticTestFile: (() => {
            const url = item.genetic_scan || '';
            if (!url) return null;
            try {
              const name = decodeURIComponent(url.split('/').pop() || '');
              return name ? { name, url } : null;
            } catch (_) {
              const name = (url.split('/').pop() || '').replace(/\?.*$/, '');
              return name ? { name, url } : null;
            }
          })(),
          // Дополнительно сохраняем для потенциального отображения
          city: item.city || null,
          mutationGene: item.mutation_gene || null,
          createdAt: item.created_at,
          updatedAt: item.updated_at,
        }));
      } catch (e) {
        this.error = e?.response?.data?.message || e.message || 'Не удалось загрузить анкеты';
        this.children = [];
      } finally {
        this.loading = false;
      }
    },

    async saveChild(data) {
      this.loading = true;
      this.error = null;
      try {
        let res;
        if (this.editedIndex !== null) {
          // Редактирование: отправляем только изменённые поля
          const original = this.children[this.editedIndex] || {};
          const updated = data || {};
          const diff = {};

          const keys = [
            'lastName',
            'firstName',
            'middleName',
            'gender',
            'birthDate',
            'citizenship',
            'countryOfResidence',
            'cityId',
            'geneticTestConfirmed',
            'diagnosisDescription',
            'geneId',
            'geneOther',
            'isLegalRepresentative',
          ];

          for (const k of keys) {
            const a = original?.[k];
            const b = updated?.[k];
            if ((a ?? '') !== (b ?? '')) diff[k] = b;
          }
          // Обработка файла: если выбран новый файл — отправляем
          if (updated?.geneticTestFile?.file instanceof File) {
            diff.geneticTestFile = updated.geneticTestFile;
          }
          // city_id алиас для API
          if ('cityId' in diff && diff.cityId != null) {
            diff.city_id = diff.cityId;
          }

          // Если нет изменений — просто закрываем форму
          const hasChanges =
            Object.keys(diff).length > 0 ||
            updated?.geneticTestFile?.file instanceof File;
          if (!hasChanges) {
            this.cancelEdit();
            return;
          }

          const id = original.id;
          res = await api.accounts.updateQuestionnaire(id, diff);
        } else {
          // Создание
          res = await api.accounts.createQuestionnaire({
            ...data,
            city_id: data.cityId ?? data.city_id,
          });
        }

        // Успех
        this.cancelEdit();
        await this.loadChildren();
        try { alert('Анкета успешно сохранена'); } catch (_) {}
        return res;
      } catch (e) {
        this.error =
          e?.response?.data?.message || e.message || 'Не удалось сохранить анкету';
        throw e;
      } finally {
        this.loading = false;
      }
    },

    async deleteChild(index) {
      if (!confirm('Удалить эту анкету?')) return;
      this.loading = true;
      this.error = null;
      try {
        const child = this.children[index];
        await api.accounts.deleteQuestionnaire(child.id);
        // После успешного удаления — обновим список с сервера
        await this.loadChildren();
      } catch (e) {
        this.error = e?.response?.data?.message || e.message || 'Не удалось удалить анкету';
      } finally {
        this.loading = false;
      }
    },
    editChild(index) {
      this.editedIndex = index;
      this.showForm = true;
    },
    cancelEdit() {
      this.editedIndex = null;
      this.showForm = false;
    },
  },
};
</script>

<style scoped>
.children-list {
  list-style: none;
  padding: 0;
}
.child-card {
  border: 1px solid #ccc;
  padding: 1em;
  margin-bottom: 1em;
}
.child-actions {
  margin-top: 0.5em;
  display: flex;
  justify-content: space-between;
}

.menu-button {
  background-color: transparent;
  border: 1px solid #23938c;
  color: #23938c;
  padding: 10px 15px 10px 30px;
  font-size: 14px;
  border-radius: 6px;
  cursor: pointer;
}

.menu-button:hover {
  background-color: #23938c;
  color: white;
}

.edit-button {
  background: url('../assets/edit-icon.png') no-repeat 7px 6px/13%;
}
.edit-button:hover {
  background-image: url('../assets/edit-icon-hover.png');
}

.delete-button {
  background: url('../assets/delete-icon.png') no-repeat 7px 11px/14%;
}
.delete-button:hover {
  background-image: url('../assets/delete-icon-hover.png');
}

.add-button {
  margin-top: 16px;
  background-color: transparent;
  border: 1px solid #23938c;
  color: #23938c;
  padding: 10px 15px;
  font-size: 14px;
  border-radius: 6px;
  cursor: pointer;
}

.add-button:hover {
  background-color: #23938c;
  color: white;
}
</style>
