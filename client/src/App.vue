<template>
  <div id="app">
    <nav>
      <!-- Left-side navigation links -->
      <div class="nav-left">
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
      </div>

      <div class="nav-right" v-if="username">
        <button @click="logout">LOG OUT</button>
      </div>
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
    const username = ref<string | null>(localStorage.getItem('username'));

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
      logout,
    };
  },
});
</script>

<style scoped>
/* Navbar container */
nav {
  display: flex; /* Use flexbox for layout */
  justify-content: space-between; /* Space between left and right sections */
  align-items: center; /* Center items vertically */
  padding: 15px 30px;
  background: linear-gradient(90deg, #4facfe 0%, #00f2fe 100%); /* Gradient background */
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1); /* Subtle shadow */
}

/* Left-side navigation */
.nav-left {
  display: flex;
  align-items: center;
}

.nav-left a,
.nav-left span {
  text-decoration: none;
  color: #ffffff; /* White text for contrast */
  margin-right: 20px;
  font-weight: 500;
  position: relative;
  transition: color 0.3s ease;
}

.nav-left a::after,
.nav-left span::after {
  content: '';
  position: absolute;
  width: 0%;
  height: 2px;
  background-color: #ffffff;
  left: 0;
  bottom: -5px;
  transition: width 0.3s ease;
}

.nav-left a:hover,
.nav-left span:hover {
  color: #ffeb3b; /* Gold color on hover */
}

.nav-left a:hover::after,
.nav-left span:hover::after {
  width: 100%; /* Underline animation */
}

.nav-left span {
  color: #ffffff; /* Ensure spans have the same color */
}

/* Right-side logout button */
.nav-right button {
  background: #ffffff; /* White background */
  color: #4facfe; /* Primary color text */
  border: none;
  padding: 10px 20px;
  border-radius: 25px;
  cursor: pointer;
  font-size: 16px;
  font-weight: bold;
  transition: background 0.3s ease, color 0.3s ease;
}

.nav-right button:hover {
  background: transparent;
  color: #ffffff;
  border: 2px solid #ffffff;
}

/* Responsive design */
@media (max-width: 768px) {
  nav {
    flex-direction: column;
    align-items: flex-start;
  }

  .nav-right {
    margin-top: 10px;
  }
}
</style>
