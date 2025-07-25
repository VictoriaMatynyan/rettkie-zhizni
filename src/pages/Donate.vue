<template>
  <div class="donate-page">
    <h1 class="donate-title">Поддержите проект «РЕТТкие Жизни»</h1>
    <div class = "donate-intro">
        <p class="donate-text">Ваше пожертвование поможет развивать инициативу «РЕТТкие Жизни»: информировать, поддерживать семьи, развивать карту пациентов и обучать специалистов.</p>
        <p class="donate-text">Вы можете выбрать фиксированную сумму или указать свою. Доступны различные способы перевода: банковская карта, СБП, SMS, а также прямой перевод по реквизитам.</p>
    </div>
    <div class="donate-section">
      <h2>Сумма пожертвования</h2>
      <div class="amount-options">
        <button
          v-for="amount in predefinedAmounts"
          :key="amount"
          :class="{ active: selectedAmount === amount }"
          @click="selectedAmount = amount"
        >
          {{ amount }} ₽
        </button>
        <input
          type="number"
          placeholder="Другая сумма"
          v-model.number="customAmount"
          @focus="selectedAmount = null"
        />
      </div>
    </div>
    <div class="donate-section">
      <h2>Способ оплаты</h2>
      <div class="methods">
        <button class="method-button">Банковская карта</button>
        <button class="method-button">СБП (QR-код)</button>
        <button class="method-button">СМС</button>
      </div>
    </div>
    <div class="donate-section">
      <h2>Реквизиты для перевода</h2>
      <div class="bank-details">
        <p><strong>Получатель:</strong> АНО «РЕТТкие Жизни»</p>
        <p><strong>ИНН:</strong> 1234567890</p>
        <p><strong>КПП:</strong> 123401001</p>
        <p><strong>Расчетный счет:</strong> 40703810900000000001</p>
        <p><strong>Банк:</strong> ПАО «Сбербанк»</p>
        <p><strong>БИК:</strong> 044525000</p>
        <p><strong>Корр. счёт:</strong> 30101810400000000225</p>
        <p><strong>Назначение:</strong> Пожертвование на уставные цели</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const predefinedAmounts = [300, 500, 1000, 2000]
const selectedAmount = ref(500)
const customAmount = ref(null)
</script>

<style scoped>
.donate-page {
  max-width: 800px;
  margin: 0 auto;
  padding: 32px 16px;
  font-family: 'Segoe UI', sans-serif;
}

.donate-title {
  font-size: 30px;
  text-align: center;
  margin-bottom: 24px;
}

.donate-section {
  margin-top: 40px;
}

.amount-options {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin-top: 12px;
}

.amount-options button {
  padding: 10px 20px;
  font-size: 16px;
  background: #f2f2f2;
  border: 1px solid #ccc;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.amount-options button.active {
  background-color: #23938c;
  color: white;
  border-color: #23938c;
}

.amount-options input {
  width: 150px;
  padding: 10px;
  font-size: 16px;
  border: 1px solid #ccc;
  border-radius: 6px;
}

.methods {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin-top: 12px;
}

.methods .method-button {
  padding: 10px 20px;
  font-size: 16px;
  border-radius: 6px;
  border: none;
  background-color: #e0e0e0;
  cursor: pointer;
}

.bank-details {
  background: #f9f9f9;
  padding: 20px;
  border-radius: 6px;
  border: 1px solid #ddd;
  font-size: 15px;
  line-height: 1.6;
}

.bank-details p {
  margin: 4px 0;
}
</style>