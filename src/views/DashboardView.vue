<template>
  <div class="page">
    <div class="page-header">
      <div>
        <h1 class="page-title">Dashboard</h1>
        <p class="page-subtitle">{{ couples.length }} pasangan terdaftar</p>
      </div>
      <router-link to="/couple/new" class="btn btn-gold">
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
          <circle cx="7" cy="7" r="6" stroke="currentColor" stroke-width="1.2"/>
          <path d="M7 4v6M4 7h6" stroke="currentColor" stroke-width="1.2" stroke-linecap="round"/>
        </svg>
        Pasangan Baru
      </router-link>
    </div>

    <div v-if="loading" class="loading-state">
      <div class="loading-spinner" />
    </div>

    <div v-else-if="couples.length === 0" class="empty-state">
      <div class="empty-icon">💍</div>
      <h3>Belum ada pasangan</h3>
      <p>Klik "Pasangan Baru" untuk menambahkan undangan pertama</p>
    </div>

    <div v-else class="couple-list">
      <div v-for="c in couples" :key="c.slug" class="couple-card">
        <div class="card-header">
          <div class="couple-names">
            <span class="name-display">{{ c.groom_name || '—' }}</span>
            <span class="amp-wrap">
              <svg viewBox="0 0 24 24" width="18" height="18" fill="none">
                <path d="M12 2L22 12L12 22L2 12Z" stroke="#B8965A" stroke-width=".8" opacity=".5"/>
                <text x="12" y="16" text-anchor="middle" font-size="9" font-family="Playfair Display,serif" font-style="italic" fill="#B8965A" opacity=".8">&amp;</text>
              </svg>
            </span>
            <span class="name-display">{{ c.bride_name || '—' }}</span>
          </div>
          <div class="card-meta">
            <span class="slug-badge">{{ c.slug }}</span>
            <span class="meta-dot">·</span>
            <span class="meta-date">{{ c.date_display || 'Tanggal belum diisi' }}</span>
          </div>
        </div>

        <div class="card-url">
          <span class="url-text">{{ baseUrl }}/{{ c.slug }}/</span>
          <button class="copy-btn" @click="copyUrl(c.slug)" :class="{ copied: copiedSlug === c.slug }">
            <svg v-if="copiedSlug !== c.slug" width="12" height="12" viewBox="0 0 12 12" fill="none">
              <rect x="4" y="4" width="7" height="7" rx="1.2" stroke="currentColor" stroke-width="1"/>
              <path d="M8 4V2.8A1.2 1.2 0 0 0 6.8 1.6H2.8A1.2 1.2 0 0 0 1.6 2.8v4A1.2 1.2 0 0 0 2.8 8H4" stroke="currentColor" stroke-width="1" stroke-linecap="round"/>
            </svg>
            <svg v-else width="12" height="12" viewBox="0 0 12 12" fill="none">
              <path d="M2 6l3 3 5-5.5" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            {{ copiedSlug === c.slug ? 'Tersalin' : 'Salin' }}
          </button>
        </div>

        <div class="card-divider" />

        <div class="card-actions">
          <router-link :to="`/couple/${c.slug}/guests`" class="action-btn">
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <circle cx="5.5" cy="4.5" r="2.5" stroke="currentColor" stroke-width="1.1"/>
              <path d="M1 12c0-2.5 2-4.5 4.5-4.5S10 9.5 10 12" stroke="currentColor" stroke-width="1.1" stroke-linecap="round"/>
              <path d="M10.5 8h3M12 6.5v3" stroke="currentColor" stroke-width="1.1" stroke-linecap="round"/>
            </svg>
            Tamu
          </router-link>
          <router-link :to="`/couple/${c.slug}/edit`" class="action-btn">
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M9.5 2L12 4.5L5.5 11H3V8.5L9.5 2Z" stroke="currentColor" stroke-width="1.1" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            Edit
          </router-link>
          <button class="action-btn danger" @click="confirmDelete(c.slug)">
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M2 4.5h10M5.5 4.5V3h3v1.5M10.5 4.5l-.7 7H4.2l-.7-7" stroke="currentColor" stroke-width="1.1" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            Hapus
          </button>
        </div>
      </div>
    </div>
  </div>

  <div v-if="deleteSlug" class="modal-backdrop" @click.self="deleteSlug = null">
    <div class="modal">
      <div class="modal-icon">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <path d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6" stroke="#B8965A" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </div>
      <h3 class="modal-title">Hapus Pasangan?</h3>
      <p class="modal-body">Data <strong>{{ deleteSlug }}</strong> akan dihapus permanen termasuk semua ucapan tamu.</p>
      <div class="modal-actions">
        <button class="modal-btn cancel" @click="deleteSlug = null">Batal</button>
        <button class="modal-btn confirm" @click="doDelete" :disabled="deleting">
          <span v-if="deleting" class="btn-spinner" />
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
const baseUrl    = 'https://janji-suci.vercel.app'

onMounted(() => {
  onValue(dbRef(db, 'weddings'), snap => {
    console.log('total children:', snap.numChildren())
    loading.value = false
    if (!snap.exists()) { couples.value = []; return }
    const arr = []
    snap.forEach(child => {
      console.log('child key:', child.key)
      arr.push({ slug: child.key, ...child.val() })
    })
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

.empty-state {
  text-align: center; padding: 80px 24px;
  background: rgba(255,255,255,.6);
  border: 1px solid rgba(184,150,90,.1);
  border-radius: 12px;
}
.empty-icon { font-size: 40px; margin-bottom: 16px; }
.empty-state h3 { font-size: 17px; color: var(--ink); margin-bottom: 6px; font-weight: 500; }
.empty-state p  { font-size: 13px; color: var(--ink-muted); }

.couple-list { display: flex; flex-direction: column; gap: 12px; }

.couple-card {
  background: #fff;
  border: 1px solid rgba(28,24,20,.08);
  border-radius: 12px;
  padding: 20px 22px;
  transition: box-shadow .2s, border-color .2s;
}
.couple-card:hover {
  box-shadow: 0 4px 24px rgba(28,24,20,.07);
  border-color: rgba(184,150,90,.2);
}

.card-header { margin-bottom: 12px; }
.couple-names {
  display: flex; align-items: center; gap: 8px;
  flex-wrap: wrap; margin-bottom: 6px;
}
.name-display {
  font-family: 'Playfair Display', serif;
  font-size: 19px; font-weight: 400;
  color: var(--ink); font-style: italic;
}
.amp-wrap { display: flex; align-items: center; }
.card-meta {
  display: flex; align-items: center; gap: 6px;
  flex-wrap: wrap;
}
.slug-badge {
  font-size: 10px; font-weight: 500; letter-spacing: .14em;
  text-transform: uppercase;
  background: rgba(184,150,90,.12);
  color: rgba(184,150,90,.9);
  border: 1px solid rgba(184,150,90,.2);
  padding: 2px 8px; border-radius: 20px;
}
.meta-dot { color: var(--ink-muted); font-size: 12px; }
.meta-date { font-size: 12px; color: var(--ink-muted); }

.card-url {
  display: flex; align-items: center; gap: 8px;
  margin-bottom: 14px; flex-wrap: wrap;
}
.url-text {
  font-family: monospace; font-size: 11px;
  color: var(--ink-muted);
  background: #f5f0e8;
  border: 1px solid rgba(184,150,90,.15);
  padding: 4px 10px; border-radius: 6px;
  overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
  max-width: 280px; flex: 1;
}
.copy-btn {
  display: inline-flex; align-items: center; gap: 5px;
  font-size: 11px; color: rgba(184,150,90,.8);
  background: none; border: none; cursor: pointer;
  padding: 0; transition: color .15s; white-space: nowrap;
  font-family: 'DM Sans', sans-serif;
}
.copy-btn:hover { color: rgba(184,150,90,1); }
.copy-btn.copied { color: #5aad7a; }

.card-divider {
  height: 1px; margin-bottom: 14px;
  background: linear-gradient(90deg, rgba(184,150,90,.12), transparent);
}

.card-actions {
  display: flex; gap: 8px; flex-wrap: wrap;
}
.action-btn {
  display: inline-flex; align-items: center; gap: 6px;
  padding: 7px 14px; border-radius: 7px;
  font-size: 12px; font-weight: 500;
  font-family: 'DM Sans', sans-serif;
  text-decoration: none; cursor: pointer;
  border: 1px solid rgba(28,24,20,.1);
  background: #faf7f2; color: var(--ink-soft);
  transition: all .15s;
}
.action-btn:hover {
  background: #f3ede3; border-color: rgba(28,24,20,.18);
  color: var(--ink);
}
.action-btn.danger {
  color: #a06060; border-color: rgba(180,80,80,.15);
  background: #faf7f2;
}
.action-btn.danger:hover {
  background: #fdf0f0; border-color: rgba(180,80,80,.3);
  color: #c05050;
}

.modal-backdrop {
  position: fixed; inset: 0; z-index: 100;
  background: rgba(14,12,9,.6);
  backdrop-filter: blur(4px);
  display: flex; align-items: center; justify-content: center;
  padding: 24px;
}
.modal {
  width: 100%; max-width: 380px;
  background: #fff;
  border-radius: 16px;
  padding: 32px 28px 24px;
  box-shadow: 0 32px 64px rgba(0,0,0,.2);
  text-align: center;
}
.modal-icon {
  width: 48px; height: 48px; border-radius: 50%;
  background: rgba(184,150,90,.1);
  border: 1px solid rgba(184,150,90,.2);
  display: flex; align-items: center; justify-content: center;
  margin: 0 auto 16px;
}
.modal-title { font-size: 17px; font-weight: 600; color: var(--ink); margin-bottom: 8px; }
.modal-body  { font-size: 13px; color: var(--ink-muted); line-height: 1.65; margin-bottom: 24px; }
.modal-body strong { color: var(--ink); }
.modal-actions { display: flex; gap: 10px; }
.modal-btn {
  flex: 1; padding: 11px;
  border-radius: 8px; font-size: 13px; font-weight: 500;
  cursor: pointer; font-family: 'DM Sans', sans-serif;
  transition: all .2s; border: 1px solid transparent;
}
.modal-btn.cancel {
  background: #faf7f2; color: var(--ink-soft);
  border-color: rgba(28,24,20,.1);
}
.modal-btn.cancel:hover { background: #f3ede3; }
.modal-btn.confirm {
  background: #c05050; color: #fff;
  display: flex; align-items: center; justify-content: center; gap: 6px;
}
.modal-btn.confirm:hover:not(:disabled) { background: #a84040; }
.modal-btn.confirm:disabled { opacity: .5; cursor: not-allowed; }
.btn-spinner {
  width: 14px; height: 14px; border-radius: 50%;
  border: 1.5px solid rgba(255,255,255,.3);
  border-top-color: #fff;
  animation: spin .7s linear infinite;
}

@media (max-width: 480px) {
  .couple-card { padding: 16px; }
  .name-display { font-size: 16px; }
  .url-text { max-width: 200px; }
  .card-actions { gap: 6px; }
  .action-btn { padding: 6px 10px; font-size: 11px; }
}
</style>