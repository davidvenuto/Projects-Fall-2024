<template>
  <div class="login-container">
    <div class="login-card">
      <h1>Welcome Back!</h1>
      <p>Please log in to continue</p>
      <form @submit.prevent="handleLogin" class="login-form">
        <div class="form-group">
          <label for="email">Email</label>
          <input type="email" id="email" v-model="email" placeholder="Enter your email" required />
        </div>
        <div class="form-group">
          <label for="password">Password</label>
          <input type="password" id="password" v-model="password" placeholder="Enter your password" required />
        </div>
        <button type="submit" class="login-button">Login</button>
      </form>
      <div v-if="error" class="error-message">{{ error }}</div>
    </div>

    <!-- Modal for login success -->
    <div v-if="showModal" class="modal-overlay" @click="closeModal">
      <div class="modal-content" @click.stop>
        <h2>Login Successful</h2>
        <p>You have been logged in successfully!</p>
        <button @click="closeModal" class="close-button">Close</button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, inject, Ref } from 'vue';
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
        console.log('Attempting login...');
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

        // Log the data received from the backend
        console.log('Login response data:', data);
        console.log('data.user:', data.user);

        // Store the token, username, and userid in localStorage
        localStorage.setItem('token', data.token);
        localStorage.setItem('username', data.user.username);
        localStorage.setItem('userid', data.user.id);

        // Update the injected username to make it reactive immediately
        if (username) username.value = data.user.username;

        error.value = '';
        showModal.value = true;
        router.push({ name: 'Home' });
      } catch (err) {
        const errorMessage = (err as Error).message;
        error.value = errorMessage;
        console.error('Error logging in:', errorMessage);
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
/* Background styling */
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background: linear-gradient(135deg, #e0f7fa, #80deea);
  font-family: 'Open Sans', sans-serif;
}

/* Card styling */
.login-card {
  background-color: #ffffff;
  padding: 40px 30px;
  border-radius: 10px;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
  text-align: center;
}

.login-card h1 {
  margin-bottom: 10px;
  color: #333;
  font-size: 28px;
}

.login-card p {
  margin-bottom: 30px;
  color: #777;
  font-size: 16px;
}

/* Form styling */
.login-form .form-group {
  margin-bottom: 20px;
  text-align: left;
}

.login-form label {
  display: block;
  margin-bottom: 8px;
  color: #555;
  font-weight: 600;
}

.login-form input {
  width: 100%;
  padding: 12px 15px;
  border: 1px solid #ccc;
  border-radius: 5px;
  font-size: 16px;
}

.login-form input::placeholder {
  color: #aaa;
}

.login-form input:focus {
  border-color: #42b983;
  outline: none;
  box-shadow: 0 0 5px rgba(66, 185, 131, 0.5);
}

/* Button styling */
.login-button {
  width: 100%;
  padding: 15px;
  background-color: #42b983;
  color: #fff;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 18px;
  font-weight: bold;
  margin-top: 10px;
  transition: background-color 0.3s ease;
}

.login-button:hover {
  background-color: #369f75;
}

/* Error message styling */
.error-message {
  color: red;
  margin-top: 15px;
  font-size: 16px;
}

/* Modal styles */
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
  padding: 30px 40px;
  border-radius: 8px;
  text-align: center;
}

.modal-content h2 {
  margin-bottom: 20px;
  color: #42b983;
  font-size: 24px;
}

.modal-content p {
  margin-bottom: 25px;
  color: #555;
  font-size: 18px;
}

.close-button {
  padding: 12px 20px;
  background-color: #42b983;
  color: #fff;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 16px;
}

.close-button:hover {
  background-color: #369f75;
}

/* Responsive design */
@media (max-width: 480px) {
  .login-card {
    padding: 30px 20px;
  }

  .login-card h1 {
    font-size: 24px;
  }

  .login-card p {
    font-size: 14px;
  }

  .login-button,
  .close-button {
    font-size: 16px;
  }
}
</style>
