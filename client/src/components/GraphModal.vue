<template>
    <div v-if="show" class="modal-overlay" @click="$emit('close')">
      <div class="modal-content" @click.stop>
        <button
          class="modal-close-button"
          @click="$emit('close')"
          aria-label="Close Modal"
        >
          &times;
        </button>
        <h2>Select a Graph to Load or Delete</h2>
        <ul class="graph-list">
          <li v-for="graph in savedGraphs" :key="graph.graphid">
            <label>
              <input
                type="radio"
                :value="String(graph.graphid)"
                v-model="selectedGraphId"
              />
              {{ graph.name }} - {{ graph.description }}
            </label>
            <!-- Image Preview -->
            <div v-if="selectedGraphId === String(graph.graphid)">
              <img
                :src="graph.image"
                alt="Graph Preview"
                class="graph-preview-image"
              />
            </div>
          </li>
        </ul>
        <button
          @click="loadSelectedGraph"
          :disabled="selectedGraphId === null"
        >
          Load Graph
        </button>
        <button
          @click="deleteSelectedGraph"
          :disabled="selectedGraphId === null"
          class="delete-button"
        >
          Delete Graph
        </button>
        <button @click="$emit('close')">Cancel</button>
      </div>
    </div>
  </template>
  
  <script lang="ts">
  import { defineComponent, PropType } from 'vue';
  
  interface Node {
    nodeid: string;
    x: number;
    y: number;
    isInitial: boolean;
    name: string;
  }
  
  interface Edge {
    from_nodeid: string;
    to_nodeid: string;
    label: string;
    isSelfLoop: boolean;
  }
  
  interface Graph {
    graphid: number;
    name: string;
    description: string;
    image: string;
    nodes: Node[];
    edges: Edge[];
    userid: number;
    created_at: string;
    updated_at: string;
    version: number;
  }
  
  export default defineComponent({
    name: 'GraphModal',
    props: {
      show: {
        type: Boolean,
        required: true,
      },
      savedGraphs: {
        type: Array as PropType<Graph[]>,
        required: true,
      },
    },
    data() {
      return {
        selectedGraphId: null as string | null,
      };
    },
    methods: {
      loadSelectedGraph() {
        this.$emit('loadSelectedGraph', this.selectedGraphId);
      },
      deleteSelectedGraph() {
        this.$emit('deleteSelectedGraph', this.selectedGraphId);
      },
    },
  });
  </script>
  
  <style scoped src="./css/graph-modal.css"></style>
  