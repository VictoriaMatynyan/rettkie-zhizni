<template>
  <div
    v-if="modelValue"
    class="confirm-modal__backdrop"
    role="presentation"
    @click="onBackdrop"
  >
    <div
      class="confirm-modal"
      role="dialog"
      aria-modal="true"
      :aria-labelledby="titleId"
      :aria-describedby="message || hasMessageSlot ? messageId : undefined"
    >
      <header class="confirm-modal__header">
        <h2 :id="titleId" class="confirm-modal__title">{{ title }}</h2>
        <button
          type="button"
          class="confirm-modal__close"
          aria-label="Закрыть"
          @click="handleCancel"
        >
          &times;
        </button>
      </header>
      <div
        v-if="message || hasMessageSlot"
        :id="messageId"
        class="confirm-modal__message"
      >
        <template v-if="hasMessageSlot">
          <slot name="message"></slot>
        </template>
        <template v-else>{{ message }}</template>
      </div>
      <footer
        class="confirm-modal__actions"
        :class="{ 'confirm-modal__single-action': !confirmText }"
      >
        <button
          v-if="showCancel"
          type="button"
          class="confirm-modal__button cancel"
          @click="handleCancel"
        >
          {{ cancelText }}
        </button>
        <button
          v-if="confirmText"
          ref="confirmButton"
          type="button"
          class="confirm-modal__button confirm"
          @click="handleConfirm"
        >
          {{ confirmText }}
        </button>
      </footer>
    </div>
  </div>
</template>

<script setup>
import { computed, ref, watch, onBeforeUnmount, nextTick, useSlots } from 'vue';

const props = defineProps({
  modelValue: { type: Boolean, default: false },
  title: { type: String, default: 'Подтверждение' },
  message: { type: String, default: '' },
  confirmText: { type: String, default: '' },
  cancelText: { type: String, default: 'Отмена' },
  showCancel: { type: Boolean, default: true },
});

const emit = defineEmits(['update:modelValue', 'confirm', 'cancel']);

const confirmButton = ref(null);
const idBase = `confirm-modal-${Math.random().toString(36).slice(2)}`;
const titleId = computed(() => `${idBase}-title`);
const messageId = computed(() => `${idBase}-message`);
const slots = useSlots();
const hasMessageSlot = computed(() => typeof slots.message === 'function');
const hasConfirmButton = computed(() => !!props.confirmText);

const isOpen = computed(() => props.modelValue);

function setBodyScroll(lock) {
  if (typeof document === 'undefined') return;
  const { body } = document;
  if (!body) return;
  body.style.overflow = lock ? 'hidden' : '';
}

function handleCancel() {
  emit('cancel');
  emit('update:modelValue', false);
}

function handleConfirm() {
  emit('confirm');
  emit('update:modelValue', false);
}

function onBackdrop(event) {
  if (event.target === event.currentTarget) {
    handleCancel();
  }
}

function onKeydown(event) {
  if (event.key === 'Escape' && isOpen.value) {
    event.stopPropagation();
    handleCancel();
  }
}

watch(isOpen, value => {
  if (typeof window !== 'undefined') {
    if (value) {
      window.addEventListener('keydown', onKeydown);
    } else {
      window.removeEventListener('keydown', onKeydown);
    }
  }
  setBodyScroll(value);
  if (value && hasConfirmButton.value) {
    nextTick(() => {
      confirmButton.value?.focus();
    });
  }
});

onBeforeUnmount(() => {
  if (typeof window !== 'undefined') {
    window.removeEventListener('keydown', onKeydown);
  }
  setBodyScroll(false);
});
</script>

<style scoped>
.confirm-modal__backdrop {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 16px;
  z-index: 1000;
}

.confirm-modal {
  width: min(420px, 100%);
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 20px 40px rgba(35, 147, 140, 0.2);
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.confirm-modal__header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 16px;
}

.confirm-modal__title {
  margin: 0;
  font-size: 20px;
  font-weight: 600;
}

.confirm-modal__close {
  border: none;
  background: transparent;
  font-size: 20px;
  cursor: pointer;
  color: #556070;
  line-height: 1;
}

.confirm-modal__close:hover {
  color: #23938c;
}

.confirm-modal__message {
  font-size: 15px;
  line-height: 1.5;
  color: #3a4554;
}

.confirm-modal__actions {
  display: flex;
  justify-content: space-between;
  gap: 12px;
}

.confirm-modal__single-action {
  justify-content: center;
}

.confirm-modal__button {
  min-width: 100px;
  padding: 10px 16px;
  border-radius: 6px;
  border: 1px solid transparent;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  transition: background-color 0.2s ease, border-color 0.2s ease, color 0.2s ease;
}

.confirm-modal__button.cancel {
  background: #f4f6fb;
  color: #39445a;
  border-color: #d0d7e2;
}

.confirm-modal__button.cancel:hover {
  background: #e9eef7;
}

.confirm-modal__button.confirm {
  background: #23938c;
  color: #fff;
}

.confirm-modal__button.confirm:hover {
  background: #1d7a74;
}
</style>
