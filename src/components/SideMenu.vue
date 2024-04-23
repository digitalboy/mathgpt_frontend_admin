<template>
    <el-menu default-active="2" class="el-menu-vertical-demo" @open="handleOpen" @close="handleClose">
        <el-menu-item index="1" @click="goToRoute('Schools')">
            <el-icon>
                <Location />
            </el-icon>
            <span>学校管理</span>
        </el-menu-item>

        <el-menu-item index="2" @click="goToRoute('Dashboard')">
            <el-icon><icon-menu /></el-icon>
            <span>Dashboard</span>
        </el-menu-item>

        <el-menu-item index="3" @click="goToRoute('SomeOtherRoute')">
            <el-icon>
                <document />
            </el-icon>
            <span>Navigator Three</span>
        </el-menu-item>

        <el-menu-item index="4" @click="goToRoute('YetAnotherRoute')">
            <el-icon>
                <setting />
            </el-icon>
            <span>Navigator Four</span>
        </el-menu-item>
    </el-menu>
</template>

<script lang="ts" setup>
import {
    Document,
    Menu as IconMenu,
    Location,
    Setting,
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
