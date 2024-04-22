// services/studentService.ts
import { BaseService } from './baseService';

interface Student {
    id?: number;
    name: string;
    phone_number: string;
    class_id: number;
    password?: string;
}

export class StudentService extends BaseService {
    // 创建学生
    public static async createStudent(studentData: Student): Promise<Student | undefined> {
        try {
            const response = await this.axiosInstance.post<Student>('/student/new', studentData);
            console.log('学生创建成功！');
            return response.data;
        } catch (error) {
            console.error('创建学生失败：', error);
            this.handleError(error);
            return undefined;
        }
    }

    // 获取所有学生的列表
    public static async getStudents(): Promise<Student[] | undefined> {
        try {
            const response = await this.axiosInstance.get<Student[]>('/student/get');
            console.log('学生列表获取成功！');
            return response.data;
        } catch (error) {
            console.error('获取学生列表失败：', error);
            this.handleError(error);
            return undefined;
        }
    }

    // 获取单个学生的详细信息
    public static async getStudentById(studentId: number): Promise<Student | undefined> {
        try {
            const response = await this.axiosInstance.get<Student>(`/student/get/${studentId}`);
            console.log('学生详细信息获取成功！');
            return response.data;
        } catch (error) {
            console.error('获取学生信息失败：', error);
            this.handleError(error);
            return undefined;
        }
    }

    // 更新学生信息
    public static async updateStudent(studentId: number, studentData: Student): Promise<Student | undefined> {
        try {
            const response = await this.axiosInstance.put<Student>(`/student/update/${studentId}`, studentData);
            console.log('学生信息更新成功！');
            return response.data;
        } catch (error) {
            console.error('更新学生信息失败：', error);
            this.handleError(error);
            return undefined;
        }
    }

    // 删除学生
    public static async deleteStudent(studentId: number): Promise<void | undefined> {
        try {
            const response = await this.axiosInstance.delete(`/student/delete/${studentId}`);
            console.log('学生删除成功！');
            return response.data;
        } catch (error) {
            console.error('删除学生失败：', error);
            this.handleError(error);
            return undefined;
        }
    }

    // 学生登录
    public static async loginStudent(phone_number: string, password: string): Promise<Student | undefined> {
        try {
            const response = await this.axiosInstance.post<Student>('/student/login', { phone_number, password });
            console.log('学生登录成功！');
            return response.data;
        } catch (error) {
            console.error('学生登录失败：', error);
            this.handleError(error);
            return undefined;
        }
    }
}
