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

            <el-menu-item index="60" @click="goToRoute('KPManage')">
                <el-icon>
                    <DataAnalysis />
                </el-icon>
                <span>知识点管理</span>
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
                <span>访客就是这个</span>
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

            <el-menu-item index="102" @click="goToRoute('DoQuestions', 'all')">
                <el-icon><icon-menu /></el-icon>
                <span>知识点练习-自选</span>
            </el-menu-item>

            <el-menu-item index="103" @click="goToRoute('DoQuestions', 'correct')">
                <el-icon><icon-menu /></el-icon>
                <span>知识点练习-正确</span>
            </el-menu-item>

            <el-menu-item index="104" @click="goToRoute('DoQuestions', 'wrong')">
                <el-icon><icon-menu /></el-icon>
                <span>知识点练习-错误</span>
            </el-menu-item>

            <el-menu-item index="105" @click="goToRoute('DoQuestions', 'uninvolved')">
                <el-icon><icon-menu /></el-icon>
                <span>知识点练习-未涉</span>
            </el-menu-item>

            <el-menu-item index="105" @click="goToRoute('DoQuestions')">
                <el-icon><icon-menu /></el-icon>
                <span>根因分析</span>
            </el-menu-item>

        </template>
        <el-menu-item index="10" @click="goToRoute('Test')">
            <el-icon>
                <setting />
            </el-icon>
            <span>访客就是这个</span>
        </el-menu-item>
    </el-menu>
    <el-card>
        <el-text>
            本数据集属于 数学根因分析与练习系统（Root Cause Analysis and Exercises for Mathematics, RCAE） 的基础子项目之一。旨在可以高效的发现学生数学学业错误的根本原因。

            <p></p>

            数学根因分析与练习系统（RCAE）
            <p></p>
            是一款利用先进的图数据库技术和强大的数据分析算法，旨在革新数学教育的系统。通过对学生答题记录的分析，RCAE能够快速定位学生掌握不牢固的知识点，并生成个性化的练习计划，帮助学生高效提升数学成绩。

            <p></p>
            后续发展计划
            <p></p>
            更多数据：继续拓展初中，高中各个年级；人教出版社，北美数学……<p></p>
            知识点解释：为每个知识点提供生动、传神、有趣的解释，提高可理解性并降低学生的认知负荷。<p></p>
            题目设计：根据布鲁姆目标分类和孩子的认知规律，为每个知识点设计题目，难度分层。<p></p>
            根因溯源：可以快速的找到错题的根因，谨防无效刷题（我最恨这个了）。<p></p>
            教师界面：老师可以随时查看各种数据透视，快速掌握群体、个体的学业水平。<p></p>
            结合脑科学：学习尽快不能很快乐，但是尽量不要伤害孩子的学习热情。<p></p>
            <p></p>

            如有任何问题或建议，请通过以下方式联系作者：<p></p>

            微信：13510546101<p></p>
            邮箱：digitalboyzone@gmail.com<p></p>
            Twitter：https://x.com/freethisslave<p></p>
            欢迎大家提供宝贵意见和建议，共同完善数学根因分析与练习系统！<p></p>

        </el-text>
    </el-card>
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

function goToRoute(routeName: string, displayType?: string) {
    // 使用vue-router进行路由跳转，并带上查询参数
    router.push({ name: routeName, query: { displayType } });
}
</script>
