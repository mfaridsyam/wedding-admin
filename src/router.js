import { createRouter, createWebHistory } from 'vue-router'
import { auth } from './firebase.js'
import { onAuthStateChanged } from 'firebase/auth'

import LoginView     from './views/LoginView.vue'
import DashboardView from './views/DashboardView.vue'
import NewCoupleView from './views/NewCoupleView.vue'
import EditCoupleView from './views/EditCoupleView.vue'
import GuestListView from './views/GuestListView.vue'

const routes = [
  { path: '/login',             component: LoginView,      meta: { public: true } },
  { path: '/',                  component: DashboardView,  meta: { requiresAuth: true } },
  { path: '/couple/new',        component: NewCoupleView,  meta: { requiresAuth: true } },
  { path: '/couple/:slug/edit', component: EditCoupleView, meta: { requiresAuth: true } },
  { path: '/couple/:slug/guests', component: GuestListView, meta: { requiresAuth: true } },
  { path: '/:pathMatch(.*)*',   redirect: '/' },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

let authReady = false
let currentUser = null

onAuthStateChanged(auth, user => {
  currentUser = user
  authReady = true
})

router.beforeEach(async (to) => {
  if (!authReady) {
    await new Promise(resolve => {
      const unsub = onAuthStateChanged(auth, user => {
        currentUser = user
        authReady = true
        unsub()
        resolve()
      })
    })
  }

  if (to.meta.requiresAuth && !currentUser) return '/login'
  if (to.path === '/login' && currentUser)  return '/'
  return true
})

export default router
