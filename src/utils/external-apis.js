/**
 * Утилиты для безопасной работы с внешними сервисами
 */

// Проверка доступности Yandex Maps API
export const isYandexMapsAvailable = () => {
  return typeof window !== 'undefined' && window.ymaps;
};

// Безопасная инициализация Yandex Maps
export const initYandexMaps = (callback) => {
  if (!isYandexMapsAvailable()) {
    if (import.meta.env.DEV) {
      console.warn('Yandex Maps API недоступен');
    }
    return;
  }

  try {
    window.ymaps.ready(callback);
  } catch (error) {
    if (import.meta.env.DEV) {
      console.error('Ошибка инициализации Yandex Maps:', error);
    }
  }
};

// Проверка доступности Yandex Metrika
export const isYandexMetrikaAvailable = () => {
  return typeof window !== 'undefined' && typeof window.ym === 'function';
};

// Безопасная инициализация Yandex Metrika
export const initYandexMetrika = (counterId, options = {}) => {
  if (!isYandexMetrikaAvailable()) {
    if (import.meta.env.DEV) {
      console.warn('Yandex Metrika недоступна');
    }
    return;
  }

  try {
    window.ym(counterId, 'init', {
      clickmap: true,
      trackLinks: true,
      accurateTrackBounce: true,
      webvisor: true,
      ...options,
    });
    return true;
  } catch (error) {
    if (import.meta.env.DEV) {
      console.error('Ошибка инициализации Yandex Metrika:', error);
    }
    return false;
  }
};

// Общая функция для безопасного выполнения кода с внешними API
export const safeExternalCall = (fn, errorMessage = 'Ошибка внешнего API') => {
  try {
    return fn();
  } catch (error) {
    if (import.meta.env.DEV) {
      console.error(errorMessage, error);
    }
    return null;
  }
};
