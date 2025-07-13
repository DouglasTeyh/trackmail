document.addEventListener('DOMContentLoaded', () => {
    const moduleLinks = document.querySelectorAll('.sidebar a');
    const moduleContent = document.getElementById('module-content');

    const modulesHTML = {
        clientes: `
            <h2>Gerenciar Clientes</h2>
            <form id="clienteForm">
                <div class="form-group">
                    <label for="clienteNome">Nome Completo:</label>
                    <input type="text" id="clienteNome" required>
                </div>
                <div class="form-group">
                    <label for="clienteCpfCnpj">CPF/CNPJ:</label>
                    <input type="text" id="clienteCpfCnpj" required>
                </div>
                <div class="form-group">
                    <label for="clienteEmail">E-mail:</label>
                    <input type="email" id="clienteEmail" required>
                </div>
                <div class="form-group">
                    <label for="clienteEndereco">Endereço:</label>
                    <input type="text" id="clienteEndereco" required>
                </div>
                <button type="submit">Cadastrar Cliente</button>
            </form>
            <br>
            <hr>
            <br>
            <h2>Lista de Clientes</h2>
            <div class="form-group">
                <label for="filterClienteNome">Filtrar por Nome:</label>
                <input type="text" id="filterClienteNome" placeholder="Digite o nome">
            </div>
            <div class="form-group">
                <label for="filterClienteCpfCnpj">Filtrar por CPF/CNPJ:</label>
                <input type="text" id="filterClienteCpfCnpj" placeholder="Digite o CPF/CNPJ">
            </div>
            <button class="btn" id="searchClientes">Buscar Clientes</button>
            <br>
            
                <table id="clientesTable">
                    <thead>
                    <tr>
                        <th>ID</th>
                        <th>Nome</th>
                        <th>CPF/CNPJ</th>
                        <th>E-mail</th>
                        <th>Endereço</th>
                    </tr>
                </thead>
                    <tbody>
                    </tbody>
                </table>
            
        `,
        encomendas: `
            <h2>Gerenciar Encomendas</h2>
            <form id="encomendaForm">
                <div class="form-group">
                    <label for="encomendaPeso">Peso (kg):</label>
                    <input type="number" id="encomendaPeso" step="0.01" min="0.01" required>
                </div>
                <div class="form-group">
                    <label for="encomendaTipo">Tipo:</label>
                    <select id="encomendaTipo" required>
                        <option value="">Selecione</option>
                        <option value="documento">Documento</option>
                        <option value="caixa">Caixa</option>
                        <option value="palete">Palete</option>
                    </select>
                </div>
                <div class="form-group">
                    <label for="encomendaDescricao">Descrição:</label>
                    <textarea id="encomendaDescricao" rows="3"></textarea>
                </div>
                <div class="form-group">
                    <label for="encomendaEndereco">Endereço de Entrega:</label>
                    <input type="text" id="encomendaEndereco" required>
                </div>
                <button type="submit">Cadastrar Encomenda</button>
            </form>
            <h3>Lista de Encomendas</h3>
            <div class="form-group">
                <label for="filterEncomendaTipo">Filtrar por Tipo:</label>
                <select id="filterEncomendaTipo">
                    <option value="">Todos</option>
                    <option value="documento">Documento</option>
                    <option value="caixa">Caixa</option>
                    <option value="palete">Palete</option>
                </select>
            </div>
            <div class="form-group">
                <label for="filterEncomendaPeso">Filtrar por Peso (min):</label>
                <input type="number" id="filterEncomendaPeso" step="0.01" min="0">
            </div>
            <button class="btn" id="searchEncomendas">Buscar Encomendas</button>
            <table id="encomendasTable">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Peso (kg)</th>
                        <th>Tipo</th>
                        <th>Descrição</th>
                        <th>Endereço</th>
                    </tr>
                </thead>
                <tbody>
                    </tbody>
            </table>
        `,
        rotas: `
            <h2>Gerenciar Rotas de Entrega</h2>
            <form id="rotaForm">
                <div class="form-group">
                    <label for="rotaOrigem">Origem:</label>
                    <input type="text" id="rotaOrigem" required>
                </div>
                <div class="form-group">
                    <label for="rotaDestino">Destino:</label>
                    <input type="text" id="rotaDestino" required>
                </div>
                <div class="form-group">
                    <label for="rotaCentrosIntermediarios">Centros Intermediários (separados por vírgula):</label>
                    <input type="text" id="rotaCentrosIntermediarios">
                    <small>Ex: CD São Paulo, CD Rio de Janeiro</small>
                </div>
                <div class="form-group">
                    <label for="rotaDistancia">Distância (km):</label>
                    <input type="number" id="rotaDistancia" step="0.1" min="0.1" required>
                </div>
                <div class="form-group">
                    <label for="rotaTempoEstimado">Tempo Estimado (h):</label>
                    <input type="number" id="rotaTempoEstimado" step="0.1" min="0.1" required>
                </div>
                <button type="submit">Cadastrar Rota</button>
            </form>
            <h3>Lista de Rotas</h3>
            <div class="form-group">
                <label for="filterRotaOrigem">Filtrar por Origem:</label>
                <input type="text" id="filterRotaOrigem" placeholder="Digite a origem">
            </div>
            <div class="form-group">
                <label for="filterRotaDestino">Filtrar por Destino:</label>
                <input type="text" id="filterRotaDestino" placeholder="Digite o destino">
            </div>
            <button class="btn" id="searchRotas">Buscar Rotas</button>
            <table id="rotasTable">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Origem</th>
                        <th>Destino</th>
                        <th>Intermediários</th>
                        <th>Distância (km)</th>
                        <th>Tempo (h)</th>
                    </tr>
                </thead>
                <tbody>
                    </tbody>
            </table>
        `,
        entregas: `
            <h2>Gerenciar Entregas</h2>
            <form id="entregaForm">
                <div class="form-group">
                    <label for="entregaCliente">Cliente:</label>
                    <select id="entregaCliente" required>
                        <option value="">Carregando clientes...</option>
                    </select>
                </div>
                <div class="form-group">
                    <label for="entregaEncomenda">Encomenda:</label>
                    <select id="entregaEncomenda" required>
                        <option value="">Carregando encomendas...</option>
                    </select>
                </div>
                <div class="form-group">
                    <label for="entregaRota">Rota:</label>
                    <select id="entregaRota" required>
                        <option value="">Carregando rotas...</option>
                    </select>
                </div>
                <div class="form-group">
                    <label for="entregaDataEstimada">Data Estimada:</label>
                    <input type="date" id="entregaDataEstimada" required>
                </div>
                <button type="submit">Criar Entrega</button>
            </form>
            <h3>Lista de Entregas</h3>
            <div class="form-group">
                <label for="filterEntregaCliente">Filtrar por Cliente:</label>
                <select id="filterEntregaCliente">
                    <option value="">Todos</option>
                    </select>
            </div>
            <div class="form-group">
                <label for="filterEntregaRota">Filtrar por Rota:</label>
                <select id="filterEntregaRota">
                    <option value="">Todas</option>
                    </select>
            </div>
            <div class="form-group">
                <label for="filterEntregaData">Filtrar por Data:</label>
                <input type="date" id="filterEntregaData">
            </div>
            <div class="form-group">
                <label for="filterEntregaStatus">Filtrar por Status:</label>
                <select id="filterEntregaStatus">
                    <option value="">Todos</option>
                    <option value="em_preparo">Em Preparo</option>
                    <option value="a_caminho">A Caminho</option>
                    <option value="entregue">Entregue</option>
                </select>
            </div>
            <button class="btn" id="searchEntregas">Buscar Entregas</button>
            <table id="entregasTable">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Cliente</th>
                        <th>Encomenda</th>
                        <th>Rota</th>
                        <th>Data Estimada</th>
                        <th>Status</th>
                    </tr>
                </thead>
                <tbody>
                    </tbody>
            </table>
        `,
        centros: `
            <h2>Centros de Distribuição</h2>
            <p>Esta é uma lista apenas para consulta.</p>
            <table id="centrosTable">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Nome</th>
                        <th>Endereço</th>
                    </tr>
                </thead>
                <tbody>
                    </tbody>
            </table>
        `
    };

    async function loadModule(moduleName) {
        moduleContent.innerHTML = modulesHTML[moduleName];

        moduleLinks.forEach(link => link.classList.remove('active'));
        document.querySelector(`.sidebar a[data-module="${moduleName}"]`).classList.add('active');

        switch (moduleName) {
            case 'clientes':
                handleClientesModule();
                break;
            case 'encomendas':
                handleEncomendasModule();
                break;
            case 'rotas':
                handleRotasModule();
                break;
            case 'entregas':
                await handleEntregasModule();
                break;
            case 'centros':
                handleCentrosModule();
                break;
        }
    }

    moduleLinks.forEach(link => {
        link.addEventListener('click', (event) => {
            event.preventDefault();
            const moduleName = event.target.dataset.module;
            loadModule(moduleName);
        });
    });

    loadModule('clientes');

    async function handleClientesModule() {
        const form = document.getElementById('clienteForm');
        const tableBody = document.querySelector('#clientesTable tbody');
        const filterNomeInput = document.getElementById('filterClienteNome');
        const filterCpfCnpjInput = document.getElementById('filterClienteCpfCnpj');
        const searchButton = document.getElementById('searchClientes');

        if (form) {
            form.addEventListener('submit', async (event) => {
                event.preventDefault();
                const nome = document.getElementById('clienteNome').value;
                const cpfCnpj = document.getElementById('clienteCpfCnpj').value;
                const email = document.getElementById('clienteEmail').value;
                const endereco = document.getElementById('clienteEndereco').value;

                if (!nome || !cpfCnpj || !email || !endereco) {
                    showMessage('Todos os campos são obrigatórios!', 'error');
                    return;
                }
                if (!isValidCpfCnpj(cpfCnpj)) {
                    showMessage('CPF/CNPJ inválido!', 'error');
                    return;
                }
                if (!isValidEmail(email)) {
                    showMessage('E-mail inválido!', 'error');
                    return;
                }

                const newCliente = { nome, cpfCnpj, email, endereco };
                const result = await postData('/clientes', newCliente);
                if (result) {
                    showMessage('Cliente cadastrado com sucesso!', 'success');
                    form.reset();
                    await loadClientes();
                }
            });
        }

        searchButton.addEventListener('click', loadClientes);
        filterNomeInput.addEventListener('input', () => loadClientes());
        filterCpfCnpjInput.addEventListener('input', () => loadClientes());


        async function loadClientes() {
            tableBody.innerHTML = '<tr><td colspan="5">Carregando clientes...</td></tr>';
            const nomeFilter = filterNomeInput.value.trim();
            const cpfCnpjFilter = filterCpfCnpjInput.value.trim();

            let endpoint = '/clientes';
            const params = new URLSearchParams();
            if (nomeFilter) {
                params.append('nome', nomeFilter);
            }
            if (cpfCnpjFilter) {
                params.append('cpfCnpj', cpfCnpjFilter);
            }
            if (params.toString()) {
                endpoint += `?${params.toString()}`;
            }

            const clientes = await fetchData(endpoint);
            tableBody.innerHTML = '';
            if (clientes && clientes.length > 0) {
                clientes.forEach(cliente => {
                    const row = tableBody.insertRow();
                    row.insertCell().textContent = cliente.id;
                    row.insertCell().textContent = cliente.nome;
                    row.insertCell().textContent = cliente.cpfCnpj;
                    row.insertCell().textContent = cliente.email;
                    row.insertCell().textContent = cliente.endereco;
                });
            } else {
                tableBody.innerHTML = '<tr><td colspan="5">Nenhum cliente encontrado.</td></tr>';
            }
        }
        await loadClientes();
    }

    async function handleEncomendasModule() {
        const form = document.getElementById('encomendaForm');
        const tableBody = document.querySelector('#encomendasTable tbody');
        const filterTipoSelect = document.getElementById('filterEncomendaTipo');
        const filterPesoInput = document.getElementById('filterEncomendaPeso');
        const searchButton = document.getElementById('searchEncomendas');

        if (form) {
            form.addEventListener('submit', async (event) => {
                event.preventDefault();
                const peso = parseFloat(document.getElementById('encomendaPeso').value);
                const tipo = document.getElementById('encomendaTipo').value;
                const descricao = document.getElementById('encomendaDescricao').value;
                const endereco = document.getElementById('encomendaEndereco').value;

                if (isNaN(peso) || peso <= 0) {
                    showMessage('Peso inválido. Deve ser um número positivo.', 'error');
                    return;
                }
                if (!tipo) {
                    showMessage('Selecione um tipo de encomenda.', 'error');
                    return;
                }
                if (!endereco) {
                    showMessage('Endereço de entrega é obrigatório.', 'error');
                    return;
                }

                const newEncomenda = { peso, tipo, descricao, endereco };
                const result = await postData('/encomendas', newEncomenda);
                if (result) {
                    showMessage('Encomenda cadastrada com sucesso!', 'success');
                    form.reset();
                    await loadEncomendas();
                }
            });
        }

        searchButton.addEventListener('click', loadEncomendas);
        filterTipoSelect.addEventListener('change', () => loadEncomendas());
        filterPesoInput.addEventListener('input', () => loadEncomendas());

        async function loadEncomendas() {
            tableBody.innerHTML = '<tr><td colspan="5">Carregando encomendas...</td></tr>';
            const tipoFilter = filterTipoSelect.value;
            const pesoFilter = parseFloat(filterPesoInput.value);

            let endpoint = '/encomendas';
            const params = new URLSearchParams();
            if (tipoFilter) {
                params.append('tipo', tipoFilter);
            }
            if (!isNaN(pesoFilter) && pesoFilter >= 0) {
                params.append('pesoMin', pesoFilter);
            }
            if (params.toString()) {
                endpoint += `?${params.toString()}`;
            }

            const encomendas = await fetchData(endpoint);
            tableBody.innerHTML = '';
            if (encomendas && encomendas.length > 0) {
                encomendas.forEach(encomenda => {
                    const row = tableBody.insertRow();
                    row.insertCell().textContent = encomenda.id;
                    row.insertCell().textContent = encomenda.peso;
                    row.insertCell().textContent = encomenda.tipo;
                    row.insertCell().textContent = encomenda.descricao || 'N/A';
                    row.insertCell().textContent = encomenda.endereco;
                });
            } else {
                tableBody.innerHTML = '<tr><td colspan="5">Nenhuma encomenda encontrada.</td></tr>';
            }
        }
        await loadEncomendas();
    }

    async function handleRotasModule() {
        const form = document.getElementById('rotaForm');
        const tableBody = document.querySelector('#rotasTable tbody');
        const filterOrigemInput = document.getElementById('filterRotaOrigem');
        const filterDestinoInput = document.getElementById('filterRotaDestino');
        const searchButton = document.getElementById('searchRotas');

        if (form) {
            form.addEventListener('submit', async (event) => {
                event.preventDefault();
                const origem = document.getElementById('rotaOrigem').value;
                const destino = document.getElementById('rotaDestino').value;
                const centrosIntermediarios = document.getElementById('rotaCentrosIntermediarios').value.split(',').map(c => c.trim()).filter(c => c);
                const distancia = parseFloat(document.getElementById('rotaDistancia').value);
                const tempoEstimado = parseFloat(document.getElementById('rotaTempoEstimado').value);

                if (!origem || !destino) {
                    showMessage('Origem e Destino são obrigatórios.', 'error');
                    return;
                }
                if (isNaN(distancia) || distancia <= 0) {
                    showMessage('Distância inválida. Deve ser um número positivo.', 'error');
                    return;
                }
                if (isNaN(tempoEstimado) || tempoEstimado <= 0) {
                    showMessage('Tempo estimado inválido. Deve ser um número positivo.', 'error');
                    return;
                }

                const newRota = { origem, destino, centrosIntermediarios, distancia, tempoEstimado };
                const result = await postData('/rotas', newRota);
                if (result) {
                    showMessage('Rota cadastrada com sucesso!', 'success');
                    form.reset();
                    await loadRotas();
                }
            });
        }

        searchButton.addEventListener('click', loadRotas);
        filterOrigemInput.addEventListener('input', () => loadRotas());
        filterDestinoInput.addEventListener('input', () => loadRotas());

        async function loadRotas() {
            tableBody.innerHTML = '<tr><td colspan="6">Carregando rotas...</td></tr>';
            const origemFilter = filterOrigemInput.value.trim();
            const destinoFilter = filterDestinoInput.value.trim();

            let endpoint = '/rotas';
            const params = new URLSearchParams();
            if (origemFilter) {
                params.append('origem', origemFilter);
            }
            if (destinoFilter) {
                params.append('destino', destinoFilter);
            }
            if (params.toString()) {
                endpoint += `?${params.toString()}`;
            }

            const rotas = await fetchData(endpoint);
            tableBody.innerHTML = '';
            if (rotas && rotas.length > 0) {
                rotas.forEach(rota => {
                    const row = tableBody.insertRow();
                    row.insertCell().textContent = rota.id;
                    row.insertCell().textContent = rota.origem;
                    row.insertCell().textContent = rota.destino;
                    row.insertCell().textContent = rota.centrosIntermediarios ? rota.centrosIntermediarios.join(', ') : 'N/A';
                    row.insertCell().textContent = rota.distancia;
                    row.insertCell().textContent = rota.tempoEstimado;
                });
            } else {
                tableBody.innerHTML = '<tr><td colspan="6">Nenhuma rota encontrada.</td></tr>';
            }
        }
        await loadRotas();
    }

    async function handleEntregasModule() {
        const form = document.getElementById('entregaForm');
        const clienteSelect = document.getElementById('entregaCliente');
        const encomendaSelect = document.getElementById('entregaEncomenda');
        const rotaSelect = document.getElementById('entregaRota');
        const tableBody = document.querySelector('#entregasTable tbody');
        const filterClienteSelect = document.getElementById('filterEntregaCliente');
        const filterRotaSelect = document.getElementById('filterEntregaRota');
        const filterDataInput = document.getElementById('filterEntregaData');
        const filterStatusSelect = document.getElementById('filterEntregaStatus');
        const searchButton = document.getElementById('searchEntregas');

        async function populateSelect(selectElement, endpoint, valueField, textField) {
            selectElement.innerHTML = '<option value="">Carregando...</option>';
            const data = await fetchData(endpoint);
            selectElement.innerHTML = '<option value="">Selecione...</option>';
            if (data && data.length > 0) {
                data.forEach(item => {
                    const option = document.createElement('option');
                    option.value = item[valueField];
                    option.textContent = item[textField];
                    selectElement.appendChild(option);
                });
            } else {
                selectElement.innerHTML = '<option value="">Nenhum dado encontrado</option>';
            }
        }

        await populateSelect(clienteSelect, '/clientes', 'id', 'nome');
        await populateSelect(encomendaSelect, '/encomendas', 'id', 'descricao');
        await populateSelect(rotaSelect, '/rotas', 'id', 'origem');

        await populateSelect(filterClienteSelect, '/clientes', 'id', 'nome');
        await populateSelect(filterRotaSelect, '/rotas', 'id', 'origem');

        if (form) {
            form.addEventListener('submit', async (event) => {
                event.preventDefault();
                const clienteId = clienteSelect.value;
                const encomendaId = encomendaSelect.value;
                const rotaId = rotaSelect.value;
                const dataEstimada = document.getElementById('entregaDataEstimada').value;

                if (!clienteId || !encomendaId || !rotaId || !dataEstimada) {
                    showMessage('Todos os campos são obrigatórios para criar uma entrega.', 'error');
                    return;
                }
                const today = new Date().toISOString().split('T')[0];
                if (dataEstimada < today) {
                    showMessage('A data estimada deve ser hoje ou no futuro.', 'error');
                    return;
                }

                const newEntrega = {
                    clienteId: parseInt(clienteId),
                    encomendaId: parseInt(encomendaId),
                    rotaId: parseInt(rotaId),
                    dataEstimada,
                    status: 'em_preparo'
                };

                const result = await postData('/entregas', newEntrega);
                if (result) {
                    showMessage('Entrega criada com sucesso!', 'success');
                    form.reset();
                    await loadEntregas();
                }
            });
        }

        searchButton.addEventListener('click', loadEntregas);
        filterClienteSelect.addEventListener('change', () => loadEntregas());
        filterRotaSelect.addEventListener('change', () => loadEntregas());
        filterDataInput.addEventListener('change', () => loadEntregas());
        filterStatusSelect.addEventListener('change', () => loadEntregas());

        async function loadEntregas() {
            tableBody.innerHTML = '<tr><td colspan="6">Carregando entregas...</td></tr>';
            const clienteFilter = filterClienteSelect.value;
            const rotaFilter = filterRotaSelect.value;
            const dataFilter = filterDataInput.value;
            const statusFilter = filterStatusSelect.value;

            let endpoint = '/entregas';
            const params = new URLSearchParams();
            if (clienteFilter) {
                params.append('clienteId', clienteFilter);
            }
            if (rotaFilter) {
                params.append('rotaId', rotaFilter);
            }
            if (dataFilter) {
                params.append('data', dataFilter);
            }
            if (statusFilter) {
                params.append('status', statusFilter);
            }
            if (params.toString()) {
                endpoint += `?${params.toString()}`;
            }

            const entregas = await fetchData(endpoint);
            tableBody.innerHTML = '';
            if (entregas && entregas.length > 0) {
                for (const entrega of entregas) {
                    const row = tableBody.insertRow();
                    row.insertCell().textContent = entrega.id;
                    const cliente = await fetchData(`/clientes/${entrega.clienteId}`);
                    const encomenda = await fetchData(`/encomendas/${entrega.encomendaId}`);
                    const rota = await fetchData(`/rotas/${entrega.rotaId}`);

                    row.insertCell().textContent = cliente ? cliente.nome : 'N/A';
                    row.insertCell().textContent = encomenda ? (encomenda.descricao || `Encomenda #${encomenda.id}`) : 'N/A';
                    row.insertCell().textContent = rota ? `${rota.origem} - ${rota.destino}` : 'N/A';
                    row.insertCell().textContent = entrega.dataEstimada;
                    row.insertCell().textContent = entrega.status;
                }
            } else {
                tableBody.innerHTML = '<tr><td colspan="6">Nenhuma entrega encontrada.</td></tr>';
            }
        }
        await loadEntregas();
    }

    async function handleCentrosModule() {
        const tableBody = document.querySelector('#centrosTable tbody');

        async function loadCentros() {
            tableBody.innerHTML = '<tr><td colspan="3">Carregando centros de distribuição...</td></tr>';
            const centros = await fetchData('/centros');
            tableBody.innerHTML = '';
            if (centros && centros.length > 0) {
                centros.forEach(centro => {
                    const row = tableBody.insertRow();
                    row.insertCell().textContent = centro.id;
                    row.insertCell().textContent = centro.nome;
                    row.insertCell().textContent = centro.endereco;
                });
            } else {
                tableBody.innerHTML = '<tr><td colspan="3">Nenhum centro de distribuição encontrado.</td></tr>';
            }
        }
        await loadCentros();
    }
});