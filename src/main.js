import { createApp } from 'vue';
import { createRouter, createWebHistory } from 'vue-router';
import App from './App.vue';
import { useAuth } from './utils/auth';

// Views Principais
import HomeView from './views/HomeView.vue';
import AdminView from './views/AdminView.vue';
import TrackingView from './views/TrackingView.vue';
import LoginView from './views/LoginView.vue'; // Nova view

// Componentes de Gerenciamento
import GerenciarClientes from './components/GerenciarClientes.vue';
import GerenciarEncomendas from './components/GerenciarEncomendas.vue';
import GerenciarRotas from './components/GerenciarRotas.vue';
import GerenciarEntregas from './components/GerenciarEntregas.vue';
import ListarCentros from './components/ListarCentros.vue';

const routes = [
  { path: '/', name: 'Home', component: HomeView },
  { path: '/tracking', name: 'Tracking', component: TrackingView },
  { path: '/login', name: 'Login', component: LoginView }, 
  {
    path: '/admin',
    component: AdminView,
    redirect: '/admin/clientes',
    meta: { requiresAuth: true }, 
    children: [
      { path: 'clientes', name: 'AdminClientes', component: GerenciarClientes },
      { path: 'encomendas', name: 'AdminEncomendas', component: GerenciarEncomendas },
      { path: 'rotas', name: 'AdminRotas', component: GerenciarRotas },
      { path: 'entregas', name: 'AdminEntregas', component: GerenciarEntregas },
      { path: 'centros', name: 'AdminCentros', component: ListarCentros },
    ]
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to, from, next) => {
  const { isAuthenticated, checkSession } = useAuth();
  checkSession();

  const requiresAuth = to.matched.some(record => record.meta.requiresAuth);

  if (requiresAuth && !isAuthenticated.value) {
    next('/login');
  } else {
    next();
  }
});

const app = createApp(App);

app.directive('mask', {
  beforeMount(el) {
    el.addEventListener('input', (event) => {
      let value = event.target.value.replace(/\D/g, '');
      if (value.length <= 11) {
        value = value.replace(/(\d{3})(\d)/, '$1.$2');
        value = value.replace(/(\d{3})(\d)/, '$1.$2');
        value = value.replace(/(\d{3})(\d{1,2})$/, '$1-$2');
      } else {
        value = value.replace(/^(\d{2})(\d)/, '$1.$2');
        value = value.replace(/^(\d{2})\.(\d{3})(\d)/, '$1.$2.$3');
        value = value.replace(/\.(\d{3})(\d)/, '.$1/$2');
        value = value.replace(/(\d{4})(\d)/, '$1-$2');
      }
      event.target.value = value.slice(0, 18);
    });
  }
});

app.use(router);
app.mount('#app');
