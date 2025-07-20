<template>
  <div class="tracking-container">
    <div class="tracking-card">
      <div class="content-box">
        <h2>Rastrear Encomenda</h2>
        <form @submit.prevent="searchDelivery">
          <div class="form-group">
            <label for="trackingCode">Código de Rastreamento:</label>
            <input type="text" id="trackingCode" v-model="trackingCode"
              placeholder="Digite o código (ex: BR123456789PE)" required>
          </div>
          <div class="form-action">
            <button type="submit" :disabled="loading">
              <span v-if="!loading">Rastrear</span>
              <span v-else>Buscando...</span>
            </button>
          </div>
        </form>
      </div>

      <div v-if="errorMessage" class="message-box error">
        {{ errorMessage }}
      </div>

      <div v-if="entrega" class="content-box results-area">
        <h3>Detalhes da Entrega</h3>
        <div class="details-grid">
          <div>
            <strong>CÓDIGO:</strong>
            <p>{{ entrega.codigo_rastreamento }}</p>
          </div>
          <div>
            <strong>STATUS ATUAL:</strong>
            <p :class="['status-tag', entrega.status]">{{ formatStatus(entrega.status) }}</p>
          </div>
          <div>
            <strong>DATA ESTIMADA:</strong>
            <p>{{ entrega.data_estimada ? new Date(entrega.data_estimada).toLocaleDateString('pt-BR') : 'N/A' }}</p>
          </div>
        </div>

        <h3 class="history-title">Histórico do Percurso</h3>
        <div class="history-timeline">
          <ul>
            <li v-for="(item, index) in entrega.historico.slice().reverse()" :key="index">
              <div :class="['timeline-point', item.status]"></div>
              <div class="timeline-content">
                <span class="status">{{ formatStatus(item.status) }}</span>
                <span class="location">{{ item.local }}</span>
                <span class="date">{{ new Date(item.data).toLocaleString('pt-BR') }}</span>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useApi } from '../utils/api';

const { fetchData } = useApi();

const trackingCode = ref('');
const entrega = ref(null);
const loading = ref(false);
const errorMessage = ref('');

const formatStatus = (status) => {
  if (!status) return 'Desconhecido';
  return status.replace(/_/g, ' ');
};

const searchDelivery = async () => {
  if (!trackingCode.value.trim()) {
    errorMessage.value = 'Por favor, insira um código de rastreamento.';
    return;
  }

  loading.value = true;
  entrega.value = null;
  errorMessage.value = '';

  try {
    const codigo = trackingCode.value.trim().toUpperCase();
    const data = await fetchData(`/entregas?codigo_rastreamento=${codigo}`);

    if (data && data.length > 0) {
      entrega.value = data[0];
    } else {
      errorMessage.value = 'Nenhuma encomenda encontrada com este código de rastreamento.';
    }
  } catch (error) {
    errorMessage.value = error.message;
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped>
.tracking-container {
  width: 100%;
  min-height: 100%;
  padding: 40px 20px;
  display: flex;
  justify-content: center;
  align-items: flex-start;
}

.tracking-card {
  width: 100%;
  max-width: 800px;
}

.form-action {
  margin-top: 15px;
}

.form-action button {
  width: 100%;
}

.results-area {
  margin-top: 30px;
}

.details-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 20px;
  margin-top: 20px;
  padding: 20px;
  background-color: #f8f9fa;
  border-radius: 6px;
}

.details-grid>div {
  display: flex;
  flex-direction: column;
}

.details-grid strong {
  font-size: 0.8em;
  color: var(--text-light);
  margin-bottom: 5px;
  text-transform: uppercase;
}

.details-grid p {
  font-size: 1.1em;
  font-weight: 500;
}

.status-tag {
  padding: 5px 12px;
  border-radius: 20px;
  color: white;
  text-align: center;
  max-width: fit-content;
  text-transform: capitalize;
  font-size: 0.9em !important;
}

.status-tag.entregue {
  background-color: #2ecc71;
}

/* Verde */
.status-tag.em_transito,
.status-tag.a_caminho {
  background-color: #f1c40f;
  color: #333;
}

/* Amarelo com texto escuro */
.status-tag.em_preparo {
  background-color: #3498db;
}

/* Azul */
.status-tag.falha_na_entrega {
  background-color: #e74c3c;
}

/* Vermelho */

.history-title {
  margin-top: 40px;
  border-top: 1px solid var(--border-color);
  padding-top: 30px;
}

.history-timeline ul {
  list-style: none;
  padding: 0;
  position: relative;
  margin-top: 20px;
}

.history-timeline ul::before {
  content: '';
  position: absolute;
  top: 10px;
  left: 10px;
  bottom: 10px;
  width: 4px;
  background: #e9ecef;
  border-radius: 2px;
}

.history-timeline li {
  position: relative;
  margin-bottom: 30px;
  padding-left: 40px;
}

.timeline-point {
  position: absolute;
  left: 0;
  top: 5px;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  border: 3px solid white;
}

.timeline-point.entregue {
  background-color: #2ecc71;
  box-shadow: 0 0 0 3px #2ecc71;
}

.timeline-point.em_transito,
.timeline-point.a_caminho {
  background-color: #f1c40f;
  box-shadow: 0 0 0 3px #f1c40f;
}

.timeline-point.em_preparo {
  background-color: #3498db;
  box-shadow: 0 0 0 3px #3498db;
}

.timeline-point.falha_na_entrega {
  background-color: #e74c3c;
  box-shadow: 0 0 0 3px #e74c3c;
}


.timeline-content .status {
  font-weight: 600;
  font-size: 1.1em;
  text-transform: capitalize;
}

.timeline-content .location {
  display: block;
  color: var(--text-light);
  margin: 5px 0;
}

.timeline-content .date {
  font-size: 0.9em;
  color: #999;
}

.message-box {
  width: 100%;
  margin-top: 20px;
  padding: 15px;
  border-radius: 6px;
  font-weight: 500;
}

.message-box.error {
  background-color: #f8d7da;
  color: #721c24;
  border: 1px solid #f5c6cb;
}
</style>
