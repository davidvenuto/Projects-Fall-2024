<template>
  <div>
    <h1>Register Page</h1>
    <p>Welcome to the Register page!</p>
    <form @submit.prevent="register">
      <div>
        <label for="fullname">Full Name:</label>
        <input type="text" id="fullname" v-model="form.fullname" required />
      </div>
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
    <p v-if="errorMessage" class="error">{{ errorMessage }}</p>
    <p v-if="successMessage" class="success">{{ successMessage }}</p>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';

export default defineComponent({
  name: 'Register',
  setup() {
    const form = ref({
      fullname: '',
      username: '',
      email: '',
      password: ''
    });

    const errorMessage = ref('');
    const successMessage = ref('');

    const register = async () => {
  errorMessage.value = '';
  successMessage.value = '';

  try {
    const response = await fetch('/api/users', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        fullname: form.value.fullname,
        username: form.value.username,
        email: form.value.email,
        password: form.value.password,
        isAdmin: false // Set isAdmin to false by default
      })
    });

    const textResponse = await response.text(); // Read response as text
    console.log('Raw response:', textResponse);

    if (!response.ok) {
      // Try to parse error message if possible
      let errorData;
      try {
        errorData = JSON.parse(textResponse);
      } catch (e) {
        throw new Error('Registration failed with status ' + response.status);
      }
      throw new Error(errorData.message || 'Registration failed');
    }

    const data = JSON.parse(textResponse); // Parse the text as JSON
    successMessage.value = 'Registration successful!';
    console.log('User registered:', data);
    // Reset the form fields
    form.value.fullname = '';
    form.value.username = '';
    form.value.email = '';
    form.value.password = '';
  } catch (error: any) {
    errorMessage.value = error.message;
    console.error('Error:', error);
  }
};


    return {
      form,
      register,
      errorMessage,
      successMessage
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
.error {
  color: red;
  text-align: center;
}
.success {
  color: green;
  text-align: center;
}
</style>
