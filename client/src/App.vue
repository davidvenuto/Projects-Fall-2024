<template>
    <div id="app">
      <nav>
        <router-link to="/">Home</router-link>
        
        <span v-if="username || !username">
          | <router-link to="/about">About</router-link>
        </span>
        
        <span v-if="!username">
          | <router-link to="/register">Register</router-link>
        </span>
        
        <span v-if="!username">
          | <router-link to="/login">Login</router-link>
        </span>
        
        <span v-if="username">
          | <router-link to="/accountinfo">Account Info</router-link>
        </span>
        
        <span v-if="username">
          | Welcome, {{ username }}!
        </span>
        
        <span v-if="username">
          | <button @click="logout">Logout</button>
        </span>
      </nav>
      <router-view />
    </div>
  </template>
  
  
  <script lang="ts">
import { defineComponent, ref, onMounted, provide } from 'vue';
import { useRouter } from 'vue-router';

export default defineComponent({
  name: 'App',
  setup() {
    const router = useRouter();
    const username = ref<string | null>(localStorage.getItem('username')); // initialize from localStorage

    // Provide username to make it reactive across the app
    provide('username', username);

    const checkUserSession = () => {
      const storedUsername = localStorage.getItem('username');
      username.value = storedUsername;
    };

    const logout = () => {
      localStorage.removeItem('token');
      localStorage.removeItem('username');
      username.value = null;
      router.push('/login');
    };

    onMounted(() => {
      checkUserSession();
    });

    return {
      username,
      logout
    };
  }
});
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
  
  button {
    background: none;
    border: none;
    color: #42b983;
    cursor: pointer;
    text-decoration: underline;
    margin-left: 10px;
  }
  
  button:hover {
    color: #35495e;
  }
  </style>
  