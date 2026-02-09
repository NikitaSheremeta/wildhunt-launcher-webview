import { createRouter, createWebHashHistory } from 'vue-router';
import { useAuthStore } from '@/stores/auth';

const routes = [
  {
    path: '/',
    name: 'Root',
    redirect: '/login',
  },
  {
    path: '/home',
    name: 'Home Page',
    component: () => import('@/views/HomePage/HomePage.vue'),
    meta: {
      requiresAuth: true,
    },
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/LogIn/LogIn.vue'),
    meta: {
      guestOnly: true,
    },
  },
  {
    path: '/signup',
    name: 'Signup',
    component: () => import('@/views/SignUp/SignUp.vue'),
    meta: {
      guestOnly: true,
    },
  },
  {
    path: '/reset-password',
    name: 'Reset Password',
    component: () => import('@/views/ResetPassword/ResetPassword.vue'),
    meta: {
      guestOnly: true,
    },
  },
  {
    path: '/map',
    name: 'Map',
    component: () => import('@/views/ServerMap/ServerMap.vue'),
  },
];

const router = createRouter({
  // Hash history is the most robust option for embedded WebView (file:/, jar:/) environments.
  // It avoids relying on server-side route handling.
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes,
});

router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore();

  // Embedded WebView mode: auth/session and JWT live in Java layer.
  // UI asks Java for the current auth status via bridge.
  if (!authStore.isAuthResolved) {
    await authStore.checkAuth({ silent: true });
  }

  if (to.meta.guestOnly && authStore.isAuthenticated) {
    return next({ path: '/home', replace: true });
  }

  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    return next({ path: '/login', replace: true });
  }

  return next();
});

export default router;
