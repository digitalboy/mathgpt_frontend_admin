// services/subjectService.ts
import { BaseService } from './baseService';

interface Subject {
    id?: number;
    name: string;
}

export class SubjectService extends BaseService {
    // 创建科目
    public static async createSubject(subjectData: Subject): Promise<Subject | undefined> {
        try {
            const response = await this.axiosInstance.post<Subject>('/subject/new', subjectData);
            console.log('科目创建成功！');
            return response.data;
        } catch (error) {
            console.error('创建科目失败：', error);
            this.handleError(error);
            return undefined;
        }
    }

    // 获取所有科目的列表
    public static async getSubjects(): Promise<Subject[] | undefined> {
        try {
            const response = await this.axiosInstance.get<Subject[]>('/subject/get');
            console.log('科目列表获取成功！');
            return response.data;
        } catch (error) {
            console.error('获取科目列表失败：', error);
            this.handleError(error);
            return undefined;
        }
    }

    // 获取单个科目的详细信息
    public static async getSubjectById(subjectId: number): Promise<Subject | undefined> {
        try {
            const response = await this.axiosInstance.get<Subject>(`/subject/get/${subjectId}`);
            console.log('科目详细信息获取成功！');
            return response.data;
        } catch (error) {
            console.error('获取科目信息失败：', error);
            this.handleError(error);
            return undefined;
        }
    }

    // 更新科目信息
    public static async updateSubject(subjectId: number, subjectData: Subject): Promise<Subject | undefined> {
        try {
            const response = await this.axiosInstance.put<Subject>(`/subject/update/${subjectId}`, subjectData);
            console.log('科目信息更新成功！');
            return response.data;
        } catch (error) {
            console.error('更新科目信息失败：', error);
            this.handleError(error);
            return undefined;
        }
    }

    // 删除科目
    public static async deleteSubject(subjectId: number): Promise<void | undefined> {
        try {
            const response = await this.axiosInstance.delete(`/subject/delete/${subjectId}`);
            console.log('科目删除成功！');
            return response.data;
        } catch (error) {
            console.error('删除科目失败：', error);
            this.handleError(error);
            return undefined;
        }
    }
}
