<template>
  <div>
    <form @submit.prevent="register">
      <input v-model="user.name" placeholder="Name" required />
      <input v-model="user.email" placeholder="Email" required />
      <input v-model="user.password" type="password" placeholder="Password" required />
      <button type="submit">Register</button>
    </form>
  </div>
</template>

<script lang="ts">
export default {
  name: 'Register',
  data() {
    return {
      user: {
        name: '',
        email: '',
        password: ''
      }
    };
  },
  methods: {
    async register() {
      try {
        const response = await fetch('/api/users', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(this.user)
        });
        const data = await response.json();
        console.log('User registered:', data);
      } catch (error) {
        console.error('Error registering user:', error);
      }
    }
  }
};
</script>

<style scoped>
h1 {
  color: #42b983;
}
form {
  display: flex;
  flex-direction: column;
  max-width: 300px;
  margin: auto;
}
div {
  margin-bottom: 10px;
}
label {
  margin-bottom: 5px;
}
input {
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
}
button {
  padding: 10px;
  background-color: #42b983;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}
button:hover {
  background-color: #369f75;
}
.error {
  color: red;
  text-align: center;
}
.success {
  color: green;
  text-align: center;
}
</style>
