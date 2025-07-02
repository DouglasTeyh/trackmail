// js/tracking.js

// Importa funções do main.js se estiver usando módulos ES6
// Exemplo: import { fetchData, showMessage } from './main.js';

document.addEventListener('DOMContentLoaded', () => {
    const trackingForm = document.getElementById('trackingForm');
    const trackingCodeInput = document.getElementById('trackingCode');
    const clientNameInput = document.getElementById('clientName');
    const statusFilterSelect = document.getElementById('statusFilter');
    const trackingResultsDiv = document.getElementById('trackingResults');

    if (trackingForm) {
        trackingForm.addEventListener('submit', async (event) => {
            event.preventDefault();
            const trackingCode = trackingCodeInput.value.trim();
            const clientName = clientNameInput.value.trim();
            const statusFilter = statusFilterSelect.value;

            trackingResultsDiv.innerHTML = ''; // Limpa resultados anteriores

            if (!trackingCode && !clientName && !statusFilter) {
                showMessage('Preencha ao menos um campo para buscar a encomenda.', 'error');
                return;
            }

            try {
                let endpoint = '/entregas';
                const params = new URLSearchParams();

                if (trackingCode) {
                    endpoint = `/entregas/${trackingCode}`; // Assume que a API pode buscar por ID direto
                } else {
                    if (clientName) {
                        // Isso pode exigir uma busca por clientes primeiro ou que a API /entregas
                        // suporte filtro por nome de cliente diretamente.
                        // Para simplificar, vamos assumir que a API /entregas pode filtrar por nome do cliente.
                        params.append('clienteNome', clientName);
                    }
                    if (statusFilter) {
                        params.append('status', statusFilter);
                    }
                }

                if (params.toString()) {
                    endpoint += `?${params.toString()}`;
                }

                const result = await fetchData(endpoint);

                if (!result || (Array.isArray(result) && result.length === 0)) {
                    trackingResultsDiv.innerHTML = '<p class="error-message">Nenhuma encomenda encontrada com os critérios fornecidos.</p>';
                    return;
                }

                let entrega;
                let historico;

                // Se a busca foi por código, result já é o objeto da entrega
                if (trackingCode && !Array.isArray(result)) {
                    entrega = result;
                    historico = await fetchData(`/entregas/${entrega.id}/historico`);
                } else if (Array.isArray(result)) {
                    // Se a busca retornou uma lista (filtros por cliente/status), exibe a primeira ou todas
                    // Para este exemplo, vamos exibir a primeira encontrada ou adaptar para exibir várias.
                    // Para um sistema de rastreamento, geralmente se espera uma única encomenda pelo código.
                    // Se buscar por cliente/status, pode ser necessário listar várias e o usuário escolher.
                    if (result.length > 0) {
                        entrega = result[0]; // Pega a primeira para exibição detalhada
                        historico = await fetchData(`/entregas/${entrega.id}/historico`);
                    }
                }

                if (entrega) {
                    trackingResultsDiv.innerHTML = `
                        <h3>Detalhes da Encomenda #${entrega.id}</h3>
                        <div class="tracking-details">
                            <p><strong>Status Atual:</strong> ${entrega.status}</p>
                            <p><strong>Origem:</strong> ${entrega.rota ? entrega.rota.origem : 'N/A'}</p>
                            <p><strong>Destino:</strong> ${entrega.rota ? entrega.rota.destino : 'N/A'}</p>
                            <p><strong>Data Estimada:</strong> ${entrega.dataEstimada}</p>
                            <p><strong>Descrição:</strong> ${entrega.encomenda ? entrega.encomenda.descricao : 'N/A'}</p>
                        </div>
                        <h3>Histórico de Movimentações</h3>
                        <ul id="historyList" class="history-list">
                            ${historico && historico.length > 0 ?
                            historico.map(h => `<li><span>${new Date(h.dataHora).toLocaleString()}</span> <span>${h.novoStatus}</span></li>`).join('') :
                            '<li>Nenhum histórico disponível.</li>'
                        }
                        </ul>
                    `;
                } else {
                    trackingResultsDiv.innerHTML = '<p class="error-message">Nenhuma encomenda encontrada.</p>';
                }

            } catch (error) {
                console.error("Erro ao rastrear encomenda:", error);
                showMessage('Ocorreu um erro ao rastrear a encomenda. Tente novamente mais tarde.', 'error');
            }
        });
    }
});