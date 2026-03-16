<template>
  <form @submit.prevent="handleSubmit" class="couple-form">

    <div v-if="error"   class="form-alert error">
      <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><circle cx="7" cy="7" r="6" stroke="currentColor" stroke-width="1"/><path d="M7 4v3.5M7 9.5v.5" stroke="currentColor" stroke-width="1.2" stroke-linecap="round"/></svg>
      {{ error }}
    </div>
    <div v-if="success" class="form-alert success">
      <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><circle cx="7" cy="7" r="6" stroke="currentColor" stroke-width="1"/><path d="M4 7l2.5 2.5 4-4" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"/></svg>
      {{ success }}
    </div>

    <!-- ── Identitas Pasangan ── -->
    <div class="form-section">
      <div class="section-header">
        <div class="section-num">01</div>
        <div>
          <h3 class="section-title">Identitas Pasangan</h3>
          <p class="section-desc">Nama lengkap dan panggilan mempelai</p>
        </div>
      </div>

      <div class="field">
        <label>Slug URL <span class="req">*</span></label>
        <input
          v-model="form.slug" type="text"
          placeholder="rizky-rahayu"
          :disabled="isEdit"
          @input="form.slug = form.slug.toLowerCase().replace(/[^a-z0-9-]/g, '-')"
          required
        />
        <span class="field-hint">URL undangan: <strong>{{ baseUrl }}/{{ form.slug || 'slug-anda' }}/</strong></span>
      </div>

      <div class="grid-2">
        <div class="field">
          <label>Nama Mempelai Pria <span class="req">*</span></label>
          <input v-model="form.groom_name" type="text" placeholder="Ahmad Rizky Pratama, S.T." required />
        </div>
        <div class="field">
          <label>Nama Mempelai Wanita <span class="req">*</span></label>
          <input v-model="form.bride_name" type="text" placeholder="Siti Rahayu Putri, S.Pd." required />
        </div>
      </div>
      <div class="grid-2">
        <div class="field">
          <label>Nama Panggil Pria</label>
          <input v-model="form.groom_short" type="text" placeholder="Rizky" />
        </div>
        <div class="field">
          <label>Nama Panggil Wanita</label>
          <input v-model="form.bride_short" type="text" placeholder="Rahayu" />
        </div>
      </div>
    </div>

    <!-- ── Data Orang Tua ── -->
    <div class="form-section">
      <div class="section-header">
        <div class="section-num">02</div>
        <div>
          <h3 class="section-title">Data Orang Tua</h3>
          <p class="section-desc">Nama ayah, ibu, dan urutan anak</p>
        </div>
      </div>

      <div class="grid-2">
        <div class="field"><label>Ayah Mempelai Pria</label><input v-model="form.groom_father" placeholder="Bapak H. Ahmad Yusuf, S.E." /></div>
        <div class="field"><label>Ibu Mempelai Pria</label><input v-model="form.groom_mother" placeholder="Ibu Hj. Siti Aminah" /></div>
      </div>
      <div class="grid-2">
        <div class="field"><label>Urutan Anak (Pria)</label><input v-model="form.groom_title" placeholder="Putra Pertama" /></div>
        <div class="field"><label>Urutan Anak (Wanita)</label><input v-model="form.bride_title" placeholder="Putra Pertama" /></div>
      </div>
      <div class="grid-2">
        <div class="field"><label>Ayah Mempelai Wanita</label><input v-model="form.bride_father" placeholder="Bapak Ir. Budi Santoso" /></div>
        <div class="field"><label>Ibu Mempelai Wanita</label><input v-model="form.bride_mother" placeholder="Ibu Dr. Maya Indah" /></div>
      </div>
    </div>

    <!-- ── Acara ── -->
    <div class="form-section">
      <div class="section-header">
        <div class="section-num">03</div>
        <div>
          <h3 class="section-title">Acara</h3>
          <p class="section-desc">Tanggal, waktu, dan lokasi acara</p>
        </div>
      </div>

      <div class="grid-2">
        <div class="field"><label>Tanggal Tampil</label><input v-model="form.date_display" placeholder="Rabu, 18 Maret 2026" /></div>
        <div class="field"><label>Tanggal Target (Countdown)</label><input v-model="form.date_target" type="datetime-local" /></div>
      </div>

      <div class="event-block">
        <div class="event-block-label">
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><circle cx="6" cy="6" r="5" stroke="currentColor" stroke-width="1"/><path d="M6 3v3l2 1.5" stroke="currentColor" stroke-width="1" stroke-linecap="round"/></svg>
          Akad Nikah
        </div>
        <div class="grid-2">
          <div class="field"><label>Waktu</label><input v-model="form.akad_time" placeholder="08.00 – 10.00 WIB" /></div>
          <div class="field"><label>Nama Tempat</label><input v-model="form.akad_venue" placeholder="Masjid Al-Ikhlas" /></div>
        </div>
        <div class="grid-2">
          <div class="field"><label>Alamat</label><input v-model="form.akad_address" placeholder="Jl. Merdeka No.12, Makassar" /></div>
          <div class="field"><label>Link Google Maps</label><input v-model="form.akad_maps" placeholder="https://maps.google.com/..." /></div>
        </div>
      </div>

      <div class="event-block">
        <div class="event-block-label">
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M1 10h10M2 10V5l4-3 4 3v5" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round"/></svg>
          Resepsi Pernikahan
        </div>
        <div class="grid-2">
          <div class="field"><label>Waktu</label><input v-model="form.resepsi_time" placeholder="11.00 – 14.00 WIB" /></div>
          <div class="field"><label>Nama Tempat</label><input v-model="form.resepsi_venue" placeholder="Grand Ballroom Hotel Makassar" /></div>
        </div>
        <div class="grid-2">
          <div class="field"><label>Alamat</label><input v-model="form.resepsi_address" placeholder="Jl. Penghibur No.1, Makassar" /></div>
          <div class="field"><label>Link Google Maps</label><input v-model="form.resepsi_maps" placeholder="https://maps.google.com/..." /></div>
        </div>
      </div>
    </div>

    <!-- ── Foto Mempelai ── -->
    <div class="form-section">
      <div class="section-header">
        <div class="section-num">04</div>
        <div>
          <h3 class="section-title">Foto Mempelai</h3>
          <p class="section-desc">Tempel link foto dari Cloudinary</p>
        </div>
      </div>

      <div class="grid-2">
        <div class="field">
          <label>Foto Mempelai Pria</label>
          <div class="photo-preview-box" v-if="form.groom_photo">
            <img :src="form.groom_photo" alt="Foto Pria" />
            <button type="button" class="photo-remove" @click="form.groom_photo = ''">✕</button>
          </div>
          <div class="photo-empty" v-else>
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none"><circle cx="16" cy="13" r="6" stroke="rgba(184,150,90,.4)" stroke-width="1.2"/><path d="M4 28c0-6.627 5.373-12 12-12s12 5.373 12 12" stroke="rgba(184,150,90,.4)" stroke-width="1.2" stroke-linecap="round"/></svg>
            <span>Preview foto</span>
          </div>
          <input v-model="form.groom_photo" type="url" placeholder="https://res.cloudinary.com/..." class="url-input" />
          <span class="field-hint">Upload ke Cloudinary lalu tempel linknya di sini</span>
        </div>

        <div class="field">
          <label>Foto Mempelai Wanita</label>
          <div class="photo-preview-box" v-if="form.bride_photo">
            <img :src="form.bride_photo" alt="Foto Wanita" />
            <button type="button" class="photo-remove" @click="form.bride_photo = ''">✕</button>
          </div>
          <div class="photo-empty" v-else>
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none"><circle cx="16" cy="13" r="6" stroke="rgba(184,150,90,.4)" stroke-width="1.2"/><path d="M4 28c0-6.627 5.373-12 12-12s12 5.373 12 12" stroke="rgba(184,150,90,.4)" stroke-width="1.2" stroke-linecap="round"/></svg>
            <span>Preview foto</span>
          </div>
          <input v-model="form.bride_photo" type="url" placeholder="https://res.cloudinary.com/..." class="url-input" />
          <span class="field-hint">Upload ke Cloudinary lalu tempel linknya di sini</span>
        </div>
      </div>
    </div>

    <!-- ── Galeri Foto ── -->
    <div class="form-section">
      <div class="section-header">
        <div class="section-num">05</div>
        <div>
          <h3 class="section-title">Galeri Foto</h3>
          <p class="section-desc">Maksimal 6 foto, tempel link Cloudinary</p>
        </div>
      </div>

      <div class="gallery-grid">
        <div v-for="i in 6" :key="i" class="gallery-item">
          <div class="gallery-preview" v-if="form.photos[i-1]">
            <img :src="form.photos[i-1]" :alt="`Foto ${i}`" />
            <button type="button" class="photo-remove" @click="form.photos[i-1] = ''">✕</button>
          </div>
          <div class="gallery-empty" v-else>
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><rect x="2" y="4" width="16" height="12" rx="2" stroke="rgba(184,150,90,.35)" stroke-width="1"/><circle cx="7" cy="9" r="2" stroke="rgba(184,150,90,.35)" stroke-width="1"/><path d="M2 14l4-4 3 3 2-2 7 5" stroke="rgba(184,150,90,.35)" stroke-width="1" stroke-linecap="round" stroke-linejoin="round"/></svg>
            <span>Foto {{ i }}</span>
          </div>
          <input
            v-model="form.photos[i-1]"
            type="url"
            :placeholder="`Link foto ${i}...`"
            class="gallery-url-input"
          />
        </div>
      </div>
    </div>

    <!-- ── Musik Latar ── -->
    <div class="form-section">
      <div class="section-header">
        <div class="section-num">06</div>
        <div>
          <h3 class="section-title">Musik Latar</h3>
          <p class="section-desc">Link audio dari Cloudinary (MP3)</p>
        </div>
      </div>
      <div class="field">
        <label>URL Musik</label>
        <input v-model="form.music_url" type="url" placeholder="https://res.cloudinary.com/.../audio.mp3" />
        <div v-if="form.music_url" class="music-preview">
          <audio controls :src="form.music_url" style="width:100%;height:36px" />
        </div>
      </div>
    </div>

    <!-- ── Gift / Rekening ── -->
    <div class="form-section">
      <div class="section-header">
        <div class="section-num">07</div>
        <div>
          <h3 class="section-title">Gift / Rekening</h3>
          <p class="section-desc">Informasi rekening atau e-wallet</p>
        </div>
      </div>

      <div v-for="(gift, i) in form.gifts" :key="i" class="gift-row">
        <div class="gift-row-header">
          <span class="gift-label">Rekening {{ i + 1 }}</span>
          <button type="button" class="remove-btn" @click="removeGift(i)" v-if="form.gifts.length > 1">
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M2 2l8 8M10 2l-8 8" stroke="currentColor" stroke-width="1.2" stroke-linecap="round"/></svg>
            Hapus
          </button>
        </div>
        <div class="grid-2">
          <div class="field">
            <label>Bank / E-Wallet</label>
            <select v-model="gift.bank">
              <option value="BRI">BRI</option>
              <option value="BCA">BCA</option>
              <option value="BNI">BNI</option>
              <option value="Mandiri">Mandiri</option>
              <option value="DANA">DANA</option>
              <option value="GoPay">GoPay</option>
              <option value="OVO">OVO</option>
              <option value="ShopeePay">ShopeePay</option>
            </select>
          </div>
          <div class="field">
            <label>Nomor Rekening / No. HP</label>
            <input v-model="gift.number" type="text" placeholder="1234-5678-9012-3456" />
          </div>
        </div>
        <div class="grid-2">
          <div class="field">
            <label>Atas Nama</label>
            <input v-model="gift.holder" type="text" placeholder="Nama pemilik rekening" />
          </div>
          <div class="field">
            <label>Jenis</label>
            <select v-model="gift.type">
              <option value="bank">Rekening Bank</option>
              <option value="ewallet">E-Wallet</option>
            </select>
          </div>
        </div>
      </div>

      <button type="button" class="add-gift-btn" @click="addGift">
        <svg width="13" height="13" viewBox="0 0 13 13" fill="none"><circle cx="6.5" cy="6.5" r="5.5" stroke="currentColor" stroke-width="1"/><path d="M6.5 4v5M4 6.5h5" stroke="currentColor" stroke-width="1" stroke-linecap="round"/></svg>
        Tambah Rekening
      </button>
    </div>

    <!-- ── Actions ── -->
    <div class="form-actions">
      <router-link to="/" class="cancel-btn">Batal</router-link>
      <button type="submit" class="save-btn" :disabled="saving">
        <div v-if="saving" class="btn-spinner" />
        <span v-else>{{ isEdit ? 'Simpan Perubahan' : 'Buat Undangan' }}</span>
      </button>
    </div>

  </form>
</template>

<script setup>
import { reactive, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { db } from '../firebase.js'
import { ref as dbRef, set, update } from 'firebase/database'

const props = defineProps({
  isEdit:      { type: Boolean, default: false },
  initialData: { type: Object,  default: () => ({}) },
})

const router  = useRouter()
const saving  = ref(false)
const error   = ref('')
const success = ref('')
const baseUrl = 'https://janji-suci.vercel.app'

const defaultGift = () => ({ bank: 'BRI', type: 'bank', holder: '', number: '', color1: '#1a4b8c', color2: '#0d2d5e' })

const bankColors = {
  BRI:       { color1: '#1a4b8c', color2: '#0d2d5e' },
  BCA:       { color1: '#005aa7', color2: '#003d7a' },
  BNI:       { color1: '#1a5276', color2: '#0e3352' },
  Mandiri:   { color1: '#003087', color2: '#001a5e' },
  DANA:      { color1: '#1188cc', color2: '#005fa3' },
  GoPay:     { color1: '#00aed6', color2: '#007a99' },
  OVO:       { color1: '#4c2a86', color2: '#2e1460' },
  ShopeePay: { color1: '#ee4d2d', color2: '#c73a1e' },
}

const form = reactive({
  slug: '', groom_name: '', groom_short: '', groom_father: '', groom_mother: '', groom_title: '', groom_photo: '',
  bride_name: '', bride_short: '', bride_father: '', bride_mother: '', bride_title: '', bride_photo: '',
  date_display: '', date_target: '',
  akad_time: '', akad_venue: '', akad_address: '', akad_maps: '',
  resepsi_time: '', resepsi_venue: '', resepsi_address: '', resepsi_maps: '',
  photos: ['', '', '', '', '', ''],
  music_url: '',
  gifts: [defaultGift()],
})

watch(() => props.initialData, data => {
  if (!data || !data.slug) return
  Object.assign(form, {
    ...data,
    photos: data.photos ? Object.values(data.photos).concat(Array(6).fill('')).slice(0, 6) : ['','','','','',''],
    gifts:  data.gifts  ? Object.values(data.gifts) : [defaultGift()],
  })
}, { immediate: true })

watch(() => form.gifts, gifts => {
  gifts.forEach(g => {
    const c = bankColors[g.bank]
    if (c) { g.color1 = c.color1; g.color2 = c.color2 }
  })
}, { deep: true })

function addGift()     { form.gifts.push(defaultGift()) }
function removeGift(i) { form.gifts.splice(i, 1) }

async function handleSubmit() {
  error.value = ''; success.value = ''; saving.value = true
  try {
    const slug = form.slug.trim()
    if (!slug) { error.value = 'Slug tidak boleh kosong'; saving.value = false; return }

    const photosObj = {}
    form.photos.forEach((p, i) => { if (p) photosObj[i] = p })

    const giftsObj = {}
    form.gifts.forEach((g, i) => { giftsObj[i] = g })

    const payload = {
      slug,
      groom_name:      form.groom_name,
      groom_short:     form.groom_short || form.groom_name.split(' ')[0],
      groom_father:    form.groom_father,
      groom_mother:    form.groom_mother,
      groom_title:     form.groom_title,
      groom_photo:     form.groom_photo,
      bride_name:      form.bride_name,
      bride_short:     form.bride_short || form.bride_name.split(' ')[0],
      bride_father:    form.bride_father,
      bride_mother:    form.bride_mother,
      bride_title:     form.bride_title,
      bride_photo:     form.bride_photo,
      date_display:    form.date_display,
      date_target:     form.date_target,
      akad_time:       form.akad_time,
      akad_venue:      form.akad_venue,
      akad_address:    form.akad_address,
      akad_maps:       form.akad_maps,
      resepsi_time:    form.resepsi_time,
      resepsi_venue:   form.resepsi_venue,
      resepsi_address: form.resepsi_address,
      resepsi_maps:    form.resepsi_maps,
      photos:          photosObj,
      music_url:       form.music_url,
      gifts:           giftsObj,
      updated_at:      Date.now(),
    }

    if (props.isEdit) {
      // ✅ update() hanya mengubah field yang ada, tidak menghapus wishes/guests
      await update(dbRef(db, `weddings/${slug}`), payload)
    } else {
      // set() untuk pasangan baru — tidak ada data lain yang perlu dijaga
      await set(dbRef(db, `weddings/${slug}`), { ...payload, created_at: Date.now() })
    }

    success.value = props.isEdit ? 'Perubahan berhasil disimpan!' : 'Undangan berhasil dibuat!'
    if (!props.isEdit) setTimeout(() => router.push('/'), 1200)

    window.scrollTo({ top: 0, behavior: 'smooth' })
  } catch (e) {
    error.value = 'Gagal menyimpan: ' + e.message
  } finally { saving.value = false }
}
</script>

<style scoped>
.couple-form { display: flex; flex-direction: column; gap: 0; }

/* Alert */
.form-alert {
  display: flex; align-items: center; gap: 8px;
  padding: 12px 16px; border-radius: 8px;
  font-size: 13px; margin-bottom: 24px;
}
.form-alert.error   { background: rgba(200,80,80,.08); border: 1px solid rgba(200,80,80,.2); color: #c05050; }
.form-alert.success { background: rgba(80,160,100,.08); border: 1px solid rgba(80,160,100,.2); color: #3a8a5a; }

/* Section */
.form-section {
  padding: 28px 0;
  border-bottom: 1px solid rgba(184,150,90,.1);
}
.form-section:last-of-type { border-bottom: none; }

.section-header {
  display: flex; align-items: flex-start; gap: 14px;
  margin-bottom: 24px;
}
.section-num {
  width: 32px; height: 32px; border-radius: 50%;
  background: rgba(184,150,90,.1);
  border: 1px solid rgba(184,150,90,.2);
  color: rgba(184,150,90,.8);
  font-size: 11px; font-weight: 600; letter-spacing: .08em;
  display: flex; align-items: center; justify-content: center;
  flex-shrink: 0; font-family: 'DM Sans', sans-serif;
}
.section-title {
  font-size: 14px; font-weight: 600; color: var(--ink);
  margin-bottom: 2px;
}
.section-desc { font-size: 12px; color: var(--ink-muted); }

/* Fields */
.grid-2 {
  display: grid; grid-template-columns: 1fr 1fr;
  gap: 14px; margin-bottom: 14px;
}
.field {
  display: flex; flex-direction: column; gap: 6px;
  margin-bottom: 14px;
}
.field:last-child { margin-bottom: 0; }

label {
  font-size: 10px; font-weight: 500;
  letter-spacing: .2em; text-transform: uppercase;
  color: var(--ink-muted);
}
.req { color: #c05050; }

input, select, textarea {
  background: #faf7f2;
  border: 1px solid rgba(28,24,20,.1);
  color: var(--ink); font-family: 'DM Sans', sans-serif; font-size: 14px;
  padding: 10px 12px; border-radius: 8px; outline: none;
  transition: border-color .2s, background .2s;
  -webkit-appearance: none; width: 100%;
}
input:focus, select:focus {
  border-color: rgba(184,150,90,.45);
  background: #fff;
}
input:disabled {
  opacity: .5; cursor: not-allowed; background: rgba(28,24,20,.04);
}
input::placeholder { color: rgba(28,24,20,.25); font-size: 13px; }

.field-hint {
  font-size: 11px; color: var(--ink-muted);
}
.field-hint strong { color: var(--gold-dark); }

/* Event block */
.event-block {
  background: rgba(184,150,90,.04);
  border: 1px solid rgba(184,150,90,.12);
  border-radius: 10px;
  padding: 18px 20px; margin-bottom: 14px;
}
.event-block-label {
  display: flex; align-items: center; gap: 6px;
  font-size: 10px; font-weight: 600; letter-spacing: .18em;
  text-transform: uppercase; color: rgba(184,150,90,.8);
  margin-bottom: 16px;
}

/* Photo fields */
.photo-preview-box {
  position: relative; width: 100%; height: 160px;
  border-radius: 10px; overflow: hidden;
  border: 1px solid rgba(184,150,90,.2);
  margin-bottom: 8px;
}
.photo-preview-box img {
  width: 100%; height: 100%; object-fit: cover;
}
.photo-remove {
  position: absolute; top: 8px; right: 8px;
  width: 26px; height: 26px; border-radius: 50%;
  background: rgba(0,0,0,.5); color: #fff;
  border: none; cursor: pointer; font-size: 10px;
  display: flex; align-items: center; justify-content: center;
  transition: background .2s;
}
.photo-remove:hover { background: rgba(0,0,0,.75); }

.photo-empty {
  width: 100%; height: 120px;
  border: 1.5px dashed rgba(184,150,90,.25);
  border-radius: 10px;
  display: flex; flex-direction: column;
  align-items: center; justify-content: center; gap: 6px;
  color: rgba(184,150,90,.4); font-size: 11px;
  margin-bottom: 8px;
  background: rgba(184,150,90,.03);
}

.url-input { font-size: 12px !important; }

/* Gallery */
.gallery-grid {
  display: grid; grid-template-columns: repeat(3, 1fr);
  gap: 12px;
}
.gallery-item { display: flex; flex-direction: column; gap: 6px; }
.gallery-preview {
  position: relative; aspect-ratio: 4/3;
  border-radius: 8px; overflow: hidden;
  border: 1px solid rgba(184,150,90,.2);
}
.gallery-preview img { width: 100%; height: 100%; object-fit: cover; }
.gallery-empty {
  aspect-ratio: 4/3;
  border: 1.5px dashed rgba(184,150,90,.2);
  border-radius: 8px;
  display: flex; flex-direction: column;
  align-items: center; justify-content: center; gap: 4px;
  color: rgba(184,150,90,.35); font-size: 10px;
  background: rgba(184,150,90,.02);
}
.gallery-url-input {
  font-size: 11px !important;
  padding: 7px 10px !important;
}

/* Music preview */
.music-preview { margin-top: 8px; }

/* Gift */
.gift-row {
  background: rgba(184,150,90,.03);
  border: 1px solid rgba(184,150,90,.1);
  border-radius: 10px;
  padding: 18px 20px; margin-bottom: 12px;
}
.gift-row-header {
  display: flex; align-items: center; justify-content: space-between;
  margin-bottom: 14px;
}
.gift-label {
  font-size: 10px; font-weight: 600; letter-spacing: .16em;
  text-transform: uppercase; color: rgba(184,150,90,.8);
}
.remove-btn {
  display: inline-flex; align-items: center; gap: 5px;
  font-size: 11px; color: #c05050;
  background: none; border: none; cursor: pointer; padding: 0;
  transition: opacity .2s;
}
.remove-btn:hover { opacity: .7; }

.add-gift-btn {
  display: inline-flex; align-items: center; gap: 7px;
  padding: 9px 18px; border-radius: 8px;
  font-size: 12px; font-weight: 500;
  background: rgba(184,150,90,.08);
  border: 1px solid rgba(184,150,90,.2);
  color: rgba(184,150,90,.8);
  cursor: pointer; transition: all .2s;
  font-family: 'DM Sans', sans-serif;
  margin-bottom: 4px;
}
.add-gift-btn:hover {
  background: rgba(184,150,90,.14);
  border-color: rgba(184,150,90,.35);
}

/* Actions */
.form-actions {
  display: flex; align-items: center; justify-content: flex-end;
  gap: 12px; padding-top: 24px;
  border-top: 1px solid rgba(184,150,90,.1);
  flex-wrap: wrap;
}
.cancel-btn {
  padding: 10px 24px; border-radius: 8px;
  font-size: 13px; font-weight: 500;
  background: #faf7f2; color: var(--ink-soft);
  border: 1px solid rgba(28,24,20,.1);
  text-decoration: none;
  transition: background .2s;
}
.cancel-btn:hover { background: #f3ede3; }
.save-btn {
  padding: 10px 28px; border-radius: 8px;
  font-size: 13px; font-weight: 500;
  background: var(--ink); color: rgba(184,150,90,.9);
  border: none; cursor: pointer;
  display: flex; align-items: center; justify-content: center; gap: 8px;
  min-width: 140px; min-height: 40px;
  transition: background .2s, opacity .2s;
  font-family: 'DM Sans', sans-serif;
}
.save-btn:hover:not(:disabled) { background: #2e2820; }
.save-btn:disabled { opacity: .5; cursor: not-allowed; }
.btn-spinner {
  width: 14px; height: 14px; border-radius: 50%;
  border: 1.5px solid rgba(184,150,90,.3);
  border-top-color: rgba(184,150,90,.9);
  animation: spin .7s linear infinite;
}
@keyframes spin { to { transform: rotate(360deg); } }

@media (max-width: 600px) {
  .grid-2 { grid-template-columns: 1fr; }
  .gallery-grid { grid-template-columns: repeat(2, 1fr); }
  .form-actions { justify-content: stretch; }
  .cancel-btn, .save-btn { flex: 1; text-align: center; justify-content: center; }
}
</style>