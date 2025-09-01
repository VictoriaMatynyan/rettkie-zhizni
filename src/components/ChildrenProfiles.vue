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
        // Убедимся, что авторизация и пользователь доступны
        if (!this.authStore.isAuthenticated || !this.authStore.user) {
          await this.authStore.initAuth();
        }
        const userId = this.authStore.user?.id;
        if (!userId) {
          this.children = [];
          return;
        }

        // Основной запрос по userId
        let list = await api.children.getByUserId(userId);

        // Фолбэк: если id строковый и массив пуст — пробуем числовое значение
        if (Array.isArray(list) && list.length === 0 && typeof userId === 'string' && !Number.isNaN(Number(userId))) {
          list = await api.children.getByUserId(Number(userId));
        }

        // На всякий случай фильтруем по совпадению userId (строгая или приведенная)
        const idStr = String(userId);
        this.children = (list || []).filter(c => String(c.userId) === idStr);
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
        const userId = this.authStore.user?.id;
        if (!userId) throw new Error('Пользователь не найден');

        if (this.editedIndex !== null) {
          const current = this.children[this.editedIndex];
          const payload = { ...current, ...data, userId, updatedAt: new Date().toISOString() };
          const updated = await api.children.update(current.id, payload);
          this.children.splice(this.editedIndex, 1, updated);
        } else {
          const payload = {
            ...data,
            userId,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          };
          const created = await api.children.create(payload);
          this.children.push(created);
        }
        this.cancelEdit();
      } catch (e) {
        this.error = e?.response?.data?.message || e.message || 'Не удалось сохранить анкету';
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
        await api.children.delete(child.id);
        this.children.splice(index, 1);
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
