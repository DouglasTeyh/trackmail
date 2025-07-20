<template>
    <div class="login-container">
        <div class="login-card content-box">
            <img src="/img/login.png" alt="TrackMAIL Logo" class="logo">
            <h2>Acesso Restrito</h2>
            <p>Por favor, insira suas credenciais para acessar o painel de gestão.</p>
            <form @submit.prevent="handleLogin">
                <div class="form-group">
                    <label for="username"><strong>Usuário:</strong></label>
                    <input type="text" id="username" v-model="username" required>
                </div>
                <div class="form-group">
                    <label for="password"><strong>Senha:</strong></label>
                    <input type="password" id="password" v-model="password" required>
                </div>
                <div v-if="errorMessage" class="error-message">
                    {{ errorMessage }}
                </div>
                <button type="submit" class="btn-login">Entrar</button>
            </form>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue';
import { useAuth } from '../utils/auth';

const { login } = useAuth();
const username = ref('');
const password = ref('');
const errorMessage = ref('');

const handleLogin = () => {
    const success = login(username.value, password.value);
    if (!success) {
        errorMessage.value = 'Usuário ou senha inválidos.';
    }
};
</script>

<style scoped>
.login-container {
    width: 100%;
    min-height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 20px;
    background-color: var(--bg-color);
}

.login-card {
    width: 100%;
    max-width: 400px;
    text-align: center;
}

.logo {
    width: 180px;
    margin-bottom: 20px;
}

.form-group {
    text-align: left;
    margin-bottom: 15px;
}

.btn-login {
    width: 100%;
    margin-top: 10px;
    padding: 12px;
    background-color: var(--primary-color);
    color: white;
    border: none;
    border-radius: 6px;
    cursor: pointer;
    font-size: 1em;
    font-weight: 500;
}

.error-message {
    color: var(--error-color);
    margin-top: 15px;
    font-size: 0.9em;
}
</style>
