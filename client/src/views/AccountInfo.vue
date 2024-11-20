<template>
  <div class="account-info-container">
    <h1>Account Information</h1>
    
    <div v-if="loading" class="loading">Loading...</div>
    
    <div v-else-if="error" class="error-message">{{ error }}</div>
    
    <div v-else class="account-details">
      <p><strong>Full Name:</strong> {{ user?.fullname }}</p>
      <p><strong>Username:</strong> {{ user?.username }}</p>
      <p><strong>Email:</strong> {{ user?.email }}</p>
      
      <button @click="handleLogout" class="logout-button">Logout</button>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';

interface User {
  userid: number;
  fullname: string;
  email: string;
  username: string;
  isAdmin: boolean;
}

export default defineComponent({
  name: 'AccountInfo',
  setup() {
    const router = useRouter();
    const user = ref<User | null>(null);
    const loading = ref<boolean>(false);
    const error = ref<string>('');
    
    const fetchUserInfo = async () => {
      loading.value = true;
      error.value = '';
      
      const token = localStorage.getItem('token');
      const userid = localStorage.getItem('userid');
      
      if (!token || !userid) {
        error.value = 'Authentication token or user ID not found. Please log in again.';
        loading.value = false;
        router.push({ name: 'Login' });
        return;
      }
      
      try {
        const response = await fetch(`/api/users/${userid}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        });
        
        if (response.status === 401) {
          error.value = 'Unauthorized access. Please log in again.';
          router.push({ name: 'Login' });
          return;
        }
        
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Failed to fetch user information.');
        }
        
        const data = await response.json();
        user.value = data.data; // Adjust based on your API response structure
      } catch (err) {
        error.value = (err as Error).message;
        console.error('Error fetching user info:', err);
      } finally {
        loading.value = false;
      }
    };
    
    const handleLogout = () => {
      // Clear authentication data from localStorage
      localStorage.removeItem('token');
      localStorage.removeItem('username');
      localStorage.removeItem('userid');
      
      // Redirect to login page
      router.push({ name: 'Login' });
    };
    
    onMounted(() => {
      fetchUserInfo();
    });
    
    return {
      user,
      loading,
      error,
      handleLogout
    };
  }
});
</script>

<style scoped>
.account-info-container {
  max-width: 500px;
  margin: 50px auto;
  padding: 30px 20px;
  background-color: #ffffff;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  font-family: 'Open Sans', sans-serif;
}

.account-info-container h1 {
  text-align: center;
  margin-bottom: 25px;
  color: #333333;
}

.loading {
  text-align: center;
  font-size: 18px;
  color: #555555;
}

.error-message {
  text-align: center;
  color: red;
  font-size: 18px;
  margin-bottom: 20px;
}

.account-details {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.account-details p {
  font-size: 18px;
  color: #555555;
}

.logout-button {
  align-self: center;
  padding: 10px 20px;
  background-color: #e53935;
  color: #ffffff;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 16px;
  margin-top: 20px;
  transition: background-color 0.3s ease;
}

.logout-button:hover {
  background-color: #c62828;
}

/* Responsive Design */
@media (max-width: 600px) {
  .account-info-container {
    margin: 20px;
    padding: 20px 15px;
  }
  
  .logout-button {
    width: 100%;
  }
}
</style>
