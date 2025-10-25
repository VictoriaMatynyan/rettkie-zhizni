<template>
  <div class="consent-tab">
    <h2>Письменное согласие</h2>

    <div v-if="loading" class="status muted">Загрузка…</div>
    <div v-else>
      <div v-if="status === 'active'" class="success-message" role="status">
        Письменное согласие получено
      </div>
      <div
        v-else-if="status === 'pending'"
        class="warning-message"
        role="status"
      >
        Письменное согласие на проверке
      </div>
      <div v-else class="danger-message" role="status" aria-live="polite">
        Статус согласия пока не установлен
      </div>

      <form class="upload-form" @submit.prevent="handleUpload">
        <label class="form-label" for="consent_file"
          >Прикрепить новое согласие</label
        >

        <!-- Скрытый системный input -->
        <input
          id="consent_file"
          ref="fileInput"
          type="file"
          class="file-input-hidden"
          accept="application/pdf,image/*"
          :disabled="submitting"
          @change="onFileChange"
        />

        <!-- Кастомная зона загрузки с drag'n'drop -->
        <div
          class="dropzone"
          :class="{ dragging: isDragging, hasFile: !!file }"
          tabindex="0"
          role="button"
          aria-label="Загрузить файл согласия"
          @dragover.prevent="onDragOver"
          @dragleave.prevent="onDragLeave"
          @drop.prevent="onDrop"
          @click="triggerFileDialog"
          @keydown.enter.prevent="triggerFileDialog"
          @keydown.space.prevent="triggerFileDialog"
        >
          <div class="dropzone-inner">
            <div v-if="!file" class="dropzone-text">
              <strong>Выберите файл</strong> или перетащите его сюда
              <div class="hint">Поддерживаются PDF и изображения</div>
            </div>
            <div v-else class="selected-file">
              <span class="file-pill">{{ file.name }}</span>
              <span class="file-size">{{ formatSize(file.size) }}</span>
              <button
                type="button"
                class="clear-button"
                @click.stop="clearFile"
              >
                Очистить
              </button>
            </div>
          </div>
        </div>

        <div class="actions">
          <button
            class="send-button"
            type="submit"
            :disabled="!file || submitting"
          >
            {{ submitting ? 'Отправка…' : 'Отправить на проверку' }}
          </button>
        </div>

        <p v-if="error" class="error-message">{{ error }}</p>
        <p v-if="sent" class="info">Файл отправлен. Статус: «на проверке»</p>
      </form>

      <!-- Скачивание шаблона -->
      <div class="template">
        <a :href="templateUrl" download>Скачать шаблон письменного согласия</a>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, inject } from 'vue';
import { api } from '../services/api.js';

const status = ref('none');
const loading = ref(false);
const submitting = ref(false);
const error = ref('');
const sent = ref(false);
const file = ref(null);
const fileInput = ref(null);
const isDragging = ref(false);

const templateUrl = '../../consent.docx';

const updateConsentStatus = inject('updateConsentStatus', () => {});

onMounted(async () => {
  loading.value = true;
  try {
    const data = await api.accounts.getConsentStatus?.();
    if (data && typeof data.status === 'string') {
      const s = data.status.toLowerCase();
      status.value =
        s === 'active' ? 'active' : s === 'pending' ? 'pending' : 'none';
    }
  } catch {
    status.value = 'none';
  } finally {
    loading.value = false;
    updateConsentStatus(status.value);
  }
});

function onFileChange(e) {
  error.value = '';
  sent.value = false;
  const f = e.target.files?.[0];
  file.value = f || null;
}

function triggerFileDialog() {
  if (submitting.value) return;
  fileInput.value?.click();
}

function clearFile() {
  file.value = null;
  if (fileInput.value) fileInput.value.value = '';
}

function onDragOver() {
  if (!submitting.value) isDragging.value = true;
}

function onDragLeave() {
  isDragging.value = false;
}

function onDrop(e) {
  isDragging.value = false;
  if (submitting.value) return;
  const f = e.dataTransfer?.files?.[0];
  if (f) {
    file.value = f;
  }
}

function formatSize(bytes) {
  if (!bytes && bytes !== 0) return '';
  const units = ['Б', 'КБ', 'МБ', 'ГБ'];
  let i = 0;
  let size = bytes;
  while (size >= 1024 && i < units.length - 1) {
    size /= 1024;
    i++;
  }
  return `${size.toFixed(size < 10 && i > 0 ? 1 : 0)} ${units[i]}`;
}
async function handleUpload() {
  if (!file.value) return;
  submitting.value = true;
  error.value = '';
  sent.value = false;
  try {
    if (typeof api.accounts.uploadConsent !== 'function') {
      throw new Error('Загрузка согласия временно недоступна');
    }
    await api.accounts.uploadConsent(file.value);
    status.value = 'pending';
    sent.value = true;
    if (fileInput.value) fileInput.value.value = '';
    file.value = null;
    updateConsentStatus(status.value);
  } catch (e) {
    const msg =
      e?.response?.data?.message || e.message || 'Не удалось отправить файл';
    error.value = msg;
  } finally {
    submitting.value = false;
  }
}
</script>

<style scoped>
.consent-tab {
  max-width: 800px;
  margin: 0 auto;
}

.status.muted {
  color: #666;
}

/* Плашка успех */
.success-message {
  background-color: #e8f8f2;
  color: #0f8a66;
  padding: 12px;
  border-radius: 8px;
  margin-bottom: 16px;
  border: 1px solid #bde9dc;
}

/* Жёлтая плашка ожидания */
.warning-message {
  background-color: #fff7e6;
  color: #a46800;
  padding: 12px;
  border-radius: 8px;
  margin-bottom: 16px;
  border: 1px solid #ffe5b4;
}

.danger-message {
  background-color: #fee;
  color: #c33;
  padding: 12px;
  border-radius: 8px;
  margin-bottom: 16px;
  border: 1px solid #fcc;
}

.upload-form {
  margin-top: 16px;
}
.file-input-hidden {
  position: absolute !important;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}

.dropzone {
  border: 1.5px dashed #ccc;
  border-radius: 10px;
  padding: 20px;
  text-align: center;
  cursor: pointer;
  transition:
    border-color 0.2s ease,
    background-color 0.2s ease;
  background-color: #fafafa;
}
.dropzone.dragging {
  border-color: #2aaea2;
  background-color: #f0fffb;
}
.dropzone.hasFile {
  border-color: #bdbdbd;
}
.dropzone-inner {
  display: flex;
  align-items: center;
  justify-content: center;
}
.dropzone .hint {
  color: #777;
  font-size: 13px;
  margin-top: 4px;
}

.selected-file {
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
}
.file-pill {
  display: inline-block;
  padding: 6px 10px;
  background: #eef7ff;
  color: #245c7f;
  border: 1px solid #cfe6ff;
  border-radius: 999px;
  max-width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.file-size {
  color: #666;
  font-size: 13px;
}
.clear-button {
  background: transparent;
  border: 1px solid #ddd;
  padding: 6px 10px;
  border-radius: 8px;
  cursor: pointer;
}
.clear-button:hover {
  background: #f6f6f6;
}

.actions {
  margin-top: 12px;
}
.form-label {
  display: block;
  margin-bottom: 8px;
  font-weight: 500;
  color: #555;
}
.send-button {
  padding: 10px 14px;
  background-color: #8132ad;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
}
.send-button:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}
.error-message {
  color: #c33;
  margin-top: 10px;
}
.info {
  color: #555;
  margin-top: 10px;
}
.template {
  margin-top: 20px;
}
.template a {
  color: #2aaea2;
  text-decoration: none;
}
.template a:hover {
  text-decoration: underline;
}
</style>
