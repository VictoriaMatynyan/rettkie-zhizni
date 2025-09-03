import { defineStore } from 'pinia';
import { api } from '../services/api.js';

// Приводим объект пользователя к единому формату
function normalizeUser(user) {
  if (!user || typeof user !== 'object') return user;
  const firstName = user.first_name ?? user.firstName ?? (user.name ? String(user.name).split(' ')[0] : undefined);
  const lastName = user.last_name ?? user.lastName ?? (user.name ? String(user.name).split(' ').slice(1).join(' ') || undefined : undefined);
  const userType = user.user_type ?? user.role ?? undefined;
  const isVerified = user.is_verified ?? user.isEmailVerified ?? undefined;

  return {
    ...user,
    first_name: firstName,
    last_name: lastName,
    user_type: userType,
    is_verified: isVerified,
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

    async updateProfile(profileData) {
      this.loading = true;
      this.error = null;
      try {
        const updatedUser = await api.users.update(this.user.id, {
          ...this.user,
          ...profileData,
        });
        this.user = normalizeUser(updatedUser);
        return updatedUser;
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
