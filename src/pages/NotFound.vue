<template>
  <div class="not-found-page">
    <div class="not-found-card">
      <p class="code">404</p>
      <h1>Страница не найдена</h1>
      <p class="text">
        Похоже, вы перешли по несуществующей ссылке или страница была перемещена.
      </p>
      <div class="actions">
        <router-link to="/" class="btn primary">На главную</router-link>
        <button class="btn ghost" @click="goBack">Назад</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router';

const router = useRouter();

function goBack() {
  if (window.history.length > 1) router.back();
  else router.push('/');
}
</script>

<style scoped>
.not-found-page {
  min-height: 70vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 32px 16px;
}

.not-found-card {
  max-width: 560px;
  width: 100%;
  background: #fff;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.06);
  padding: 32px 28px;
  text-align: center;
}

.code {
  font-size: 18px;
  letter-spacing: 2px;
  color: #9ca3af;
  margin-bottom: 8px;
}

h1 {
  font-size: 26px;
  margin: 0 0 12px;
}

.text {
  color: #6b7280;
  margin: 0 0 24px;
}

.actions {
  display: flex;
  gap: 12px;
  justify-content: center;
  flex-wrap: wrap;
}

.btn {
  border: 1px solid #2aaea2;
  border-radius: 8px;
  padding: 10px 18px;
  font-size: 15px;
  cursor: pointer;
  transition: background-color 0.2s ease, color 0.2s ease, border-color 0.2s ease;
  text-decoration: none;
}

.btn.primary {
  background: #2aaea2;
  color: #fff;
}
.btn.primary:hover {
  background: #249b91;
  border-color: #249b91;
}

.btn.ghost {
  background: transparent;
  color: #2aaea2;
}
.btn.ghost:hover {
  background: rgba(42, 174, 162, 0.08);
}
</style>
