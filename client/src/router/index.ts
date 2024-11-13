import { createRouter, createWebHistory } from 'vue-router';
import Home from '../views/Home.vue';
import About from '../views/About.vue';
import Register from '../views/Register.vue';
import Login from '../views/Login.vue';
import AccountInfo from '../views/AccountInfo.vue';

const routes = [
  { path: '/', name: 'Home', component: Home },
  { path: '/about', name: 'About', component: About },
  { path: '/login', name: 'Login', component: Login },
  { path: '/register', name: 'Register', component: Register },
  { path: '/accountinfo', name: 'AccountInfo', component: AccountInfo }
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
