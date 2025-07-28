import js from '@eslint/js';
import eslintConfigPrettier from 'eslint-config-prettier';
import pluginVue from 'eslint-plugin-vue';

export default [
  // Игнорируемые файлы и папки
  {
    ignores: [
      'dist/**',
      'node_modules/**',
      '*.config.js',
      '.vscode/**',
      'coverage/**',
      '*.min.js',
    ],
  },

  // Основная конфигурация для JS файлов
  {
    files: ['**/*.js', '**/*.mjs'],
    ...js.configs.recommended,
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'module',
      globals: {
        // Браузерные глобальные переменные
        window: 'readonly',
        document: 'readonly',
        console: 'readonly',
        // Node.js глобальные переменные для конфигурационных файлов
        process: 'readonly',
        __dirname: 'readonly',
        __filename: 'readonly',
        // Yandex Maps API
        ymaps: 'readonly',
      },
    },
    rules: {
      // Качество кода
      'no-unused-vars': [
        'error',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
        },
      ],
      'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
      'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',

      // Стиль кода
      quotes: ['error', 'single', { avoidEscape: true }],
      semi: ['error', 'always'],
      indent: ['error', 2, { SwitchCase: 1 }],
      'comma-dangle': ['error', 'es5'],

      // Лучшие практики
      eqeqeq: ['error', 'always'],
      'no-var': 'error',
      'prefer-const': 'error',
      'no-multiple-empty-lines': ['error', { max: 2, maxEOF: 1 }],
      'no-trailing-spaces': 'error',
    },
  },

  // Конфигурация для Vue файлов
  ...pluginVue.configs['flat/recommended'],
  {
    files: ['**/*.vue'],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'module',
      globals: {
        // Браузерные глобальные переменные
        window: 'readonly',
        document: 'readonly',
        console: 'readonly',
        // Yandex Maps API
        ymaps: 'readonly',
      },
    },
    rules: {
      // Vue-специфичные правила
      'vue/component-name-in-template-casing': ['error', 'PascalCase'],
      'vue/block-order': [
        'error',
        {
          order: ['template', 'script', 'style'],
        },
      ],
      'vue/component-definition-name-casing': ['error', 'PascalCase'],
      'vue/multi-word-component-names': 'off', // Отключаем строгое требование
      'vue/no-unused-components': 'warn',
      'vue/no-unused-vars': 'warn',

      // Порядок в компонентах
      'vue/order-in-components': [
        'error',
        {
          order: [
            'el',
            'name',
            'key',
            'parent',
            'functional',
            ['delimiters', 'comments'],
            ['components', 'directives', 'filters'],
            'extends',
            'mixins',
            ['provide', 'inject'],
            'ROUTER_GUARDS',
            'layout',
            'middleware',
            'validate',
            'scrollToTop',
            'transition',
            'loading',
            'inheritAttrs',
            'model',
            ['props', 'propsData'],
            'emits',
            'setup',
            'asyncData',
            'data',
            'fetch',
            'head',
            'computed',
            'watch',
            'watchQuery',
            'LIFECYCLE_HOOKS',
            'methods',
            ['template', 'render'],
            'renderError',
          ],
        },
      ],

      // Props validation - мягкие правила
      'vue/require-prop-types': 'warn',
      'vue/require-default-prop': 'off',
      'vue/prop-name-casing': ['error', 'camelCase'],

      // Стиль кода в Vue
      'vue/html-indent': ['error', 2],
      'vue/html-quotes': ['error', 'double'],
      'vue/max-attributes-per-line': [
        'error',
        {
          singleline: 3,
          multiline: 1,
        },
      ],
      'vue/html-self-closing': [
        'error',
        {
          html: {
            void: 'never',
            normal: 'never',
            component: 'always',
          },
        },
      ],

      // Стандартные JS правила для Vue файлов
      quotes: ['error', 'single', { avoidEscape: true }],
      semi: ['error', 'always'],
      indent: 'off', // Отключаем базовый indent в пользу vue/html-indent
      'comma-dangle': ['error', 'es5'],
    },
  },

  // Интеграция с Prettier (должна быть последней)
  eslintConfigPrettier,
];
