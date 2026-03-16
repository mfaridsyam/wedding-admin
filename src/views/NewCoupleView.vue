<template>
  <div class="page">
    <div class="page-header">
      <div>
        <h1 class="page-title">Pasangan Baru</h1>
        <p class="page-subtitle">Isi data mempelai untuk membuat undangan baru</p>
      </div>
    </div>
    <div class="form-card">
      <CoupleForm />
    </div>
  </div>
</template>

<script setup>
import CoupleForm from '../components/CoupleForm.vue'
</script>

<style scoped>
.form-card {
  background: #fff;
  border: 1px solid rgba(28,24,20,.08);
  border-radius: 12px;
  padding: 32px;
}

@media (max-width: 600px) {
  .form-card { padding: 20px 16px; }
}
</style>