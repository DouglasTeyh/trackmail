<template>
    <div>
        <!-- Modal de Confirmação -->
        <div v-if="showDeleteModal" class="modal-overlay">
            <div class="modal-content">
                <h4>Confirmar Exclusão</h4>
                <p>Você tem certeza que deseja deletar esta encomenda?</p>
                <div class="modal-actions">
                    <button @click="confirmDelete" class="btn-danger">Deletar</button>
                    <button @click="showDeleteModal = false" class="btn-secondary">Cancelar</button>
                </div>
            </div>
        </div>

        <div class="content-box">
            <h2 v-if="!editingEncomenda">Cadastrar Nova Encomenda</h2>
            <h2 v-else>Editando Encomenda</h2>
            <form @submit.prevent="handleSubmit">
                <div class="form-grid">
                    <div class="form-group">
                        <label for="encomendaPeso">Peso (kg):</label>
                        <input type="number" id="encomendaPeso" step="0.01" min="0.01" v-model.number="formData.peso"
                            required>
                    </div>
                    <div class="form-group">
                        <label for="encomendaTipo">Tipo:</label>
                        <select id="encomendaTipo" v-model="formData.tipo" required>
                            <option disabled value="">Selecione</option>
                            <option value="documento">Documento</option>
                            <option value="caixa">Caixa</option>
                            <option value="palete">Palete</option>
                        </select>
                    </div>
                    <div class="form-group full-width">
                        <label for="encomendaDescricao">Descrição:</label>
                        <textarea id="encomendaDescricao" rows="3" v-model="formData.descricao"></textarea>
                    </div>
                    <div class="form-group full-width">
                        <label for="encomendaEndereco">Endereço de Entrega:</label>
                        <input type="text" id="encomendaEndereco" v-model="formData.endereco_entrega" required>
                    </div>
                </div>
                <div class="form-actions">
                    <button type="submit" :disabled="loadingEncomendas">
                        {{ editingEncomenda ? 'Salvar Alterações' : 'Cadastrar Encomenda' }}
                    </button>
                    <button v-if="editingEncomenda" type="button" @click="cancelEdit" class="btn-secondary">Cancelar
                        Edição</button>
                </div>
            </form>
        </div>

        <div class="content-box">
            <h2>Lista de Encomendas</h2>
            <form @submit.prevent="handleSearch">
                <div class="form-grid">
                    <div class="form-group">
                        <label for="filterTipo">Filtrar por Tipo:</label>
                        <select id="filterTipo" v-model="filterEncomendas.tipo">
                            <option value="">Todos</option>
                            <option value="documento">Documento</option>
                            <option value="caixa">Caixa</option>
                            <option value="palete">Palete</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label for="filterEndereco">Filtrar por Endereço:</label>
                        <input type="text" id="filterEndereco" v-model="filterEncomendas.endereco"
                            placeholder="Digite o início do endereço">
                    </div>
                </div>
                <div class="filter-actions">
                    <button type="submit" :disabled="loadingEncomendas">Buscar</button>
                    <button type="button" @click="clearFilters" :disabled="loadingEncomendas"
                        class="btn-secondary">Limpar Filtros</button>
                </div>
            </form>

            <div class="table-wrapper">
                <table>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Peso (kg)</th>
                            <th>Tipo</th>
                            <th>Descrição</th>
                            <th>Endereço de Entrega</th>
                            <th>Ações</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-if="loadingEncomendas">
                            <td colspan="6" class="text-center">Carregando...</td>
                        </tr>
                        <tr v-else-if="encomendas.length === 0">
                            <td colspan="6" class="text-center">Nenhuma encomenda encontrada.</td>
                        </tr>
                        <tr v-for="encomenda in encomendas" :key="encomenda.id">
                            <td>{{ encomenda.id }}</td>
                            <td>{{ encomenda.peso }}</td>
                            <td class="capitalize">{{ encomenda.tipo }}</td>
                            <td>{{ encomenda.descricao || 'N/A' }}</td>
                            <td>{{ encomenda.endereco_entrega }}</td>
                            <td class="actions-cell">
                                <button @click="startEdit(encomenda)" class="btn-icon btn-edit"
                                    title="Editar">&#9998;</button>
                                <button @click="deleteEncomenda(encomenda.id)" class="btn-icon btn-delete"
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

const allEncomendas = ref([]);
const encomendas = ref([]);
const formData = ref({ peso: null, tipo: '', descricao: '', endereco_entrega: '' });
const filterEncomendas = ref({ tipo: '', endereco: '' });
const loadingEncomendas = ref(false);
const editingEncomenda = ref(null);
const showDeleteModal = ref(false);
const encomendaToDeleteId = ref(null);

const fetchAllEncomendas = async () => {
    loadingEncomendas.value = true;
    const data = await fetchData('/encomendas');
    if (data) {
        allEncomendas.value = data;
        encomendas.value = data;
    }
    loadingEncomendas.value = false;
};

const handleSubmit = async () => {
    if (editingEncomenda.value) {
        const result = await updateData('/encomendas', editingEncomenda.value.id, formData.value);
        if (result) {
            showMessage('Encomenda atualizada com sucesso!', 'success');
            cancelEdit();
            await fetchAllEncomendas();
        }
    } else {
        const result = await postData('/encomendas', formData.value);
        if (result) {
            showMessage('Encomenda cadastrada com sucesso!', 'success');
            formData.value = { peso: null, tipo: '', descricao: '', endereco_entrega: '' };
            await fetchAllEncomendas();
        }
    }
};

const startEdit = (encomenda) => {
    editingEncomenda.value = encomenda;
    formData.value = { ...encomenda };
    window.scrollTo(0, 0);
};

const cancelEdit = () => {
    editingEncomenda.value = null;
    formData.value = { peso: null, tipo: '', descricao: '', endereco_entrega: '' };
};

const deleteEncomenda = (id) => {
    encomendaToDeleteId.value = id;
    showDeleteModal.value = true;
};

const confirmDelete = async () => {
    const success = await deleteData('/encomendas', encomendaToDeleteId.value);
    if (success) {
        showMessage('Encomenda deletada com sucesso!', 'success');
        await fetchAllEncomendas();
    }
    showDeleteModal.value = false;
    encomendaToDeleteId.value = null;
};

const handleSearch = () => {
    const tipoFiltro = filterEncomendas.value.tipo;
    const enderecoFiltro = filterEncomendas.value.endereco.trim().toLowerCase();

    if (!tipoFiltro && !enderecoFiltro) {
        encomendas.value = allEncomendas.value;
        return;
    }

    encomendas.value = allEncomendas.value.filter(encomenda => {
        const tipoMatch = tipoFiltro ? encomenda.tipo === tipoFiltro : true;
        const enderecoDoCliente = encomenda.endereco_entrega || '';
        const enderecoMatch = enderecoFiltro ? enderecoDoCliente.toLowerCase().startsWith(enderecoFiltro) : true;
        return tipoMatch && enderecoMatch;
    });
};

const clearFilters = () => {
    filterEncomendas.value = { tipo: '', endereco: '' };
    encomendas.value = allEncomendas.value;
};

onMounted(fetchAllEncomendas);
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

.capitalize {
    text-transform: capitalize;
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
