import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import LoginView from '@/views/LoginView.vue'
import VueCookies from 'vue-cookies'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'login',
      component: LoginView,
      meta: { requiresNoAuth: true },
    },
    {
      path: '/home',
      name: 'home',
      component: HomeView,
      meta: { requiresAuth: true },
    },
  ],
})

router.beforeEach((to, from, next) => {
  const isAuth = VueCookies.get('storepos')
  const requiresAuth = to.matched.some((record) => record.meta.requiresAuth)
  const requiresNoAuth = to.matched.some((record) => record.meta.requiresNoAuth)

  if (requiresAuth && !isAuth) {
    next('/')
  } else if (requiresNoAuth && isAuth) {
    next('/home')
  } else {
    next()
  }
})

export default router
