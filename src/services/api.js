import axios from 'axios';

// API базовый URL
const API_BASE_URL = 'http://127.0.0.1:8000';

// Axios instance
export const httpClient = axios.create({
  baseURL: API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
});

function getAccessToken() {
  return localStorage.getItem('accessToken');
}
function setAccessToken(token) {
  if (!token) localStorage.removeItem('accessToken');
  else localStorage.setItem('accessToken', token);
}
function getRefreshToken() {
  return localStorage.getItem('refreshToken');
}
function setRefreshToken(token) {
  if (!token) localStorage.removeItem('refreshToken');
  else localStorage.setItem('refreshToken', token);
}

// Attach token
httpClient.interceptors.request.use(config => {
  const token = getAccessToken();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

let isRefreshing = false;
let queue = [];

httpClient.interceptors.response.use(
  r => r,
  async err => {
    const original = err.config || {};
    if (err.response?.status === 401 && !original._retry) {
      original._retry = true;
      const rt = getRefreshToken();
      if (!rt) {
        setAccessToken(null);
        setRefreshToken(null);
        return Promise.reject(err);
      }

      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          queue.push({ resolve, reject });
        })
          .then(token => {
            original.headers = original.headers || {};
            original.headers.Authorization = `Bearer ${token}`;
            return httpClient(original);
          })
          .catch(e => Promise.reject(e));
      }

      try {
        isRefreshing = true;
        const { data } = await httpClient.post('/accounts/refresh/', {
          refresh: rt,
        });
        if (data.ok && data.access) {
          setAccessToken(data.access);
          setRefreshToken(data.refresh);
          queue.forEach(p => p.resolve(data.access));
          queue = [];
          isRefreshing = false;
          original.headers = original.headers || {};
          original.headers.Authorization = `Bearer ${data.access}`;
          return httpClient(original);
        }
        throw new Error('Refresh failed');
      } catch (e) {
        isRefreshing = false;
        setAccessToken(null);
        setRefreshToken(null);
        queue.forEach(p => p.reject(e));
        queue = [];
        return Promise.reject(e);
      }
    }
    return Promise.reject(err);
  }
);

// API Methods
export const api = {
  auth: {
    register: payload =>
      httpClient.post('/accounts/register/', payload).then(r => r.data),
    login: payload =>
      httpClient.post('/accounts/login/', payload).then(r => r.data),
    // Запрос на отправку письма для восстановления пароля
    requestPasswordReset: ({ email }) =>
      httpClient.post('/accounts/password/reset/', { email }).then(r => r.data),
    // Подтверждение сброса пароля (если будет отдельная страница/форма)
    confirmPasswordReset: payload =>
      httpClient
        .post('/accounts/password/reset/confirm/', payload)
        .then(r => r.data),
    refresh: refreshToken =>
      httpClient
        .post('/accounts/refresh/', { refresh: refreshToken })
        .then(r => r.data),
    me: () => httpClient.get('/accounts/me/').then(r => r.data),
  },

  // Справочники аккаунтов
  accounts: {
    getRegions: () => httpClient.get('/accounts/regions/').then(r => r.data),
    getUserTypes: () =>
      httpClient.get('/accounts/user-types/').then(r => r.data),
    // Создание анкеты подопечного
    createQuestionnaire: payload => {
      const fd = new FormData();
      // Поля ФИО
      if (payload.lastName) fd.append('last_name', payload.lastName);
      if (payload.firstName) fd.append('first_name', payload.firstName);
      if (payload.middleName) fd.append('middle_name', payload.middleName);

      // Пол: преобразуем м/ж в мужской/женский при необходимости
      if (payload.gender) {
        const g = payload.gender;
        const gender = g === 'м' ? 'мужской' : g === 'ж' ? 'женский' : g;
        fd.append('gender', gender);
      }

      // Дата рождения (YYYY-MM-DD)
      if (payload.birthDate) fd.append('birth_date', payload.birthDate);

      // Гражданство и страна проживания
      if (payload.citizenship) {
        const c = payload.citizenship;
        const citizenship = c === 'РФ' ? 'Россия' : c;
        fd.append('citizenship', citizenship);
      }
      if (payload.countryOfResidence) {
        fd.append('country_of_residence', payload.countryOfResidence);
      }

      // Город: используем id из формы (без хардкода)
      const cityId =
        payload.city_id ??
        payload.cityId ??
        (payload.city && typeof payload.city === 'object'
          ? payload.city.id
          : null);
      if (cityId !== null) fd.append('city_id', String(cityId));

      // Подтверждение Ретта и детали диагноза
      if (payload.geneticTestConfirmed)
        fd.append('rett_confirmed', payload.geneticTestConfirmed);
      if (payload.diagnosisDescription)
        fd.append('diagnosis_details', payload.diagnosisDescription);

      // Ген мутации: сопоставляем известные гены к id, иначе используем other
      if (payload.gene) {
        const geneMap = { MECP2: 1, CDKL5: 2, FOXG1: 3 };
        const geneId = geneMap[payload.gene];
        if (geneId) fd.append('mutation_gene_id', String(geneId));
        if (payload.gene === 'другой' && payload.geneOther) {
          fd.append('mutation_gene_other', payload.geneOther);
        }
      }

      // Законный представитель
      if (typeof payload.isLegalRepresentative === 'boolean') {
        fd.append(
          'is_legal_representative',
          String(payload.isLegalRepresentative)
        );
      }

      // Файл генетического анализа
      const fileObj = payload.geneticTestFile?.file || payload.geneticTestFile;
      if (fileObj instanceof File) {
        fd.append('genetic_scan', fileObj, fileObj.name);
      }

      return httpClient
        .post('/accounts/questionnaires/', fd, {
          headers: { 'Content-Type': 'multipart/form-data' },
        })
        .then(r => r.data);
    },
  },

  // Пользователи
  users: {
    getAll: () => httpClient.get('/users').then(r => r.data),
    getById: id => httpClient.get(`/users/${id}`).then(r => r.data),
    getByEmail: email =>
      httpClient
        .get(`/users?email=${encodeURIComponent(email)}`)
        .then(r => r.data),
    create: data => httpClient.post('/users', data).then(r => r.data),
    update: (id, data) =>
      httpClient.put(`/users/${id}`, data).then(r => r.data),
    delete: id => httpClient.delete(`/users/${id}`).then(r => r.data),
  },

  // Дети
  children: {
    getAll: () => httpClient.get('/children').then(r => r.data),
    getById: id => httpClient.get(`/children/${id}`).then(r => r.data),
    getByUserId: userId =>
      httpClient.get(`/children?userId=${userId}`).then(r => r.data),
    create: data => httpClient.post('/children', data).then(r => r.data),
    update: (id, data) =>
      httpClient.put(`/children/${id}`, data).then(r => r.data),
    delete: id => httpClient.delete(`/children/${id}`).then(r => r.data),
  },

  // Новости
  news: {
    getAll: () => httpClient.get('/news').then(r => r.data),
    getById: id => httpClient.get(`/news/${id}`).then(r => r.data),
    create: data => httpClient.post('/news', data).then(r => r.data),
    update: (id, data) => httpClient.put(`/news/${id}`, data).then(r => r.data),
    delete: id => httpClient.delete(`/news/${id}`).then(r => r.data),
  },

  // Статьи
  articles: {
    getAll: () => httpClient.get('/articles').then(r => r.data),
    getById: id => httpClient.get(`/articles/${id}`).then(r => r.data),
    create: data => httpClient.post('/articles', data).then(r => r.data),
    update: (id, data) =>
      httpClient.put(`/articles/${id}`, data).then(r => r.data),
    delete: id => httpClient.delete(`/articles/${id}`).then(r => r.data),
  },

  // События
  events: {
    getAll: () => httpClient.get('/events').then(r => r.data),
    getById: id => httpClient.get(`/events/${id}`).then(r => r.data),
    create: data => httpClient.post('/events', data).then(r => r.data),
    update: (id, data) =>
      httpClient.put(`/events/${id}`, data).then(r => r.data),
    delete: id => httpClient.delete(`/events/${id}`).then(r => r.data),
  },

  // Истории
  stories: {
    getAll: () => httpClient.get('/stories').then(r => r.data),
    getById: id => httpClient.get(`/stories/${id}`).then(r => r.data),
    create: data => httpClient.post('/stories', data).then(r => r.data),
    update: (id, data) =>
      httpClient.put(`/stories/${id}`, data).then(r => r.data),
    delete: id => httpClient.delete(`/stories/${id}`).then(r => r.data),
  },

  // Врачи
  doctors: {
    getAll: () => httpClient.get('/doctors').then(r => r.data),
    getById: id => httpClient.get(`/doctors/${id}`).then(r => r.data),
    create: data => httpClient.post('/doctors', data).then(r => r.data),
    update: (id, data) =>
      httpClient.put(`/doctors/${id}`, data).then(r => r.data),
    delete: id => httpClient.delete(`/doctors/${id}`).then(r => r.data),
  },

  // Регионы
  regions: {
    getAll: () => httpClient.get('/regions').then(r => r.data),
  },

  // Контакты
  contacts: {
    getAll: () => httpClient.get('/contacts').then(r => r.data),
    create: data => httpClient.post('/contacts', data).then(r => r.data),
    update: (id, data) =>
      httpClient.put(`/contacts/${id}`, data).then(r => r.data),
    delete: id => httpClient.delete(`/contacts/${id}`).then(r => r.data),
  },
};

export default httpClient;
