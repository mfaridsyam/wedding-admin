<template>
  <div class="login-wrap">
    <div class="login-card card">
      <div class="login-brand">
        <span class="lb-icon">✦</span>
        <h1>Wedding<em>Admin</em></h1>
        <p>Login untuk mengelola undangan</p>
      </div>

      <div v-if="error" class="alert alert-error">{{ error }}</div>

      <form @submit.prevent="handleLogin">
        <div class="field">
          <label>Email</label>
          <input v-model="form.email" type="email" placeholder="admin@email.com" required />
        </div>
        <div class="field">
          <label>Password</label>
          <input v-model="form.password" type="password" placeholder="••••••••" required />
        </div>
        <button type="submit" class="btn btn-primary" style="width:100%;justify-content:center;padding:12px" :disabled="loading">
          <span v-if="loading" class="spinner" style="width:16px;height:16px;border-width:1.5px" />
          <span v-else>Masuk</span>
        </button>
      </form>

      <p class="login-note">
        Untuk membuat akun admin, gunakan Firebase Console<br/>
        Authentication → Add user
      </p>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from '../composables/useAuth.js'

const router = useRouter()
const { login } = useAuth()
const form    = reactive({ email: '', password: '' })
const error   = ref('')
const loading = ref(false)

async function handleLogin() {
  error.value = ''; loading.value = true
  try {
    await login(form.email, form.password)
    router.push('/')
  } catch (e) {
    error.value = e.code === 'auth/invalid-credential'
      ? 'Email atau password salah.'
      : 'Login gagal. Coba lagi.'
  } finally { loading.value = false }
}
</script>

<style scoped>
.login-wrap {
  min-height: 100vh; background: var(--ink);
  display: flex; align-items: center; justify-content: center;
  padding: 24px;
}
.login-card {
  width: 100%; max-width: 400px;
  padding: 40px 36px;
}
.login-brand { text-align: center; margin-bottom: 32px; }
.lb-icon { font-size: 28px; color: var(--gold); display: block; margin-bottom: 12px; }
.login-brand h1 {
  font-family: 'Playfair Display', serif;
  font-size: 28px; font-weight: 400; color: var(--ink); margin-bottom: 6px;
}
.login-brand h1 em { font-style: italic; color: var(--gold-dark); }
.login-brand p { font-size: 13px; color: var(--ink-muted); }
.login-note {
  margin-top: 20px; text-align: center;
  font-size: 11px; color: var(--ink-muted); line-height: 1.6;
}
</style>
