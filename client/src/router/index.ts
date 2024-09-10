import { createRouter, createWebHistory } from 'vue-router';

// Import your views (pages)
import Home from '../views/Home.vue';
import About from '../views/About.vue';
import Register from '../views/Register.vue';
import Login from '../views/Login.vue';
import AccountInfo from '../views/AccountInfo.vue';

const routes = [
  { path: '/', component: Home },
  { path: '/about', component: About },
  { path: '/login', component: Login },
  { path: '/register', component: Register },
  { path: '/accountinfo', component: AccountInfo }
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
