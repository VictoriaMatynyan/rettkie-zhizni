// API базовый URL
const API_BASE_URL = 'http://localhost:3001';

// Базовый класс для работы с API
class ApiService {
  constructor(baseURL = API_BASE_URL) {
    this.baseURL = baseURL;
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  // GET запрос
  async get(endpoint) {
    return this.request(endpoint);
  }

  // POST запрос
  async post(endpoint, data) {
    return this.request(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // PUT запрос
  async put(endpoint, data) {
    return this.request(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  // PATCH запрос
  async patch(endpoint, data) {
    return this.request(endpoint, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  }

  // DELETE запрос
  async delete(endpoint) {
    return this.request(endpoint, {
      method: 'DELETE',
    });
  }
}

// Создаем экземпляр API сервиса
const apiService = new ApiService();

// Специфичные методы для работы с данными приложения
export const api = {
  // Дети
  children: {
    getAll: () => apiService.get('/children'),
    getById: id => apiService.get(`/children/${id}`),
    create: data => apiService.post('/children', data),
    update: (id, data) => apiService.put(`/children/${id}`, data),
    delete: id => apiService.delete(`/children/${id}`),
  },

  // Новости
  news: {
    getAll: () => apiService.get('/news'),
    getById: id => apiService.get(`/news/${id}`),
    create: data => apiService.post('/news', data),
    update: (id, data) => apiService.put(`/news/${id}`, data),
    delete: id => apiService.delete(`/news/${id}`),
  },

  // Статьи
  articles: {
    getAll: () => apiService.get('/articles'),
    getById: id => apiService.get(`/articles/${id}`),
    create: data => apiService.post('/articles', data),
    update: (id, data) => apiService.put(`/articles/${id}`, data),
    delete: id => apiService.delete(`/articles/${id}`),
  },

  // События
  events: {
    getAll: () => apiService.get('/events'),
    getById: id => apiService.get(`/events/${id}`),
    create: data => apiService.post('/events', data),
    update: (id, data) => apiService.put(`/events/${id}`, data),
    delete: id => apiService.delete(`/events/${id}`),
  },

  // Истории
  stories: {
    getAll: () => apiService.get('/stories'),
    getById: id => apiService.get(`/stories/${id}`),
    create: data => apiService.post('/stories', data),
    update: (id, data) => apiService.put(`/stories/${id}`, data),
    delete: id => apiService.delete(`/stories/${id}`),
  },

  // Врачи
  doctors: {
    getAll: () => apiService.get('/doctors'),
    getById: id => apiService.get(`/doctors/${id}`),
    create: data => apiService.post('/doctors', data),
    update: (id, data) => apiService.put(`/doctors/${id}`, data),
    delete: id => apiService.delete(`/doctors/${id}`),
  },

  // Регионы
  regions: {
    getAll: () => apiService.get('/regions'),
  },

  // Контакты
  contacts: {
    getAll: () => apiService.get('/contacts'),
    create: data => apiService.post('/contacts', data),
    update: (id, data) => apiService.put(`/contacts/${id}`, data),
    delete: id => apiService.delete(`/contacts/${id}`),
  },
};

export default apiService;
