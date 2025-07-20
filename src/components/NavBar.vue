<template>
    <nav class="navbar">
        <div class="area-logo">
            <img src="/img/logo.svg" alt="TrackMAIL Logo" class="logo">
        </div>
        <div class="nav-links">
            <router-link to="/" class="nav-link">Voltar ao Inicio</router-link>
            <button v-if="isAuthenticated" @click="handleLogout" class="nav-link btn-logout">Sair</button>
        </div>
    </nav>
</template>

<script setup>

import { useAuth } from '../utils/auth';
const { isAuthenticated, logout } = useAuth();
const handleLogout = () => {
    logout();
};
</script>

<style scoped>
.navbar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    background-color: #0090FF;
    padding: 20px 15%;
}

.logo {
    width: 180px;
}

.nav-links {
    display: flex;
    gap: 15px;
    align-items: center;
}

.nav-link {
    color: white;
    padding: 10px 20px;
    border: 1px solid #FFFFFF;
    border-radius: 10px;
    transition: all 0.2s ease-in-out;
    background-color: transparent;
    text-decoration: none;
    font-family: 'Poppins', sans-serif;
    font-size: 1em;
}

.nav-link:hover {
    transform: scale(1.02);
    background-color: rgba(255, 255, 255, 0.1);
    box-shadow: 1px 1px 5px rgba(0, 0, 0, 0.2);
}

.btn-logout {
    cursor: pointer;
    background-color: var(--error-color);
    border-color: var(--error-color);
}
</style>
