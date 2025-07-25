<template>
  <div class="safe-iframe-wrapper">
    <div v-if="loading" class="iframe-loading">
      <div class="loading-spinner"></div>
      <p>Загрузка видео...</p>
    </div>
    <iframe
      v-show="!loading"
      :src="src"
      :title="title"
      :width="width"
      :height="height"
      :frameborder="frameborder"
      :allowfullscreen="allowfullscreen"
      @load="onLoad"
      @error="onError"
    ></iframe>
    <div v-if="error" class="iframe-error">
      <p>Не удалось загрузить видео</p>
      <button class="retry-button" @click="retry">Попробовать снова</button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'SafeIframe',
  props: {
    src: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      default: 'Видео',
    },
    width: {
      type: [String, Number],
      default: '100%',
    },
    height: {
      type: [String, Number],
      default: '315',
    },
    frameborder: {
      type: [String, Number],
      default: '0',
    },
    allowfullscreen: {
      type: Boolean,
      default: true,
    },
  },
  data() {
    return {
      loading: true,
      error: false,
    };
  },
  methods: {
    onLoad() {
      this.loading = false;
      this.error = false;
    },
    onError() {
      this.loading = false;
      this.error = true;
      console.warn('Ошибка загрузки iframe:', this.src);
    },
    retry() {
      this.loading = true;
      this.error = false;
      // Принудительно перезагружаем iframe
      this.$nextTick(() => {
        const iframe = this.$el.querySelector('iframe');
        if (iframe) {
          const currentSrc = iframe.src;
          iframe.src = '';
          iframe.src = currentSrc;
        }
      });
    },
  },
};
</script>

<style scoped>
.safe-iframe-wrapper {
  position: relative;
  width: 100%;
  background: #f5f5f5;
  border-radius: 8px;
  overflow: hidden;
}

.iframe-loading,
.iframe-error {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 315px;
  background: #f9f9f9;
  color: #666;
}

.loading-spinner {
  width: 40px;
  height: 40px;
  border: 3px solid #f3f3f3;
  border-top: 3px solid #8132ad;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 16px;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

.retry-button {
  background: #8132ad;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 4px;
  cursor: pointer;
  margin-top: 8px;
}

.retry-button:hover {
  background: #6a2a8d;
}

iframe {
  width: 100%;
  height: 100%;
  border: none;
}
</style>
