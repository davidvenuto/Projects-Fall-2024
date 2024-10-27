<template>
  <div>
    <h1>Register Page</h1>
    <p>Welcome to the Register page!</p>
    <form @submit.prevent="register">
      <div>
        <label for="username">Username:</label>
        <input type="text" id="username" v-model="form.username" required />
      </div>
      <div>
        <label for="email">Email:</label>
        <input type="email" id="email" v-model="form.email" required />
      </div>
      <div>
        <label for="password">Password:</label>
        <input type="password" id="password" v-model="form.password" required />
      </div>
      <button type="submit">Register</button>
    </form>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';

export default defineComponent({
  name: 'Register',
  setup() {
    const form = ref({
      username: '',
      email: '',
      password: ''
    });

    const register = () => {
      // Add your registration logic here
      console.log('Form submitted:', form.value);
    };

    return {
      form,
      register
    };
  }
});
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
</style>