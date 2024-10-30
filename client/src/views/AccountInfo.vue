<template>
  <div>
    <h1>Account Information</h1>
    <div v-if="user">
      <p>Full Name: {{ user.fullname }}</p>
      <p>Email: {{ user.email }}</p>
      <p>Username: {{ user.username }}</p>
      <p>Admin: {{ user.isAdmin ? 'Yes' : 'No' }}</p>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

interface User {
  userid: number;
  fullname: string;
  email: string;
  username: string;
  password: string;
  isAdmin: boolean;
}

export default defineComponent({
  name: 'AccountInfo',
  data() {
    return {
      user: null as User | null
    };
  },
  async created() {
    try {
      const response = await fetch('/api/users/0'); // Replace with dynamic user ID
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      this.user = data.data;
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  }
});
</script>