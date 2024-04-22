// services/schoolService.ts
import { BaseService } from './baseService';

interface School {
    id?: number;
    name: string;
    description: string;
    location: string;
    contact: string;
}

export class SchoolService extends BaseService {
    // 创建学校
    public static async createSchool(schoolData: School): Promise<School | undefined> {
        try {
            const response = await this.axiosInstance.post<School>('/school/new', schoolData);
            console.log('学校创建成功！');
            return response.data;
        } catch (error) {
            console.error('创建学校失败：', error);
            this.handleError(error);
            return undefined; // 明确返回 undefined
        }
    }

    // 获取所有学校的列表
    public static async getSchools(): Promise<School[] | undefined> {
        try {
            const response = await this.axiosInstance.get<School[]>('/school/get');
            console.log('学校列表获取成功！');
            return response.data;
        } catch (error) {
            console.error('获取学校列表失败：', error);
            this.handleError(error);
            return undefined; // 明确返回 undefined
        }
    }

    // 获取单个学校的详细信息
    public static async getSchoolById(schoolId: number): Promise<School | undefined> {
        try {
            const response = await this.axiosInstance.get<School>(`/school/get/${schoolId}`);
            console.log('学校详细信息获取成功！');
            return response.data;
        } catch (error) {
            console.error('获取学校信息失败：', error);
            this.handleError(error);
            return undefined; // 明确返回 undefined
        }
    }

    // 更新学校信息
    public static async updateSchool(schoolId: number, schoolData: School): Promise<School | undefined> {
        try {
            const response = await this.axiosInstance.put<School>(`/school/update/${schoolId}`, schoolData);
            console.log('学校信息更新成功！');
            return response.data;
        } catch (error) {
            console.error('更新学校信息失败：', error);
            this.handleError(error);
            return undefined; // 明确返回 undefined
        }
    }

    // 删除学校
    public static async deleteSchool(schoolId: number): Promise<void | undefined> {
        try {
            const response = await this.axiosInstance.delete(`/school/delete/${schoolId}`);
            console.log('学校删除成功！');
            return response.data;
        } catch (error) {
            console.error('删除学校失败：', error);
            this.handleError(error);
            return undefined; // 明确返回 undefined
        }
    }
}
