const API_BASE_URL = 'http://localhost:3000';

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

function isValidEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
}

function isValidCpfCnpj(doc) {
    const cleanedDoc = doc.replace(/\D/g, '');
    if (cleanedDoc.length === 11 || cleanedDoc.length === 14) {
        return true;
    }
    return false;
}

function showMessage(message, type = 'error') {
    const msgDiv = document.createElement('div');
    msgDiv.textContent = message;
    msgDiv.classList.add(type === 'error' ? 'error-message' : 'success-message');
    document.body.prepend(msgDiv);
    setTimeout(() => msgDiv.remove(), 5000);
}