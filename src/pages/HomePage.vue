<template>
    <div class="home-page">
      <h1>Добро пожаловать!</h1>
      <img src="/src/assets/logo_horizontal.png" alt="Логотип на главной странице" class="home-page-logo">
      <p>Это главная страница. Здесь будет баннер, последние новости и наши истории.</p>
    </div>
  </template>
  
  <script setup>
  // пока ничего не нужно
  </script>
  
  <style scoped>
  .home-page {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    padding: 24px;
  }
  
  .home-page h1 {
    font-size: 24px;
    margin-bottom: 24px;
  }

  .home-page-logo {
    max-width: 1420px;
    width: 100%;
  }
  </style>
  