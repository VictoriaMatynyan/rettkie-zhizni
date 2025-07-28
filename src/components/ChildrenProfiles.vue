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

export default {
  name: 'ChildrenProfiles',
  components: { ChildForm },
  data() {
    return {
      children: [], // Здесь будет список анкет
      showForm: false,
      editedIndex: null,
    };
  },
  computed: {
    editedChild() {
      return this.editedIndex !== null
        ? { ...this.children[this.editedIndex] }
        : null;
    },
  },
  methods: {
    saveChild(data) {
      if (this.editedIndex !== null) {
        this.children.splice(this.editedIndex, 1, data);
      } else {
        data.id = Date.now();
        this.children.push(data);
      }
      this.cancelEdit();
    },
    deleteChild(index) {
      if (confirm('Удалить эту анкету?')) {
        this.children.splice(index, 1);
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
