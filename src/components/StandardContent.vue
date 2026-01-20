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

    <div v-if="videoUrl && finalShowVideo" class="video-section">
      <iframe
        width="720"
        height="405"
        :src="videoUrl"
        frameborder="0"
        allow="autoplay; fullscreen"
        allowfullscreen
        mozallowfullscreen
        webkitAllowFullScreen
        title="Видеоплеер"
      ></iframe>
    </div>
    <div v-if="showMap" class="map-section">
      <h3 v-if="mapTitle" class="map-title">{{ mapTitle }}</h3>
      <OSMMap :points="mapPoints" />
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, computed } from 'vue';
import { useRoute } from 'vue-router';
import OSMMap from './OSMMap.vue';

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
  showVideo: { type: Boolean, default: undefined },
  hideVideoOnRoutes: { type: Array, default: () => [] },
  // OSM Map integration
  showMap: { type: Boolean, default: false },
  mapPoints: { type: Array, default: () => [] },
  mapTitle: { type: String, default: '' },
});

const route = useRoute();
const modalOpen = ref(false);
const envShow = import.meta.env.PROD;
const hiddenByRoute = computed(() => {
  const list = props.hideVideoOnRoutes || [];
  return list.some(r => r === route.name || r === route.path);
});
const finalShowVideo = computed(() => {
  if (hiddenByRoute.value) return false;
  if (typeof props.showVideo === 'boolean') return props.showVideo;
  return envShow;
});

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
  font-size: clamp(13px, calc(8px + 2vw), 18px);
  line-height: 1.6;
  margin-bottom: clamp(12px, calc(8px + 1.5vw), 16px);
  text-align: center;
}

.media-section {
  margin: clamp(20px, calc(12px + 4vw), 36px) 0;
  text-align: center;
}

.media-section__symptoms {
  max-width: 100%;
  width: 100%;
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
  z-index: 10;
}

.media-section__modal-image {
  max-width: 80%;
  max-height: 80%;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  cursor: zoom-out;
}

.caption {
  font-size: clamp(11px, calc(7px + 1.5vw), 14px);
  color: #666;
  margin-top: clamp(6px, calc(4px + 1.2vw), 12px);
  text-align: center;
}

.download-link {
  color: #1976d2;
}

.file-download {
  margin: clamp(20px, calc(14px + 4vw), 32px) 0;
  background: #f5f5f5;
  padding: clamp(8px, calc(6px + 1.8vw), 14px)
    clamp(12px, calc(8px + 3.5vw), 22px);
  border-radius: 6px;
  font-size: clamp(12px, calc(8px + 2vw), 16px);
  text-align: center;
  width: 100%;
  box-sizing: border-box;
}

.video-section {
  margin-top: clamp(24px, calc(16px + 4vw), 44px);
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

.map-section {
  margin-top: clamp(24px, calc(16px + 4vw), 44px);
}
.map-title {
  font-size: clamp(15px, calc(9px + 2.4vw), 22px);
  margin-bottom: clamp(12px, calc(8px + 2vw), 20px);
  text-align: left;
}

@media (max-width: 1129px) {
  .media-section__symptoms {
    max-width: 95%;
    width: 95%;
  }

  .file-download {
    max-width: 95%;
    width: 95%;
  }

  .standard-text {
    font-size: 16px;
    margin: 0;
  }
}

@media (max-width: 980px) {
  .standard-content {
    width: 100%;
    padding: 0 16px;
    box-sizing: border-box;
  }

  .media-section {
    width: 100%;
    box-sizing: border-box;
  }

  .media-section__symptoms {
    /* max-width: 90%;
    width: 90%; */
    height: auto;
    box-sizing: border-box;
  }

  .file-download {
    max-width: 90%;
    width: 90%;
  }
}

@media (max-width: 1024px) {
  .media-section__symptoms {
    /* max-width: 85%;
    width: 85%; */
  }

  .file-download {
    max-width: 85%;
    width: 85%;
  }
}

@media (max-width: 768px) {
  .standard-content {
    padding: 0 12px;
  }

  .media-section__symptoms {
    /* max-width: 80%;
    width: 80%; */
  }

  .file-download {
    max-width: 80%;
    width: 80%;
  }
}

@media (max-width: 600px) {
  .standard-content {
    padding: 0 16px;
  }

  .media-section__symptoms {
    /* max-width: 75%;
    width: 75%; */
  }

  .file-download {
    max-width: 75%;
    width: 75%;
  }
}

@media (max-width: 480px) {
  .standard-text {
    line-height: 1.5;
  }

  .standard-content {
    padding: 0 20px;
  }

  .media-section__symptoms {
    /* max-width: 70%;
    width: 70%; */
  }

  .file-download {
    max-width: 70%;
    width: 70%;
  }

  .media-section__modal-image {
    max-width: 90%;
    max-height: 70%;
  }
}
</style>
