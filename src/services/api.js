import axios from 'axios';

const API_BASE_URL = import.meta.env.DEV ? '/api' : 'http://127.0.0.1:8000';

export const httpClient = axios.create({
  baseURL: API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
  withCredentials: false,
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
    if (err.code === 'ERR_NETWORK' || err.message?.includes('CORS')) {
      console.error('CORS ошибка:', err);
      throw new Error(
        'Ошибка подключения к серверу. Проверьте, что API сервер запущен и настроен CORS.'
      );
    }

    const original = err.config || {};
    const isRefreshCall =
      typeof original?.url === 'string' &&
      original.url.includes('/accounts/token/refresh/');
    if (isRefreshCall) {
      return Promise.reject(err);
    }
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
        const { data } = await httpClient.post('/accounts/token/refresh/', {
          refresh: rt,
        });
        if (data && data.access) {
          setAccessToken(data.access);
          if (data.refresh) setRefreshToken(data.refresh);
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

export const api = {
  auth: {
    register: payload =>
      httpClient.post('/accounts/register/', payload).then(r => r.data),
    login: payload =>
      httpClient.post('/accounts/login/', payload).then(r => r.data),
    logout: refreshToken =>
      httpClient
        .post('/accounts/logout/', { refresh: refreshToken })
        .then(r => r.data),

    requestPasswordReset: ({ email }) =>
      httpClient.post('/accounts/password/reset/', { email }).then(r => r.data),

    confirmPasswordReset: payload =>
      httpClient
        .post('/accounts/password/reset/confirm/', payload)
        .then(r => r.data),
    refresh: refreshToken =>
      httpClient
        .post('/accounts/token/refresh/', { refresh: refreshToken })
        .then(r => r.data),
    me: () => httpClient.get('/accounts/me/').then(r => r.data),
    updateMe: async payload => {
      try {
        const r = await httpClient.post('/accounts/me/update/', payload);
        return r.data;
      } catch (e) {
        if (e?.response?.status === 405) {
          const r2 = await httpClient.patch('/accounts/me/update/', payload);
          return r2.data;
        }
        throw e;
      }
    },
  },

  accounts: {
    getRegions: () => httpClient.get('/accounts/regions/').then(r => r.data),
    getUserTypes: () =>
      httpClient.get('/accounts/user-types/').then(r => r.data),
    getMutationGenes: () =>
      httpClient.get('/accounts/mutation-genes/').then(r => r.data),
    getNews: () => httpClient.get('/accounts/news/').then(r => r.data),
    getNewsById: id =>
      httpClient.get(`/accounts/news/${id}/`).then(r => r.data),

    getEvents: () => httpClient.get('/accounts/events/').then(r => r.data),
    getEventById: id =>
      httpClient.get(`/accounts/events/${id}/`).then(r => r.data),

    getFamilyStories: () =>
      httpClient.get('/accounts/family-stories/').then(r => r.data),
    getFamilyStoryById: id =>
      httpClient.get(`/accounts/family-stories/${id}/`).then(r => r.data),

    getArticleCategories: () =>
      httpClient.get('/accounts/article-categories/').then(r => r.data),

    getArticles: () => httpClient.get('/accounts/articles/').then(r => r.data),
    getArticleById: id =>
      httpClient.get(`/accounts/articles/${id}/`).then(r => r.data),

    sendFeedback: payload =>
      httpClient.post('/accounts/feedback/', payload).then(r => r.data),

    getQuestionnaireStatsByCity: () =>
      httpClient
        .get('/accounts/questionnaires/stats/by-city/')
        .then(r => r.data),
    getQuestionnaireStatsByGene: () =>
      httpClient
        .get('/accounts/questionnaires/stats/by-gene/')
        .then(r => r.data),

    getMyQuestionnaires: () =>
      httpClient.get('/accounts/questionnaires/my/').then(r => r.data),

    createQuestionnaire: payload => {
      const fd = new FormData();
      if (payload.lastName) fd.append('last_name', payload.lastName);
      if (payload.firstName) fd.append('first_name', payload.firstName);
      if (payload.middleName) fd.append('middle_name', payload.middleName);

      if (payload.gender) {
        const g = payload.gender;
        const gender = g === 'м' ? 'мужской' : g === 'ж' ? 'женский' : g;
        fd.append('gender', gender);
      }

      if (payload.birthDate) fd.append('birth_date', payload.birthDate);

      if (payload.citizenship) {
        const c = payload.citizenship;
        const citizenship = c === 'РФ' ? 'Россия' : c;
        fd.append('citizenship', citizenship);
      }
      if (payload.countryOfResidence) {
        fd.append('country_of_residence', payload.countryOfResidence);
      }

      const cityId =
        payload.city_id ??
        payload.cityId ??
        (payload.city && typeof payload.city === 'object'
          ? payload.city.id
          : null);
      if (cityId !== null) fd.append('city_id', String(cityId));

      if (payload.geneticTestConfirmed)
        fd.append('rett_confirmed', payload.geneticTestConfirmed);
      if (payload.diagnosisDescription)
        fd.append('diagnosis_details', payload.diagnosisDescription);

      if (payload.geneId) {
        fd.append('mutation_gene_id', String(payload.geneId));
      } else if (payload.gene) {
        const geneMap = { MECP2: 1, CDKL5: 2, FOXG1: 3, Другое: 4, другой: 4 };
        const geneId = geneMap[payload.gene];
        if (geneId) fd.append('mutation_gene_id', String(geneId));
      }
      if (payload.geneOther) {
        fd.append('mutation_gene_other', payload.geneOther);
      }

      if (typeof payload.isLegalRepresentative === 'boolean') {
        fd.append(
          'is_legal_representative',
          String(payload.isLegalRepresentative)
        );
      }

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

    updateQuestionnaire: (id, payload) => {
      const fd = new FormData();

      if ('lastName' in payload && payload.lastName)
        fd.append('last_name', payload.lastName);
      if ('firstName' in payload && payload.firstName)
        fd.append('first_name', payload.firstName);
      if ('middleName' in payload)
        fd.append('middle_name', payload.middleName || '');

      if ('gender' in payload && payload.gender) {
        const g = payload.gender;
        const gender = g === 'м' ? 'мужской' : g === 'ж' ? 'женский' : g;
        fd.append('gender', gender);
      }

      if ('birthDate' in payload && payload.birthDate)
        fd.append('birth_date', payload.birthDate);

      if ('citizenship' in payload) {
        const c = payload.citizenship;
        const citizenship = c === 'РФ' ? 'Россия' : c || '';
        fd.append('citizenship', citizenship);
      }
      if ('countryOfResidence' in payload)
        fd.append('country_of_residence', payload.countryOfResidence || '');

      if ('city_id' in payload && payload.city_id !== null) {
        fd.append('city_id', String(payload.city_id));
      } else if ('cityId' in payload && payload.cityId) {
        fd.append('city_id', String(payload.cityId));
      }

      if ('geneticTestConfirmed' in payload && payload.geneticTestConfirmed)
        fd.append('rett_confirmed', payload.geneticTestConfirmed);
      if ('diagnosisDescription' in payload)
        fd.append('diagnosis_details', payload.diagnosisDescription || '');

      if ('geneId' in payload && payload.geneId)
        fd.append('mutation_gene_id', String(payload.geneId));
      else if ('gene' in payload && payload.gene) {
        const geneMap = { MECP2: 1, CDKL5: 2, FOXG1: 3, Другое: 4, другой: 4 };
        const geneId = geneMap[payload.gene];
        if (geneId) fd.append('mutation_gene_id', String(geneId));
      }
      if ('geneOther' in payload)
        fd.append('mutation_gene_other', payload.geneOther || '');

      if ('isLegalRepresentative' in payload) {
        fd.append(
          'is_legal_representative',
          String(!!payload.isLegalRepresentative)
        );
      }

      const fileObj = payload.geneticTestFile?.file || payload.geneticTestFile;
      if (fileObj instanceof File) {
        fd.append('genetic_scan', fileObj, fileObj.name);
      }

      return httpClient
        .post(`/accounts/questionnaires/${id}/update/`, fd, {
          headers: { 'Content-Type': 'multipart/form-data' },
        })
        .then(r => r.data);
    },

    deleteQuestionnaire: id =>
      httpClient
        .post(`/accounts/questionnaires/${id}/delete/`)
        .then(r => r.data),

    getConsentStatus: () =>
      httpClient.get('/accounts/consent/status/').then(r => r.data),
    uploadConsent: file => {
      const fd = new FormData();
      if (file instanceof File) fd.append('consent_file', file, file.name);
      return httpClient
        .post('/accounts/consent/upload/', fd, {
          headers: { 'Content-Type': 'multipart/form-data' },
        })
        .then(r => r.data);
    },
  },

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

  news: {
    getAll: () => httpClient.get('/news').then(r => r.data),
    getById: id => httpClient.get(`/news/${id}`).then(r => r.data),
    create: data => httpClient.post('/news', data).then(r => r.data),
    update: (id, data) => httpClient.put(`/news/${id}`, data).then(r => r.data),
    delete: id => httpClient.delete(`/news/${id}`).then(r => r.data),
  },

  articles: {
    getAll: () => httpClient.get('/articles').then(r => r.data),
    getById: id => httpClient.get(`/articles/${id}`).then(r => r.data),
    create: data => httpClient.post('/articles', data).then(r => r.data),
    update: (id, data) =>
      httpClient.put(`/articles/${id}`, data).then(r => r.data),
    delete: id => httpClient.delete(`/articles/${id}`).then(r => r.data),
  },

  events: {
    getAll: () => httpClient.get('/events').then(r => r.data),
    getById: id => httpClient.get(`/events/${id}`).then(r => r.data),
    create: data => httpClient.post('/events', data).then(r => r.data),
    update: (id, data) =>
      httpClient.put(`/events/${id}`, data).then(r => r.data),
    delete: id => httpClient.delete(`/events/${id}`).then(r => r.data),
  },

  stories: {
    getAll: () => httpClient.get('/stories').then(r => r.data),
    getById: id => httpClient.get(`/stories/${id}`).then(r => r.data),
    create: data => httpClient.post('/stories', data).then(r => r.data),
    update: (id, data) =>
      httpClient.put(`/stories/${id}`, data).then(r => r.data),
    delete: id => httpClient.delete(`/stories/${id}`).then(r => r.data),
  },

  doctors: {
    getAll: () => httpClient.get('/doctors').then(r => r.data),
    getById: id => httpClient.get(`/doctors/${id}`).then(r => r.data),
    create: data => httpClient.post('/doctors', data).then(r => r.data),
    update: (id, data) =>
      httpClient.put(`/doctors/${id}`, data).then(r => r.data),
    delete: id => httpClient.delete(`/doctors/${id}`).then(r => r.data),
  },

  regions: {
    getAll: () => httpClient.get('/regions').then(r => r.data),
  },

  contacts: {
    getAll: () => httpClient.get('/contacts').then(r => r.data),
    create: data => httpClient.post('/contacts', data).then(r => r.data),
    update: (id, data) =>
      httpClient.put(`/contacts/${id}`, data).then(r => r.data),
    delete: id => httpClient.delete(`/contacts/${id}`).then(r => r.data),
  },
};

export default httpClient;
