<template>
  <div class="page">
    <div class="page-header">
      <div>
        <h1 class="page-title">Edit Undangan</h1>
        <p class="page-subtitle">{{ slug }}</p>
      </div>
      <a :href="previewUrl" target="_blank" class="preview-btn">
        <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
          <path d="M1 12L12 1M12 1H5M12 1v7" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
        Preview
      </a>
    </div>

    <div v-if="loading" class="loading-state">
      <div class="loading-spinner" />
    </div>

    <div v-else-if="!data" class="not-found">
      <div class="not-found-icon">🔍</div>
      <h3>Pasangan tidak ditemukan</h3>
      <p>Slug "{{ slug }}" tidak ada di database</p>
    </div>

    <div v-else class="form-card">
      <CoupleForm :is-edit="true" :initial-data="data" />
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { db } from '../firebase.js'
import { ref as dbRef, get } from 'firebase/database'
import CoupleForm from '../components/CoupleForm.vue'

const route      = useRoute()
const slug       = computed(() => route.params.slug)
const data       = ref(null)
const loading    = ref(true)
const previewUrl = computed(() => `https://janji-suci.vercel.app/${slug.value}/`)

onMounted(async () => {
  try {
    const snap = await get(dbRef(db, `weddings/${slug.value}`))
    data.value = snap.exists() ? { slug: slug.value, ...snap.val() } : null
  } finally { loading.value = false }
})
</script>

<style scoped>
.loading-state {
  display: flex; justify-content: center; padding: 80px;
}
.loading-spinner {
  width: 28px; height: 28px; border-radius: 50%;
  border: 2px solid rgba(184,150,90,.15);
  border-top-color: rgba(184,150,90,.7);
  animation: spin .8s linear infinite;
}
@keyframes spin { to { transform: rotate(360deg); } }

.not-found {
  text-align: center; padding: 80px 24px;
  background: rgba(255,255,255,.6);
  border: 1px solid rgba(184,150,90,.1);
  border-radius: 12px;
}
.not-found-icon { font-size: 40px; margin-bottom: 16px; }
.not-found h3 { font-size: 17px; color: var(--ink); margin-bottom: 6px; font-weight: 500; }
.not-found p  { font-size: 13px; color: var(--ink-muted); }

.form-card {
  background: #fff;
  border: 1px solid rgba(28,24,20,.08);
  border-radius: 12px;
  padding: 32px;
}

.preview-btn {
  display: inline-flex; align-items: center; gap: 7px;
  padding: 8px 16px; border-radius: 8px;
  font-size: 12px; font-weight: 500;
  background: #faf7f2; color: var(--ink-soft);
  border: 1px solid rgba(28,24,20,.1);
  text-decoration: none;
  transition: all .2s; white-space: nowrap;
}
.preview-btn:hover {
  background: #f3ede3; color: var(--ink);
  border-color: rgba(184,150,90,.3);
}

@media (max-width: 600px) {
  .form-card { padding: 20px 16px; }
}
</style>