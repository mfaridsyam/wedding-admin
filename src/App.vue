<template>
  <div class="app-shell" v-if="isAuthPage">
    <router-view />
  </div>

  <div class="app-shell layout" v-else>
    <aside class="sidebar">
      <div class="sidebar-brand">
        <span class="brand-icon">✦</span>
        <span class="brand-text">Wedding<em>Admin</em></span>
      </div>

      <nav class="sidebar-nav">
        <router-link to="/" class="nav-item" exact-active-class="active">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><rect x="1" y="1" width="6" height="6" rx="1.5" stroke="currentColor" stroke-width="1.2"/><rect x="9" y="1" width="6" height="6" rx="1.5" stroke="currentColor" stroke-width="1.2"/><rect x="1" y="9" width="6" height="6" rx="1.5" stroke="currentColor" stroke-width="1.2"/><rect x="9" y="9" width="6" height="6" rx="1.5" stroke="currentColor" stroke-width="1.2"/></svg>
          Dashboard
        </router-link>
        <router-link to="/couple/new" class="nav-item" active-class="active">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><circle cx="8" cy="8" r="7" stroke="currentColor" stroke-width="1.2"/><path d="M8 5v6M5 8h6" stroke="currentColor" stroke-width="1.2" stroke-linecap="round"/></svg>
          Pasangan Baru
        </router-link>
      </nav>

      <div class="sidebar-footer">
        <div class="user-info">
          <div class="user-avatar">{{ userInitial }}</div>
          <div>
            <div class="user-email">{{ userEmail }}</div>
            <button class="logout-btn" @click="handleLogout">Keluar</button>
          </div>
        </div>
      </div>
    </aside>

    <main class="main-content">
      <router-view />
    </main>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuth } from './composables/useAuth.js'

const route  = useRoute()
const router = useRouter()
const { user, logout } = useAuth()

const isAuthPage  = computed(() => route.path === '/login')
const userEmail   = computed(() => user.value?.email || '')
const userInitial = computed(() => userEmail.value.charAt(0).toUpperCase())

async function handleLogout() {
  await logout()
  router.push('/login')
}
</script>

<style>
.app-shell { min-height: 100vh; }

.app-shell.layout {
  display: grid;
  grid-template-columns: 220px 1fr;
  min-height: 100vh;
}

.sidebar {
  background: var(--ink);
  display: flex; flex-direction: column;
  padding: 0;
  position: sticky; top: 0; height: 100vh;
  overflow-y: auto;
}

.sidebar-brand {
  display: flex; align-items: center; gap: 10px;
  padding: 24px 20px 20px;
  border-bottom: 1px solid rgba(255,255,255,.07);
}
.brand-icon { color: var(--gold); font-size: 18px; }
.brand-text {
  font-family: 'Playfair Display', serif;
  font-size: 18px; color: #fff; font-weight: 400;
}
.brand-text em { font-style: italic; color: var(--gold-light); }

.sidebar-nav {
  flex: 1; padding: 16px 12px;
  display: flex; flex-direction: column; gap: 2px;
}

.nav-item {
  display: flex; align-items: center; gap: 10px;
  padding: 9px 12px; border-radius: var(--radius-sm);
  color: rgba(255,255,255,.5); font-size: 13px;
  text-decoration: none;
  transition: background .15s, color .15s;
}
.nav-item:hover { background: rgba(255,255,255,.06); color: rgba(255,255,255,.8); }
.nav-item.active { background: rgba(184,150,90,.15); color: var(--gold-light); }

.sidebar-footer {
  padding: 16px 16px 24px;
  border-top: 1px solid rgba(255,255,255,.07);
}
.user-info { display: flex; align-items: center; gap: 10px; }
.user-avatar {
  width: 32px; height: 32px; border-radius: 50%;
  background: var(--gold-dark); color: #fff;
  font-size: 13px; font-weight: 600;
  display: flex; align-items: center; justify-content: center;
  flex-shrink: 0;
}
.user-email { font-size: 11px; color: rgba(255,255,255,.4); max-width: 130px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.logout-btn {
  font-size: 11px; color: rgba(255,255,255,.3);
  background: none; border: none; cursor: pointer; padding: 0;
  transition: color .15s;
}
.logout-btn:hover { color: var(--gold-light); }

.main-content {
  background: var(--bg);
  overflow-y: auto;
  min-height: 100vh;
}

@media (max-width: 680px) {
  .app-shell.layout { grid-template-columns: 1fr; }
  .sidebar { display: none; }
}
</style>
