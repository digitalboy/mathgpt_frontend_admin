// src/router/index.ts

import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';
import { useAuthStore } from '@/stores/authStore';
import Login from '@/views/Login.vue';
import Dashboard from '@/views/Dashboard.vue';
import Schools from '@/views/Schools.vue';
import Grades from '@/views/Grades.vue';
import Classes from '@/views/Classes.vue';
import Subjects from '@/views/Subjects.vue';
import Students from '@/views/Students.vue';
import Graph from '@/views/Graph.vue';
// import Test from '@/views/Test.vue';

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'Home',
    redirect: '/login'
  },
  {
    path: '/login',
    name: 'Login',
    component: Login
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: Dashboard,
    meta: { requiresAuth: true }
  },
  {
    path: '/schools',
    name: 'Schools',
    component: Schools,
    meta: { requiresAuth: true }
  },
  {
    path: '/grades',
    name: 'Grades',
    component: Grades,
    meta: { requiresAuth: true }
  }
  ,
  {
    path: '/classes',
    name: 'Classes',
    component: Classes,
    meta: { requiresAuth: true }
  },
  {
    path: '/subjects',
    name: 'Subjects',
    component: Subjects,
    meta: { requiresAuth: true }
  },
  {
    path: '/students',
    name: 'students',
    component: Students,
    meta: { requiresAuth: true }
  }
  ,
  {
    path: '/graph',
    name: 'Graph',
    component: Graph,
    meta: { requiresAuth: true }
  }
  ,
  // {
  //   path: '/test',
  //   name: 'Test',
  //   component: Test,
  //   meta: { requiresAuth: true }
  // }
];

const router = createRouter({
  history: createWebHistory(),
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
