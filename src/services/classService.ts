// services/classService.ts
import { BaseService } from './baseService';

export interface Class {
    id?: number;
    name: string;
    grade_id: number;
    num_of_students?: number;
    description?: string;
}

export class ClassService extends BaseService {
    // 创建班级
    public static async createClass(classData: Class): Promise<Class | undefined> {
        try {
            const response = await this.axiosInstance.post<Class>('/class/new', classData);
            console.log('班级创建成功！');
            return response.data;
        } catch (error) {
            console.error('创建班级失败：', error);
            this.handleError(error);
            return undefined;
        }
    }

    // 获取所有班级的列表
    public static async getClasses(): Promise<Class[] | undefined> {
        try {
            const response = await this.axiosInstance.get<Class[]>('/class/get');
            console.log('班级列表获取成功！');
            console.log(response.data);
            return response.data;
        } catch (error) {
            console.error('获取班级列表失败：', error);
            this.handleError(error);
            return undefined;
        }
    }

    // 获取单个班级的详细信息
    public static async getClassById(classId: number): Promise<Class | undefined> {
        try {
            const response = await this.axiosInstance.get<Class>(`/class/get/${classId}`);
            console.log('班级详细信息获取成功！');
            return response.data;
        } catch (error) {
            console.error('获取班级信息失败：', error);
            this.handleError(error);
            return undefined;
        }
    }

    // 更新班级信息
    public static async updateClass(classId: number, classData: Class): Promise<Class | undefined> {
        try {
            const response = await this.axiosInstance.put<Class>(`/class/update/${classId}`, classData);
            console.log('班级信息更新成功！');
            return response.data;
        } catch (error) {
            console.error('更新班级信息失败：', error);
            this.handleError(error);
            return undefined;
        }
    }

    // 删除班级
    public static async deleteClass(classId: number): Promise<void | undefined> {
        try {
            const response = await this.axiosInstance.delete(`/class/delete/${classId}`);
            console.log('班级删除成功！');
            return response.data;
        } catch (error) {
            console.error('删除班级失败：', error);
            this.handleError(error);
            return undefined;
        }
    }
}
