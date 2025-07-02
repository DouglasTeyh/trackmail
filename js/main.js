// js/main.js

const API_BASE_URL = 'http://localhost:3000'; // Substitua pela URL da sua API REST

// Função genérica para fazer requisições GET
async function fetchData(endpoint) {
    try {
        const response = await fetch(`${API_BASE_URL}${endpoint}`);
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || `Erro HTTP! Status: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error(`Erro ao buscar dados de ${endpoint}:`, error);
        alert(`Não foi possível carregar os dados. Detalhes: ${error.message}`);
        return null;
    }
}

// Função genérica para fazer requisições POST
async function postData(endpoint, data) {
    try {
        const response = await fetch(`${API_BASE_URL}${endpoint}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || `Erro HTTP! Status: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error(`Erro ao enviar dados para ${endpoint}:`, error);
        alert(`Erro ao cadastrar. Detalhes: ${error.message}`);
        return null;
    }
}

// Validação de e-mail simples
function isValidEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
}

// Validação de CPF/CNPJ (apenas formato básico, não a validação de dígitos)
function isValidCpfCnpj(doc) {
    const cleanedDoc = doc.replace(/\D/g, ''); // Remove não-dígitos
    if (cleanedDoc.length === 11 || cleanedDoc.length === 14) {
        return true; // Assume que o formato está ok para CPF ou CNPJ
    }
    return false;
}

// Função para mostrar mensagens de erro no frontend (pode ser aprimorada com um div específico)
function showMessage(message, type = 'error') {
    const msgDiv = document.createElement('div');
    msgDiv.textContent = message;
    msgDiv.classList.add(type === 'error' ? 'error-message' : 'success-message');
    // Adicionar ao corpo ou a um elemento específico onde as mensagens devem aparecer
    document.body.prepend(msgDiv); // Adiciona no início do body
    setTimeout(() => msgDiv.remove(), 5000); // Remove a mensagem após 5 segundos
}