<template>
  <div class="login-wrap">
    <div class="login-bg">
      <div class="bg-orb orb-1" />
      <div class="bg-orb orb-2" />
    </div>

    <div class="login-card">
      <div class="login-brand">
        <div class="brand-diamond">
          <svg viewBox="0 0 32 32" fill="none" width="32" height="32">
            <path d="M16 2L30 16L16 30L2 16Z" stroke="#B8965A" stroke-width="1" opacity=".6"/>
            <path d="M16 8L24 16L16 24L8 16Z" fill="#B8965A" opacity=".15"/>
            <circle cx="16" cy="16" r="3" fill="#B8965A" opacity=".5"/>
          </svg>
        </div>
        <h1>Wedding<em>Admin</em></h1>
        <p>Kelola undangan pernikahan digital</p>
      </div>

      <div v-if="error" class="alert-error">
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
          <circle cx="7" cy="7" r="6" stroke="currentColor" stroke-width="1"/>
          <path d="M7 4v4M7 10v.5" stroke="currentColor" stroke-width="1.2" stroke-linecap="round"/>
        </svg>
        {{ error }}
      </div>

      <form @submit.prevent="handleLogin" class="login-form">
        <div class="field">
          <label>Email</label>
          <input v-model="form.email" type="email" placeholder="admin@email.com" required autocomplete="email" />
        </div>
        <div class="field">
          <label>Password</label>
          <input v-model="form.password" type="password" placeholder="••••••••" required autocomplete="current-password" />
        </div>
        <button type="submit" class="login-btn" :disabled="loading">
          <span v-if="loading" class="btn-spinner" />
          <span v-else>Masuk</span>
        </button>
      </form>

      <p class="login-note">
        Buat akun admin melalui Firebase Console → Authentication → Add user
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
  min-height: 100vh;
  background: #0e0c09;
  display: flex; align-items: center; justify-content: center;
  padding: 24px;
  position: relative; overflow: hidden;
}

.login-bg { position: absolute; inset: 0; pointer-events: none; }
.bg-orb {
  position: absolute; border-radius: 50%;
  filter: blur(80px);
}
.orb-1 {
  width: 400px; height: 400px;
  background: radial-gradient(circle, rgba(184,150,90,.1) 0%, transparent 70%);
  top: -100px; left: -100px;
}
.orb-2 {
  width: 350px; height: 350px;
  background: radial-gradient(circle, rgba(184,150,90,.07) 0%, transparent 70%);
  bottom: -80px; right: -80px;
}

.login-card {
  width: 100%; max-width: 420px;
  background: rgba(255,255,255,.03);
  border: 1px solid rgba(184,150,90,.15);
  border-radius: 16px;
  padding: 48px 40px 36px;
  position: relative; z-index: 1;
  backdrop-filter: blur(20px);
  box-shadow: 0 32px 64px rgba(0,0,0,.4), 0 8px 24px rgba(0,0,0,.2);
}

.login-brand { text-align: center; margin-bottom: 36px; }
.brand-diamond {
  display: flex; justify-content: center;
  margin-bottom: 16px;
  animation: diamond-pulse 3s ease-in-out infinite;
}
@keyframes diamond-pulse {
  0%,100% { opacity: .6; }
  50%      { opacity: 1; }
}
.login-brand h1 {
  font-family: 'Playfair Display', serif;
  font-size: 26px; font-weight: 400;
  color: #f5f0e8; margin-bottom: 6px;
}
.login-brand h1 em { font-style: italic; color: rgba(184,150,90,.9); }
.login-brand p { font-size: 12px; color: rgba(245,240,232,.3); letter-spacing: .04em; }

.alert-error {
  display: flex; align-items: center; gap: 8px;
  background: rgba(200,80,80,.1);
  border: 1px solid rgba(200,80,80,.2);
  color: rgba(220,140,140,.9);
  font-size: 13px; padding: 10px 14px;
  border-radius: 8px; margin-bottom: 20px;
}

.login-form { display: flex; flex-direction: column; gap: 16px; }
.field { display: flex; flex-direction: column; gap: 6px; }
.field label {
  font-size: 10px; font-weight: 500;
  letter-spacing: .22em; text-transform: uppercase;
  color: rgba(184,150,90,.5);
}
.field input {
  background: rgba(255,255,255,.04);
  border: 1px solid rgba(184,150,90,.15);
  color: rgba(245,240,232,.85);
  font-family: 'DM Sans', sans-serif; font-size: 14px;
  padding: 12px 14px; border-radius: 8px; outline: none;
  transition: border-color .2s, background .2s;
}
.field input:focus {
  border-color: rgba(184,150,90,.45);
  background: rgba(255,255,255,.06);
}
.field input::placeholder { color: rgba(245,240,232,.2); }

.login-btn {
  margin-top: 4px; width: 100%; padding: 13px;
  background: linear-gradient(135deg, rgba(184,150,90,.25), rgba(184,150,90,.15));
  border: 1px solid rgba(184,150,90,.35);
  color: rgba(184,150,90,.95);
  font-family: 'DM Sans', sans-serif; font-size: 11px;
  font-weight: 500; letter-spacing: .22em; text-transform: uppercase;
  border-radius: 8px; cursor: pointer;
  transition: all .25s;
  display: flex; align-items: center; justify-content: center;
  min-height: 44px;
}
.login-btn:hover:not(:disabled) {
  background: linear-gradient(135deg, rgba(184,150,90,.35), rgba(184,150,90,.22));
  border-color: rgba(184,150,90,.55);
  color: rgba(184,150,90,1);
}
.login-btn:disabled { opacity: .5; cursor: not-allowed; }

.btn-spinner {
  width: 16px; height: 16px; border-radius: 50%;
  border: 1.5px solid rgba(184,150,90,.3);
  border-top-color: rgba(184,150,90,.9);
  animation: spin .7s linear infinite;
}
@keyframes spin { to { transform: rotate(360deg); } }

.login-note {
  margin-top: 24px; text-align: center;
  font-size: 11px; color: rgba(245,240,232,.18); line-height: 1.7;
}

@media (max-width: 480px) {
  .login-card { padding: 36px 24px 28px; }
}
</style>