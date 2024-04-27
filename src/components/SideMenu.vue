<!-- src\components\SideMenu.vue -->
<template>
    <el-menu default-active="2" class="el-menu-vertical-demo" @open="handleOpen" @close="handleClose">
        <template v-if="isAdmin">
            <el-menu-item index="1" @click="goToRoute('Schools')">
                <el-icon>
                    <School />
                </el-icon>
                <span>学校管理</span>
            </el-menu-item>

            <el-menu-item index="2" @click="goToRoute('Grades')">
                <el-icon>
                    <document />
                </el-icon>
                <span>年级管理</span>
            </el-menu-item>

            <el-menu-item index="3" @click="goToRoute('Classes')">
                <el-icon>
                    <document />
                </el-icon>
                <span>班级管理</span>
            </el-menu-item>

            <el-menu-item index="4" @click="goToRoute('Subjects')">
                <el-icon>
                    <EditPen />
                </el-icon>
                <span>学科管理</span>
            </el-menu-item>

            <el-menu-item index="5" @click="goToRoute('Students')">
                <el-icon>
                    <User />
                </el-icon>
                <span>学生管理</span>
            </el-menu-item>

            <el-menu-item index="6" @click="goToRoute('Graph')">
                <el-icon>
                    <DataAnalysis />
                </el-icon>
                <span>图谱管理</span>
            </el-menu-item>

            <el-menu-item index="7" @click="goToRoute('Questions')">
                <el-icon>
                    <document />
                </el-icon>
                <span>试题管理</span>
            </el-menu-item>

            <el-menu-item index="8" @click="goToRoute('QuestionDesign')">
                <el-icon>
                    <document />
                </el-icon>
                <span>试题设计</span>
            </el-menu-item>

            <el-menu-item index="9" @click="goToRoute('Dashboard')">
                <el-icon><icon-menu /></el-icon>
                <span>Dashboard</span>
            </el-menu-item>

            <el-menu-item index="10" @click="goToRoute('Test')">
                <el-icon>
                    <setting />
                </el-icon>
                <span>测试</span>
            </el-menu-item>
        </template>
        <template v-if="isStudent">
            <el-menu-item index="100" @click="goToRoute('StudentDashboard')">
                <el-icon><icon-menu /></el-icon>
                <span>我的报告</span>
            </el-menu-item>

            <el-menu-item index="101" @click="goToRoute('StudentAllGraph')">
                <el-icon>
                    <DataAnalysis />
                </el-icon>
                <span>知识图谱</span>
            </el-menu-item>

            <el-menu-item index="102" @click="goToRoute('DoQuestions')">
                <el-icon><icon-menu /></el-icon>
                <span>自选练习</span>
            </el-menu-item>

            <el-menu-item index="103" @click="goToRoute('DoQuestions')">
                <el-icon><icon-menu /></el-icon>
                <span>随机练习</span>
            </el-menu-item>

            <el-menu-item index="104" @click="goToRoute('DoQuestions')">
                <el-icon><icon-menu /></el-icon>
                <span>根因分析</span>
            </el-menu-item>

        </template>
        <el-menu-item index="10" @click="goToRoute('Test')">
            <el-icon>
                <setting />
            </el-icon>
            <span>测试</span>
        </el-menu-item>
    </el-menu>
</template>

<script lang="ts" setup>
import { computed } from 'vue';
import {
    Document,
    Menu as IconMenu,
    User,
    Setting,
    DataAnalysis,
    EditPen,
} from '@element-plus/icons-vue'
import { useAuthStore } from '@/stores/authStore';
import { useRouter } from 'vue-router';
const router = useRouter();
const authStore = useAuthStore();

// Computed properties to check roles
const isAdmin = computed(() => authStore.user?.role === 'admin');
const isStudent = computed(() => authStore.user?.role === 'student');


const handleOpen = (key: string, keyPath: string[]) => {
    console.log(key, keyPath)
}

const handleClose = (key: string, keyPath: string[]) => {
    console.log(key, keyPath)
}

const goToRoute = (routeName: string) => {
    router.push({ name: routeName });
}
</script>
