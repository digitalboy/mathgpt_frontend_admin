// stores/classStore.ts
import { defineStore } from 'pinia';
import { Class, ClassService } from '@/services/classService';

export const useClassStore = defineStore('class', {
    state: () => ({
        classes: [] as Class[],
        currentClass: null as Class | null,
    }),
    actions: {
        setCurrentClass(classInfo: Class | null) {
            this.currentClass = classInfo;
        },
        async fetchClasses() {
            try {
                const classes = await ClassService.getClasses();
                if (classes) {
                    this.classes = classes;
                }
            } catch (error) {
                console.error('加载班级列表失败:', error);
            }
        },
        async fetchClassById(classId: number) {
            try {
                const classInfo = await ClassService.getClassById(classId);
                if (classInfo) {
                    this.setCurrentClass(classInfo);
                }
            } catch (error) {
                console.error('获取班级详细信息失败:', error);
            }
        },
        async createClass(classData: Class) {
            try {
                const newClass = await ClassService.createClass(classData);
                if (newClass) {
                    this.classes.push(newClass);
                    this.setCurrentClass(newClass);
                }
            } catch (error) {
                console.error('创建班级失败:', error);
            }
        },
        async updateClass(classId: number, classData: Class) {
            try {
                const updatedClass = await ClassService.updateClass(classId, classData);
                if (updatedClass) {
                    const index = this.classes.findIndex(c => c.id === classId);
                    if (index !== -1) {
                        this.classes[index] = updatedClass;
                        this.setCurrentClass(updatedClass);
                    }
                }
            } catch (error) {
                console.error('更新班级信息失败:', error);
            }
        },
        async deleteClass(classId: number) {
            try {
                await ClassService.deleteClass(classId);
                this.classes = this.classes.filter(c => c.id !== classId);
                if (this.currentClass?.id === classId) {
                    this.currentClass = null;
                }
            } catch (error) {
                console.error('删除班级失败:', error);
            }
        }
    }
});
