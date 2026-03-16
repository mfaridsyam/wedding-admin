<template>
  <div class="page">
    <div class="page-header">
      <div>
        <h1 class="page-title">Edit Undangan</h1>
        <p class="page-subtitle">{{ slug }}</p>
      </div>
      <a :href="previewUrl" target="_blank" class="btn btn-ghost btn-sm">
        <svg width="13" height="13" viewBox="0 0 13 13" fill="none"><path d="M1 12L12 1M12 1H5M12 1v7" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"/></svg>
        Preview Undangan
      </a>
    </div>

    <div v-if="loading" style="display:flex;justify-content:center;padding:60px">
      <div class="spinner" style="width:28px;height:28px" />
    </div>

    <div v-else-if="!data" class="empty-state card">
      <div class="empty-state-icon">🔍</div>
      <h3>Pasangan tidak ditemukan</h3>
      <p>Slug "{{ slug }}" tidak ada di database</p>
    </div>

    <div v-else class="card" style="padding: 28px 32px">
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

const route     = useRoute()
const slug      = computed(() => route.params.slug)
const data      = ref(null)
const loading   = ref(true)
const previewUrl = computed(() => `https://janji-suci.vercel.app/${slug.value}/`)

onMounted(async () => {
  try {
    const snap = await get(dbRef(db, `weddings/${slug.value}`))
    data.value = snap.exists() ? { slug: slug.value, ...snap.val() } : null
  } finally { loading.value = false }
})
</script>
