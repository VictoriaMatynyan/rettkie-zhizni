<template>
  <div class="standard-page">
    <h1>О синдроме Ретта</h1>

    <section class="standard-text">
        <p>
            Синдром Ретта — редкое генетическое заболевание, поражающее центральную нервную систему.
        </p>
    </section>

    <section class="media-section">
        <img src="/src/assets/symptoms.png" alt="Схема симптомов Ретта" @click="openModal" class="media-section__symptoms"/>
        <p class="caption">Изображение: основные проявления синдрома Ретта</p>
        <div class="media-modal" v-if="showModal" @click="closeModal">
            <img src="/src/assets/symptoms.png" alt="Схема симптомов Ретта" @click="openModal" class="media-section__modal-image"/>
        </div>
    </section>

    <section class="file-download">
        <p>
            <strong>Скачать памятку по заболеванию: </strong>
            <a href="/files/rett-info-brochure.pdf" download>Гайд-заглушка (1.2 МБ)</a>
        </p>
    </section>

    <section class="video-section">
        <iframe
            width="720"
            height="405"
            src="https://rutube.ru/play/embed/someVideoId/"
            frameBorder="0"
            allow="clipboard-write; autoplay"
            webkitAllowFullScreen
            mozallowfullscreen
            allowFullScreen>
        </iframe>
    </section>
  </div>
</template>

<script setup>
import {ref, onMounted, onBeforeUnmount} from 'vue';

const showModal = ref(false);

const openModal = () => {
    showModal.value = true;
};
const closeModal = () => {
    showModal.value = false;
};

const handleKeyDown = (e) => {
    if (e.key === 'Escape' || e.keyCode === 27) {
        showModal.value = false;
    }
};

onMounted(() => {
    window.addEventListener('keydown', handleKeyDown);
});
onBeforeUnmount(() => {
    window.removeEventListener('keydown', handleKeyDown);
})
</script>

<style scoped>
.standard-page {
  max-width: 900px;
  margin: 0 auto;
  padding: 32px 16px;
}

.standard-page h1 {
  font-size: 28px;
  margin-bottom: 24px;
  text-align: center;
}

.standard-page p {
  line-height: 1.6;
  margin-bottom: 16px;
}

a {
  color: #1976d2;
  text-decoration: underline;
}

.media-section {
  margin: 32px 0;
  text-align: center;
}

.media-section__symptoms {
  max-width: 100%;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
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
    background-color: rgba(0, 0, 0, .4);
    z-index: 9999;
}

.media-section__symptoms {
    cursor: zoom-in;
    transition: transform 0.3s ease-in-out;
}

.media-section__modal-image {
    max-width: 80%;
    max-height: 80%;
    border-radius: 8px;
    box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    cursor: zoom-out;
}

.caption {
  font-size: 14px;
  color: #666;
  margin-top: 8px;
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
  top: 0; left: 0;
  width: 100%; height: 100%;
  border: none;
  border-radius: 8px;
}
</style>