<template>
  <div class="about-page">
    <h1 class="about-title">О нас</h1>
    <StandardContent
      :paragraphs="[
        'Наша организация объединяет родителей, специалистов и всех, кто заинтересован в поддержке людей с синдромом Ретта.',
        'Мы ведём информационную и образовательную работу, взаимодействуем с медицинским сообществом, государственными структурами и международными организациями.'
      ]"
      :imageSrc="aboutImg"
      :imageSrcModal="aboutImg"
      imageAlt="О нас"
      imageAltModal="О нас (увеличено)"
      downloadLink="/files/rett-about.pdf"
      downloadLabel="Скачать презентацию о сообществе: "
      captionText="Фотография с мероприятия сообщества"
      downloadLinkName="Презентация (1.3 МБ)"
      videoUrl="https://rutube.ru/play/embed/someVideoId/"
    />

    <section class="document-section">
      <h2 class="block-title">Документы</h2>

      <div v-for="group in documentGroups" :key="group.title" class="document-group">
        <h3 class="group-title">{{ group.title }}</h3>
        <ul class="document-list">
          <li v-for="doc in group.documents" :key="doc.name" class="document-item">
            <a :href="doc.link" target="_blank" rel="noopener">
              📎 {{ doc.name }}
            </a>
          </li>
        </ul>
      </div>
    </section>
  </div>
</template>

<script setup>
import StandardContent from '../components/StandardContent.vue';
import aboutImg from '../assets/logo_horizontal.png';

const documentGroups = [
  {
    title: 'Уставные документы',
    documents: [
      { name: 'Устав организации', link: '/files/statute.pdf' },
      { name: 'Свидетельство о регистрации', link: '/files/registration.pdf' }
    ]
  },
  {
    title: 'Финансовая отчётность',
    documents: [
      { name: 'Отчёт за 2023 год', link: '/files/report-2023.xlsx' },
      { name: 'Отчёт за 2022 год', link: '/files/report-2022.xlsx' }
    ]
  },
  {
    title: 'Политики и регламенты',
    documents: [
      { name: 'Политика обработки данных', link: '/files/privacy.docx' },
      { name: 'Регламент взаимодействия с семьями', link: '/files/rules.pdf' }
    ]
  }
]
</script>

<style scoped>
.about-page {
  max-width: 1050px;
  margin: 0 auto;
  padding: 32px 16px;
}

.about-title {
  font-size: 28px;
  margin-bottom: 24px;
  text-align: center;
}

.block-title {
  font-size: 22px;
  margin-top: 40px;
  margin-bottom: 20px;
}

.document-group {
  margin-bottom: 32px;
}

.group-title {
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 12px;
}

.document-list {
  list-style-type: none;
  padding-left: 0;
}

.document-item {
  margin-bottom: 8px;
}

.document-item a {
  text-decoration: none;
  color: #2AAEA2;
  font-weight: 500;
}

.document-item a:hover {
  text-decoration: underline;
}
</style>