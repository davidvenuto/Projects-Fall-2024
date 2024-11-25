<template>
  <div class="container">
    <div class="left-side">
      <WorkspaceHeader
        :actionHistoryLength="actionHistory.length"
        :redoStackLength="redoStack.length"
        @openSaveModal="openSaveModal"
        @saveAsImage="saveAsImage"
        @loadGraph="loadGraph"
        @saveGraphsAsJSON="saveGraphsAsJSON"
        @importJSON="importJSON"
        @clearWorkspace="clearWorkspace"
        @undoLastAction="undoLastAction"
        @redoLastAction="redoLastAction"
      />

      <div
        class="workspace"
        ref="workspace"
        @dragover.prevent="onDragOver"
        @drop="onDrop"
      >
        <svg
          class="edges-layer"
          style="position: absolute; width: 100%; height: 100%; top: 0; left: 0"
        >
          <defs>
            <marker
              id="arrowhead"
              markerWidth="10"
              markerHeight="7"
              refX="20"
              refY="3.5"
              orient="auto"
            >
              <polygon points="0 0, 10 3.5, 0 7" fill="black" />
            </marker>
          </defs>

          <path
            v-for="edge in edges"
            :key="edge.id"
            :d="
              edge.isSelfLoop
                ? 'M ' +
                  edge.x1 +
                  ',' +
                  edge.y1 +
                  ' a 20,20 0 1,1 40,0 a 20,20 0 1,1 -40,0'
                : 'M' + edge.x1 + ',' + edge.y1 + ' L' + edge.x2 + ',' + edge.y2
            "
            stroke="#333"
            stroke-width="2"
            fill="none"
            :marker-end="edge.isSelfLoop ? '' : 'url(#arrowhead)'"
          />

          <text
            v-for="edge in edges"
            :key="edge.id + '-label'"
            :x="edge.isSelfLoop ? edge.x1 + 20 : (edge.x1 + edge.x2) / 2"
            :y="edge.isSelfLoop ? edge.y1 - 30 : (edge.y1 + edge.y2) / 2 - 10"
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
            top: item.y + 'px',
          }"
          :class="item.isInitial ? 'initial-state' : 'node'"
          class="workspace-item"
          draggable="true"
          @dragstart="onItemDragStart($event, index)"
        >
          <div
            v-if="item.type === 'Node'"
            :class="{
              'node-circle': !item.isInitial,
              'double-circle': item.isInitial,
            }"
          >
            <span>{{ item.name }}</span>
          </div>
        </div>
      </div>

      <GraphModal
  :show="showGraphModal"
  :savedGraphs="savedGraphs"
  @close="showGraphModal = false"
  @loadSelectedGraph="handleLoadSelectedGraph"
  @deleteSelectedGraph="handleDeleteSelectedGraph"
/>


      <div v-if="showSaveModal" class="modal-overlay" @click="closeSaveModal">
        <div class="modal-content" @click.stop>
          <h2>Save Graph</h2>
          <form @submit.prevent="submitSaveGraph">
            <div class="form-group">
              <label for="graphTitle">Title</label>
              <input
                type="text"
                id="graphTitle"
                v-model="graphTitle"
                required
              />
            </div>
            <div class="form-group">
              <label for="graphDescription">Description</label>
              <textarea
                id="graphDescription"
                v-model="graphDescription"
                required
              ></textarea>
            </div>
            <button type="submit">Save</button>
            <button type="button" @click="closeSaveModal">Cancel</button>
          </form>
        </div>
      </div>
    </div>
    <Toolbox @dragStart="onDragStart" />
  </div>
</template>

<script lang="ts">
import html2canvas from "html2canvas";
import { v4 as uuidv4 } from "uuid";
import WorkspaceHeader from "@/components/WorkspaceHeader.vue";
import Toolbox from "@/components/Toolbox.vue";
import GraphModal from "@/components/GraphModal.vue";

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
  name: "Home",
  data() {
    return {
      nodes: [] as Node[],
      edges: [] as Edge[],
      hasInitialState: false,
      stateCounter: 0,
      savedGraphs: [] as any[],
      showGraphModal: false,
      selectedGraphId: null as string | null,
      showSaveModal: false,
      graphTitle: "",
      graphDescription: "",
      actionHistory: [] as any[],
      redoStack: [] as any[],
    };
  },
  components: {
    WorkspaceHeader,
    Toolbox,
    GraphModal,
  },
  methods: {
    handleLoadSelectedGraph(selectedGraphId: string) {
    this.selectedGraphId = selectedGraphId;
    this.loadSelectedGraph();
  },

  handleDeleteSelectedGraph(selectedGraphId: string) {
    this.selectedGraphId = selectedGraphId;
    this.deleteSelectedGraph();
  },

    clearWorkspace() {
      const confirmation = confirm(
        "Are you sure you want to clear the workspace? This action cannot be undone and you will lose your current progress."
      );
      if (confirmation) {
        this.nodes = [];
        this.edges = [];
        this.actionHistory = [];
        this.redoStack = [];
        this.hasInitialState = false;
        this.stateCounter = 0;
      }
    },

    undoLastAction() {
      const lastAction = this.actionHistory.pop();
      if (!lastAction) {
        alert("Nothing to undo.");
        return;
      }

      this.redoStack.push(lastAction);

      switch (lastAction.type) {
        case "add_node":
          const nodeIndex = this.nodes.findIndex(
            (node) => node.id === lastAction.node.id
          );
          if (nodeIndex !== -1) {
            if (this.nodes[nodeIndex].isInitial) {
              this.hasInitialState = false;
            }
            this.nodes.splice(nodeIndex, 1);
            this.stateCounter--;
            this.edges = this.edges.filter(
              (edge) =>
                edge.fromNodeId !== lastAction.node.id &&
                edge.toNodeId !== lastAction.node.id
            );
          }
          break;

        case "add_edge":
          const edgeIndex = this.edges.findIndex(
            (edge) => edge.id === lastAction.edge.id
          );
          if (edgeIndex !== -1) {
            this.edges.splice(edgeIndex, 1);
          }
          break;

        case "move_node":
          this.nodes[lastAction.nodeIndex].x = lastAction.previousPosition.x;
          this.nodes[lastAction.nodeIndex].y = lastAction.previousPosition.y;
          this.updateEdges();
          break;

        default:
          break;
      }
    },

    redoLastAction() {
      const lastUndone = this.redoStack.pop();
      if (!lastUndone) {
        alert("Nothing to redo.");
        return;
      }

      this.actionHistory.push(lastUndone);

      switch (lastUndone.type) {
        case "add_node":
          this.nodes.push(lastUndone.node);
          if (lastUndone.node.isInitial) {
            this.hasInitialState = true;
          }
          break;

        case "add_edge":
          this.edges.push(lastUndone.edge);
          break;

        case "move_node":
          this.nodes[lastUndone.nodeIndex].x = lastUndone.newPosition.x;
          this.nodes[lastUndone.nodeIndex].y = lastUndone.newPosition.y;
          this.updateEdges();
          break;

        default:
          break;
      }
    },

    async deleteSelectedGraph() {
      if (!this.selectedGraphId) {
        alert("Please select a graph to delete.");
        return;
      }

      const confirmDeletion = confirm(
        "Are you sure you want to delete the selected graph? This action cannot be undone."
      );
      if (!confirmDeletion) {
        return;
      }

      try {
        const token = localStorage.getItem("token");

        if (!token) {
          alert("No user information found. Please log in again.");
          return;
        }

        const response = await fetch(`/api/graphs/${this.selectedGraphId}`, {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const result = await response.json();

        if (result.isSuccess) {
          alert("Graph deleted successfully!");

          this.savedGraphs = this.savedGraphs.filter(
            (graph) => String(graph.graphid) !== this.selectedGraphId
          );
          this.selectedGraphId = null;
        } else {
          alert("Failed to delete the graph.");
        }
      } catch (error) {
        console.error("Error deleting graph:", error);
        alert("An error occurred while deleting the graph.");
      }
    },
    async importJSON() {
      try {
        const token = localStorage.getItem("token");

        if (!token) {
          alert("No user information found. Please log in again.");
          return;
        }
        const fileInput = document.createElement("input");
        fileInput.type = "file";
        fileInput.accept = ".json";
        fileInput.onchange = async (event: Event) => {
          const input = event.target as HTMLInputElement;
          if (input.files && input.files[0]) {
            const file = input.files[0];
            const text = await file.text();
            let jsonData;

            try {
              jsonData = JSON.parse(text);
            } catch (parseError) {
              console.error("Invalid JSON format:", parseError);
              alert("The selected file contains invalid JSON.");
              return;
            }
            if (Array.isArray(jsonData)) {
              if (jsonData.length === 0) {
                alert("The JSON array is empty.");
                return;
              }
              jsonData = jsonData[0];
            }

            if (!jsonData.nodes || !Array.isArray(jsonData.nodes)) {
              alert('Invalid JSON structure: "nodes" array is missing.');
              return;
            }

            if (!jsonData.edges || !Array.isArray(jsonData.edges)) {
              alert('Invalid JSON structure: "edges" array is missing.');
              return;
            }
            this.nodes = jsonData.nodes.map((nodeData: any) => {
              const nodeId = nodeData.nodeid || uuidv4();

              return {
                id: nodeId,
                type: nodeData.type || "Node",
                x: nodeData.x || 0,
                y: nodeData.y || 0,
                name: nodeData.name || `q${this.stateCounter++}`,
                isInitial: nodeData.isInitial || false,
              };
            });

            this.hasInitialState = this.nodes.some((node) => node.isInitial);
            this.edges = jsonData.edges.map((edgeData: any) => {
              const edgeId = uuidv4();

              const isSelfLoop =
                edgeData.isSelfLoop !== undefined
                  ? edgeData.isSelfLoop
                  : edgeData.from_nodeid === edgeData.to_nodeid;

              return {
                id: edgeId,
                fromNodeId: edgeData.fromNodeid,
                toNodeId: edgeData.to_nodeid,
                x1: 0,
                y1: 0,
                x2: 0,
                y2: 0,
                label: edgeData.label || "",
                isSelfLoop: isSelfLoop,
              };
            });
            this.updateEdges();
            this.selectedGraphId = null;
            alert("Graph imported successfully!");
          }
        };
        fileInput.click();
      } catch (error) {
        console.error("Error importing JSON:", error);
        alert("An error occurred while importing the JSON file.");
      }
    },
    async saveGraphsAsJSON() {
      try {
        const token = localStorage.getItem("token");

        if (!token) {
          alert("No user information found. Please log in again.");
          return;
        }

        const response = await fetch("/api/graphs/user", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const result = await response.json();

        if (result.isSuccess) {
          const dataStr = JSON.stringify(result.data, null, 2);
          const blob = new Blob([dataStr], { type: "application/json" });
          const url = URL.createObjectURL(blob);

          const link = document.createElement("a");
          link.href = url;
          link.download = "my_graphs.json";
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          URL.revokeObjectURL(url);
        } else {
          alert("Failed to load graphs.");
        }
      } catch (error) {
        console.error("Error saving JSON:", error);
        alert("An error occurred while saving the JSON file.");
      }
    },

    async loadGraph() {
      try {
        const confirmation = confirm(
          "Loading a saved graph will discard your current progress. Do you want to continue?"
        );

        if (!confirmation) {
          return;
        }

        const token = localStorage.getItem("token");

        if (!token) {
          alert("No user information found. Please log in again.");
          return;
        }

        const response = await fetch("/api/graphs/user", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const result = await response.json();

        if (result.isSuccess) {
          this.savedGraphs = result.data;
          this.showGraphModal = true;
        } else {
          alert("Failed to load graphs.");
        }
      } catch (error) {
        console.error("Error loading graphs:", error);
        alert("An error occurred while loading graphs.");
      }
    },

    loadSelectedGraph() {
      const graph = this.savedGraphs.find(
        (g) => String(g.graphid) === this.selectedGraphId
      );
      if (graph) {
        this.nodes = [];
        this.edges = [];
        this.stateCounter = graph.nodes.length;
        this.hasInitialState = false;

        graph.nodes.forEach((nodeData: any) => {
          const node: Node = {
            id: nodeData.nodeid,
            type: "Node",
            x: nodeData.x,
            y: nodeData.y,
            name: nodeData.name || `q${this.stateCounter++}`,
            isInitial: nodeData.isInitial || false,
          };
          if (node.isInitial) {
            this.hasInitialState = true;
          }
          this.nodes.push(node);
        });

        graph.edges.forEach((edgeData: any) => {
          const edge: Edge = {
            id: uuidv4(),
            fromNodeId: edgeData.from_nodeid,
            toNodeId: edgeData.to_nodeid,
            x1: 0,
            y1: 0,
            x2: 0,
            y2: 0,
            label: edgeData.label || "",
            isSelfLoop: edgeData.from_nodeid === edgeData.to_nodeid,
          };
          this.edges.push(edge);
        });

        this.updateEdges();

        this.showGraphModal = false;
        this.selectedGraphId = null;
      }
    },

    saveAsImage() {
      const workspace = this.$refs.workspace as HTMLElement;
      if (!workspace) return;

      const filename = prompt(
        "Enter a filename for your image:",
        "workspace.png"
      );
      if (!filename) return;

      html2canvas(workspace).then((canvas) => {
        const link = document.createElement("a");
        link.download = filename.toLowerCase().endsWith(".png")
          ? filename
          : `${filename}.png`;
        link.href = canvas.toDataURL("image/png");
        link.click();
      });
    },

    openSaveModal() {
      this.showSaveModal = true;
    },

    closeSaveModal() {
      this.showSaveModal = false;
      this.graphTitle = "";
      this.graphDescription = "";
    },

    async submitSaveGraph() {
      try {
        const token = localStorage.getItem("token");
        const userid = localStorage.getItem("userid");

        if (!token || !userid) {
          alert("No user information found. Please log in again.");
          return;
        }

        const workspace = this.$refs.workspace as HTMLElement;
        if (!workspace) {
          alert("Workspace not found.");
          return;
        }

        const canvas = await html2canvas(workspace);
        const imageDataUrl = canvas.toDataURL("image/png");

        const graphData = {
          name: this.graphTitle || "Untitled Graph",
          description: this.graphDescription || "No description provided.",
          nodes: this.nodes.map((node) => ({
            nodeid: node.id,
            x: node.x,
            y: node.y,
            isInitial: node.isInitial || false,
            name: node.name,
          })),
          edges: this.edges.map((edge) => ({
            from_nodeid: edge.fromNodeId,
            to_nodeid: edge.toNodeId,
            label: edge.label || "",
            isSelfLoop: edge.isSelfLoop || false,
          })),
          image: imageDataUrl,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          version: 1,
        };

        const response = await fetch("/api/graphs", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(graphData),
        });

        const result = await response.json();

        if (result.isSuccess) {
          alert("Graph saved successfully!");
        } else {
          alert("Failed to save graph.");
        }
      } catch (error) {
        console.error("Error saving graph:", error);
        alert("An error occurred while saving the graph.");
      } finally {
        this.closeSaveModal();
      }
    },

    onDragStart(event: DragEvent, type: string) {
      const dataTransfer = event.dataTransfer;
      if (!dataTransfer) return;
      dataTransfer.setData("type", type);

      const img = document.createElement("div");
      img.style.width = "0px";
      img.style.height = "0px";
      document.body.appendChild(img);
      dataTransfer.setDragImage(img, 0, 0);
      setTimeout(() => document.body.removeChild(img), 0);
    },

    onItemDragStart(event: DragEvent, index: number) {
      const dataTransfer = event.dataTransfer;
      if (!dataTransfer) return;
      dataTransfer.setData("movingItemIndex", index.toString());
    },

    onDragOver(event: DragEvent) {
      event.preventDefault();
    },

    onDrop(event: DragEvent) {
      event.preventDefault();
      this.redoStack = [];
      const dataTransfer = event.dataTransfer;
      if (!dataTransfer) return;

      const workspaceRect = (
        event.currentTarget as HTMLElement
      ).getBoundingClientRect();
      const x = event.clientX - workspaceRect.left;
      const y = event.clientY - workspaceRect.top;

      const movingItemIndex = dataTransfer.getData("movingItemIndex");
      const itemType = dataTransfer.getData("type");

      if (movingItemIndex) {
        const index = parseInt(movingItemIndex);
        if (!isNaN(index) && this.nodes[index]) {
          const previousPosition = {
            x: this.nodes[index].x,
            y: this.nodes[index].y,
          };
          this.nodes[index].x = x;
          this.nodes[index].y = y;
          this.updateEdges();

          this.actionHistory.push({
            type: "move_node",
            nodeIndex: index,
            previousPosition,
          });
        }
        return;
      }

      if (!this.hasInitialState && itemType !== "InitialNode") {
        alert("Please place an initial state first.");
        return;
      }

      switch (itemType) {
        case "InitialNode":
          if (!this.hasInitialState) {
            const newNode = {
              id: uuidv4(),
              type: "Node",
              x,
              y,
              name: `q${this.stateCounter++}`,
              isInitial: true,
            };
            this.nodes.push(newNode);
            this.hasInitialState = true;

            this.actionHistory.push({
              type: "add_node",
              node: newNode,
            });
          }
          break;

        case "Node":
          const newNode = {
            id: uuidv4(),
            type: itemType,
            x,
            y,
            name: `q${this.stateCounter++}`,
            isInitial: false,
          };
          this.nodes.push(newNode);

          this.actionHistory.push({
            type: "add_node",
            node: newNode,
          });
          break;

        case "Edge":
          if (this.nodes.length >= 2) {
            const fromNode = this.nodes[this.nodes.length - 2];
            const toNode = this.nodes[this.nodes.length - 1];
            const label =
              prompt(
                "Enter label for this edge (e.g., 'a' for q0 to q1 transition):",
                ""
              ) || "";

            const newEdge = {
              id: uuidv4(),
              fromNodeId: fromNode.id,
              toNodeId: toNode.id,
              x1: fromNode.x + 20,
              y1: fromNode.y + 20,
              x2: toNode.x + 20,
              y2: toNode.y + 20,
              label,
            };
            this.edges.push(newEdge);

            this.actionHistory.push({
              type: "add_edge",
              edge: newEdge,
            });
          }
          break;

        case "SelfLoop":
          const targetNode = this.nodes[this.nodes.length - 1];
          if (targetNode) {
            const label =
              prompt("Enter label for this self-loop (e.g., 'a'):", "") || "";
            const newEdge = {
              id: uuidv4(),
              fromNodeId: targetNode.id,
              toNodeId: targetNode.id,
              x1: targetNode.x,
              y1: targetNode.y,
              x2: targetNode.x,
              y2: targetNode.y,
              label,
              isSelfLoop: true,
            };
            this.edges.push(newEdge);

            this.actionHistory.push({
              type: "add_edge",
              edge: newEdge,
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
          const offset = 25;
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

<style src="./css/home.css"></style>
