import { createRouter, createWebHistory } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import { HTTP_STATUS } from '@/constants/status-codes';

const routes = [
  {
    path: '/',
    name: 'Home Page',
    component: () => import('@/views/HomePage/HomePage.vue'),
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
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore();
  const token = localStorage.getItem('token');

  if (to.meta.guestOnly) {
    if (token) {
      authStore.setIsAuthenticated(true);

      return next({ path: '/', replace: true });
    }

    authStore.setIsAuthenticated(false);
    return next();
  }

  if (to.meta.requiresAuth) {
    if (!token) {
      const response = await authStore.checkAuth();

      if (response.status === HTTP_STATUS.UNAUTHORIZED) {
        authStore.setIsAuthenticated(false);

        return next({ path: '/login', replace: true });
      }

      authStore.setIsAuthenticated(response.status === HTTP_STATUS.OK);

      return next();
    }

    authStore.setIsAuthenticated(true);

    return next();
  }

  if (token) {
    authStore.setIsAuthenticated(true);
  }

  return next();
});

export default router;
