<template>
  <div class="page">
    <div class="page-header">
      <div>
        <h1 class="page-title">Dashboard</h1>
        <p class="page-subtitle">{{ couples.length }} pasangan terdaftar</p>
      </div>
      <router-link to="/couple/new" class="btn btn-gold">
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><circle cx="7" cy="7" r="6" stroke="currentColor" stroke-width="1.2"/><path d="M7 4v6M4 7h6" stroke="currentColor" stroke-width="1.2" stroke-linecap="round"/></svg>
        Pasangan Baru
      </router-link>
    </div>

    <div v-if="loading" style="display:flex;justify-content:center;padding:60px">
      <div class="spinner" style="width:28px;height:28px" />
    </div>

    <div v-else-if="couples.length === 0" class="empty-state card">
      <div class="empty-state-icon">💍</div>
      <h3>Belum ada pasangan</h3>
      <p>Klik "Pasangan Baru" untuk menambahkan</p>
    </div>

    <div v-else class="couple-list">
      <div v-for="c in couples" :key="c.slug" class="couple-card card">
        <div class="couple-card-left">
          <div class="couple-names">
            <span class="name-display">{{ c.groom_name || '—' }}</span>
            <span class="amp">&amp;</span>
            <span class="name-display">{{ c.bride_name || '—' }}</span>
          </div>
          <div class="couple-meta">
            <span class="badge badge-gold">{{ c.slug }}</span>
            <span class="meta-date">{{ c.date_display || 'Tanggal belum diisi' }}</span>
          </div>
          <div class="couple-url">
            <span class="url-text">{{ baseUrl }}/{{ c.slug }}/</span>
            <button class="copy-url-btn" @click="copyUrl(c.slug)" :class="{ copied: copiedSlug === c.slug }">
              {{ copiedSlug === c.slug ? '✓ Tersalin' : 'Salin' }}
            </button>
          </div>
        </div>

        <div class="couple-card-actions">
          <router-link :to="`/couple/${c.slug}/guests`" class="btn btn-ghost btn-sm">
            <svg width="13" height="13" viewBox="0 0 13 13" fill="none"><circle cx="5" cy="4" r="2.5" stroke="currentColor" stroke-width="1"/><path d="M1 11c0-2.2 1.8-4 4-4s4 1.8 4 4" stroke="currentColor" stroke-width="1" stroke-linecap="round"/><path d="M9 7.5h3M10.5 6v3" stroke="currentColor" stroke-width="1" stroke-linecap="round"/></svg>
            Tamu
          </router-link>
          <router-link :to="`/couple/${c.slug}/edit`" class="btn btn-ghost btn-sm">
            <svg width="13" height="13" viewBox="0 0 13 13" fill="none"><path d="M9 2L11 4L5 10H3V8L9 2Z" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round"/></svg>
            Edit
          </router-link>
          <button class="btn btn-danger btn-sm" @click="confirmDelete(c.slug)">
            <svg width="13" height="13" viewBox="0 0 13 13" fill="none"><path d="M2 4h9M5 4V2.5h3V4M10 4l-.7 7H3.7L3 4" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round"/></svg>
            Hapus
          </button>
        </div>
      </div>
    </div>
  </div>

  <div v-if="deleteSlug" class="modal-backdrop" @click.self="deleteSlug = null">
    <div class="modal card">
      <h3 class="modal-title">Hapus Pasangan?</h3>
      <p class="modal-body">Data <strong>{{ deleteSlug }}</strong> akan dihapus permanen termasuk semua ucapan tamu.</p>
      <div class="modal-actions">
        <button class="btn btn-ghost" @click="deleteSlug = null">Batal</button>
        <button class="btn btn-danger" @click="doDelete" :disabled="deleting">
          <span v-if="deleting" class="spinner" style="width:14px;height:14px;border-width:1.5px"/>
          <span v-else>Hapus</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { db } from '../firebase.js'
import { ref as dbRef, onValue, remove } from 'firebase/database'

const couples    = ref([])
const loading    = ref(true)
const deleteSlug = ref(null)
const deleting   = ref(false)
const copiedSlug = ref('')
const baseUrl    = window.location.origin.replace('admin.', '') || 'https://inv-wedding.vercel.app'

onMounted(() => {
  onValue(dbRef(db, 'weddings'), snap => {
    loading.value = false
    if (!snap.exists()) { couples.value = []; return }
    const arr = []
    snap.forEach(child => arr.push({ slug: child.key, ...child.val() }))
    couples.value = arr.sort((a, b) => (b.created_at || 0) - (a.created_at || 0))
  })
})

function confirmDelete(slug) { deleteSlug.value = slug }

async function doDelete() {
  deleting.value = true
  try {
    await remove(dbRef(db, `weddings/${deleteSlug.value}`))
    deleteSlug.value = null
  } finally { deleting.value = false }
}

async function copyUrl(slug) {
  const url = `${baseUrl}/${slug}/`
  await navigator.clipboard.writeText(url).catch(() => {})
  copiedSlug.value = slug
  setTimeout(() => { copiedSlug.value = '' }, 2000)
}
</script>

<style scoped>
.couple-list { display: flex; flex-direction: column; gap: 14px; }

.couple-card {
  display: flex; align-items: center; justify-content: space-between;
  padding: 20px 24px; gap: 16px; flex-wrap: wrap;
  transition: box-shadow .15s;
}
.couple-card:hover { box-shadow: var(--shadow-lg); }

.couple-card-left { flex: 1; min-width: 0; }

.couple-names {
  display: flex; align-items: baseline; gap: 8px;
  margin-bottom: 8px;
}
.name-display {
  font-family: 'Playfair Display', serif;
  font-size: 20px; font-weight: 400; color: var(--ink);
  font-style: italic;
}
.amp { font-size: 14px; color: var(--ink-muted); }

.couple-meta {
  display: flex; align-items: center; gap: 10px;
  margin-bottom: 8px; flex-wrap: wrap;
}
.meta-date { font-size: 12px; color: var(--ink-muted); }

.couple-url {
  display: flex; align-items: center; gap: 8px;
}
.url-text {
  font-size: 11px; color: var(--ink-muted);
  font-family: monospace; background: var(--bg);
  padding: 3px 8px; border-radius: 4px;
  border: 1px solid var(--border);
  max-width: 300px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
}
.copy-url-btn {
  font-size: 11px; color: var(--gold-dark);
  background: none; border: none; cursor: pointer;
  padding: 0; transition: color .15s; white-space: nowrap;
}
.copy-url-btn.copied { color: var(--green); }

.couple-card-actions {
  display: flex; gap: 8px; flex-shrink: 0; flex-wrap: wrap;
}

.modal-backdrop {
  position: fixed; inset: 0; z-index: 100;
  background: rgba(28,24,20,.5);
  display: flex; align-items: center; justify-content: center;
  padding: 24px;
}
.modal { width: 100%; max-width: 400px; padding: 28px 28px 24px; }
.modal-title { font-size: 17px; font-weight: 600; color: var(--ink); margin-bottom: 10px; }
.modal-body  { font-size: 14px; color: var(--ink-soft); line-height: 1.6; margin-bottom: 24px; }
.modal-actions { display: flex; gap: 10px; justify-content: flex-end; }
</style>
