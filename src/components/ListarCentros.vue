<template>
    <div class="content-box">
        <h2>Centros de Distribuição</h2>
        <form @submit.prevent="handleSearch" class="filter-form">
            <div class="form-grid">
                <div class="form-group">
                    <label for="filterNome">Filtrar por Nome do Centro:</label>
                    <input type="text" id="filterNome" v-model="filterCentros.nome"
                        placeholder="Digite o início do nome">
                </div>
                <div class="form-group">
                    <label for="filterCidade">Filtrar por Cidade:</label>
                    <input type="text" id="filterCidade" v-model="filterCentros.cidade"
                        placeholder="Digite o início da cidade">
                </div>
            </div>
            <div class="filter-actions">
                <button type="submit" :disabled="loadingCentros">Buscar</button>
                <button type="button" @click="clearFilters" :disabled="loadingCentros" class="btn-secondary">Limpar
                    Filtros</button>
            </div>
        </form>

        <div class="table-wrapper">
            <table>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Nome</th>
                        <th>Endereço</th>
                        <th>Cidade</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-if="loadingCentros">
                        <td colspan="4" class="text-center">Carregando...</td>
                    </tr>
                    <tr v-else-if="centros.length === 0">
                        <td colspan="4" class="text-center">Nenhum centro de distribuição encontrado.</td>
                    </tr>
                    <tr v-for="centro in centros" :key="centro.id">
                        <td>{{ centro.id }}</td>
                        <td>{{ centro.nome }}</td>
                        <td>{{ centro.endereco }}</td>
                        <td>{{ centro.cidade }}</td>
                    </tr>
                </tbody>
            </table>
        </div>
        <div v-if="message" :class="['message-box', messageType]">{{ message }}</div>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useApi } from '../utils/api';

const { message, messageType, fetchData } = useApi();

const allCentros = ref([]);
const centros = ref([]);
const filterCentros = ref({ nome: '', cidade: '' });
const loadingCentros = ref(false);

const fetchAllCentros = async () => {
    loadingCentros.value = true;
    const data = await fetchData('/centros');
    if (data) {
        allCentros.value = data;
        centros.value = data;
    }
    loadingCentros.value = false;
};

const handleSearch = () => {
    const nomeFiltro = filterCentros.value.nome.trim().toLowerCase();
    const cidadeFiltro = filterCentros.value.cidade.trim().toLowerCase();

    if (!nomeFiltro && !cidadeFiltro) {
        centros.value = allCentros.value;
        return;
    }

    centros.value = allCentros.value.filter(centro => {
        const centroNome = centro.nome || '';
        const centroCidade = centro.cidade || '';

        const nomeMatch = nomeFiltro ? centroNome.toLowerCase().startsWith(nomeFiltro) : true;
        const cidadeMatch = cidadeFiltro ? centroCidade.toLowerCase().startsWith(cidadeFiltro) : true;

        return nomeMatch && cidadeMatch;
    });
};

const clearFilters = () => {
    filterCentros.value = { nome: '', cidade: '' };
    centros.value = allCentros.value;
};

onMounted(fetchAllCentros);
</script>

<style scoped>
.filter-form {
    margin-bottom: 20px;
    padding-bottom: 20px;
    border-bottom: 1px solid var(--border-color);
}

.filter-actions {
    display: flex;
    gap: 10px;
    margin-top: 10px;
}

.btn-secondary {
    background-color: #6c757d;
    color: white;
    border: none;
    padding: 12px 25px;
    border-radius: 6px;
    cursor: pointer;
    font-size: 1em;
    font-weight: 500;
    transition: background-color 0.2s ease;
}

.btn-secondary:hover {
    background-color: #5a6268;
}

.btn-secondary:disabled,
button:disabled {
    background-color: #cccccc;
    cursor: not-allowed;
}

.text-center {
    text-align: center;
}
</style>
