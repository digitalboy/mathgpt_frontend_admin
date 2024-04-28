// services/studentService.ts
import { BaseService } from './baseService';

export interface Student {
    id?: number;
    name: string;
    phone_number: string;
    class_id: number;
    password?: string;
    grade_name?:string;
    class_name?:string;
}

export interface SubjectPerformance {
    answer_rate: string;
    answered_questions: number;
    correct_answers: number;
    correct_rate: string;
    total_questions: number;
    knowledge_point_reach_rate:number;
    reached_knowledge_points:number;
    total_knowledge_points:number;
}

// 使用索引签名来允许任意的科目名称作为键，导出以便其他部分使用
export interface StudentPerformanceResponse {
    [subject: string]: SubjectPerformance;
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

    public static async getStudentPerformance(student_id: number): Promise<StudentPerformanceResponse | undefined> {
        try {
            const response = await this.axiosInstance.get<StudentPerformanceResponse>(`/student/performance/${student_id}`);
            console.log('学生表现数据获取成功！');
            return response.data;
        } catch (error) {
            console.error('获取学生表现数据失败：', error);
            this.handleError(error);
            return undefined;
        }
    }
}
