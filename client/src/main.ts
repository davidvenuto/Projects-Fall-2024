import { createApp } from 'vue';
import App from './App.vue';
import router from './router';  // Import the router

// Use the router in the Vue app
const app = createApp(App);
app.use(router);
app.mount('#app');
