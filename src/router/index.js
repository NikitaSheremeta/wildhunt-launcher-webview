import { createRouter, createWebHistory } from 'vue-router';
import { useAuthStore } from '@/stores/auth';

const routes = [
  {
    path: '/',
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
  },
  {
    path: '/signup',
    name: 'Signup',
    component: () => import('@/views/SignUp/SignUp.vue'),
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

router.beforeEach(async (to, from, next) => {
  const token = localStorage.getItem('token');

  const authStore = useAuthStore();

  if (to.meta.requiresAuth) {
    if (!token) {
      const response = await authStore.checkAuth();

      if (response.status === 401) {
        return next({ path: '/login', replace: true });
      }
    }
  }

  if (to.path === '/login' || to.path === '/signup') {
    if (!token) {
      const response = await authStore.checkAuth();

      if (response.status === 200) {
        return next({ path: '/', replace: true });
      }
    }

    if (token) {
      return next({ path: '/', replace: true });
    }
  }

  return next();
});

export default router;
