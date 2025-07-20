<template>
    <div>
        <div v-if="showDeleteModal" class="modal-overlay">
            <div class="modal-content">
                <h4>Confirmar Exclusão</h4>
                <p>Você tem certeza que deseja deletar esta entrega? Esta ação não pode ser desfeita.</p>
                <div class="modal-actions">
                    <button @click="confirmDelete" class="btn-danger">Deletar</button>
                    <button @click="showDeleteModal = false" class="btn-secondary">Cancelar</button>
                </div>
            </div>
        </div>

        <div class="content-box">
            <h2 v-if="!editingEntrega">Criar Nova Entrega</h2>
            <h2 v-else>Editando Entrega</h2>
            <form @submit.prevent="handleSubmit">
                <div class="form-grid">
                    <div class="form-group">
                        <label for="entregaCliente">Cliente:</label>
                        <select id="entregaCliente" v-model="formData.clienteId" required>
                            <option disabled value="">Selecione...</option>
                            <option v-for="cliente in allClientes" :key="cliente.id" :value="cliente.id">{{ cliente.nome }}</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label for="entregaEncomenda">Encomenda:</label>
                        <select id="entregaEncomenda" v-model="formData.encomendaId" required>
                            <option disabled value="">Selecione...</option>
                            <option v-for="encomenda in allEncomendas" :key="encomenda.id" :value="encomenda.id">{{ `ID ${encomenda.id} - ${encomenda.descricao || 'Sem descrição'}` }}</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label for="entregaRota">Rota:</label>
                        <select id="entregaRota" v-model="formData.rotaId" required>
                            <option disabled value="">Selecione...</option>
                            <option v-for="rota in allRotas" :key="rota.id" :value="rota.id">{{ `${rota.origem} -> ${rota.destino}` }}</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label for="entregaDataEstimada">Data Estimada:</label>
                        <input type="date" id="entregaDataEstimada" v-model="formData.data_estimada" required>
                    </div>
                </div>
                 <div class="form-actions">
                    <button type="submit" :disabled="loadingEntregas">
                        {{ editingEntrega ? 'Salvar Alterações' : 'Criar Entrega' }}
                    </button>
                    <button v-if="editingEntrega" type="button" @click="cancelEdit" class="btn-secondary">Cancelar Edição</button>
                </div>
            </form>
        </div>

        <div class="content-box">
            <h2>Lista de Entregas</h2>
            <form @submit.prevent="handleSearch">
                 <div class="form-grid">
                    <div class="form-group">
                        <label for="filterCliente">Filtrar por Cliente:</label>
                        <input type="text" id="filterCliente" v-model="filterEntregas.cliente" placeholder="Digite o início do nome">
                    </div>
                    <div class="form-group">
                        <label for="filterCodigo">Filtrar por Cód. Rastreamento:</label>
                        <input type="text" id="filterCodigo" v-model="filterEntregas.codigo" placeholder="Digite o início do código">
                    </div>
                    <div class="form-group">
                        <label for="filterStatus">Filtrar por Status:</label>
                        <select id="filterStatus" v-model="filterEntregas.status">
                            <option value="">Todos</option>
                            <option value="em_preparo">Em Preparo</option>
                            <option value="em_transito">Em Trânsito</option>
                            <option value="entregue">Entregue</option>
                            <option value="falha_na_entrega">Falha na Entrega</option>
                        </select>
                    </div>
                </div>
                <div class="filter-actions">
                    <button type="submit" :disabled="loadingEntregas">Buscar</button>
                    <button type="button" @click="clearFilters" :disabled="loadingEntregas" class="btn-secondary">Limpar Filtros</button>
                </div>
            </form>

            <div class="table-wrapper">
                <table>
                    <thead>
                        <tr>
                            <th>Cód. Rastreio</th>
                            <th>Cliente</th>
                            <th>Rota</th>
                            <th>Data Estimada</th>
                            <th>Status</th>
                            <th>Ações</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-if="loadingEntregas">
                            <td colspan="6" class="text-center">Carregando...</td>
                        </tr>
                        <tr v-else-if="entregas.length === 0">
                            <td colspan="6" class="text-center">Nenhuma entrega encontrada.</td>
                        </tr>
                        <tr v-for="entrega in entregas" :key="entrega.id">
                            <td>{{ entrega.codigo_rastreamento || 'N/A' }}</td>
                            <td>{{ entrega.cliente?.nome || 'Cliente não encontrado' }}</td>
                            <td>{{ entrega.rota ? `${entrega.rota.origem} -> ${entrega.rota.destino}` : 'Rota não encontrada' }}</td>
                            <td>{{ entrega.data_estimada ? new Date(entrega.data_estimada).toLocaleDateString('pt-BR') : 'N/A' }}</td>
                            <td>
                                <select v-model="entrega.status" @change="updateStatus(entrega, $event.target.value)" class="status-select">
                                    <option value="em_preparo">Em Preparo</option>
                                    <option value="em_transito">Em Trânsito</option>
                                    <option value="entregue">Entregue</option>
                                    <option value="falha_na_entrega">Falha na Entrega</option>
                                </select>
                            </td>
                            <td class="actions-cell">
                                <button @click="startEdit(entrega)" class="btn-icon btn-edit" title="Editar">&#9998;</button>
                                <button @click="deleteEntrega(entrega.id)" class="btn-icon btn-delete" title="Deletar">&#128465;</button>
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

const allEntregas = ref([]);
const entregas = ref([]);
const formData = ref({ clienteId: '', encomendaId: '', rotaId: '', data_estimada: '' });
const filterEntregas = ref({ cliente: '', codigo: '', status: '' });
const loadingEntregas = ref(false);
const allClientes = ref([]);
const allEncomendas = ref([]);
const allRotas = ref([]);
const editingEntrega = ref(null);
const showDeleteModal = ref(false);
const entregaToDeleteId = ref(null);

const formatStatus = (status) => {
    if (!status) return 'Desconhecido';
    return status.replace(/_/g, ' ');
};

const fetchAllEntregas = async () => {
    loadingEntregas.value = true;
    const data = await fetchData('/entregas?_expand=cliente&_expand=rota');
    if (data) {
        allEntregas.value = data;
        entregas.value = data;
    }
    loadingEntregas.value = false;
};

const loadPrerequisites = async () => {
    const [clientesData, encomendasData, rotasData] = await Promise.all([
        fetchData('/clientes'),
        fetchData('/encomendas'),
        fetchData('/rotas')
    ]);
    if (clientesData) allClientes.value = clientesData;
    if (encomendasData) allEncomendas.value = encomendasData;
    if (rotasData) allRotas.value = rotasData;
};

const generateTrackingCode = () => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = '';
  for (let i = 0; i < 9; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return `BR${result}PE`;
};

const handleSubmit = async () => {
    const entregaData = {
        ...formData.value,
        codigo_rastreamento: editingEntrega.value?.codigo_rastreamento || generateTrackingCode(),
        status: editingEntrega.value?.status || 'em_preparo',
        historico: editingEntrega.value?.historico || [{ data: new Date().toISOString(), status: "em_preparo", local: "Centro de Distribuição de Origem" }]
    };

    if (editingEntrega.value) {
        const result = await updateData('/entregas', editingEntrega.value.id, entregaData);
        if (result) {
            showMessage('Entrega atualizada com sucesso!', 'success');
            cancelEdit();
            await fetchAllEntregas();
        }
    } else {
        const result = await postData('/entregas', entregaData);
        if (result) {
            showMessage('Entrega criada com sucesso!', 'success');
            formData.value = { clienteId: '', encomendaId: '', rotaId: '', data_estimada: '' };
            await fetchAllEntregas();
        }
    }
};

const startEdit = (entrega) => {
    editingEntrega.value = entrega;
    const formattedDate = entrega.data_estimada ? new Date(entrega.data_estimada).toISOString().split('T')[0] : '';
    formData.value = { ...entrega, data_estimada: formattedDate };
    window.scrollTo(0,0);
};

const cancelEdit = () => {
    editingEntrega.value = null;
    formData.value = { clienteId: '', encomendaId: '', rotaId: '', data_estimada: '' };
};

const deleteEntrega = (id) => {
    entregaToDeleteId.value = id;
    showDeleteModal.value = true;
};

const confirmDelete = async () => {
    const success = await deleteData('/entregas', entregaToDeleteId.value);
    if (success) {
        showMessage('Entrega deletada com sucesso!', 'success');
        await fetchAllEntregas();
    }
    showDeleteModal.value = false;
    entregaToDeleteId.value = null;
};

const updateStatus = async (entrega, newStatus) => {
    const updatedEntrega = { ...entrega };
    updatedEntrega.status = newStatus;

    const newHistoryEntry = {
        data: new Date().toISOString(),
        status: newStatus,
        local: "Status atualizado pelo painel"
    };
    updatedEntrega.historico.push(newHistoryEntry);

    const result = await updateData('/entregas', entrega.id, updatedEntrega);
    if (result) {
        showMessage(`Status da entrega ${entrega.id} atualizado para "${formatStatus(newStatus)}"`, 'success');
        const index = allEntregas.value.findIndex(e => e.id === entrega.id);
        if (index !== -1) {
            allEntregas.value[index] = result;
        }
    } else {
        await fetchAllEntregas();
    }
};

const handleSearch = () => {
    const clienteFiltro = filterEntregas.value.cliente.trim().toLowerCase();
    const codigoFiltro = filterEntregas.value.codigo.trim().toLowerCase();
    const statusFiltro = filterEntregas.value.status;

    if (!clienteFiltro && !codigoFiltro && !statusFiltro) {
        entregas.value = allEntregas.value;
        return;
    }

    entregas.value = allEntregas.value.filter(entrega => {
        const clienteNome = entrega.cliente?.nome?.toLowerCase() || '';
        const codigoRastreio = entrega.codigo_rastreamento?.toLowerCase() || '';
        const clienteMatch = clienteFiltro ? clienteNome.startsWith(clienteFiltro) : true;
        const codigoMatch = codigoFiltro ? codigoRastreio.startsWith(codigoFiltro) : true;
        const statusMatch = statusFiltro ? entrega.status === statusFiltro : true;
        return clienteMatch && codigoMatch && statusMatch;
    });
};

const clearFilters = () => {
    filterEntregas.value = { cliente: '', codigo: '', status: '' };
    entregas.value = allEntregas.value;
};

onMounted(async () => {
    await loadPrerequisites();
    await fetchAllEntregas();
});
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
.status-select {
    padding: 8px;
    border-radius: 6px;
    border: 1px solid var(--border-color);
    background-color: #fff;
    cursor: pointer;
    width: 100%;
}
.status-select:focus {
    outline: none;
    border-color: var(--primary-color);
    box-shadow: 0 0 0 2px rgba(0, 122, 215, 0.2);
}
</style>
