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
        setCurrentNode(node: Node) {
            this.currentNode = node;
        },
        setCurrentEdge(edge: Edge) {
            this.currentEdge = edge;
        },

        async fetchNodesAndEdges() {
            console.log('获取节点和边...');
            try {
                const graphData = await GraphService.getNodesAndEdges();
                if (graphData) {
                    this.nodes = graphData.nodes;
                    this.edges = graphData.edges;
                    console.log('状态：节点和边获取成功！');
                }
            } catch (error) {
                console.error('获取节点和边失败：', error);
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
                const graphData = await GraphService.updateNodesAndEdges(updates);
                if (graphData) {
                    this.nodes = graphData.nodes;
                    this.edges = graphData.edges;
                }
            } catch (error) {
                console.error('更新节点和边失败：', error);
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
