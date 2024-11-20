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

        console.log('Login response data:', data);
        console.log('data.user:', data.user);

        localStorage.setItem('token', data.token);
        localStorage.setItem('username', data.user.username);
        localStorage.setItem('userid', data.user.id);

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
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background: linear-gradient(135deg, #e0f7fa, #80deea);
  font-family: 'Open Sans', sans-serif;
}

.login-card {
  max-width: 400px; /* Added to set a maximum width */
  width: 100%; /* Ensures the card takes full width up to max-width */
  background-color: #ffffff;
  padding: 60px 50px; /* Increased padding for more space */
  border-radius: 15px; /* Slightly more rounded corners */
  box-shadow: 0 12px 30px rgba(0, 0, 0, 0.15); /* Enhanced shadow for depth */
  text-align: center;
  margin: 20px; /* Added margin for spacing on smaller screens */
  transition: transform 0.3s;
}

.login-card:hover {
  transform: translateY(-5px); /* Subtle lift on hover */
}

.login-card h1 {
  margin-bottom: 15px;
  color: #333;
  font-size: 32px; /* Increased font size */
}

.login-card p {
  margin-bottom: 35px;
  color: #777;
  font-size: 18px; /* Increased font size */
}

/* Form styling */
.login-form .form-group {
  margin-bottom: 25px;
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
  padding: 15px 20px; /* Increased padding */
  border: 1px solid #ccc;
  border-radius: 5px;
  font-size: 18px; /* Increased font size */
}

.login-form input::placeholder {
  color: #aaa;
}

.login-form input:focus {
  border-color: #0b9eff;
  outline: none;
  box-shadow: 0 0 5px rgba(11, 158, 255, 0.5);
}

/* Button styling */
.login-button {
  width: 100%;
  padding: 18px; /* Increased padding */
  background-color: #128cff;
  color: #fff;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 20px; /* Increased font size */
  font-weight: bold;
  margin-top: 15px;
  transition: background-color 0.3s ease, transform 0.3s;
}

.login-button:hover {
  background-color: #0084ff;
  transform: translateY(-2px);
}

/* Error message styling */
.error-message {
  color: red;
  margin-top: 20px;
  font-size: 18px; /* Increased font size */
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
    padding: 40px 30px; /* Adjusted padding for small screens */
    margin: 20px;
  }

  .login-card h1 {
    font-size: 28px;
  }

  .login-card p {
    font-size: 16px;
  }

  .login-form input {
    font-size: 16px;
  }

  .login-button {
    font-size: 18px;
    padding: 15px;
  }
}

</style>
