<template>
  <div class="container">
    <div class="left-side">
      <div class="workspace-header">
        <h2 class="workspace-title">Workspace</h2>
        <p>Drop items here</p>
        <button @click="saveGraph">Save Graph to Database</button>
        <button @click="saveAsImage">Save Workspace as Image</button>
      </div>

      <div class="workspace" ref="workspace" @dragover.prevent="onDragOver" @drop="onDrop">
        <svg class="edges-layer" style="position: absolute; width: 100%; height: 100%; top: 0; left: 0;">
          <defs>
            <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="20" refY="3.5" orient="auto">
              <polygon points="0 0, 10 3.5, 0 7" fill="black" />
            </marker>
          </defs>

          <path
            v-for="edge in edges"
            :key="edge.id"
            :d="edge.isSelfLoop
              ? 'M ' + edge.x1 + ',' + edge.y1 + ' a 20,20 0 1,1 40,0 a 20,20 0 1,1 -40,0'
              : 'M' + edge.x1 + ',' + edge.y1 + ' L' + edge.x2 + ',' + edge.y2"
            stroke="#333"
            stroke-width="2"
            fill="none"
            :marker-end="edge.isSelfLoop ? '' : 'url(#arrowhead)'"
          />

          <text
            v-for="edge in edges"
            :key="edge.id + '-label'"
            :x="edge.isSelfLoop ? edge.x1 + 20 : (edge.x1 + edge.x2) / 2"
            :y="edge.isSelfLoop ? edge.y1 - 30 : ((edge.y1 + edge.y2) / 2) - 10"
            fill="#333"
            font-size="14"
            text-anchor="middle"
          >
            {{ edge.label }}
          </text>
        </svg>

        <div
          v-for="(item, index) in nodes"
          :key="index"
          :style="{
            position: 'absolute',
            left: item.x + 'px',
            top: item.y + 'px'
          }"
          :class="item.isInitial ? 'initial-state' : 'node'"
          class="workspace-item"
          draggable="true"
          @dragstart="onItemDragStart($event, index)"
        >
          <div
            v-if="item.type === 'Node'"
            :class="{ 'node-circle': !item.isInitial, 'double-circle': item.isInitial }"
          >
            <span>{{ item.name }}</span>
          </div>
        </div>
      </div>
    </div>

    <div class="toolbox">
      <h2>Toolbox</h2>
      <p>Drag items from here:</p>

      <div class="toolbox-item" draggable="true" @dragstart="onDragStart($event, 'SelfLoop')">
        <svg width="60" height="60">
          <path d="M 20,40 C 10,20, 50,20, 40,40" stroke="#333" stroke-width="2" fill="none" />
          <polygon points="37,36 45,40 37,44" fill="#333" />
        </svg>
      </div>

      <div class="toolbox-item" draggable="true" @dragstart="onDragStart($event, 'Node')">
        <div class="node-circle"></div>
      </div>

      <div class="toolbox-item" draggable="true" @dragstart="onDragStart($event, 'InitialNode')">
        <div class="double-circle"></div>
      </div>

      <div class="toolbox-item" draggable="true" @dragstart="onDragStart($event, 'Edge')">
        <svg width="60" height="10">
          <defs>
            <marker id="toolbox-arrowhead" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
              <polygon points="0 0, 10 3.5, 0 7" fill="#333" />
            </marker>
          </defs>
          <line x1="0" y1="5" x2="50" y2="5" stroke="#333" stroke-width="2" marker-end="url(#toolbox-arrowhead)" />
        </svg>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import html2canvas from 'html2canvas';
import { v4 as uuidv4 } from 'uuid';

interface Node {
  id: string;
  type: string;
  x: number;
  y: number;
  name: string;
  isInitial?: boolean;
}

interface Edge {
  id: string;
  fromNodeId: string;
  toNodeId: string;
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  label: string;
  isSelfLoop?: boolean;
}

export default {
  name: 'Home',
  data() {
    return {
      nodes: [] as Node[],
      edges: [] as Edge[],
      hasInitialState: false,
      stateCounter: 0,
    };
  },
  methods: {
    saveAsImage() {
      const workspace = this.$refs.workspace as HTMLElement;
      if (!workspace) return;

      html2canvas(workspace).then((canvas) => {
        const link = document.createElement('a');
        link.download = 'workspace.png';
        link.href = canvas.toDataURL('image/png');
        link.click();
      });
    },

    async saveGraph() {
  try {
    // Get the token and userid from localStorage
    const token = localStorage.getItem('token');
    const userid = localStorage.getItem('userid');

    // Check if token and userid exist
    if (!token || !userid) {
      alert('No user information found. Please log in again.');
      return;
    }

    const graphData = {
  name: 'Untitled Graph',
  description: 'Graph created via the workspace',
  // Remove 'userid' from here
  nodes: this.nodes.map((node) => ({
    nodeid: node.id,
    x: node.x,
    y: node.y,
  })),
  edges: this.edges.map((edge) => ({
    from_nodeid: edge.fromNodeId,
    to_nodeid: edge.toNodeId,
  })),
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
  version: 1,
};

    // Send to the backend
    const response = await fetch('/api/graphs', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`, // Include the token in headers
      },
      body: JSON.stringify(graphData),
    });

    const result = await response.json();

    if (result.isSuccess) {
      alert('Graph saved successfully!');
    } else {
      alert('Failed to save graph.');
    }
  } catch (error) {
    console.error('Error saving graph:', error);
    alert('An error occurred while saving the graph.');
  }
},

    onDragStart(event: DragEvent, type: string) {
      const dataTransfer = event.dataTransfer;
      if (!dataTransfer) return;
      dataTransfer.setData('type', type);

      // Create an empty drag image
      const img = document.createElement('div');
      img.style.width = '0px';
      img.style.height = '0px';
      document.body.appendChild(img);
      dataTransfer.setDragImage(img, 0, 0);
      setTimeout(() => document.body.removeChild(img), 0);
    },

    onItemDragStart(event: DragEvent, index: number) {
      const dataTransfer = event.dataTransfer;
      if (!dataTransfer) return;
      dataTransfer.setData('movingItemIndex', index.toString());
    },

    onDragOver(event: DragEvent) {
      event.preventDefault();
    },

    onDrop(event: DragEvent) {
      event.preventDefault();
      const dataTransfer = event.dataTransfer;
      if (!dataTransfer) return;

      const workspaceRect = (event.currentTarget as HTMLElement).getBoundingClientRect();
      const x = event.clientX - workspaceRect.left;
      const y = event.clientY - workspaceRect.top;

      const movingItemIndex = dataTransfer.getData('movingItemIndex');
      const itemType = dataTransfer.getData('type');

      if (movingItemIndex) {
        const index = parseInt(movingItemIndex);
        if (!isNaN(index) && this.nodes[index]) {
          this.nodes[index].x = x;
          this.nodes[index].y = y;
          this.updateEdges();
        }
        return;
      }

      if (!this.hasInitialState && itemType !== 'InitialNode') {
        alert('Please place an initial state first.');
        return;
      }

      switch (itemType) {
        case 'InitialNode':
          if (!this.hasInitialState) {
            this.nodes.push({
              id: uuidv4(),
              type: 'Node',
              x,
              y,
              name: `q${this.stateCounter++}`,
              isInitial: true,
            });
            this.hasInitialState = true;
          }
          break;

        case 'Node':
          this.nodes.push({
            id: uuidv4(),
            type: itemType,
            x,
            y,
            name: `q${this.stateCounter++}`,
            isInitial: false,
          });
          break;

        case 'Edge':
          if (this.nodes.length >= 2) {
            const fromNode = this.nodes[this.nodes.length - 2];
            const toNode = this.nodes[this.nodes.length - 1];
            const label = prompt("Enter label for this edge (e.g., 'a' for q0 to q1 transition):", '') || '';

            this.edges.push({
              id: uuidv4(),
              fromNodeId: fromNode.id,
              toNodeId: toNode.id,
              x1: fromNode.x + 20,
              y1: fromNode.y + 20,
              x2: toNode.x + 20,
              y2: toNode.y + 20,
              label,
            });
          }
          break;

        case 'SelfLoop':
          const targetNode = this.nodes[this.nodes.length - 1];
          if (targetNode) {
            const label = prompt("Enter label for this self-loop (e.g., 'a'):", '') || '';
            this.edges.push({
              id: uuidv4(),
              fromNodeId: targetNode.id,
              toNodeId: targetNode.id,
              x1: targetNode.x,
              y1: targetNode.y,
              x2: targetNode.x,
              y2: targetNode.y,
              label,
              isSelfLoop: true,
            });
          }
          break;

        default:
          break;
      }
    },

    updateEdges() {
      this.edges.forEach((edge) => {
        const fromNode = this.nodes.find((node) => node.id === edge.fromNodeId);
        const toNode = this.nodes.find((node) => node.id === edge.toNodeId);
        if (fromNode && toNode) {
          const offset = 22;
          edge.x1 = fromNode.x + offset;
          edge.y1 = fromNode.y + offset;
          edge.x2 = toNode.x + offset;
          edge.y2 = toNode.y + offset;
        }
      });
    },
  },
};
</script>

<style scoped>
/* Container styling */
.container {
  display: flex;
  height: 100vh;
  background-color: #f0f5f9;
  font-family: 'Open Sans', sans-serif;
}

/* Left-side (Workspace area) */
.left-side {
  display: flex;
  flex-direction: column;
  width: 80%;
  background-color: #ffffff;
  border-right: 1px solid #ddd;
}

.workspace-header {
  padding: 20px;
  background-color: #ffffff;
  border-bottom: 1px solid #ddd;
}

.workspace-header h2 {
  margin-top: 0;
  color: #333;
  font-size: 24px;
}

.workspace-header p {
  color: #777;
  margin-bottom: 15px;
}

.workspace-header button {
  margin-right: 10px;
  padding: 10px 15px;
  background-color: #42b983;
  color: #ffffff;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 14px;
  transition: background-color 0.3s ease;
}

.workspace-header button:hover {
  background-color: #369f75;
}

.workspace {
  flex: 1;
  background-color: #f9fafc;
  position: relative;
  overflow: hidden;
}

/* Nodes styling */
.workspace-item {
  cursor: grab;
}

.node {
  position: absolute;
  display: flex;
  align-items: center;
  justify-content: center;
}

.node-circle {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background-color: #4facfe;
  border: 2px solid #ffffff;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  color: #ffffff;
  font-weight: bold;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform 0.2s ease;
}

.node-circle:hover {
  transform: scale(1.05);
}

.double-circle {
  position: relative;
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background-color: #4facfe;
  border: 2px solid #ffffff;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  color: #ffffff;
  font-weight: bold;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform 0.2s ease;
}

.double-circle:hover {
  transform: scale(1.05);
}

.double-circle::after {
  content: '';
  position: absolute;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: transparent;
  border: 2px solid #ffffff;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

/* Edges styling */
.edges-layer path {
  stroke: #333;
  stroke-width: 2;
}

.edges-layer text {
  font-size: 14px;
  fill: #333;
}

/* Toolbox styling */
.toolbox {
  width: 20%;
  background-color: #2c3e50;
  padding: 20px;
  color: #ecf0f1;
}

.toolbox h2 {
  color: #ecf0f1;
  margin-top: 0;
  font-size: 24px;
}

.toolbox p {
  color: #bdc3c7;
  margin-bottom: 20px;
}

.toolbox-item {
  cursor: grab;
  margin-bottom: 20px;
  background-color: #34495e;
  padding: 15px;
  border-radius: 8px;
  text-align: center;
  transition: background-color 0.3s ease;
}

.toolbox-item:hover {
  background-color: #3d566e;
}

.toolbox-item .node-circle,
.toolbox-item .double-circle {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: #4facfe;
  border: 2px solid #ffffff;
  margin: 0 auto;
  box-shadow: none;
}

.toolbox-item .double-circle::after {
  width: 30px;
  height: 30px;
  border: 2px solid #ffffff;
}

.toolbox-item svg {
  display: block;
  margin: 0 auto;
}

.toolbox-item svg path,
.toolbox-item svg line,
.toolbox-item svg polygon {
  stroke: #ffffff;
  fill: #ffffff;
}

.toolbox-item svg line {
  stroke-width: 2;
}

/* Scrollbar customization */
.toolbox {
  overflow-y: auto;
}

.toolbox::-webkit-scrollbar {
  width: 6px;
}

.toolbox::-webkit-scrollbar-thumb {
  background-color: #95a5a6;
  border-radius: 3px;
}

/* Responsive design */
@media (max-width: 768px) {
  .container {
    flex-direction: column;
  }

  .left-side,
  .toolbox {
    width: 100%;
  }

  .toolbox {
    order: -1;
  }
}
</style>