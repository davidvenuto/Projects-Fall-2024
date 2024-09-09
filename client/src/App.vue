<template>
    <div id="app">
      <nav>
        <router-link to="/">Home</router-link> |
        <router-link to="/about">About</router-link>
      </nav>
      <router-view />
    </div>
  </template>
  
  <script lang="ts">
  export default {
    name: 'App',
  };
  </script>
  
  <style scoped>
  nav {
    margin-bottom: 20px;
  }
  
  nav a {
    text-decoration: none;
    color: #42b983;
    margin-right: 10px;
  }
  
  nav a:hover {
    color: #35495e;
  }
  </style>
  