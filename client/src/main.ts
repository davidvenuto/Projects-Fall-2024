import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import GoogleSignInPlugin from 'vue3-google-login'; 

const app = createApp(App);

app.use(router);
app.use(GoogleSignInPlugin, {
  clientId: '748775701811-crnrqbspef48i5qtclsjua2qrf1n2kkt.apps.googleusercontent.com', // Replace with your actual client ID
});

app.mount('#app');
