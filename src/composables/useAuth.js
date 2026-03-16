import { ref, onMounted, onUnmounted } from 'vue'
import { auth } from '../firebase.js'
import { onAuthStateChanged, signInWithEmailAndPassword, signOut } from 'firebase/auth'

const user = ref(null)

export function useAuth() {
  let unsub = null

  onMounted(() => {
    unsub = onAuthStateChanged(auth, u => { user.value = u })
  })
  onUnmounted(() => unsub?.())

  async function login(email, password) {
    await signInWithEmailAndPassword(auth, email, password)
  }

  async function logout() {
    await signOut(auth)
  }

  return { user, login, logout }
}
