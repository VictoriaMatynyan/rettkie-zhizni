<template>
    <header class="site-header">
      <div class="header-container">
        <!-- Логотип и название -->
        <router-link to="/rettkie-zhizni" class="logo-block">
          <img src="/src/assets/logo_square.png" alt="Логотип" class="logo-img" />
          <span class="site-title">РЕТТкие Жизни</span>
        </router-link>
  
        <!-- Бургер -->
        <button class="burger" @click="menuOpen = !menuOpen">
          ☰
        </button>
  
        <!-- Навигация -->
        <nav class="main-nav" :class="{ open: menuOpen }">
          <router-link to="/about">О синдроме Ретта</router-link>
          <router-link to="/doctors">Врачам</router-link>
  
          <div class="dropdown">
            <span class="dropdown-trigger">Пациентам</span>
            <div class="dropdown-content">
              <router-link to="/patients/newbie">Для новичков</router-link>
              <router-link to="/patients/stories">Истории семей</router-link>
              <router-link to="/patients/articles">Статьи</router-link>
              <router-link to="/patients/drug-development">О разработке лекарства</router-link>
              <router-link to="/patients/support">Как помочь</router-link>
              <router-link to="/patients/contact">Обратиться в сообщество</router-link>
              <router-link to="/patients/rehab">Реабилитация</router-link>
            </div>
          </div>
  
          <!-- <router-link to="/articles">Статьи</router-link> -->
          <router-link to="/news">Новости</router-link>
          <router-link to="/events">Мероприятия</router-link>
          <router-link to="/about-us">О нас</router-link>

          <div class="dropdown">
            <span class="dropdown-trigger">Реестр пациентов</span>
            <div class="dropdown-content">
              <router-link to="/patient-registry/personal-account">Личный кабинет</router-link>
              <router-link to="/patient-registry/patient-file">Карта пациентов</router-link>
              <router-link to="/patient-registry/privacy-policy">Политика обработки персональных данных</router-link>
            </div>
          </div>
          <router-link to="/donate" class="btn-donate">Помочь</router-link>
          <router-link to="/patients/newbie" class="btn-help">Что делать</router-link>
        </nav>
      </div>
    </header>
  </template>
  
  <script setup>
  import { ref } from 'vue'
  const menuOpen = ref(false)
  </script>
  
  <style scoped>
  .site-header {
    background-color: #fff;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.05);
    position: sticky;
    top: 0;
    z-index: 100;
  }
  
  .header-container {
    max-width: 1520px;
    margin: 0 auto;
    padding: 0 16px;
    height: 60px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    position: relative;
  }
  
  .logo-block {
    display: flex;
    align-items: center;
    text-decoration: none;
  }
  
  .logo-img {
    height: 32px;
    margin-right: 8px;
  }
  
  .site-title {
    font-weight: bold;
    font-size: 18px;
    color: #333;
  }
  
  .burger {
    font-size: 24px;
    background: none;
    border: none;
    cursor: pointer;
    display: none;
  }
  
  .main-nav {
    display: flex;
    align-items: center;
    gap: 16px;
  }
  
  .main-nav a {
    text-decoration: none;
    color: #333;
    padding: 6px 8px;
    transition: color 0.2s;
  }
  
  .main-nav a:hover {
    color: #007acc;
  }  

  .btn-donate,
  .btn-help {
    display: inline-block;
    padding: 8px 16px;
    font-size: 14px;
    font-weight: 500;
    border-radius: 6px;
    text-decoration: none;
    transition: background-color 0.3s ease, box-shadow 0.2s ease;
    cursor: pointer;
  }

  .main-nav > .btn-donate {
    color: #018628;
    border: 1px solid #10813f;
  }

  .main-nav > .btn-donate:hover {
    color: #229954;
    box-shadow: 0 2px 6px rgba(16, 129, 63, 0.4);
  }

  .main-nav > .btn-help {
    color: #0160a2;
    border: 1px solid #0160a2;

  }

  .btn-help:hover {
    color: #0370bb;
    box-shadow: 0 2px 6px rgba(41, 128, 185, 0.4);
  }
    
  /* Выпадающее меню */
  .dropdown {
    position: relative;
  }
  
  .dropdown-trigger {
    cursor: pointer;
    padding: 6px 8px;
  }
  
  .dropdown-content {
    display: none;
    position: absolute;
    background-color: #fff;
    box-shadow: 0 2px 8px rgba(0,0,0,0.15);
    padding: 8px 0;
    top: 100%;
    left: 0;
    z-index: 10;
    min-width: 160px;
  }
  
  .dropdown-content a {
    display: block;
    padding: 6px 12px;
    color: #333;
    text-decoration: none;
  }
  
  .dropdown-content a:hover {
    background-color: #f1f1f1;
  }
  
  .dropdown:hover .dropdown-content {
    display: block;
  }
  
@media (max-width: 1190px) {
    .burger {
      display: block;
    }
  
    .main-nav {
      position: absolute;
      top: 60px;
      left: 0;
      right: 0;
      background-color: #fff;
      flex-direction: column;
      padding: 16px;
      display: none;
    }
  
    .main-nav.open {
      display: flex;
    }
  
    .main-nav a,
    .dropdown {
      width: 100%;
    }
  }
  </style>
  