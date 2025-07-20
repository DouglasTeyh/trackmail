<template>
    <div>
        <!-- Modal de Confirmação -->
        <div v-if="showDeleteModal" class="modal-overlay">
            <div class="modal-content">
                <h4>Confirmar Exclusão</h4>
                <p>Você tem certeza que deseja deletar esta rota?</p>
                <div class="modal-actions">
                    <button @click="confirmDelete" class="btn-danger">Deletar</button>
                    <button @click="showDeleteModal = false" class="btn-secondary">Cancelar</button>
                </div>
            </div>
        </div>

        <div class="content-box">
            <h2 v-if="!editingRota">Cadastrar Nova Rota</h2>
            <h2 v-else>Editando Rota</h2>
            <form @submit.prevent="handleSubmit">
                <div class="form-grid">
                    <div class="form-group">
                        <label for="rotaOrigem">Origem:</label>
                        <input type="text" id="rotaOrigem" v-model="formData.origem" required>
                    </div>
                    <div class="form-group">
                        <label for="rotaDestino">Destino:</label>
                        <input type="text" id="rotaDestino" v-model="formData.destino" required>
                    </div>
                    <div class="form-group">
                        <label for="rotaDistancia">Distância (km):</label>
                        <input type="number" id="rotaDistancia" step="0.1" min="0.1"
                            v-model.number="formData.distancia_km" required>
                    </div>
                    <div class="form-group">
                        <label for="rotaTempoEstimado">Tempo Estimado (h):</label>
                        <input type="number" id="rotaTempoEstimado" step="0.1" min="0.1"
                            v-model.number="formData.tempo_estimado_h" required>
                    </div>
                </div>
                <div class="form-actions">
                    <button type="submit" :disabled="loadingRotas">
                        {{ editingRota ? 'Salvar Alterações' : 'Cadastrar Rota' }}
                    </button>
                    <button v-if="editingRota" type="button" @click="cancelEdit" class="btn-secondary">Cancelar
                        Edição</button>
                </div>
            </form>
        </div>

        <div class="content-box">
            <h2>Lista de Rotas</h2>
            <form @submit.prevent="handleSearch">
                <div class="form-grid">
                    <div class="form-group">
                        <label for="filterOrigem">Filtrar por Origem:</label>
                        <input type="text" id="filterOrigem" v-model="filterRotas.origem"
                            placeholder="Digite o início da origem">
                    </div>
                    <div class="form-group">
                        <label for="filterDestino">Filtrar por Destino:</label>
                        <input type="text" id="filterDestino" v-model="filterRotas.destino"
                            placeholder="Digite o início do destino">
                    </div>
                </div>
                <div class="filter-actions">
                    <button type="submit" :disabled="loadingRotas">Buscar</button>
                    <button type="button" @click="clearFilters" :disabled="loadingRotas" class="btn-secondary">Limpar
                        Filtros</button>
                </div>
            </form>

            <div class="table-wrapper">
                <table>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Origem</th>
                            <th>Destino</th>
                            <th>Distância (km)</th>
                            <th>Tempo (h)</th>
                            <th>Ações</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-if="loadingRotas">
                            <td colspan="6" class="text-center">Carregando...</td>
                        </tr>
                        <tr v-else-if="rotas.length === 0">
                            <td colspan="6" class="text-center">Nenhuma rota encontrada.</td>
                        </tr>
                        <tr v-for="rota in rotas" :key="rota.id">
                            <td>{{ rota.id }}</td>
                            <td>{{ rota.origem }}</td>
                            <td>{{ rota.destino }}</td>
                            <td>{{ rota.distancia_km }}</td>
                            <td>{{ rota.tempo_estimado_h }}</td>
                            <td class="actions-cell">
                                <button @click="startEdit(rota)" class="btn-icon btn-edit"
                                    title="Editar">&#9998;</button>
                                <button @click="deleteRota(rota.id)" class="btn-icon btn-delete"
                                    title="Deletar">&#128465;</button>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
        <div v-if="message" :class="['message-box', messageType]">{{ message }}</div>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useApi } from '../utils/api';

const { message, messageType, showMessage, fetchData, postData, updateData, deleteData } = useApi();

const allRotas = ref([]);
const rotas = ref([]);
const formData = ref({ origem: '', destino: '', distancia_km: null, tempo_estimado_h: null });
const filterRotas = ref({ origem: '', destino: '' });
const loadingRotas = ref(false);
const editingRota = ref(null);
const showDeleteModal = ref(false);
const rotaToDeleteId = ref(null);

const fetchAllRotas = async () => {
    loadingRotas.value = true;
    const data = await fetchData('/rotas');
    if (data) {
        allRotas.value = data;
        rotas.value = data;
    }
    loadingRotas.value = false;
};

const handleSubmit = async () => {
    if (editingRota.value) {
        const result = await updateData('/rotas', editingRota.value.id, formData.value);
        if (result) {
            showMessage('Rota atualizada com sucesso!', 'success');
            cancelEdit();
            await fetchAllRotas();
        }
    } else {
        const result = await postData('/rotas', formData.value);
        if (result) {
            showMessage('Rota cadastrada com sucesso!', 'success');
            formData.value = { origem: '', destino: '', distancia_km: null, tempo_estimado_h: null };
            await fetchAllRotas();
        }
    }
};

const startEdit = (rota) => {
    editingRota.value = rota;
    formData.value = { ...rota };
    window.scrollTo(0, 0);
};

const cancelEdit = () => {
    editingRota.value = null;
    formData.value = { origem: '', destino: '', distancia_km: null, tempo_estimado_h: null };
};

const deleteRota = (id) => {
    rotaToDeleteId.value = id;
    showDeleteModal.value = true;
};

const confirmDelete = async () => {
    const success = await deleteData('/rotas', rotaToDeleteId.value);
    if (success) {
        showMessage('Rota deletada com sucesso!', 'success');
        await fetchAllRotas();
    }
    showDeleteModal.value = false;
    rotaToDeleteId.value = null;
};

const handleSearch = () => {
    const origemFiltro = filterRotas.value.origem.trim().toLowerCase();
    const destinoFiltro = filterRotas.value.destino.trim().toLowerCase();

    if (!origemFiltro && !destinoFiltro) {
        rotas.value = allRotas.value;
        return;
    }

    rotas.value = allRotas.value.filter(rota => {
        const rotaOrigem = rota.origem || '';
        const rotaDestino = rota.destino || '';
        const origemMatch = origemFiltro ? rotaOrigem.toLowerCase().startsWith(origemFiltro) : true;
        const destinoMatch = destinoFiltro ? rotaDestino.toLowerCase().startsWith(destinoFiltro) : true;
        return origemMatch && destinoMatch;
    });
};

const clearFilters = () => {
    filterRotas.value = { origem: '', destino: '' };
    rotas.value = allRotas.value;
};

onMounted(fetchAllRotas);
</script>

<style scoped>
.table-wrapper {
    max-height: 320px;
    overflow-y: auto;
}

.actions-cell {
    display: flex;
    gap: 10px;
    justify-content: center;
    align-items: center;
}

.btn-icon {
    border: none;
    background: none;
    cursor: pointer;
    font-size: 1.2rem;
    padding: 5px;
}

.btn-edit {
    color: var(--primary-color);
}

.btn-delete {
    color: var(--error-color);
}

.form-actions,
.filter-actions {
    display: flex;
    gap: 10px;
    margin-top: 10px;
    margin-bottom: 20px;
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

.modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.6);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
}

.modal-content {
    background: white;
    padding: 30px;
    border-radius: 8px;
    width: 90%;
    max-width: 400px;
    text-align: center;
}

.modal-actions {
    display: flex;
    justify-content: center;
    gap: 15px;
    margin-top: 20px;
}

.btn-danger {
    background-color: var(--error-color);
    color: white;
    border: none;
    padding: 10px 20px;
    border-radius: 6px;
    cursor: pointer;
}
</style>
