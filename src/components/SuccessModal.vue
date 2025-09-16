<template>
  <div
    v-if="modelValue"
    class="modal-overlay"
    @click.self="handleBackdrop"
  >
    <div class="modal" role="dialog" aria-modal="true" :aria-labelledby="titleId">
      <button class="modal__close" aria-label="Закрыть" @click="close">×</button>
      <h3 :id="titleId" class="modal__title">{{ title }}</h3>
      <p v-if="message" class="modal__text">{{ message }}</p>

      <div v-if="links && links.length" class="modal-social" aria-label="Социальные сети">
        <template v-for="(l, idx) in links" :key="idx">
          <a :href="l.href || '#'" target="_blank" rel="noopener" class="modal-social__link">
            <img v-if="l.iconSrc" :src="l.iconSrc" :alt="l.alt || ''" class="modal-social__icon" />
            <span>{{ l.label }}</span>
          </a>
          <span v-if="idx < links.length - 1" class="modal-social__sep">•</span>
        </template>
      </div>

      <button class="modal-action" @click="close">{{ actionLabel }}</button>
    </div>
  </div>
</template>

<script setup>
import { onMounted, onBeforeUnmount, computed } from 'vue';

const props = defineProps({
  modelValue: { type: Boolean, default: false },
  title: { type: String, default: '' },
  message: {
    type: String,
    default: '',
  },
  links: { type: Array, default: () => [] },
  actionLabel: { type: String, default: '' },
  closeOnEsc: { type: Boolean, default: true },
  closeOnBackdrop: { type: Boolean, default: true },
});

const emit = defineEmits(['update:modelValue', 'close']);

const titleId = computed(() => 'modal-title-' + Math.random().toString(36).slice(2));

function close() {
  emit('update:modelValue', false);
  emit('close');
}

function handleBackdrop() {
  if (props.closeOnBackdrop) close();
}

function onKeyDown(e) {
  if (!props.modelValue) return;
  if (!props.closeOnEsc) return;
  if (e.key === 'Escape' || e.keyCode === 27) close();
}

onMounted(() => window.addEventListener('keydown', onKeyDown));
onBeforeUnmount(() => window.removeEventListener('keydown', onKeyDown));
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.45);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 100;
  padding: 16px;
}

.modal {
  position: relative;
  background: #fff;
  border-radius: 10px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
  max-width: 520px;
  width: 100%;
  padding: 24px 20px 20px;
}

.modal__close {
  position: absolute;
  top: 8px;
  right: 10px;
  background: transparent;
  border: none;
  font-size: 24px;
  line-height: 1;
  cursor: pointer;
  color: #666;
}

.modal__title {
  margin: 0 0 8px;
  font-size: 22px;
  text-align: center;
}

.modal__text {
  margin: 0 0 16px;
  color: #444;
  text-align: center;
}

.modal-social {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  margin: 4px 0 16px;
  flex-wrap: wrap;
}

.modal-social__link {
  color: #1976d2;
  text-decoration: none;
  display: inline-flex;
  align-items: center;
  gap: 6px;
}

.modal-social__link:hover { text-decoration: underline; }

.modal-social__sep { color: #999; }

.modal-social__icon { width: 18px; height: 18px; }

.modal-action {
  display: block;
  margin: 0 auto;
  background-color: rgba(43, 174, 162, 0.8);
  color: white;
  padding: 10px 20px;
  font-size: 16px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
}

.modal-action:hover { background-color: rgba(43, 174, 162, 1); }

@media (max-width: 480px) {
  .modal { padding: 20px 16px 16px; }
  .modal__title { font-size: 20px; }
}
</style>

