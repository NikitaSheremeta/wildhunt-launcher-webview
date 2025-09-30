import { createRouter, createWebHistory } from 'vue-router';

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

router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('token');

  if (to.meta.requiresAuth && !token) {
    next({ path: '/login', replace: true });

    return;
  }

  if ((to.path === '/login' || to.path === '/signup') && token) {
    next({ path: '/', replace: true });

    return;
  }

  next();
});

export default router;
