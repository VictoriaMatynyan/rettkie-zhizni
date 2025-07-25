import js from '@eslint/js';
import prettier from 'eslint-config-prettier';
import prettierPlugin from 'eslint-plugin-prettier';
import vue from 'eslint-plugin-vue';

export default [
  // Базовые правила для JavaScript
  js.configs.recommended,

  // Правила для Vue файлов
  ...vue.configs['flat/recommended'],

  // Конфигурация Prettier
  prettier,

  {
    files: ['**/*.{js,vue}'],
    plugins: {
      prettier: prettierPlugin,
    },
    rules: {
      // Prettier правила
      'prettier/prettier': 'error',

      // Vue правила
      'vue/multi-word-component-names': 'off',
      'vue/no-unused-vars': 'error',
      'vue/no-undef-components': 'off', // Отключаем, так как router-link регистрируется глобально
      'vue/component-name-in-template-casing': ['error', 'PascalCase'],
      'vue/attribute-hyphenation': 'off', // Отключаем принудительную kebab-case
      'vue/v-on-event-hyphenation': ['error', 'always'],
      'vue/attributes-order': 'warn', // Делаем предупреждением вместо ошибки
      'vue/require-explicit-emits': 'warn', // Делаем предупреждением
      'vue/require-default-prop': 'warn', // Делаем предупреждением

      // JavaScript правила
      'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
      'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
      'no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
      'prefer-const': 'error',
      'no-var': 'error',

      // Стилистические правила
      indent: 'off', // Делегируем Prettier
      quotes: 'off', // Делегируем Prettier
      semi: 'off', // Делегируем Prettier
    },
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: {
        // Глобальные переменные для браузера
        window: 'readonly',
        document: 'readonly',
        console: 'readonly',
        process: 'readonly',
        // Дополнительные глобальные переменные
        confirm: 'readonly',
        alert: 'readonly',
        setTimeout: 'readonly',
        setInterval: 'readonly',
        clearTimeout: 'readonly',
        clearInterval: 'readonly',
        // Yandex Maps API
        ymaps: 'readonly',
      },
    },
  },

  // Игнорируемые файлы
  {
    ignores: ['dist/**', 'node_modules/**', '*.config.js', 'coverage/**'],
  },
];
