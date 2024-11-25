<template>
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
  </template>
  
  <script lang="ts">
  export default {
    name: 'Toolbox',
    methods: {
      onDragStart(event: DragEvent, type: string) {
        this.$emit('dragStart', event, type);
      },
    },
  };
  </script>
  
  <style src="./css/toolbox.css"></style>
  ```
  