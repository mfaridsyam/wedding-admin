<template>
  <form @submit.prevent="handleSubmit">

    <div v-if="error"   class="alert alert-error">{{ error }}</div>
    <div v-if="success" class="alert alert-success">{{ success }}</div>

    <p class="section-title">Identitas Pasangan</p>

    <div class="field">
      <label>Slug URL <span class="required">*</span></label>
      <input
        v-model="form.slug"
        type="text"
        placeholder="rizky-nanda"
        :disabled="isEdit"
        @input="form.slug = form.slug.toLowerCase().replace(/[^a-z0-9-]/g, '-')"
        required
      />
      <span class="field-hint">
        URL undangan: <strong>{{ baseUrl }}/{{ form.slug || 'slug-anda' }}/</strong>
      </span>
    </div>

    <div class="grid-2">
      <div class="field">
        <label>Nama Mempelai Pria <span class="required">*</span></label>
        <input v-model="form.groom_name" type="text" placeholder="Rizky Ramadhan, S.T." required />
      </div>
      <div class="field">
        <label>Nama Mempelai Wanita <span class="required">*</span></label>
        <input v-model="form.bride_name" type="text" placeholder="Nanda Putri, S.Pd." required />
      </div>
    </div>

    <div class="grid-2">
      <div class="field">
        <label>Nama Panggil Pria</label>
        <input v-model="form.groom_short" type="text" placeholder="Rizky" />
      </div>
      <div class="field">
        <label>Nama Panggil Wanita</label>
        <input v-model="form.bride_short" type="text" placeholder="Nanda" />
      </div>
    </div>

    <hr />
    <p class="section-title">Data Orang Tua</p>

    <div class="grid-2">
      <div class="field">
        <label>Ayah Mempelai Pria</label>
        <input v-model="form.groom_father" type="text" placeholder="Bapak H. Ahmad Yusuf" />
      </div>
      <div class="field">
        <label>Ibu Mempelai Pria</label>
        <input v-model="form.groom_mother" type="text" placeholder="Ibu Hj. Siti Rahayu" />
      </div>
    </div>
    <div class="grid-2">
      <div class="field">
        <label>Urutan Anak (Pria)</label>
        <input v-model="form.groom_title" type="text" placeholder="Putra Pertama" />
      </div>
      <div class="field">
        <label>Urutan Anak (Wanita)</label>
        <input v-model="form.bride_title" type="text" placeholder="Putri Kedua" />
      </div>
    </div>

    <div class="grid-2">
      <div class="field">
        <label>Ayah Mempelai Wanita</label>
        <input v-model="form.bride_father" type="text" placeholder="Bapak Ir. Budi Santoso" />
      </div>
      <div class="field">
        <label>Ibu Mempelai Wanita</label>
        <input v-model="form.bride_mother" type="text" placeholder="Ibu Dr. Maya Indah" />
      </div>
    </div>

    <hr />
    <p class="section-title">Acara</p>

    <div class="grid-2">
      <div class="field">
        <label>Tanggal Tampil</label>
        <input v-model="form.date_display" type="text" placeholder="Sabtu, 14 Juni 2025" />
      </div>
      <div class="field">
        <label>Tanggal Target (Countdown)</label>
        <input v-model="form.date_target" type="datetime-local" />
      </div>
    </div>

    <div class="event-block">
      <p class="event-block-label">Akad Nikah</p>
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
      <p class="event-block-label">Resepsi</p>
      <div class="grid-2">
        <div class="field"><label>Waktu</label><input v-model="form.resepsi_time" placeholder="11.00 – 14.00 WIB" /></div>
        <div class="field"><label>Nama Tempat</label><input v-model="form.resepsi_venue" placeholder="Grand Ballroom Hotel Makassar" /></div>
      </div>
      <div class="grid-2">
        <div class="field"><label>Alamat</label><input v-model="form.resepsi_address" placeholder="Jl. Penghibur No.1, Makassar" /></div>
        <div class="field"><label>Link Google Maps</label><input v-model="form.resepsi_maps" placeholder="https://maps.google.com/..." /></div>
      </div>
    </div>

    <hr />
    <p class="section-title">Foto Mempelai & Galeri</p>

    <div class="grid-2">
      <div class="field">
        <label>Foto Mempelai Pria</label>
        <div class="photo-upload" @click="$refs.groomPhotoInput.click()">
          <img v-if="form.groom_photo" :src="form.groom_photo" class="photo-preview" />
          <div v-else class="photo-placeholder">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none"><rect x="3" y="5" width="18" height="14" rx="2" stroke="currentColor" stroke-width="1.2"/><circle cx="12" cy="12" r="3" stroke="currentColor" stroke-width="1.2"/></svg>
            <span>Pilih foto</span>
          </div>
          <div v-if="uploading.groom" class="photo-uploading"><div class="spinner"/></div>
        </div>
        <input ref="groomPhotoInput" type="file" accept="image/*" style="display:none" @change="uploadPhoto('groom', $event)" />
        <input v-model="form.groom_photo" type="url" placeholder="Atau tempel URL Cloudinary..." style="margin-top:6px" />
      </div>

      <div class="field">
        <label>Foto Mempelai Wanita</label>
        <div class="photo-upload" @click="$refs.bridePhotoInput.click()">
          <img v-if="form.bride_photo" :src="form.bride_photo" class="photo-preview" />
          <div v-else class="photo-placeholder">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none"><rect x="3" y="5" width="18" height="14" rx="2" stroke="currentColor" stroke-width="1.2"/><circle cx="12" cy="12" r="3" stroke="currentColor" stroke-width="1.2"/></svg>
            <span>Pilih foto</span>
          </div>
          <div v-if="uploading.bride" class="photo-uploading"><div class="spinner"/></div>
        </div>
        <input ref="bridePhotoInput" type="file" accept="image/*" style="display:none" @change="uploadPhoto('bride', $event)" />
        <input v-model="form.bride_photo" type="url" placeholder="Atau tempel URL Cloudinary..." style="margin-top:6px" />
      </div>
    </div>

    <div class="field">
      <label>Galeri Foto (maks. 6)</label>
      <div class="gallery-upload-grid">
        <div
          v-for="i in 6" :key="i"
          class="gallery-cell"
          @click="triggerGalleryUpload(i - 1)"
        >
          <img v-if="form.photos[i-1]" :src="form.photos[i-1]" />
          <div v-else class="gallery-empty">
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><rect x="2" y="3" width="14" height="11" rx="1.5" stroke="currentColor" stroke-width="1"/><path d="M2 11l4-4 3 3 2-2 5 4" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round"/></svg>
            <span>{{ i }}</span>
          </div>
          <div v-if="uploading[`photo_${i-1}`]" class="photo-uploading"><div class="spinner" style="width:16px;height:16px"/></div>
        </div>
      </div>
      <input ref="galleryInput" type="file" accept="image/*" style="display:none" @change="uploadGalleryPhoto($event)" />
      <span class="field-hint">Klik sel untuk upload. Foto otomatis dikompresi via Cloudinary.</span>
    </div>

    <hr />
    <p class="section-title">Musik Latar</p>

    <div class="field">
      <label>File Musik (MP3)</label>
      <div class="music-upload-row">
        <button type="button" class="btn btn-ghost btn-sm" @click="$refs.musicInput.click()" :disabled="uploading.music">
          <span v-if="uploading.music" class="spinner" style="width:13px;height:13px"/>
          <span v-else>Upload MP3</span>
        </button>
        <input v-model="form.music_url" type="url" placeholder="Atau tempel URL Cloudinary audio..." style="flex:1" />
      </div>
      <input ref="musicInput" type="file" accept="audio/*" style="display:none" @change="uploadMusic($event)" />
      <span v-if="form.music_url" class="field-hint">✓ Musik sudah diisi</span>
    </div>

    <hr />
    <p class="section-title">Gift / Rekening</p>

    <div v-for="(gift, i) in form.gifts" :key="i" class="gift-row">
      <div class="gift-row-header">
        <span class="gift-row-num">{{ i + 1 }}</span>
        <button type="button" class="btn btn-danger btn-sm" @click="removeGift(i)" v-if="form.gifts.length > 1">Hapus</button>
      </div>
      <div class="grid-2">
        <div class="field">
          <label>Nama Bank / E-Wallet</label>
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

    <button type="button" class="btn btn-ghost btn-sm" @click="addGift" style="margin-bottom:24px">
      + Tambah Rekening
    </button>

    <hr />
    <div style="display:flex;gap:12px;justify-content:flex-end;padding-top:8px">
      <router-link to="/" class="btn btn-ghost">Batal</router-link>
      <button type="submit" class="btn btn-gold" :disabled="saving">
        <span v-if="saving" class="spinner" style="width:14px;height:14px;border-width:1.5px"/>
        <span v-else>{{ isEdit ? 'Simpan Perubahan' : 'Buat Undangan' }}</span>
      </button>
    </div>
  </form>
</template>

<script setup>
import { reactive, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { db } from '../firebase.js'
import { ref as dbRef, set, serverTimestamp } from 'firebase/database'
import { uploadToCloudinary, uploadAudioToCloudinary } from '../cloudinary.js'

const props = defineProps({
  isEdit:      { type: Boolean, default: false },
  initialData: { type: Object,  default: () => ({}) },
})

const router  = useRouter()
const saving  = ref(false)
const error   = ref('')
const success = ref('')
const baseUrl = window.location.origin.replace('admin.', '')

const uploading = reactive({
  groom: false, bride: false, music: false,
})

const defaultGift = () => ({ bank: 'BRI', type: 'bank', holder: '', number: '', color1: '#1a4b8c', color2: '#0d2d5e' })

const bankColors = {
  BRI: { color1: '#1a4b8c', color2: '#0d2d5e' },
  BCA: { color1: '#005aa7', color2: '#003d7a' },
  BNI: { color1: '#1a5276', color2: '#0e3352' },
  Mandiri: { color1: '#003087', color2: '#001a5e' },
  DANA: { color1: '#1188cc', color2: '#005fa3' },
  GoPay: { color1: '#00aed6', color2: '#007a99' },
  OVO:   { color1: '#4c2a86', color2: '#2e1460' },
  ShopeePay: { color1: '#ee4d2d', color2: '#c73a1e' },
}

const form = reactive({
  slug:            '',
  groom_name:      '',
  groom_short:     '',
  groom_father:    '',
  groom_mother:    '',
  groom_title:     '',
  groom_photo:     '',
  bride_name:      '',
  bride_short:     '',
  bride_father:    '',
  bride_mother:    '',
  bride_title:     '',
  bride_photo:     '',
  date_display:    '',
  date_target:     '',
  akad_time:       '',
  akad_venue:      '',
  akad_address:    '',
  akad_maps:       '',
  resepsi_time:    '',
  resepsi_venue:   '',
  resepsi_address: '',
  resepsi_maps:    '',
  photos:          ['', '', '', '', '', ''],
  music_url:       '',
  gifts:           [defaultGift()],
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

function addGift()      { form.gifts.push(defaultGift()) }
function removeGift(i)  { form.gifts.splice(i, 1) }

async function uploadPhoto(who, e) {
  const file = e.target.files[0]; if (!file) return
  uploading[who] = true
  try {
    const url = await uploadToCloudinary(file, `wedding/${form.slug || 'general'}`)
    if (who === 'groom') form.groom_photo = url
    else                 form.bride_photo  = url
  } catch { error.value = 'Upload foto gagal. Cek konfigurasi Cloudinary.' }
  finally { uploading[who] = false; e.target.value = '' }
}

let galleryTargetIdx = 0
const galleryInput = ref(null)
function triggerGalleryUpload(idx) { galleryTargetIdx = idx; galleryInput.value.click() }

async function uploadGalleryPhoto(e) {
  const file = e.target.files[0]; if (!file) return
  const key = `photo_${galleryTargetIdx}`
  uploading[key] = true
  try {
    const url = await uploadToCloudinary(file, `wedding/${form.slug || 'general'}/gallery`)
    form.photos[galleryTargetIdx] = url
  } catch { error.value = 'Upload galeri gagal.' }
  finally { uploading[key] = false; e.target.value = '' }
}

async function uploadMusic(e) {
  const file = e.target.files[0]; if (!file) return
  uploading.music = true
  try {
    const url = await uploadAudioToCloudinary(file, `wedding/${form.slug || 'general'}/music`)
    form.music_url = url
  } catch { error.value = 'Upload musik gagal.' }
  finally { uploading.music = false; e.target.value = '' }
}

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
      ...(!props.isEdit && { created_at: Date.now() }),
    }

    await set(dbRef(db, `weddings/${slug}`), payload)
    success.value = props.isEdit ? 'Perubahan berhasil disimpan!' : 'Undangan berhasil dibuat!'
    if (!props.isEdit) setTimeout(() => router.push('/'), 1200)
  } catch (e) {
    error.value = 'Gagal menyimpan: ' + e.message
  } finally { saving.value = false }
}
</script>

<style scoped>
.required { color: var(--red); }

.event-block {
  background: var(--bg);
  border: 1px solid var(--border);
  border-radius: var(--radius-sm);
  padding: 16px 18px; margin-bottom: 16px;
}
.event-block-label {
  font-size: 11px; font-weight: 600; letter-spacing: .12em;
  text-transform: uppercase; color: var(--gold-dark);
  margin-bottom: 14px;
}

.photo-upload {
  width: 100%; height: 140px;
  border: 2px dashed var(--border);
  border-radius: var(--radius-sm);
  cursor: pointer; position: relative;
  overflow: hidden;
  transition: border-color .15s;
  display: flex; align-items: center; justify-content: center;
}
.photo-upload:hover { border-color: var(--gold-light); }
.photo-preview { width: 100%; height: 100%; object-fit: cover; }
.photo-placeholder {
  display: flex; flex-direction: column; align-items: center; gap: 6px;
  color: var(--ink-muted); font-size: 12px;
}
.photo-uploading {
  position: absolute; inset: 0;
  background: rgba(255,255,255,.8);
  display: flex; align-items: center; justify-content: center;
}

.gallery-upload-grid {
  display: grid; grid-template-columns: repeat(6, 1fr);
  gap: 8px; margin-bottom: 8px;
}
.gallery-cell {
  aspect-ratio: 1; border: 2px dashed var(--border);
  border-radius: var(--radius-sm); cursor: pointer;
  overflow: hidden; position: relative;
  display: flex; align-items: center; justify-content: center;
  transition: border-color .15s;
}
.gallery-cell:hover { border-color: var(--gold-light); }
.gallery-cell img { width: 100%; height: 100%; object-fit: cover; }
.gallery-empty {
  display: flex; flex-direction: column; align-items: center; gap: 3px;
  color: var(--ink-muted); font-size: 10px;
}

.music-upload-row { display: flex; gap: 10px; align-items: center; }

.gift-row {
  background: var(--bg);
  border: 1px solid var(--border);
  border-radius: var(--radius-sm);
  padding: 16px 18px; margin-bottom: 12px;
}
.gift-row-header {
  display: flex; align-items: center; justify-content: space-between;
  margin-bottom: 12px;
}
.gift-row-num {
  font-size: 11px; font-weight: 600; letter-spacing: .12em;
  text-transform: uppercase; color: var(--gold-dark);
}

@media (max-width: 540px) {
  .gallery-upload-grid { grid-template-columns: repeat(3, 1fr); }
}
</style>
