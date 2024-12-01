<template>
  <div v-if="show" class="modal-overlay" @click="$emit('close')">
    <div class="modal-content graph-modal-content" @click.stop>
      <button
        class="modal-close-button"
        @click="$emit('close')"
        aria-label="Close Modal"
      >
        &times;
      </button>
      <h2>Select a Graph to Load or Delete</h2>
      <div class="modal-body">
        <!-- Graph List -->
        <div class="graph-list-container">
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
            </li>
          </ul>
        </div>
        <!-- Image Preview -->
        <div class="image-preview-container" v-if="selectedGraph && selectedGraph.image">
          <img
            :src="selectedGraph.image"
            alt="Graph Preview"
            class="graph-preview-image"
          />
        </div>
      </div>
      <div class="modal-footer">
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
  computed: {
    selectedGraph(): Graph | undefined {
      return this.savedGraphs.find(
        (graph) => String(graph.graphid) === this.selectedGraphId
      );
    },
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
  