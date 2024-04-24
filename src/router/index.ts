// src/router/index.ts

import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';
import { useAuthStore } from '@/stores/authStore';

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'Home',
    redirect: '/login'
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/Login.vue')
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: () => import('@/views/Dashboard.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/schools',
    name: 'Schools',
    component: () => import('@/views/Schools.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/grades',
    name: 'Grades',
    component: () => import('@/views/Grades.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/classes',
    name: 'Classes',
    component: () => import('@/views/Classes.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/subjects',
    name: 'Subjects',
    component: () => import('@/views/Subjects.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/students',
    name: 'Students',
    component: () => import('@/views/Students.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/graph',
    name: 'Graph',
    component: () => import('@/views/Graph.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/questions',
    name: 'Questions',
    component: () => import('@/views/Questions.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/test',
    name: 'Test',
    component: () => import('@/views/Test.vue'),
    meta: { requiresAuth: true }
  }
];

const router = createRouter({
  history: createWebHistory('/admin/'),  // 注意这里设置 base 为 '/admin/'
  routes
});

router.beforeEach((to, _from, next) => {
  const authStore = useAuthStore();

  if (to.meta.requiresAuth && !authStore.isLoggedIn) {
    next({ name: 'Login' });
  } else {
    next();
  }
});

export default router;
