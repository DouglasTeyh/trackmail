<template>
  <div class="admin-dashboard">
    <aside class="sidebar">
      <h2>Admin</h2>
      <ul>
        <li><router-link to="/admin/clientes">Gerenciar Clientes</router-link></li>
        <li><router-link to="/admin/encomendas">Gerenciar Encomendas</router-link></li>
        <li><router-link to="/admin/rotas">Gerenciar Rotas</router-link></li>
        <li><router-link to="/admin/entregas">Gerenciar Entregas</router-link></li>
        <li><router-link to="/admin/centros">Listar Centros</router-link></li>
      </ul>
    </aside>
    <div class="content-area">
      <router-view v-slot="{ Component }">
        <transition name="fade" mode="out-in">
          <component :is="Component" />
        </transition>
      </router-view>
    </div>
  </div>
</template>

<script setup>
</script>

<style scoped>
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.1s ease-in-out;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
}
</style>
