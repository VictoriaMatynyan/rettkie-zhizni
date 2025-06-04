<template>
    <footer class="site-footer">
      <div class="footer-container">
        <!-- Юридическая информация -->
        <div class="footer-section">
          <p class="org-name">НКО «Ретткие жизни»</p>
          <router-link to="/privacy-policy" class="footer-link">Политика обработки персональных данных</router-link>
          <p class="copyright">© {{ new Date().getFullYear() }} Все права защищены</p>
        </div>
  
        <!-- Соцсети -->
        <div class="footer-section">
          <p class="footer-heading">Мы в соцсетях:</p>
          <div class="social-links">
            <a href="#" target="_blank" rel="noopener" aria-label="ВКонтакте">
              <img src="/src/assets/vk_logo.svg" alt="лого ВК" class="icon" />
            </a>
            <a href="#" target="_blank" rel="noopener" aria-label="Телеграм">
              <img src="/src/assets/telegram_logo.svg" alt="лого Телеграм" class="icon" />
            </a>
            <a href="#" target="_blank" rel="noopener" aria-label="WhatsApp">
              <img src="/src/assets/whatsapp_logo.png" alt="лого WhatsApp" class="icon" />
            </a>
          </div>
        </div>
          <div class="footer-section">
          <p class="footer-heading">Связаться с нами:</p>
          <div class="messenger-links">
            <a href="#" target="_blank" class="messenger-link">
              <img src="/src/assets/telegram_logo.svg" alt="лого Телеграм" class="icon" />
              <span>Имя (Telegram)</span>
            </a>
            <a href="#" target="_blank" class="messenger-link">
              <img src="/src/assets/whatsapp_logo.png" alt="лого WhatsApp" class="icon" />
              <span>Имя (WhatsApp)</span>
            </a>
          </div>
        </div>
      </div>
    </footer>
  </template>
  
  <script setup>
  // никаких настроек не требуется
  </script>
  
  <style scoped>
  .site-footer {
    background-color: #f8f8f8;
    padding: 24px 16px;
    border-top: 1px solid #ddd;
    font-size: 14px;
    color: #333;
  }
  
  .footer-container {
    max-width: 1200px;
    margin: 0 auto;
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    gap: 24px;
  }
  
  .footer-section {
    flex: 1 1 250px;
  }
  
  .footer-link {
    display: inline-block;
    margin: 6px 0;
    color: #007acc;
    text-decoration: none;
  }
  
  .footer-link:hover {
    text-decoration: underline;
  }
  
  .footer-heading {
    font-weight: bold;
    margin-bottom: 8px;
  }
  
  .social-links,
  .messenger-links {
    display: flex;
    align-items: center;
    gap: 12px;
    flex-wrap: wrap;
  }
  
  .messenger-link {
    display: flex;
    align-items: center;
    gap: 6px;
    text-decoration: none;
    color: #333;
  }
  
  .messenger-link:hover {
    text-decoration: underline;
  }
  
  .icon {
    width: 20px;
    height: 20px;
  }
  </style>
  