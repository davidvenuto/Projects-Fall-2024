<template>
  <div class="login-container">
    <h1>Login Page</h1>
    <p>Welcome to the Login page!</p>
    <form @submit.prevent="handleLogin">
      <div class="form-group">
        <label for="email">Email:</label>
        <input type="email" id="email" v-model="email" required />
      </div>
      <div class="form-group">
        <label for="password">Password:</label>
        <input type="password" id="password" v-model="password" required />
      </div>
      <button type="submit">Login</button>
    </form>
    <div v-if="error" class="error">{{ error }}</div>

    <div v-if="showModal" class="modal-overlay" @click="closeModal">
      <div class="modal-content" @click.stop>
        <h2>Login Successful</h2>
        <p>You have been logged in successfully!</p>
        <button @click="closeModal">Close</button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, inject, Ref } from 'vue'; // Import Ref from 'vue'
import { useRouter } from 'vue-router';

export default defineComponent({
  name: 'Login',
  setup() {
    const router = useRouter();
    const email = ref('');
    const password = ref('');
    const error = ref('');
    const showModal = ref(false);

    // Inject the provided username with an explicit type
    const username = inject<Ref<string | null>>('username');

    const handleLogin = async () => {
      try {
        console.log("Attempting login...");
        const response = await fetch('/api/users/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ email: email.value, password: password.value })
        });

        if (!response.ok) {
          throw new Error('Invalid email or password');
        }

        const data = await response.json();
        localStorage.setItem('token', data.token);
        localStorage.setItem('username', data.user.username);

        // Update the injected username to make it reactive immediately
        if (username) username.value = data.user.username;

        error.value = '';
        showModal.value = true;
        router.push({ name: 'Home' });
      } catch (err) {
        const errorMessage = (err as Error).message;
        error.value = errorMessage;
        console.error("Error logging in:", errorMessage);
      }
    };

    const closeModal = () => {
      showModal.value = false;
    };

    return {
      email,
      password,
      handleLogin,
      error,
      showModal,
      closeModal
    };
  }
});
</script>




<style scoped>
.login-container {
  max-width: 400px;
  margin: 0 auto;
  padding: 20px;
  border: 1px solid #ccc;
  border-radius: 5px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
}

h1 {
  color: #42b983;
}

.form-group {
  margin-bottom: 15px;
}

label {
  display: block;
  margin-bottom: 5px;
}

input {
  width: 100%;
  padding: 8px;
  box-sizing: border-box;
}

button {
  background-color: #42b983;
  color: white;
  border: none;
  padding: 10px 15px;
  cursor: pointer;
}

button:hover {
  background-color: #369f6b;
}

.error {
  color: red;
}

.success {
  color: green;
}

/* Modal Styles */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
}

.modal-content {
  background-color: #fff;
  padding: 20px;
  border-radius: 5px;
}

.modal-content h2 {
  margin-top: 0;
}

.modal-content button {
  margin-top: 15px;
}
</style>