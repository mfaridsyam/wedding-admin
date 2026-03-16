<template>
  <div class="page">
    <div class="page-header">
      <div>
        <h1 class="page-title">Daftar Tamu</h1>
        <p class="page-subtitle">{{ slug }} · {{ guests.length }} tamu</p>
      </div>
      <div style="display:flex;gap:10px">
        <button class="btn btn-ghost btn-sm" @click="exportCSV">
          <svg width="13" height="13" viewBox="0 0 13 13" fill="none"><path d="M2 10h9M6.5 2v6M4 6l2.5 2.5L9 6" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"/></svg>
          Export CSV
        </button>
      </div>
    </div>

    <div class="card add-guest-card">
      <p class="section-title">Tambah Tamu</p>
      <div class="add-guest-row">
        <div class="field" style="margin:0;flex:1">
          <input
            v-model="newGuestName"
            type="text"
            placeholder="Nama tamu, misal: Budi Hartono"
            @keyup.enter="addGuest"
          />
        </div>
        <button class="btn btn-gold" @click="addGuest" :disabled="!newGuestName.trim()">
          + Tambah
        </button>
      </div>

      <details class="bulk-details">
        <summary>Tambah banyak sekaligus (bulk)</summary>
        <div style="margin-top:12px">
          <div class="field">
            <label>Satu nama per baris</label>
            <textarea v-model="bulkText" rows="5" placeholder="Budi Hartono&#10;Siti Nurhaliza&#10;Ahmad Ridwan" />
          </div>
          <button class="btn btn-ghost btn-sm" @click="addBulk">Tambah Semua</button>
        </div>
      </details>
    </div>

    <div class="card" style="margin-top:16px">
      <div v-if="guests.length === 0" class="empty-state" style="padding:40px">
        <div class="empty-state-icon">👥</div>
        <h3>Belum ada tamu</h3>
        <p>Tambahkan nama tamu di atas</p>
      </div>

      <div v-else>
        <div class="guest-list-header">
          <input v-model="search" type="text" placeholder="Cari nama tamu..." class="search-input" />
          <span class="guest-count">{{ filteredGuests.length }} tamu</span>
        </div>

        <div class="guest-table">
          <div class="guest-row guest-row-head">
            <span>Nama Tamu</span>
            <span>Link Undangan</span>
            <span></span>
          </div>
          <div v-for="(g, i) in filteredGuests" :key="i" class="guest-row">
            <span class="guest-name">{{ g }}</span>
            <span class="guest-link-wrap">
              <code class="guest-link">{{ shortLink(g) }}</code>
            </span>
            <div class="guest-actions">
              <button class="action-btn" @click="copyGuestLink(g)" :class="{ copied: copiedGuest === g }" title="Salin link">
                <svg v-if="copiedGuest !== g" width="13" height="13" viewBox="0 0 13 13" fill="none"><rect x="4" y="4" width="8" height="8" rx="1.5" stroke="currentColor" stroke-width="1"/><path d="M9 4V2.5A1.5 1.5 0 0 0 7.5 1h-5A1.5 1.5 0 0 0 1 2.5v5A1.5 1.5 0 0 0 2.5 9H4" stroke="currentColor" stroke-width="1" stroke-linecap="round"/></svg>
                <svg v-else width="13" height="13" viewBox="0 0 13 13" fill="none"><path d="M2 6.5l3.5 3.5 5.5-6" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"/></svg>
              </button>
              <button class="action-btn" @click="shareWhatsApp(g)" title="Bagikan via WhatsApp">
                <svg width="13" height="13" viewBox="0 0 13 13" fill="none"><path d="M6.5 1a5.5 5.5 0 0 1 4.77 8.23L12 12l-2.77-.73A5.5 5.5 0 1 1 6.5 1z" stroke="currentColor" stroke-width="1" stroke-linejoin="round"/><path d="M4.5 5.5c.5 1 1.5 2 2.5 2.5" stroke="currentColor" stroke-width="1" stroke-linecap="round"/></svg>
              </button>
              <button class="action-btn danger" @click="removeGuest(i)" title="Hapus">
                <svg width="13" height="13" viewBox="0 0 13 13" fill="none"><path d="M2 4h9M5 4V2.5h3V4M10 4l-.7 7H3.7L3 4" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round"/></svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div v-if="guests.length > 0" class="card" style="margin-top:16px;padding:20px 24px">
      <p class="section-title" style="margin-bottom:12px">Salin Semua Link</p>
      <p style="font-size:13px;color:var(--ink-muted);margin-bottom:14px">
        Salin semua link sekaligus untuk dikirim via WhatsApp atau email.
      </p>
      <button class="btn btn-ghost btn-sm" @click="copyAllLinks">
        Salin {{ guests.length }} Link Sekaligus
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import { db } from '../firebase.js'
import { ref as dbRef, get, set } from 'firebase/database'

const route       = useRoute()
const slug        = computed(() => route.params.slug)
const guests      = ref([])
const newGuestName = ref('')
const bulkText    = ref('')
const search      = ref('')
const copiedGuest = ref('')
const baseUrl     = window.location.origin.replace('admin.', '') || 'https://inv-wedding.vercel.app'

// Load guests from Firebase
onMounted(async () => {
  const snap = await get(dbRef(db, `weddings/${slug.value}/guests`))
  if (snap.exists()) guests.value = Object.values(snap.val())
})

// Save to Firebase whenever guests change
async function saveGuests() {
  const obj = {}
  guests.value.forEach((g, i) => { obj[i] = g })
  await set(dbRef(db, `weddings/${slug.value}/guests`), obj)
}

function addGuest() {
  const name = newGuestName.value.trim()
  if (!name || guests.value.includes(name)) return
  guests.value.push(name)
  newGuestName.value = ''
  saveGuests()
}

function addBulk() {
  const names = bulkText.value.split('\n').map(n => n.trim()).filter(Boolean)
  names.forEach(n => { if (!guests.value.includes(n)) guests.value.push(n) })
  bulkText.value = ''
  saveGuests()
}

function removeGuest(i) {
  guests.value.splice(i, 1)
  saveGuests()
}

const filteredGuests = computed(() => {
  if (!search.value) return guests.value
  return guests.value.filter(g => g.toLowerCase().includes(search.value.toLowerCase()))
})

function guestLink(name) {
  return `${baseUrl}/${slug.value}/to%20${encodeURIComponent(name)}`
}
function shortLink(name) {
  return `/${slug.value}/to ${name}`
}

async function copyGuestLink(name) {
  await navigator.clipboard.writeText(guestLink(name)).catch(() => {})
  copiedGuest.value = name
  setTimeout(() => { copiedGuest.value = '' }, 2000)
}

function shareWhatsApp(name) {
  const msg = `Assalamu'alaikum ${name},\n\nKami mengundang Anda untuk hadir dalam resepsi pernikahan kami.\n\nUndangan digital: ${guestLink(name)}`
  window.open(`https://wa.me/?text=${encodeURIComponent(msg)}`, '_blank')
}

async function copyAllLinks() {
  const text = guests.value.map(g => `${g}: ${guestLink(g)}`).join('\n')
  await navigator.clipboard.writeText(text).catch(() => {})
  alert(`${guests.value.length} link tersalin!`)
}

function exportCSV() {
  const rows = [['Nama Tamu', 'Link Undangan'], ...guests.value.map(g => [g, guestLink(g)])]
  const csv  = rows.map(r => r.map(c => `"${c}"`).join(',')).join('\n')
  const blob = new Blob([csv], { type: 'text/csv' })
  const a    = document.createElement('a')
  a.href     = URL.createObjectURL(blob)
  a.download = `tamu-${slug.value}.csv`
  a.click()
}
</script>

<style scoped>
.add-guest-card { padding: 20px 24px; }
.add-guest-row  { display: flex; gap: 10px; align-items: flex-end; }
.bulk-details {
  margin-top: 16px; font-size: 13px; color: var(--ink-muted); cursor: pointer;
}
.bulk-details summary { list-style: none; padding: 6px 0; }
.bulk-details summary::-webkit-details-marker { display: none; }

.search-input {
  flex: 1; background: var(--bg);
  border: 1px solid var(--border); border-radius: var(--radius-sm);
  padding: 9px 13px; font-family: inherit; font-size: 13px;
  color: var(--ink); outline: none;
}
.search-input:focus { border-color: var(--gold); }

.guest-list-header {
  display: flex; align-items: center; gap: 12px;
  padding: 16px 20px; border-bottom: 1px solid var(--border);
}
.guest-count { font-size: 12px; color: var(--ink-muted); white-space: nowrap; }

.guest-table { display: flex; flex-direction: column; }
.guest-row {
  display: grid; grid-template-columns: 1fr 1.6fr auto;
  align-items: center; gap: 12px;
  padding: 12px 20px; border-bottom: 1px solid var(--border);
}
.guest-row:last-child { border-bottom: none; }
.guest-row-head {
  font-size: 10px; font-weight: 600; letter-spacing: .12em;
  text-transform: uppercase; color: var(--ink-muted);
  background: var(--bg);
}

.guest-name  { font-size: 13px; font-weight: 500; color: var(--ink); }
.guest-link-wrap { overflow: hidden; }
.guest-link {
  font-family: monospace; font-size: 11px; color: var(--ink-muted);
  white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
  display: block;
}

.guest-actions { display: flex; gap: 6px; }
.action-btn {
  width: 28px; height: 28px; border-radius: var(--radius-sm);
  border: 1px solid var(--border); background: var(--surface);
  color: var(--ink-soft); cursor: pointer;
  display: flex; align-items: center; justify-content: center;
  transition: background .15s, color .15s, border-color .15s;
}
.action-btn:hover { background: var(--bg-2); border-color: var(--border-2); color: var(--ink); }
.action-btn.copied { background: var(--green-pale); border-color: #b2e0ca; color: var(--green); }
.action-btn.danger:hover { background: var(--red-pale); border-color: #f5c6c2; color: var(--red); }

@media (max-width: 560px) {
  .guest-row { grid-template-columns: 1fr auto; }
  .guest-link-wrap { display: none; }
}
</style>
