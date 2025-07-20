<template>
    <div class="homepage-container">
        <div class="backgrounds">
            <div class="background-azul">
                <img src="/img/casa.svg" alt="casa TrackMAIL" class="casa">
                <img src="/img/carrinho.svg" alt="carrinho TrackMAIL" class="carrinho">
                <img src="/img/Transportadora.svg" alt="Transportadora TrackMAIL" class="transportadora">
            </div>
            <div class="background-branco">
                <span class="rodape-inicial">&copy; 2025 TrackMAIL - by Douglas e Wellington</span>
            </div>
        </div>
        <section>
            <img src="/img/logo.svg" alt="logotipo TrackMAIL" class="logo">
            <span class="slogan">SISTEMA DE LOGÍSTICA ONLINE.</span>
            <div class="area-sessao">
                <router-link to="/admin" class="sessao">
                    <i class="fa-solid fa-pen-to-square"></i>
                    <span>Gestão</span>
                </router-link>
                <router-link to="/tracking" class="sessao">
                    <i class="fa-solid fa-truck-fast"></i>
                    <span>Rastreio</span>
                </router-link>
            </div>
        </section>
    </div>
</template>

<script setup>
</script>

<style scoped>
@import '../assets/css/home.css';
</style>
