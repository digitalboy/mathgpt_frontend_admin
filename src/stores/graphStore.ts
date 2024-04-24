// stores/graphStore.ts
import { defineStore } from 'pinia';
import { GraphService, Node, Edge } from '@/services/graphService';

export const useGraphStore = defineStore('graph', {
    state: () => ({
        nodes: [] as Node[],
        edges: [] as Edge[],
        currentNode: null as Node | null,
        currentEdge: null as Edge | null
    }),
    getters: {
        currentNodeDetails: (state) => state.currentNode,
        currentEdgeDetails: (state) => state.currentEdge
    },
    actions: {
        setCurrentNode(node: Node | null) {
            this.currentNode = node;
        },
        setCurrentEdge(edge: Edge | null) {
            this.currentEdge = edge;
        },

        async fetchNodesAndEdges() {
            // console.log('Fetching nodes and edges...');
            try {
                const graphData = await GraphService.getNodesAndEdges();
                if (graphData) {
                    // 直接使用从服务返回的节点和边数组
                    this.nodes = graphData.nodes;
                    this.edges = graphData.edges;
                    // console.log('Processed nodes:', this.nodes);
                    // console.log('Processed edges:', this.edges);
                    console.log('状态：成功获取节点和边。');
                }
            } catch (error) {
                console.error('状态：获取节点和边失败', error);
            }
        },
        
        async addNodesAndEdges(nodes: Node[], edges: Edge[]) {
            try {
                const graphData = await GraphService.addNodesAndEdges({ nodes, edges });
                if (graphData) {
                    this.nodes = graphData.nodes;
                    this.edges = graphData.edges;
                }
            } catch (error) {
                console.error('添加节点和边失败：', error);
            }
        },

        async updateNodesAndEdges(updates: any[]) {
            try {
                const updatePayload = { updates }; // 构造符合预期的对象
                const graphData = await GraphService.updateNodesAndEdges(updatePayload);
                if (graphData) {
                    this.nodes = graphData.nodes;
                    this.edges = graphData.edges;
                    console.log('Nodes and edges updated successfully!');
                }
            } catch (error) {
                console.error('Failed to update nodes and edges:', error);
            }
        },
        async deleteNode(uuid: string) {
            try {
                const response = await GraphService.deleteNode(uuid);
                if (response && response.message === '节点删除成功！') {
                    this.nodes = this.nodes.filter(node => node.elementId !== uuid);
                    if (this.currentNode?.elementId === uuid) {
                        this.currentNode = null;
                    }
                }
            } catch (error) {
                console.error('删除节点失败：', error);
            }
        },
        async deleteEdge(start_uuid: string, end_uuid: string, rel_type: string) {
            try {
                const response = await GraphService.deleteEdge(start_uuid, end_uuid, rel_type);
                if (response && response.message === '边删除成功！') {
                    this.edges = this.edges.filter(edge => !(edge.start_uuid === start_uuid && edge.end_uuid === end_uuid && edge.type === rel_type));
                    if (this.currentEdge && this.currentEdge.start_uuid === start_uuid && this.currentEdge.end_uuid === end_uuid && this.currentEdge.type === rel_type) {
                        this.currentEdge = null;
                    }
                }
            } catch (error) {
                console.error('删除边失败：', error);
            }
        }
    }
});
