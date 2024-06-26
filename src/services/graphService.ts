// services/graphService.ts
import { BaseService } from './baseService';

export interface Node {    
    explanation_count: number;
    identity: number;
    labels: string;
    prerequisite_from_count: number;
    properties: {
        description: string;
        grade: string;
        node_name: string;
        publisher: string;
        subject: string;
        uuid: string;
    };
    total_questions?: number;
    unreached_questions?: number;
    answered_questions?: number;
    correct_answer_rate?: number;
    correct_answers?: number;    
    elementId?: string;
    color?: {
        border: string;
        background: string;
    };
    borderWidth?:number
}

export interface Edge {
    type: string;
    start_uuid: string;
    end_uuid: string;
    properties: {
        since?: number;
        description?: string;
    };
}

export interface GraphData {
    nodes: Node[];
    edges: Edge[];
}


export class GraphService extends BaseService {
    // 获取节点和边
    public static async getNodesAndEdges(grades?: string, subject?: string, student_id?: number, edge_types?: string[], textbook_version?: string): Promise<GraphData | undefined> {
        try {
            const params: any = { grades, subject, student_id, edge_types, textbook_version };
            if (edge_types) {
                params.edge_types = edge_types.join(',');
            }
            const response = await this.axiosInstance.get<GraphData>('/graph/get_nodes_edges', { params });
            console.log('知识点的节点和边获取成功！');
            return response.data;
        } catch (error) {
            console.error('获取知识点的节点和边失败：', error);
            this.handleError(error);
            return undefined;
        }
    }

    // 搜索节点
    public static async searchNodes(grade?: string, subject?: string): Promise<Node[] | undefined> {
        try {
            const response = await this.axiosInstance.get<Node[]>('/graph/search_nodes', { params: { grade, subject } });
            console.log('节点搜索成功！');
            console.log(response.data);
            return response.data;
        } catch (error) {
            console.error('节点搜索失败：', error);
            this.handleError(error);
            return undefined;
        }
    }

    // 添加节点和边
    public static async addNodesAndEdges(data: { nodes: Node[], edges: Edge[] }): Promise<GraphData | undefined> {
        try {
            const response = await this.axiosInstance.post<GraphData>('/graph/add_nodes_edges', data);
            console.log('节点和边添加成功！');
            return response.data;
        } catch (error) {
            console.error('添加节点和边失败：', error);
            this.handleError(error);
            return undefined;
        }
    }

    // 更新节点和边
    public static async updateNodesAndEdges(data: { updates: any[] }): Promise<GraphData | undefined> {
        try {
            const response = await this.axiosInstance.put<GraphData>('/graph/update_nodes_edges', data);
            console.log('节点和边更新成功！');
            return response.data;
        } catch (error) {
            console.error('更新节点和边失败：', error);
            this.handleError(error);
            return undefined;
        }
    }

    // 删除节点
    public static async deleteNode(uuid: string): Promise<{ message: string } | undefined> {
        try {
            const response = await this.axiosInstance.delete(`/graph/delete_node/${uuid}`);
            console.log('节点删除成功！');
            return response.data;
        } catch (error) {
            console.error('删除节点失败：', error);
            this.handleError(error);
            return undefined;
        }
    }

    // 删除边
    public static async deleteEdge(start_uuid: string, end_uuid: string, rel_type: string): Promise<{ message: string } | undefined> {
        try {
            const response = await this.axiosInstance.delete('/graph/delete_edge', { data: { start_uuid, end_uuid, rel_type } });
            console.log('边删除成功！');
            return response.data;
        } catch (error) {
            console.error('删除边失败：', error);
            this.handleError(error);
            return undefined;
        }
    }

    /**
     * 获取与指定UUID相邻的节点和边
     * @param uuid 节点的UUID
     * @param degree 相邻的度数，默认为1
     * @returns 相邻的节点和边的集合或者在出现错误时返回undefined
     */
    public static async getNeighborhood(uuid: string, degree: number = 1): Promise<GraphData | undefined> {
        // console.log('获取相邻节点和边...');
        try {
            const response = await this.axiosInstance.get<GraphData>('/graph/get_neighborhood', {
                params: { uuid, degree }
            });
            console.log('获取相邻节点和边成功！');
            // console.log(response.data);
            return response.data;
        } catch (error) {
            console.error('获取相邻节点和边失败：', error);
            this.handleError(error);
            return undefined;
        }
    }

    // 获取节点的隔离级别
    public static async getIsolationRank(limit: number): Promise<Node[] | undefined> {
        try {
            const response = await this.axiosInstance.get<Node[]>('/graph/isolation_rank', { params: { limit } });
            console.log('节点的隔离级别获取成功！');
            return response.data;
        } catch (error) {
            console.error('获取节点的隔离级别失败：', error);
            this.handleError(error);
            return undefined;
        }
    }

    // 绘制数学图形
    public static async drawFigure(json_data: any, uuid: string): Promise<{ message: string } | undefined> {
        try {
            const response = await this.axiosInstance.post('/graph/draw_figure', { json_data, uuid });
            console.log('图形绘制成功！');
            return response.data;
        } catch (error) {
            console.error('图形绘制失败：', error);
            this.handleError(error);
            return undefined;
        }
    }
}
