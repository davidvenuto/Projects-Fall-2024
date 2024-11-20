<template>
  <div class="register-container">
    <h1>Register</h1>
    <form @submit.prevent="register" class="register-form">
      <div class="form-group">
        <label for="fullname">Full Name</label>
        <input v-model="user.fullname" id="fullname" placeholder="Enter your full name" required />
      </div>
      <div class="form-group">
        <label for="email">Email</label>
        <input v-model="user.email" id="email" type="email" placeholder="Enter your email" required />
      </div>
      <div class="form-group">
        <label for="username">Username</label>
        <input v-model="user.username" id="username" placeholder="Choose a username" required />
      </div>
      <div class="form-group">
        <label for="password">Password</label>
        <input v-model="user.password" id="password" type="password" placeholder="Create a password" required />
      </div>
      <button type="submit" class="register-button">Register</button>
    </form>
  </div>
</template>

<script lang="ts">
export default {
  name: 'Register',
  data() {
    return {
      user: {
        fullname: '',
        email: '',
        username: '',
        password: '',
        isAdmin: false
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
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
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
.register-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 40px 20px;
  background-color: #f0f5f9;
  border-radius: 8px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
}

.register-container h1 {
  color: #333;
  margin-bottom: 30px;
  font-size: 32px;
}

.register-form {
  width: 100%;
  max-width: 400px;
}

.form-group {
  margin-bottom: 20px;
}

.form-group label {
  font-weight: 600;
  margin-bottom: 8px;
  display: block;
  color: #555;
}

.form-group input {
  width: 100%;
  padding: 12px 15px;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 16px;
}

.form-group input::placeholder {
  color: #aaa;
}

.form-group input:focus {
  border-color: #18aed3;
  outline: none;
  box-shadow: 0 0 5px rgba(28, 221, 255, 0.5);
}

.register-button {
  width: 100%;
  padding: 15px;
  background-color: #1dbfff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 18px;
  font-weight: bold;
  transition: background-color 0.3s ease;
}

.register-button:hover {
  background-color: #227bff;
}

@media (max-width: 480px) {
  .register-container {
    padding: 30px 15px;
  }

  .register-container h1 {
    font-size: 28px;
  }
}

body {
  background: linear-gradient(to right, #e0f7fa, #80deea);
  font-family: 'Open Sans', sans-serif;
}
</style>
