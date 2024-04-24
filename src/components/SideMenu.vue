<template>
    <el-menu default-active="2" class="el-menu-vertical-demo" @open="handleOpen" @close="handleClose">
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
    </el-menu>
</template>

<script lang="ts" setup>
import {
    Document,
    Menu as IconMenu,
    User,
    Setting,
    DataAnalysis,
    EditPen,
} from '@element-plus/icons-vue'
import { useRouter } from 'vue-router';
const router = useRouter();

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
