<template>
  <div>
    <header class="site-header">
      <div class="header-container">
        <router-link to="/" class="logo-block">
          <img
            src="/src/assets/logo_square.png"
            alt="Логотип"
            class="logo-img"
          />
          <span class="site-title">РЕТТкие Жизни</span>
        </router-link>
        <button
          ref="burgerRef"
          class="burger"
          :class="{ open: menuOpen }"
          @click="menuOpen = !menuOpen"
        >
          <span class="burger-icon">{{ menuOpen ? '✕' : '☰' }}</span>
        </button>
        <nav class="main-nav main-nav-desktop" @mouseleave="handleMouseLeave">
          <router-link to="/about-rett">О синдроме Ретта</router-link>
          <router-link to="/doctors">Врачам</router-link>
          <div
            class="dropdown"
            :class="{ active: activeDropdown === 'patients' }"
          >
            <span class="dropdown-trigger" @click="toggleDropdown('patients')">
              Пациентам
              <span v-if="isMobile" class="dropdown-arrow">
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M12 3V21M12 21L5 14M12 21L19 14"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                </svg>
              </span>
            </span>
            <div
              class="dropdown-content"
              :class="{
                'mobile-open': activeDropdown === 'patients' && isMobile,
              }"
            >
              <router-link to="/patients/newbie" @click="closeMenu"
                >Для новичков</router-link
              >
              <router-link to="/patients/stories" @click="closeMenu"
                >Истории семей</router-link
              >
              <router-link to="/patients/articles" @click="closeMenu"
                >Статьи</router-link
              >
              <router-link to="/patients/drug-development" @click="closeMenu"
                >О разработке лекарства</router-link
              >
              <router-link to="/patients/support" @click="closeMenu"
                >Как помочь</router-link
              >
              <router-link to="/patients/contact" @click="closeMenu"
                >Обратиться в сообщество</router-link
              >
              <router-link to="/patients/rehab" @click="closeMenu"
                >Реабилитация</router-link
              >
            </div>
          </div>
          <router-link to="/news">Новости</router-link>
          <router-link to="/events">Мероприятия</router-link>
          <router-link to="/about-us">О нас</router-link>
          <div
            class="dropdown"
            :class="{ active: activeDropdown === 'registry' }"
          >
            <span class="dropdown-trigger" @click="toggleDropdown('registry')">
              <router-link to="/patient-registry" @click.stop="closeMenu"
                >Реестр пациентов</router-link
              >
              <span
                v-if="isMobile"
                class="dropdown-arrow"
                @click.stop="toggleDropdown('registry')"
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M12 3V21M12 21L5 14M12 21L19 14"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                </svg>
              </span>
            </span>
            <div
              class="dropdown-content"
              :class="{
                'mobile-open': activeDropdown === 'registry' && isMobile,
              }"
            >
              <router-link
                to="/patient-registry/personal-account"
                @click="closeMenu"
                >Личный кабинет</router-link
              >
              <div v-if="!authStore.isAuthenticated" class="auth-buttons">
                <router-link to="/login" @click="closeMenu">Вход</router-link>
              </div>
              <router-link
                to="/patient-registry/patient-map"
                @click="closeMenu"
              >
                Карта пациентов
              </router-link>
              <router-link
                to="/patient-registry/privacy-policy"
                @click="closeMenu"
                >Политика обработки персональных данных</router-link
              >
            </div>
          </div>
          <router-link to="/donate" class="btn-donate">Помочь</router-link>
          <router-link to="/patients/newbie" class="btn-help"
            >Что делать</router-link
          >
        </nav>
      </div>
    </header>

    <nav
      ref="menuRef"
      class="main-nav main-nav-mobile"
      :class="{ open: menuOpen }"
    >
      <div class="mobile-header">
        <router-link to="/" class="mobile-logo-block" @click="closeMenu">
          <img
            src="/src/assets/logo_square.png"
            alt="Логотип"
            class="mobile-logo-img"
          />
          <span class="mobile-site-title">РЕТТкие Жизни</span>
        </router-link>
      </div>
      <router-link to="/about-rett">О синдроме Ретта</router-link>
      <router-link to="/doctors">Врачам</router-link>
      <div class="dropdown" :class="{ active: activeDropdown === 'patients' }">
        <span class="dropdown-trigger" @click="toggleDropdown('patients')">
          Пациентам
          <span v-if="isMobile" class="dropdown-arrow">
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M12 3V21M12 21L5 14M12 21L19 14"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
          </span>
        </span>
        <div
          class="dropdown-content"
          :class="{
            'mobile-open': activeDropdown === 'patients' && isMobile,
          }"
        >
          <router-link to="/patients/newbie" @click="closeMenu"
            >Для новичков</router-link
          >
          <router-link to="/patients/stories" @click="closeMenu"
            >Истории семей</router-link
          >
          <router-link to="/patients/articles" @click="closeMenu"
            >Статьи</router-link
          >
          <router-link to="/patients/drug-development" @click="closeMenu"
            >О разработке лекарства</router-link
          >
          <router-link to="/patients/support" @click="closeMenu"
            >Как помочь</router-link
          >
          <router-link to="/patients/contact" @click="closeMenu"
            >Обратиться в сообщество</router-link
          >
          <router-link to="/patients/rehab" @click="closeMenu"
            >Реабилитация</router-link
          >
        </div>
      </div>
      <router-link to="/news">Новости</router-link>
      <router-link to="/events">Мероприятия</router-link>
      <router-link to="/about-us">О нас</router-link>
      <div class="dropdown" :class="{ active: activeDropdown === 'registry' }">
        <span class="dropdown-trigger" @click="toggleDropdown('registry')">
          <router-link to="/patient-registry" @click.stop="closeMenu"
            >Реестр пациентов</router-link
          >
          <span
            v-if="isMobile"
            class="dropdown-arrow"
            @click.stop="toggleDropdown('registry')"
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M12 3V21M12 21L5 14M12 21L19 14"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
          </span>
        </span>
        <div
          class="dropdown-content"
          :class="{
            'mobile-open': activeDropdown === 'registry' && isMobile,
          }"
        >
          <router-link
            to="/patient-registry/personal-account"
            @click="closeMenu"
            >Личный кабинет</router-link
          >
          <div v-if="!authStore.isAuthenticated" class="auth-buttons">
            <router-link to="/login" @click="closeMenu">Вход</router-link>
          </div>
          <router-link to="/patient-registry/patient-map" @click="closeMenu">
            Карта пациентов
          </router-link>
          <router-link to="/patient-registry/privacy-policy" @click="closeMenu"
            >Политика обработки персональных данных</router-link
          >
        </div>
      </div>
      <router-link to="/donate" class="btn-donate">Помочь</router-link>
      <router-link to="/patients/newbie" class="btn-help"
        >Что делать</router-link
      >
    </nav>

    <div class="mobile-controls" :class="{ 'menu-open': menuOpen }">
      <router-link to="/" class="home-icon-mobile" @click="closeMenu">
        <img
          :src="
            $route.path === '/'
              ? '/src/assets/home_icon_white.svg'
              : '/src/assets/home_icon.svg'
          "
          alt="Домой"
          class="home-icon-img"
        />
      </router-link>
      <button
        ref="burgerMobileRef"
        class="burger-mobile"
        :class="{ open: menuOpen }"
        @click="menuOpen = !menuOpen"
      >
        <svg
          v-if="!menuOpen"
          class="burger-icon menu-icon"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M3 12h18M3 6h18M3 18h18"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
        <svg
          v-else
          class="burger-icon close-icon"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M19 5L5 19M5 5l14 14"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
      </button>
    </div>
    <div
      class="menu-overlay"
      :class="{ open: menuOpen }"
      @click="closeMenu"
    ></div>
  </div>
</template>

<script setup>
import { onBeforeUnmount, onMounted, ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../stores/auth.js';

const menuOpen = ref(false);
const menuRef = ref(null);
const burgerRef = ref(null);
const burgerMobileRef = ref(null);
const activeDropdown = ref(null);
const windowWidth = ref(window.innerWidth);

const authStore = useAuthStore();
const router = useRouter();

const isMobile = computed(() => windowWidth.value <= 1190);

function handleResize() {
  windowWidth.value = window.innerWidth;
  if (!isMobile.value) {
    activeDropdown.value = null;
  }
}

function toggleDropdown(dropdownName) {
  if (isMobile.value) {
    activeDropdown.value =
      activeDropdown.value === dropdownName ? null : dropdownName;
  }
}

function closeMenu() {
  if (isMobile.value) {
    menuOpen.value = false;
    activeDropdown.value = null;
  }
}

function handleMouseLeave() {
  if (!isMobile.value) {
    menuOpen.value = false;
  }
}

onMounted(async () => {
  await authStore.initAuth();
  document.addEventListener('click', handleClickOutside);
  window.addEventListener('resize', handleResize);
});

function handleClickOutside(event) {
  const clickedOutsideMenu =
    menuRef.value && !menuRef.value.contains(event.target);
  const clickedBurger =
    burgerRef.value && burgerRef.value.contains(event.target);
  const clickedMobileBurger =
    burgerMobileRef.value && burgerMobileRef.value.contains(event.target);

  if (clickedOutsideMenu && !clickedBurger && !clickedMobileBurger) {
    menuOpen.value = false;
    activeDropdown.value = null;
  }
}

onBeforeUnmount(() => {
  document.removeEventListener('click', handleClickOutside);
  window.removeEventListener('resize', handleResize);
});
</script>

<style scoped>
.site-header {
  background-color: #fff;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.05);
  position: sticky;
  top: 0;
  z-index: 10;
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
  z-index: 1001;
  position: relative;
}

.menu-overlay {
  display: none;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 999;
  opacity: 0;
  transition: opacity 0.3s ease;
  pointer-events: none;
}

.menu-overlay.open {
  display: block;
  opacity: 1;
  pointer-events: auto;
}

.main-nav {
  display: flex;
  align-items: center;
  gap: 16px;
  flex-wrap: nowrap;
}

@media (min-width: 1191px) {
  .main-nav-mobile {
    display: none !important;
  }
}

.main-nav a {
  text-decoration: none;
  color: #333;
  padding: 0;
  transition: color 0.2s;
  white-space: nowrap;
}

.main-nav a:hover {
  color: #23938c;
}

.main-nav > .btn-donate,
.main-nav > .btn-help {
  display: flex;
  padding: 7px 13px;
  font-size: 14px;
  font-weight: 500;
  border-radius: 6px;
  text-decoration: none;
  transition:
    background-color 0.3s ease,
    box-shadow 0.2s ease;
  cursor: pointer;
}

.main-nav > .btn-donate {
  color: #23938c;
  border: 1px solid #23938c;
}

.main-nav > .btn-donate:hover {
  color: white;
  background-color: #23938c;
  box-shadow: 0 2px 6px rgba(16, 129, 63, 0.4);
}

.main-nav > .btn-help {
  color: #8232ad;
  border: 1px solid #8232ad;
}

.main-nav > .btn-help:hover {
  color: white;
  box-shadow: 0 2px 6px rgba(41, 128, 185, 0.4);
  background-color: #8232ad;
}

.dropdown {
  position: relative;
}

.dropdown-trigger {
  cursor: pointer;
  padding: 0;
  white-space: nowrap;
}

.dropdown-trigger:hover {
  color: #23938c;
}

.dropdown-content {
  display: none;
  position: absolute;
  background-color: #fff;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  padding: 8px 0;
  top: 100%;
  left: 0;
  z-index: 20;
  min-width: 160px;
}

.dropdown-content a {
  display: block;
  padding: 6px 12px;
  color: #333;
  text-decoration: none;
}

.dropdown-content a:hover span:hover {
  background-color: #f1f1f1;
}

.auth-block {
  margin-left: 20px;
  display: flex;
  align-items: center;
}

.auth-buttons {
  display: flex;
  gap: 10px;
  align-items: center;
}

.auth-btn {
  padding: 8px 16px;
  border-radius: 6px;
  text-decoration: none;
  font-size: 14px;
  font-weight: 500;
  transition: all 0.3s ease;
}

.login-btn {
  color: #8132ad;
  border: 1px solid #8132ad;
  background: transparent;
}

.login-btn:hover {
  background-color: #8132ad;
  color: white;
}

.register-btn {
  background-color: #8132ad;
  color: white;
  border: 1px solid #8132ad;
}

.register-btn:hover {
  background-color: #6b2a91;
}

.user-menu {
  position: relative;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  padding: 8px 12px;
  border-radius: 6px;
  transition: background-color 0.3s ease;
}

.user-info:hover {
  background-color: #f8f9fa;
}

.user-avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background-color: #8132ad;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: bold;
}

.user-name {
  font-size: 14px;
  font-weight: 500;
  color: #333;
  max-width: 120px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.user-dropdown {
  display: none;
  position: absolute;
  top: 100%;
  right: 0;
  background: white;
  border-radius: 8px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
  padding: 8px 0;
  min-width: 180px;
  z-index: 30;
}

.user-menu:hover .user-dropdown {
  display: block;
}

.dropdown-item {
  display: block;
  padding: 8px 16px;
  color: #333;
  text-decoration: none;
  font-size: 14px;
  border: none;
  background: none;
  width: 100%;
  text-align: left;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.dropdown-item:hover {
  background-color: #f8f9fa;
}

.logout-btn {
  color: #dc3545;
  border-top: 1px solid #eee;
}

.logout-btn:hover {
  background-color: #fee;
}

@media (max-width: 768px) {
  .auth-block {
    margin-left: 0;
    margin-top: 15px;
    padding-top: 15px;
    border-top: 1px solid #eee;
  }

  .auth-buttons {
    flex-direction: column;
    width: 100%;
    gap: 8px;
  }

  .auth-btn {
    width: 100%;
    text-align: center;
  }

  .user-info {
    justify-content: flex-start;
  }

  .user-name {
    max-width: none;
  }
}

@media (min-width: 1191px) {
  .dropdown:hover .dropdown-content {
    display: block;
  }
}

@media (min-width: 1191px) {
  .menu-overlay {
    display: none !important;
  }

  .mobile-header {
    display: none !important;
  }

  .burger-mobile {
    display: none !important;
  }

  .mobile-controls {
    display: none !important;
  }
}

@media (max-width: 1190px) {
  .site-header {
    display: none;
  }

  .mobile-controls {
    display: flex;
    position: fixed;
    top: 16px;
    right: 16px;
    z-index: 1001;
    gap: 8px;
    transition: right 0.3s ease;
  }

  .mobile-controls.menu-open {
    right: 316px;
  }

  .home-icon-mobile {
    display: flex;
    width: 48px;
    height: 48px;
    align-items: center;
    justify-content: center;
    background-color: #fff;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
    border-radius: 8px;
    transition: all 0.3s ease;
    text-decoration: none;
  }

  .home-icon-mobile:hover {
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  }

  .home-icon-mobile .home-icon-img {
    width: 24px;
    height: 24px;
    transition: all 0.3s ease;
  }

  .home-icon-mobile.router-link-exact-active {
    background-color: #23938c;
    box-shadow: 0 2px 8px rgba(35, 147, 140, 0.3);
  }

  .home-icon-mobile.router-link-exact-active:hover {
    background-color: #1e7a73;
    box-shadow: 0 4px 12px rgba(35, 147, 140, 0.4);
  }

  .burger-mobile {
    display: flex;
    width: 48px;
    height: 48px;
    align-items: center;
    justify-content: center;
    background-color: #fff;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
    border-radius: 8px;
    transition: all 0.3s ease;
    border: none;
    cursor: pointer;
  }

  .burger-mobile:hover {
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  }

  .burger-mobile.open {
    background-color: #23938c;
  }

  .burger-mobile .burger-icon {
    width: 24px;
    height: 24px;
    transition: all 0.3s ease;
    filter: brightness(0) saturate(100%) invert(20%) sepia(8%) saturate(1012%)
      hue-rotate(169deg) brightness(96%) contrast(89%);
    pointer-events: none;
  }

  .burger-mobile.open {
    background-color: #23938c;
  }

  .burger-mobile.open .burger-icon {
    filter: brightness(0) saturate(100%) invert(0%) sepia(0%) saturate(0%)
      hue-rotate(0deg) brightness(0%) contrast(100%);
  }

  .main-nav-mobile {
    flex-direction: column;
    position: fixed;
    top: 0;
    right: -300px;
    width: 300px;
    height: 100vh;
    background-color: #fff;
    padding: 0;
    box-shadow: -2px 0 10px rgba(0, 0, 0, 0.1);
    transition: right 0.3s ease;
    overflow-y: auto;
    pointer-events: auto;
    gap: 0;
    z-index: 1000;
  }

  .main-nav-mobile.open {
    right: 0;
  }

  .mobile-header {
    display: flex;
    align-items: center;
    padding: 16px 20px;
    border-bottom: 2px solid #f0f0f0;
    background-color: #fff;
    position: sticky;
    top: 0;
    z-index: 10;
  }

  .mobile-logo-block {
    display: flex;
    align-items: center;
    text-decoration: none;
  }

  .mobile-logo-img {
    height: 32px;
    margin-right: 8px;
  }

  .mobile-site-title {
    font-weight: bold;
    font-size: 18px;
    color: #333;
  }

  .main-nav-mobile > a,
  .main-nav-mobile > .dropdown {
    display: block;
    width: 100%;
    padding: 12px 20px;
    border-bottom: 1px solid #f0f0f0;
    text-decoration: none;
    box-sizing: border-box;
  }

  .main-nav-mobile a,
  .main-nav-mobile .dropdown-trigger {
    white-space: normal;
  }

  .main-nav-mobile .dropdown {
    position: relative;
  }

  .main-nav-mobile .dropdown-trigger {
    display: flex;
    justify-content: space-between;
    align-items: center;
    cursor: pointer;
    padding: 0;
    margin: 0;
  }

  .main-nav-mobile .dropdown-trigger a {
    flex: 1;
  }

  .main-nav-mobile .dropdown-arrow {
    display: inline-block;
    transform-origin: center;
    transition: transform 0.3s ease;
  }

  .main-nav-mobile .dropdown-arrow svg {
    color: #23938c;
    transition: transform 0.3s ease;
  }

  .main-nav-mobile .dropdown.active .dropdown-arrow svg {
    transform: rotate(90deg);
  }

  .main-nav-mobile .dropdown.active > .dropdown-trigger {
    color: #23938c;
    font-weight: 500;
  }

  .main-nav-mobile .dropdown.active {
    background-color: #f0f9f8;
  }

  .main-nav-mobile .dropdown-content {
    display: block;
    position: static;
    box-shadow: none;
    padding: 0;
    margin: 0;
    background-color: transparent;
    max-height: 0;
    overflow: hidden;
    opacity: 0;
    transition:
      max-height 0.3s ease-out,
      padding 0.3s ease-out,
      opacity 0.2s ease-out;
  }

  .main-nav-mobile .dropdown-content.mobile-open {
    max-height: 400px;
    padding: 8px 0;
    opacity: 1;
  }

  .main-nav-mobile .dropdown-content a {
    padding: 8px 20px 8px 36px;
    border-bottom: none;
    font-size: 14px;
    color: #555;
    display: block;
    width: 100%;
    box-sizing: border-box;
  }

  .main-nav-mobile .dropdown-content .auth-buttons {
    padding: 0;
    width: 100%;
    box-sizing: border-box;
    margin: 0;
  }

  .main-nav-mobile .dropdown-content .auth-buttons a {
    padding: 8px 0 8px 36px;
    display: block;
    width: 100%;
    box-sizing: border-box;
    text-align: left;
    font-size: 14px;
    color: #555;
    border-bottom: none;
  }

  .main-nav-mobile .dropdown-content {
    display: block !important;
  }

  .main-nav-mobile > .btn-donate,
  .main-nav-mobile > .btn-help {
    width: 100%;
    justify-content: center;
    margin: 0;
    border-radius: 0;
    border-left: none;
    border-right: none;
    border-top: none;
    border-bottom: none;
    padding: 16px 20px;
    font-size: 16px;
    font-weight: 600;
  }
}

@media (max-width: 1216px) and (min-width: 1191px) {
  .header-container {
    padding: 0 12px;
  }

  .logo-img {
    height: 30px;
  }
  .site-title {
    font-size: 16px;
  }

  .main-nav {
    gap: 12px;
  }

  .main-nav a {
    font-size: 15px;
  }

  .main-nav > .btn-donate,
  .main-nav > .btn-help {
    padding: 6px 10px;
    font-size: 13px;
  }
}
</style>
