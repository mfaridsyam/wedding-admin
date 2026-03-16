<template>
  <div class="page">
    <div class="page-header">
      <div>
        <h1 class="page-title">Pasangan Baru</h1>
        <p class="page-subtitle">Isi data mempelai untuk membuat undangan baru</p>
      </div>
    </div>
    <div class="card" style="padding: 28px 32px">
      <CoupleForm />
    </div>
  </div>
</template>

<script setup>
import CoupleForm from '../components/CoupleForm.vue'
</script>
