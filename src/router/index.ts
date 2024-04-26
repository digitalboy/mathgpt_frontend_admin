// src/router/index.ts

import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';
import { useAuthStore } from '@/stores/authStore';

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'Home',
    redirect: '/dashboard'
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/Login.vue'),
    meta: { hideMenu: true }
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
    meta: { requiresAuth: true, roles: ['admin'] }
  },
  {
    path: '/questiondesign',
    name: 'QuestionDesign',
    component: () => import('@/views/QuestionDesign.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/test',
    name: 'Test',
    component: () => import('@/views/Test.vue'),
    meta: { requiresAuth: true }
  }, 
  {
    path: '/student/dashborad',
    name: 'StudentDashboard',
    component: () => import('@/views/student/Dashboard.vue'),
    meta: { requiresAuth: true }
  },
];

const router = createRouter({
  history: createWebHistory('/admin/'),  // 注意这里设置 base 为 '/admin/'
  routes
});

router.beforeEach((to, _from, next) => {
  const authStore = useAuthStore();

  // 检查是否需要权限认证，如果未登录则跳转至登录页面
  if (to.meta.requiresAuth && !authStore.user?.isLoggedIn) {
    next({ name: 'Login' });
  } else {
    // 检查路由是否定义了需要特定角色访问
    if (to.meta.roles) {
      const roles = to.meta.roles as string[]; // 这里通过类型断言，明确 roles 的类型为字符串数组
      if (!roles.includes(authStore.user?.role as string)) {
        // 如果未包含相应角色，重定向到未授权访问页面
        next({ path: '/unauthorized' });
      } else {
        next(); // 角色匹配，正常导航
      }
    } else {
      next(); // 若未设置 roles 属性，则无需角色限制，正常导航
    }
  }
});
export default router;
