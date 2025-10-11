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
          <button
            class="menu-button delete-button"
            @click="requestDelete(index)"
          >
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
    <ConfirmModal
      v-model="showDeleteConfirm"
      title="Удалить анкету?"
      :message="deleteConfirmMessage"
      confirm-text="Да"
      cancel-text="Отмена"
      @confirm="confirmDelete"
      @cancel="cancelDelete"
    />
  </div>
</template>

<script>
import ChildForm from './ChildForm.vue';
import ConfirmModal from './ConfirmModal.vue';
import { api } from '../services/api.js';
import { useAuthStore } from '../stores/auth.js';

export default {
  name: 'ChildrenProfiles',
  components: { ChildForm, ConfirmModal },
  data() {
    return {
      children: [], // список анкет текущего пользователя
      showForm: false,
      editedIndex: null,
      loading: false,
      error: null,
      showDeleteConfirm: false,
      pendingDeleteIndex: null,
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
    pendingChild() {
      if (this.pendingDeleteIndex === null) return null;
      return this.children[this.pendingDeleteIndex] || null;
    },
    deleteConfirmMessage() {
      const child = this.pendingChild;
      if (!child) {
        return 'Вы уверены, что хотите удалить анкету?';
      }
      const parts = [child.lastName, child.firstName].filter(Boolean);
      const name = parts.join(' ').trim();
      return name
        ? `Вы уверены, что хотите удалить анкету "${name}"?`
        : 'Вы уверены, что хотите удалить анкету?';
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
          gender:
            item.gender === 'женский'
              ? 'ж'
              : item.gender === 'мужской'
                ? 'м'
                : item.gender || '',
          birthDate: item.birth_date || '',
          citizenship:
            item.citizenship === 'Россия' ? 'РФ' : item.citizenship || '',
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
        this.error =
          e?.response?.data?.message ||
          e.message ||
          'Не удалось загрузить анкеты';
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
        try {
          alert('Анкета успешно сохранена');
        } catch (_) {}
        return res;
      } catch (e) {
        this.error =
          e?.response?.data?.message ||
          e.message ||
          'Не удалось сохранить анкету';
        throw e;
      } finally {
        this.loading = false;
      }
    },

    requestDelete(index) {
      this.pendingDeleteIndex = index;
      this.showDeleteConfirm = true;
    },
    cancelDelete() {
      this.showDeleteConfirm = false;
      this.pendingDeleteIndex = null;
    },
    async confirmDelete() {
      if (this.pendingDeleteIndex === null) {
        this.showDeleteConfirm = false;
        return;
      }
      this.loading = true;
      this.error = null;
      try {
        const child = this.children[this.pendingDeleteIndex];
        if (!child) throw new Error('Анкета не найдена');
        await api.accounts.deleteQuestionnaire(child.id);
        // После успешного удаления — обновим список с сервера
        await this.loadChildren();
        this.cancelDelete();
      } catch (e) {
        this.error =
          e?.response?.data?.message ||
          e.message ||
          'Не удалось удалить анкету';
        this.cancelDelete();
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
.children-profiles {
  max-width: 800px;
  margin: 0 auto;
}

.children-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: clamp(16px, 3.5vw, 28px);
}

.child-card {
  max-width: 1050px;
  display: flex;
  flex-direction: column;
  gap: clamp(12px, 2vw, 20px);
  padding: clamp(16px, 3vw, 24px);
  border: 1px solid rgba(35, 147, 140, 0.18);
  border-radius: 14px;
  background: #fff;
  box-shadow: 0 12px 30px rgba(23, 60, 108, 0.06);
  transition:
    box-shadow 0.2s ease,
    transform 0.2s ease;
}

.child-card:hover {
  box-shadow: 0 16px 34px rgba(23, 60, 108, 0.12);
  transform: translateY(-2px);
}

.child-info p {
  margin: 0;
  font-size: clamp(14px, 2.1vw, 16px);
  color: #2c3e50;
}

.child-info strong {
  font-size: clamp(15px, 2.3vw, 18px);
}

.child-actions {
  margin-top: auto;
  display: flex;
  flex-wrap: wrap;
  gap: clamp(10px, 2.5vw, 18px);
  justify-content: flex-end;
}

.menu-button {
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  background-color: transparent;
  border: 1px solid #23938c;
  color: #23938c;
  padding: clamp(10px, 2.6vw, 14px) clamp(16px, 4vw, 28px);
  font-size: clamp(13px, 2vw, 15px);
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
  background-repeat: no-repeat;
  background-position: 18px 50%;
  background-size: clamp(16px, 3vw, 20px);
  padding-left: clamp(40px, 5vw, 52px);
}

.menu-button:hover {
  background-color: #23938c;
  color: white;
  box-shadow: 0 4px 12px rgba(35, 147, 140, 0.25);
}

.edit-button {
  background-image: url('../assets/edit-icon.png');
}
.edit-button:hover {
  background-image: url('../assets/edit-icon-hover.png');
}

.delete-button {
  background-image: url('../assets/delete-icon.png');
}
.delete-button:hover {
  background-image: url('../assets/delete-icon-hover.png');
}

.add-button {
  align-self: flex-start;
  background-color: transparent;
  border: 1px solid #23938c;
  color: #23938c;
  padding: clamp(12px, 3vw, 16px) clamp(18px, 4vw, 24px);
  font-size: clamp(14px, 2.2vw, 16px);
  border-radius: 8px;
  cursor: pointer;
  transition:
    background-color 0.2s ease,
    color 0.2s ease,
    box-shadow 0.2s ease;
}

.add-button:hover {
  background-color: #23938c;
  color: white;
  box-shadow: 0 4px 12px rgba(35, 147, 140, 0.25);
}

@media (max-width: 640px) {
  .children-list {
    grid-template-columns: 1fr;
  }

  .child-actions {
    flex-direction: column;
    align-items: stretch;
  }

  .menu-button,
  .add-button {
    width: 100%;
    text-align: center;
    background-position: 18px 50%;
  }

  .menu-button {
    padding-left: clamp(44px, 8vw, 60px);
  }
}
</style>
