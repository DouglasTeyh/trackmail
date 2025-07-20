<template>
  <div>
    <!-- Modal de Confirmação de Exclusão -->
    <div v-if="showDeleteModal" class="modal-overlay">
      <div class="modal-content">
        <h4>Confirmar Exclusão</h4>
        <p>Você tem certeza que deseja deletar este cliente? Esta ação não pode ser desfeita.</p>
        <div class="modal-actions">
          <button @click="confirmDelete" class="btn-danger">Deletar</button>
          <button @click="showDeleteModal = false" class="btn-secondary">Cancelar</button>
        </div>
      </div>
    </div>

    <div class="content-box">
      <h2 v-if="!editingCliente">Cadastrar Novo Cliente</h2>
      <h2 v-else>Editando Cliente</h2>
      <form @submit.prevent="handleSubmit">
        <div class="form-grid">
          <div class="form-group full-width">
            <label for="clienteNome">Nome Completo:</label>
            <input type="text" id="clienteNome" v-model="formData.nome" required>
          </div>
          <div class="form-group">
            <label for="clienteCpfCnpj">CPF/CNPJ:</label>
            <input type="text" id="clienteCpfCnpj" v-model="formData.cpfCnpj" v-mask required
              placeholder="000.000.000-00">
          </div>
          <div class="form-group">
            <label for="clienteEmail">E-mail:</label>
            <input type="email" id="clienteEmail" v-model="formData.email" required>
          </div>
          <div class="form-group full-width">
            <label for="clienteEndereco">Endereço:</label>
            <input type="text" id="clienteEndereco" v-model="formData.endereco" required>
          </div>
        </div>
        <div class="form-actions">
          <button type="submit" :disabled="loadingClientes">
            {{ editingCliente ? 'Salvar Alterações' : 'Cadastrar Cliente' }}
          </button>
          <button v-if="editingCliente" type="button" @click="cancelEdit" class="btn-secondary">Cancelar Edição</button>
        </div>
      </form>
    </div>

    <div class="content-box">
      <h2>Lista de Clientes</h2>
      <form @submit.prevent="handleSearch">
        <div class="form-grid">
          <div class="form-group">
            <label for="filterNome">Filtrar por Nome:</label>
            <input type="text" id="filterNome" v-model="filterClientes.nome" placeholder="Digite o início do nome">
          </div>
          <div class="form-group">
            <label for="filterCpfCnpj">Filtrar por CPF/CNPJ:</label>
            <input type="text" id="filterCpfCnpj" v-model="filterClientes.cpfCnpj" v-mask
              placeholder="Digite o início do CPF/CNPJ">
          </div>
        </div>
        <div class="filter-actions">
          <button type="submit" :disabled="loadingClientes">Buscar</button>
          <button type="button" @click="clearFilters" :disabled="loadingClientes" class="btn-secondary">Limpar
            Filtros</button>
        </div>
      </form>

      <div class="table-wrapper">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Nome</th>
              <th>CPF/CNPJ</th>
              <th>E-mail</th>
              <th>Endereço</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="loadingClientes">
              <td colspan="6" class="text-center">Carregando...</td>
            </tr>
            <tr v-else-if="clientes.length === 0">
              <td colspan="6" class="text-center">Nenhum cliente encontrado.</td>
            </tr>
            <tr v-for="cliente in clientes" :key="cliente.id">
              <td>{{ cliente.id }}</td>
              <td>{{ cliente.nome }}</td>
              <td>{{ formatCpfCnpj(cliente.cpfCnpj) }}</td>
              <td>{{ cliente.email }}</td>
              <td>{{ cliente.endereco }}</td>
              <td class="actions-cell">
                <button @click="startEdit(cliente)" class="btn-icon btn-edit" title="Editar">&#9998;</button>
                <button @click="deleteCliente(cliente.id)" class="btn-icon btn-delete"
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

const allClientes = ref([]);
const clientes = ref([]);
const formData = ref({ nome: '', cpfCnpj: '', email: '', endereco: '' });
const filterClientes = ref({ nome: '', cpfCnpj: '' });
const loadingClientes = ref(false);
const editingCliente = ref(null);
const showDeleteModal = ref(false);
const clienteToDeleteId = ref(null);

const formatCpfCnpj = (value) => {
  if (!value) return '';
  const cleaned = String(value).replace(/\D/g, '');
  if (cleaned.length <= 11) {
    return cleaned.padStart(11, '0').replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
  } 
  return cleaned.padStart(14, '0').replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5');
};

const fetchAllClientes = async () => {
  loadingClientes.value = true;
  const data = await fetchData('/clientes');
  if (data) {
    allClientes.value = data;
    clientes.value = data;
  }
  loadingClientes.value = false;
};

const handleSubmit = async () => {
  const clienteData = {
    ...formData.value,
    cpfCnpj: formData.value.cpfCnpj.replace(/\D/g, '')
  };

  if (editingCliente.value) {
    const result = await updateData('/clientes', editingCliente.value.id, clienteData);
    if (result) {
      showMessage('Cliente atualizado com sucesso!', 'success');
      cancelEdit();
      await fetchAllClientes();
    }
  } else {
    const result = await postData('/clientes', clienteData);
    if (result) {
      showMessage('Cliente cadastrado com sucesso!', 'success');
      formData.value = { nome: '', cpfCnpj: '', email: '', endereco: '' };
      await fetchAllClientes();
    }
  }
};

const startEdit = (cliente) => {
    editingCliente.value = cliente;
    formData.value = { ...cliente, cpfCnpj: formatCpfCnpj(cliente.cpfCnpj) };
    window.scrollTo(0,0);
};

const cancelEdit = () => {
    editingCliente.value = null;
    formData.value = { nome: '', cpfCnpj: '', email: '', endereco: '' };
};

const deleteCliente = (id) => {
    clienteToDeleteId.value = id;
    showDeleteModal.value = true;
};

const confirmDelete = async () => {
    const success = await deleteData('/clientes', clienteToDeleteId.value);
    if (success) {
        showMessage('Cliente deletado com sucesso!', 'success');
        await fetchAllClientes();
    }
    showDeleteModal.value = false;
    clienteToDeleteId.value = null;
};

const handleSearch = () => {
  const nomeFiltro = filterClientes.value.nome.trim().toLowerCase();
  const cpfCnpjFiltro = filterClientes.value.cpfCnpj.replace(/\D/g, '');

  if (!nomeFiltro && !cpfCnpjFiltro) {
    clientes.value = allClientes.value;
    return;
  }

  clientes.value = allClientes.value.filter(cliente => {
    const nomeMatch = nomeFiltro ? cliente.nome.toLowerCase().startsWith(nomeFiltro) : true;
    const clienteCpfCnpjLimpo = cliente.cpfCnpj ? String(cliente.cpfCnpj).replace(/\D/g, '') : '';
    const cpfCnpjMatch = cpfCnpjFiltro ? clienteCpfCnpjLimpo.startsWith(cpfCnpjFiltro) : true;
    return nomeMatch && cpfCnpjMatch;
  });
};

const clearFilters = () => {
  filterClientes.value = { nome: '', cpfCnpj: '' };
  clientes.value = allClientes.value;
};

onMounted(fetchAllClientes);
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
.btn-edit { color: var(--primary-color); }
.btn-delete { color: var(--error-color); }

.form-actions, .filter-actions {
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
.btn-secondary:hover { background-color: #5a6268; }
.btn-secondary:disabled, button:disabled {
  background-color: #cccccc;
  cursor: not-allowed;
}
.text-center { text-align: center; }

/* Modal Styles */
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
