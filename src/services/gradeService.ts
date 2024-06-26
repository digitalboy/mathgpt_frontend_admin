// services/gradeService.ts
import { BaseService } from './baseService';

export interface Grade {
    id?: number;
    name: string;
    description: string;
}

export class GradeService extends BaseService {
    // 创建年级
    public static async createGrade(gradeData: Grade): Promise<Grade | undefined> {
        try {
            const response = await this.axiosInstance.post<Grade>('/grade/new', gradeData);
            console.log('年级创建成功！');
            return response.data;
        } catch (error) {
            console.error('创建年级失败：', error);
            this.handleError(error);
            return undefined;
        }
    }

    // 获取所有年级的列表
    public static async getGrades(): Promise<Grade[] | undefined> {
        try {
            const response = await this.axiosInstance.get<Grade[]>('/grade/get');
            console.log('年级列表获取成功！');
            return response.data;
        } catch (error) {
            console.error('获取年级列表失败：', error);
            this.handleError(error);
            return undefined;
        }
    }

    // 获取单个年级的详细信息
    public static async getGradeById(grade_id: number): Promise<Grade | undefined> {
        try {
            const response = await this.axiosInstance.get<Grade>(`/grade/get/${grade_id}`);
            console.log('年级详细信息获取成功！');
            return response.data;
        } catch (error) {
            console.error('获取年级信息失败：', error);
            this.handleError(error);
            return undefined;
        }
    }

    // 更新年级信息
    public static async updateGrade(grade_id: number, gradeData: Grade): Promise<Grade | undefined> {
        try {
            const response = await this.axiosInstance.put<Grade>(`/grade/update/${grade_id}`, gradeData);
            console.log('年级信息更新成功！');
            return response.data;
        } catch (error) {
            console.error('更新年级信息失败：', error);
            this.handleError(error);
            return undefined;
        }
    }

    // 删除年级
    public static async deleteGrade(grade_id: number): Promise<{ success: string } | undefined> {
        try {
            const response = await this.axiosInstance.delete(`/grade/delete/${grade_id}`);
            console.log('年级删除成功！');
            return response.data;
        } catch (error) {
            console.error('删除年级失败：', error);
            this.handleError(error);
            return undefined;
        }
    }
}
