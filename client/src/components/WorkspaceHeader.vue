<template>
    <div class="workspace-header">
      <h2 class="workspace-title">Workspace</h2>
      <p>Drop items here</p>
  
      <!-- File Operations Group -->
      <div class="button-group file-operations">
        <button @click="$emit('openSaveModal')">Save Graph</button>
        <button @click="$emit('saveAsImage')">Save as Image</button>
        <button @click="$emit('loadGraph')">Manage Graphs</button>
        <button @click="$emit('saveGraphsAsJSON')">Export Graph</button>
        <button @click="$emit('importJSON')">Import Graph</button>
        <button @click="$emit('clearWorkspace')">Clear Workspace</button>
      </div>
  
      <!-- Edit Operations Group -->
      <div class="button-group edit-operations">
        <button @click="$emit('undoLastAction')" :disabled="actionHistoryLength === 0">Undo</button>
        <button @click="$emit('redoLastAction')" :disabled="redoStackLength === 0">Redo</button>
      </div>
    </div>
  </template>
  
  <script lang="ts">
  export default {
    name: 'WorkspaceHeader',
    props: {
      actionHistoryLength: {
        type: Number,
        required: true,
      },
      redoStackLength: {
        type: Number,
        required: true,
      },
    },
  };
  </script>
  
  <style src="./css/workspace-header.css"></style>
  ```