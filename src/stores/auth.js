import { defineStore } from 'pinia';
import { api } from '../services/api.js';

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null,
    accessToken: localStorage.getItem('accessToken'),
    refreshToken: localStorage.getItem('refreshToken'),
    isAuthenticated: !!localStorage.getItem('accessToken'),
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
      state.user
        ? `${state.user.firstName?.[0] || ''}${state.user.lastName?.[0] || ''}`
        : '',
  },

  actions: {
    async initAuth() {
      if (!this.accessToken) return;
      try {
        const { user } = await api.auth.me();
        this.user = user;
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
        this.user = data.user;
        this.accessToken = data.accessToken;
        this.refreshToken = data.refreshToken;
        this.isAuthenticated = true;
        localStorage.setItem('accessToken', data.accessToken);
        localStorage.setItem('refreshToken', data.refreshToken);
        return data.user;
      } catch (e) {
        this.error = e?.response?.data?.message || e.message;
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
        this.user = data.user;
        this.accessToken = data.accessToken;
        this.refreshToken = data.refreshToken;
        this.isAuthenticated = true;
        localStorage.setItem('accessToken', data.accessToken);
        localStorage.setItem('refreshToken', data.refreshToken);
        return data.user;
      } catch (e) {
        this.error = e?.response?.data?.message || e.message;
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
        this.user = updatedUser;
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
