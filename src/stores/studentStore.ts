// stores/studentStore.ts
import { defineStore } from 'pinia';
import { Student, StudentService } from '@/services/studentService';

export const useStudentStore = defineStore('student', {
    state: () => ({
        students: [] as Student[],
        currentStudent: null as Student | null,
    }),
    actions: {
        setCurrentStudent(student: Student | null) {
            this.currentStudent = student;
        },
        async fetchStudents() {
            try {
                const students = await StudentService.getStudents();
                if (students) {
                    this.students = students;
                }
            } catch (error) {
                console.error('加载学生列表失败:', error);
            }
        },
        async fetchStudentById(studentId: number) {
            try {
                const student = await StudentService.getStudentById(studentId);
                if (student) {
                    this.setCurrentStudent(student);
                }
            } catch (error) {
                console.error('获取学生详细信息失败:', error);
            }
        },
        async createStudent(studentData: Student) {
            try {
                const newStudent = await StudentService.createStudent(studentData);
                if (newStudent) {
                    this.students.push(newStudent);
                    this.setCurrentStudent(newStudent);
                }
            } catch (error) {
                console.error('创建学生失败:', error);
            }
        },
        async updateStudent(studentId: number, studentData: Student) {
            try {
                const updatedStudent = await StudentService.updateStudent(studentId, studentData);
                if (updatedStudent) {
                    const index = this.students.findIndex(s => s.id === studentId);
                    if (index !== -1) {
                        this.students[index] = updatedStudent;
                        this.setCurrentStudent(updatedStudent);
                    }
                }
            } catch (error) {
                console.error('更新学生信息失败:', error);
            }
        },
        async deleteStudent(studentId: number) {
            try {
                await StudentService.deleteStudent(studentId);
                this.students = this.students.filter(s => s.id !== studentId);
                if (this.currentStudent?.id === studentId) {
                    this.currentStudent = null;
                }
            } catch (error) {
                console.error('删除学生失败:', error);
            }
        },
        async loginStudent(phoneNumber: string, password: string) {
            try {
                const student = await StudentService.loginStudent(phoneNumber, password);
                if (student) {
                    this.setCurrentStudent(student);
                }
            } catch (error) {
                console.error('学生登录失败:', error);
            }
        }
    }
});
