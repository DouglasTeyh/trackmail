<template>
  <div id="app-container">
    <nav-bar v-if="showLayout" />

    <main :class="{ 'is-home': !showLayout }">
      <router-view />
    </main>

    <app-footer v-if="showLayout" />
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import NavBar from './components/NavBar.vue';
import AppFooter from './components/AppFooter.vue';

import './assets/css/style.css';

const route = useRoute();

const showLayout = computed(() => {
  return route.name !== 'Home';
});
</script>
