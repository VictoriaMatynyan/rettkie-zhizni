import { defineStore } from 'pinia';
import { api } from '../services/api.js';

// Приводим объект пользователя к единому формату
function normalizeUser(user) {
  if (!user || typeof user !== 'object') return user;
  const firstName =
    user.first_name ??
    user.firstName ??
    (user.name ? String(user.name).split(' ')[0] : undefined);
  const lastName =
    user.last_name ??
    user.lastName ??
    (user.name
      ? String(user.name).split(' ').slice(1).join(' ') || undefined
      : undefined);
  const userType = user.user_type ?? user.role ?? undefined;
  const isVerified = user.is_verified ?? user.isEmailVerified ?? undefined;
  // Флаг подписки приходит как receive_news (boolean)
  const emailNotificationsRaw = user.receive_news ?? user.email_notifications;
  const emailNotifications = typeof emailNotificationsRaw === 'boolean'
    ? emailNotificationsRaw
    : undefined;

  return {
    ...user,
    first_name: firstName,
    last_name: lastName,
    user_type: userType,
    is_verified: isVerified,
    email_notifications: emailNotifications,
  };
}

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null,
    accessToken: localStorage.getItem('accessToken'),
    refreshToken: localStorage.getItem('refreshToken'),
    isAuthenticated: !!localStorage.getItem('accessToken'),
    loading: false,
    error: null,
    registrationSuccess: false,
  }),

  getters: {
    isAdmin: state => state.user?.user_type === 'admin',
    isParent: state => state.user?.user_type === 'parent',
    isDoctor: state => state.user?.user_type === 'doctor',
    isVerified: state => state.user?.is_verified,
    userFullName: state => {
      if (!state.user) return '';
      const first = state.user.first_name ?? state.user.firstName ?? '';
      const last = state.user.last_name ?? state.user.lastName ?? '';
      return [first, last].filter(Boolean).join(' ');
    },
    userInitials: state => {
      if (!state.user) return '';
      const first = state.user.first_name ?? state.user.firstName ?? '';
      const last = state.user.last_name ?? state.user.lastName ?? '';
      return `${first?.[0] || ''}${last?.[0] || ''}`.toUpperCase();
    },
  },

  actions: {
    async fetchUserProfile() {
      try {
        const user = await api.auth.me();
        this.user = normalizeUser(user);
        return user;
      } catch (e) {
        if (e.response?.status === 401) {
          this.logout();
        }
        throw e;
      }
    },

    async initAuth() {
      if (!this.accessToken) return;
      try {
        await this.fetchUserProfile();
        this.isAuthenticated = true;
      } catch {
        this.logout();
      }
    },

    async register(payload) {
      this.loading = true;
      this.error = null;
      try {
        const data = await api.auth.register(payload);
        this.registrationSuccess = true;
        return data;
      } catch (e) {
        // Go API может вернуть ошибки валидации в виде объекта
        if (e.response?.data?.errors) {
          this.error = Object.values(e.response.data.errors).flat().join(', ');
        } else {
          this.error = e?.response?.data?.message || e.message;
        }
        throw e;
      } finally {
        this.loading = false;
      }
    },

    async login(credentials) {
      this.loading = true;
      this.error = null;
      try {
        const data = await api.auth.login(credentials);
        this.accessToken = data.access;
        this.refreshToken = data.refresh;
        this.isAuthenticated = true;
        localStorage.setItem('accessToken', data.access);
        localStorage.setItem('refreshToken', data.refresh);

        // После успешного логина получаем данные пользователя
        await this.fetchUserProfile();
        return this.user;
      } catch (e) {
        // Обработка ошибок аутентификации
        if (e.response?.data?.detail) {
          this.error = e.response.data.detail;
        } else {
          this.error = e?.response?.data?.message || e.message;
        }
        throw e;
      } finally {
        this.loading = false;
      }
    },

    logout() {
      this.user = null;
      this.accessToken = null;
      this.refreshToken = null;
      this.isAuthenticated = false;
      this.error = null;
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
    },

    async logoutRemote() {
      try {
        const rt = this.refreshToken || localStorage.getItem('refreshToken');
        if (rt) {
          await api.auth.logout(rt);
        }
      } catch (e) {
        // Не блокируем локальный выход, даже если сервер вернул ошибку
        console.warn(
          'Не удалось выйти из аккаунта:',
          e?.response?.data || e.message || e
        );
      } finally {
        this.logout();
      }
    },

    async updateProfile(profileData, options = {}) {
      this.loading = true;
      this.error = null;
      try {
        // Вычисляем изменённые поля относительно текущего пользователя,
        // либо отправляем как есть, если включён режим force.
        const allowedKeys = [
          'first_name',
          'last_name',
          'email',
          'phone',
          'email_notifications',
        ];

        const current = this.user ? normalizeUser(this.user) : {};
        const changed = {};

        if (options.force) {
          for (const key of allowedKeys) {
            if (!(key in profileData)) continue;
            if (key === 'email_notifications') changed.receive_news = !!profileData[key];
            else changed[key] = profileData[key];
          }
        } else {
          for (const key of allowedKeys) {
            if (!(key in profileData)) continue;
            const newVal = key === 'email_notifications' ? !!profileData[key] : profileData[key];
            const curVal = current?.[key];
            // Отправляем только реально изменившиеся значения (включая пустые строки)
            if (newVal !== curVal) {
              if (key === 'email_notifications') changed.receive_news = newVal;
              else changed[key] = newVal;
            }
          }
        }

        // Если изменений нет — возвращаем текущего пользователя без запроса
        if (Object.keys(changed).length === 0) {
          return this.user;
        }

        // Делаем запрос обновления и мёрджим частичный ответ с текущим пользователем
        const updatedUser = await api.auth.updateMe(changed);
        const merged = normalizeUser({ ...(this.user || {}), ...(updatedUser || {}) });
        this.user = merged;
        return merged;
      } catch (e) {
        this.error = e?.response?.data?.message || e.message;
        throw e;
      } finally {
        this.loading = false;
      }
    },

    clearError() {
      this.error = null;
    },
  },
});
