import { ref } from 'vue';

const API_BASE_URL = import.meta.env.PROD 
    ? '/api' 
    : 'http://200.133.17.234:5000';

export function useApi() {
    const message = ref('');
    const messageType = ref('');

    const showMessage = (msg, type = 'success') => {
        message.value = msg;
        messageType.value = type;
        setTimeout(() => {
            message.value = '';
        }, 5000);
    };

    const fetchData = async (endpoint, timeout = 8000) => {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), timeout);

        try {
            const response = await fetch(`${API_BASE_URL}${endpoint}`, {
                signal: controller.signal
            });
            if (!response.ok) {
                const errorData = await response.json().catch(() => ({ message: `Erro HTTP! Status: ${response.status}` }));
                throw new Error(errorData.message);
            }
            return await response.json();
        } catch (error) {
            if (error.name === 'AbortError') {
                throw new Error('O servidor demorou muito para responder. Tente novamente.');
            }
            throw error;
        } finally {
            clearTimeout(timeoutId);
        }
    };

    const postData = async (endpoint, data) => {
        try {
            const response = await fetch(`${API_BASE_URL}${endpoint}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });
            if (!response.ok) {
                const errorData = await response.json().catch(() => ({ message: `Erro HTTP! Status: ${response.status}` }));
                throw new Error(errorData.message);
            }
            return await response.json();
        } catch (error) {
            showMessage(`Erro ao cadastrar: ${error.message}`, 'error');
            return null;
        }
    };

    const updateData = async (endpoint, id, data) => {
        try {
            const response = await fetch(`${API_BASE_URL}${endpoint}/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });
            if (!response.ok) {
                const errorData = await response.json().catch(() => ({ message: `Erro HTTP! Status: ${response.status}` }));
                throw new Error(errorData.message);
            }
            return await response.json();
        } catch (error) {
            showMessage(`Erro ao atualizar: ${error.message}`, 'error');
            return null;
        }
    };

    const deleteData = async (endpoint, id) => {
        try {
            const response = await fetch(`${API_BASE_URL}${endpoint}/${id}`, {
                method: 'DELETE',
            });
            if (!response.ok) {
                const errorData = await response.json().catch(() => ({ message: `Erro HTTP! Status: ${response.status}` }));
                throw new Error(errorData.message);
            }
            return response.ok;
        } catch (error) {
            showMessage(`Erro ao deletar: ${error.message}`, 'error');
            return false;
        }
    };

    return { message, messageType, showMessage, fetchData, postData, updateData, deleteData };
}
