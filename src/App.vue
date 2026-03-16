<template>
  <div class="app-shell" v-if="isAuthPage">
    <router-view />
  </div>

  <div class="app-shell layout" v-else>
    <header class="mobile-header">
      <div class="mobile-brand">
        <span class="brand-icon">✦</span>
        <span class="brand-text">Wedding<em>Admin</em></span>
      </div>
      <button class="mobile-menu-btn" @click="menuOpen = !menuOpen">
        <svg v-if="!menuOpen" width="18" height="18" viewBox="0 0 18 18" fill="none">
          <path d="M2 4h14M2 9h14M2 14h14" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/>
        </svg>
        <svg v-else width="18" height="18" viewBox="0 0 18 18" fill="none">
          <path d="M2 2l14 14M16 2L2 16" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/>
        </svg>
      </button>
    </header>

    <div v-if="menuOpen" class="drawer-overlay" @click="menuOpen = false" />

    <aside class="sidebar" :class="{ open: menuOpen }">
      <div class="sidebar-brand">
        <div class="brand-gem">✦</div>
        <span class="brand-text">Wedding<em>Admin</em></span>
      </div>

      <nav class="sidebar-nav">
        <router-link to="/" class="nav-item" exact-active-class="active" @click="menuOpen = false">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <rect x="1" y="1" width="6" height="6" rx="1.5" stroke="currentColor" stroke-width="1.2"/>
            <rect x="9" y="1" width="6" height="6" rx="1.5" stroke="currentColor" stroke-width="1.2"/>
            <rect x="1" y="9" width="6" height="6" rx="1.5" stroke="currentColor" stroke-width="1.2"/>
            <rect x="9" y="9" width="6" height="6" rx="1.5" stroke="currentColor" stroke-width="1.2"/>
          </svg>
          <span>Dashboard</span>
        </router-link>
        <router-link to="/couple/new" class="nav-item" active-class="active" @click="menuOpen = false">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <circle cx="8" cy="8" r="7" stroke="currentColor" stroke-width="1.2"/>
            <path d="M8 5v6M5 8h6" stroke="currentColor" stroke-width="1.2" stroke-linecap="round"/>
          </svg>
          <span>Pasangan Baru</span>
        </router-link>
      </nav>

      <div class="sidebar-footer">
        <div class="user-row">
          <div class="user-avatar">{{ userInitial }}</div>
          <div class="user-info">
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
import { ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuth } from './composables/useAuth.js'

const route    = useRoute()
const router   = useRouter()
const { user, logout } = useAuth()
const menuOpen = ref(false)

const isAuthPage  = computed(() => route.path === '/login')
const userEmail   = computed(() => user.value?.email || '')
const userInitial = computed(() => userEmail.value.charAt(0).toUpperCase())

async function handleLogout() {
  menuOpen.value = false
  await logout()
  router.push('/login')
}
</script>

<style>
* { box-sizing: border-box; }

.app-shell { min-height: 100vh; }

.app-shell.layout {
  display: grid;
  grid-template-columns: 220px 1fr;
  min-height: 100vh;
}

.sidebar {
  background: #0e0c09;
  display: flex; flex-direction: column;
  position: sticky; top: 0; height: 100vh;
  overflow-y: auto;
  border-right: 1px solid rgba(184,150,90,.1);
  z-index: 50;
}

.sidebar-brand {
  display: flex; align-items: center; gap: 10px;
  padding: 24px 20px 20px;
  border-bottom: 1px solid rgba(184,150,90,.08);
}
.brand-gem { color: rgba(184,150,90,.8); font-size: 16px; }
.brand-text {
  font-family: 'Playfair Display', serif;
  font-size: 17px; color: #f5f0e8; font-weight: 400;
}
.brand-text em { font-style: italic; color: rgba(184,150,90,.85); }

.sidebar-nav {
  flex: 1; padding: 16px 12px;
  display: flex; flex-direction: column; gap: 3px;
}

.nav-item {
  display: flex; align-items: center; gap: 10px;
  padding: 10px 12px; border-radius: 8px;
  color: rgba(245,240,232,.35); font-size: 13px;
  text-decoration: none;
  transition: background .15s, color .15s;
}
.nav-item:hover {
  background: rgba(184,150,90,.08);
  color: rgba(245,240,232,.7);
}
.nav-item.active {
  background: rgba(184,150,90,.14);
  color: rgba(184,150,90,.9);
}

.sidebar-footer {
  padding: 14px 16px 20px;
  border-top: 1px solid rgba(184,150,90,.08);
}
.user-row { display: flex; align-items: center; gap: 10px; }
.user-avatar {
  width: 32px; height: 32px; border-radius: 50%;
  background: rgba(184,150,90,.2);
  border: 1px solid rgba(184,150,90,.3);
  color: rgba(184,150,90,.9);
  font-size: 13px; font-weight: 600;
  display: flex; align-items: center; justify-content: center;
  flex-shrink: 0;
}
.user-info { min-width: 0; }
.user-email {
  font-size: 11px; color: rgba(245,240,232,.3);
  overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
  max-width: 130px;
}
.logout-btn {
  font-size: 11px; color: rgba(184,150,90,.4);
  background: none; border: none; cursor: pointer; padding: 0;
  transition: color .15s;
}
.logout-btn:hover { color: rgba(184,150,90,.8); }

.main-content {
  background: #faf7f2;
  overflow-y: auto;
  min-height: 100vh;
}

.mobile-header { display: none; }
.drawer-overlay { display: none; }

@media (max-width: 720px) {
  .app-shell.layout {
    grid-template-columns: 1fr;
    grid-template-rows: 56px 1fr;
  }

  .mobile-header {
    display: flex; align-items: center; justify-content: space-between;
    padding: 0 20px;
    background: #0e0c09;
    border-bottom: 1px solid rgba(184,150,90,.1);
    position: sticky; top: 0; z-index: 60;
    height: 56px;
  }
  .mobile-brand {
    display: flex; align-items: center; gap: 8px;
  }
  .mobile-brand .brand-icon { color: rgba(184,150,90,.8); font-size: 14px; }
  .mobile-brand .brand-text {
    font-family: 'Playfair Display', serif;
    font-size: 16px; color: #f5f0e8;
  }
  .mobile-brand .brand-text em { font-style: italic; color: rgba(184,150,90,.85); }
  .mobile-menu-btn {
    width: 36px; height: 36px; border-radius: 8px;
    background: rgba(184,150,90,.08);
    border: 1px solid rgba(184,150,90,.15);
    color: rgba(245,240,232,.6);
    display: flex; align-items: center; justify-content: center;
    cursor: pointer;
    transition: background .2s;
  }
  .mobile-menu-btn:hover { background: rgba(184,150,90,.15); }

  .drawer-overlay {
    display: block;
    position: fixed; inset: 0; z-index: 49;
    background: rgba(0,0,0,.5);
  }

  .sidebar {
    position: fixed;
    top: 56px; left: 0; bottom: 0;
    width: 260px; height: auto;
    transform: translateX(-100%);
    transition: transform .3s cubic-bezier(.22,1,.36,1);
    z-index: 50;
  }
  .sidebar.open { transform: translateX(0); }

  .main-content { min-height: calc(100vh - 56px); }
}
</style>