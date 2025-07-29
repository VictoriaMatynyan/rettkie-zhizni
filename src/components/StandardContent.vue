<template>
  <section class="standard-content">
    <p
      v-for="(paragraph, index) in paragraphs"
      :key="index"
      class="standard-text"
    >
      {{ paragraph }}
    </p>

    <div class="media-section">
      <img
        :src="imageSrc"
        :alt="imageAlt"
        class="media-section__symptoms"
        @click="openModal"
      />
      <p class="caption">{{ captionText }}</p>
      <div v-if="modalOpen" class="media-modal" @click="closeModal">
        <img
          :src="imageSrcModal"
          :alt="imageAltModal"
          class="media-section__modal-image"
          @click="openModal"
        />
      </div>
    </div>

    <p v-if="downloadLink" class="file-download">
      <strong>{{ downloadLabel }}</strong>
      <a class="download-link" :href="downloadLink" download>{{
        downloadLinkName
      }}</a>
    </p>

    <div class="video-section">
      <iframe
        v-if="videoUrl"
        width="720"
        height="405"
        :src="videoUrl"
        frameborder="0"
        allow="clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowfullscreen
        mozallowfullscreen
        webkitAllowFullScreen
      ></iframe>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue';

const props = defineProps({
  paragraphs: Array,
  downloadLink: String,
  downloadLabel: String,
  downloadLinkName: String,
  imageSrc: String,
  imageSrcModal: String,
  imageAlt: String,
  imageAltModal: String,
  captionText: String,
  videoUrl: String,
});

const modalOpen = ref(false);

const openModal = () => {
  modalOpen.value = true;
};
const closeModal = () => {
  modalOpen.value = false;
};
const handleEsc = e => {
  if (e.key === 'Escape' || e.keyCode === 27) closeModal();
};

onMounted(() => window.addEventListener('keydown', handleEsc));
onBeforeUnmount(() => window.removeEventListener('keydown', handleEsc));
</script>

<style scoped>
.standard-content {
  width: 100%;
  margin: 0 auto;
}

.standard-text {
  line-height: 1.6;
  margin-bottom: 16px;
  text-align: center;
}

.media-section {
  margin: 32px 0;
  text-align: center;
}

.media-section__symptoms {
  max-width: 100%;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.media-section__symptoms:hover {
  cursor: zoom-in;
  transition: transform 0.3s ease-in-out;
}

.media-modal {
  display: flex;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  justify-content: center;
  align-items: center;
  background-color: rgba(0, 0, 0, 0.4);
  z-index: 9999;
}

.media-section__modal-image {
  max-width: 80%;
  max-height: 80%;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  cursor: zoom-out;
}

.caption {
  font-size: 14px;
  color: #666;
  margin-top: 8px;
}

.download-link {
  color: #1976d2;
}

.file-download {
  margin: 24px 0;
  background: #f5f5f5;
  padding: 12px 16px;
  border-radius: 6px;
}

.video-section {
  margin-top: 32px;
  position: relative;
  padding-bottom: 56.25%;
  height: 0;
  overflow: hidden;
}

.video-section iframe {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  border: none;
  border-radius: 8px;
}
</style>
