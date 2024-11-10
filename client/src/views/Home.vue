<template>
  <div class="container">
    <div class="left-side">
      <div class="workspace-header">
        <h2 class="workspace-title">Workspace</h2>
        <p>Drop items here</p>
        <button @click="saveAsImage">Save Workspace as Image</button>
      </div>

      <div class="workspace" ref="workspace" @dragover.prevent="onDragOver" @drop="onDrop">
        <svg class="edges-layer" style="position: absolute; width: 100%; height: 100%; top: 0; left: 0;">
          <defs>
            <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="20" refY="3.5" orient="auto">
              <polygon points="0 0, 10 3.5, 0 7" fill="black" />
            </marker>
          </defs>
          <path v-for="edge in edges" :key="edge.id" :d="'M' + edge.x1 + ',' + edge.y1 + ' L' + edge.x2 + ',' + edge.y2"
            stroke="black" stroke-width="2" fill="none" marker-end="url(#arrowhead)" />

          <text v-for="edge in edges" :key="edge.id + '-label'" :x="(edge.x1 + edge.x2) / 2"
            :y="((edge.y1 + edge.y2) / 2) - 10" fill="black" font-size="30" text-anchor="middle">
            {{ edge.label }}
          </text>

        </svg>

        <div v-for="(item, index) in nodes" :key="index" :style="{
          position: 'absolute',
          left: item.x + 'px',
          top: item.y + 'px'
        }" :class="item.isInitial ? 'initial-state' : 'node'" class="workspace-item" draggable="true"
          @dragstart="onItemDragStart($event, index)">
          <div v-if="item.type === 'Node'" :class="{ 'node-circle': !item.isInitial, 'double-circle': item.isInitial }">
            <span>{{ item.name }}</span>
          </div>
        </div>
      </div>
    </div>

    <div class="toolbox">
      <h2>Toolbox</h2>
      <p>Drag items from here:</p>

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
              <polygon points="0 0, 10 3.5, 0 7" fill="black" />
            </marker>
          </defs>
          <line x1="0" y1="5" x2="50" y2="5" stroke="black" stroke-width="2" marker-end="url(#toolbox-arrowhead)" />
        </svg>
      </div>

    </div>
  </div>
</template>

<script lang="ts">
import html2canvas from 'html2canvas';
import { v4 as uuidv4 } from 'uuid';

export default {
  name: 'Home',
  data() {
    return {
      nodes: [] as { id: string; type: string; x: number; y: number; name: string; isInitial?: boolean }[],
      edges: [] as {
        id: string;
        fromNodeId: string;
        toNodeId: string;
        x1: number;
        y1: number;
        x2: number;
        y2: number;
        label: string; 
      }[],
      hasInitialState: false,
      stateCounter: 0
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

    onDragStart(event: DragEvent, type: string) {
      const dataTransfer = event.dataTransfer;
      if (!dataTransfer) return;
      dataTransfer.setData('type', type);
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
      if (movingItemIndex !== '') {
        const index = parseInt(movingItemIndex);
        if (!isNaN(index) && this.nodes[index]) {
          this.nodes[index].x = x;
          this.nodes[index].y = y;
          this.updateEdges();
        }
      } else {
        const itemType = dataTransfer.getData('type');

        if (!this.hasInitialState && itemType !== 'InitialNode') {
          alert('Please place an initial state first.');
          return;
        }

        if (itemType === 'InitialNode' && !this.hasInitialState) {
          this.nodes.push({
            id: uuidv4(),
            type: 'Node',
            x,
            y,
            name: `q${this.stateCounter++}`,
            isInitial: true
          });
          this.hasInitialState = true;
        } else if (this.hasInitialState && itemType === 'Node') {
          this.nodes.push({
            id: uuidv4(),
            type: itemType,
            x,
            y,
            name: `q${this.stateCounter++}`,
            isInitial: false
          });
        } else if (this.hasInitialState && itemType === 'Edge' && this.nodes.length >= 2) {
          const fromNode = this.nodes[this.nodes.length - 2];
          const toNode = this.nodes[this.nodes.length - 1];
          if (fromNode && toNode) {
            const label = prompt("Enter label for this edge (e.g., 'a' for q0 to q1 transition):", "");

            this.edges.push({
              id: uuidv4(),
              fromNodeId: fromNode.id,
              toNodeId: toNode.id,
              x1: fromNode.x + 20,
              y1: fromNode.y + 20,
              x2: toNode.x + 20,
              y2: toNode.y + 20,
              label: label || '' 
            });
          }
        }
      }
    },

    updateEdges() {
      this.edges.forEach(edge => {
        const fromNode = this.nodes.find(node => node.id === edge.fromNodeId);
        const toNode = this.nodes.find(node => node.id === edge.toNodeId);
        if (fromNode && toNode) {
          const offset = 22;
          edge.x1 = fromNode.x + offset;
          edge.y1 = fromNode.y + offset;
          edge.x2 = toNode.x + offset;
          edge.y2 = toNode.y + offset;
        }
      });
    }
  },
};
</script>

<style scoped>
.container {
  display: flex;
  height: 100vh;
}

.left-side {
  display: flex;
  flex-direction: column;
  width: 80%;
}

.workspace-header {
  padding: 20px;
  background-color: #ffffff;
  border-bottom: 1px solid #ddd;
}

.workspace {
  flex: 1;
  background-color: #ffffff;
  border: 1px solid #ddd;
  position: relative;
}

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
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: #42b983;
  border: 2px solid #333;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  color: white;
}

.double-circle {
  position: relative;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: #42b983;
  border: 2px solid #333;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  color: white;
}

.double-circle::after {
  content: "";
  position: absolute;
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background-color: transparent;
  border: 2px solid #333;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

.edge-line {
  width: 60px;
  height: 2px;
  background-color: #333;
  margin-top: 20px;
}

.toolbox {
  width: 20%;
  background-color: #f0f0f0;
  padding: 20px;
}

.toolbox-item {
  cursor: grab;
  margin-bottom: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.toolbox-item .node-circle {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: #42b983;
  border: 2px solid #333;
}

.toolbox-item .double-circle {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: #42b983;
  border: 2px solid #333;
  position: relative;
}

.toolbox-item .double-circle::after {
  content: "";
  position: absolute;
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background-color: transparent;
  border: 2px solid #333;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

.toolbox-item .edge-line {
  width: 60px;
  height: 2px;
  background-color: #333;
}
</style>
