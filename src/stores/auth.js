import { defineStore } from 'pinia';
import { api } from '../services/api.js';

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null,
    token: localStorage.getItem('authToken'),
    isAuthenticated: false,
    loading: false,
    error: null,
  }),

  getters: {
    isAdmin: state => state.user?.role === 'admin',
    isParent: state => state.user?.role === 'parent',
    isDoctor: state => state.user?.role === 'doctor',
    userFullName: state =>
      state.user ? `${state.user.firstName} ${state.user.lastName}` : '',
    userInitials: state =>
      state.user ? `${state.user.firstName[0]}${state.user.lastName[0]}` : '',
  },

  actions: {
    // Инициализация при загрузке приложения
    async initAuth() {
      const token = localStorage.getItem('authToken');
      const userId = localStorage.getItem('userId');

      if (token && userId) {
        try {
          // Загружаем данные пользователя
          const user = await api.users.getById(userId);
          this.user = user;
          this.token = token;
          this.isAuthenticated = true;
        } catch {
          // Если токен недействителен, очищаем данные
          this.logout();
        }
      }
    },

    // Регистрация
    async register(userData) {
      this.loading = true;
      this.error = null;

      try {
        // Проверяем, не существует ли уже пользователь с таким email
        const existingUsers = await api.users.getByEmail(userData.email);
        if (existingUsers.length > 0) {
          throw new Error('Пользователь с таким email уже существует');
        }

        // Создаем нового пользователя
        const newUser = {
          ...userData,
          role: userData.role || 'parent',
          registeredAt: new Date().toISOString(),
          isEmailVerified: false,
          isActive: true,
          hasConsentToDataProcessing: true,
        };

        const user = await api.users.create(newUser);

        // Автоматически авторизуем после регистрации
        await this.login({
          email: userData.email,
          password: userData.password,
        });

        return user;
      } catch (error) {
        this.error = error.message;
        throw error;
      } finally {
        this.loading = false;
      }
    },

    // Авторизация
    async login(credentials) {
      this.loading = true;
      this.error = null;

      try {
        // Ищем пользователя по email и паролю
        const users = await api.users.getByEmailAndPassword(
          credentials.email,
          credentials.password
        );

        if (users.length === 0) {
          throw new Error('Неверный email или пароль');
        }

        const user = users[0];

        if (!user.isActive) {
          throw new Error('Аккаунт заблокирован');
        }

        // Генерируем простой токен (в реальном проекте будет JWT)
        const token = `token_${user.id}_${Date.now()}`;

        // Сохраняем данные
        this.user = user;
        this.token = token;
        this.isAuthenticated = true;

        // Сохраняем в localStorage
        localStorage.setItem('authToken', token);
        localStorage.setItem('userId', user.id.toString());

        return user;
      } catch (error) {
        this.error = error.message;
        throw error;
      } finally {
        this.loading = false;
      }
    },

    // Выход
    logout() {
      this.user = null;
      this.token = null;
      this.isAuthenticated = false;
      this.error = null;

      // Очищаем localStorage
      localStorage.removeItem('authToken');
      localStorage.removeItem('userId');
    },

    // Обновление профиля
    async updateProfile(profileData) {
      this.loading = true;
      this.error = null;

      try {
        const updatedUser = await api.users.update(this.user.id, {
          ...this.user,
          ...profileData,
        });

        this.user = updatedUser;
        return updatedUser;
      } catch (error) {
        this.error = error.message;
        throw error;
      } finally {
        this.loading = false;
      }
    },

    // Изменение пароля
    async changePassword(currentPassword, newPassword) {
      this.loading = true;
      this.error = null;

      try {
        if (this.user.password !== currentPassword) {
          throw new Error('Неверный текущий пароль');
        }

        await api.users.update(this.user.id, {
          ...this.user,
          password: newPassword,
        });

        return true;
      } catch (error) {
        this.error = error.message;
        throw error;
      } finally {
        this.loading = false;
      }
    },

    // Очистка ошибок
    clearError() {
      this.error = null;
    },
  },
});
