
const BASE_URL = import.meta.env.VITE_API_URL || 'http://https://projeto-agita.onrender.com';

// Função auxiliar para chamadas fetch
async function apiFetch(endpoint, options = {}) {
    try {
        const response = await fetch(`${BASE_URL}${endpoint}`, options);

        // Tenta retornar JSON, se não, apenas o status de OK
        const contentType = response.headers.get("content-type");
        if (contentType && contentType.indexOf("application/json") !== -1) {
             const data = await response.json();
             if (!response.ok) {
                // Se a resposta NÃO foi ok, joga um erro com a mensagem do backend
                throw new Error(data.message || 'Erro da API');
             }
             return data; // Sucesso (ex: um GET ou um POST que retorna dados)
        }

        if (!response.ok) {
             throw new Error(`Erro ${response.status} na API`);
        }

        return { ok: true, status: response.status }; // Sucesso (ex: um DELETE)

    } catch (err) {
        console.error(`Erro na chamada API para ${endpoint}:`, err);
        // Re-joga o erro para o componente que chamou poder tratar
        throw err; 
    }
}

// --- FUNÇÕES DE BUSCA (GET) ---

export const fetchAthletes = () => apiFetch('/users/athletes');
export const fetchEvents = () => apiFetch('/events');
export const fetchAgeCategories = () => apiFetch('/age-categories');
export const fetchApparatusList = () => apiFetch('/apparatus');
export const fetchEventsList = () => apiFetch('/events/list');
export const fetchGradesReport = () => apiFetch('/grades-report');
export const fetchPaymentsReport = () => apiFetch('/payments-report');
export const fetchDocumentsReport = () => apiFetch('/documents');

// --- FUNÇÕES DE AÇÃO (POST, PUT, DELETE) ---

export const createEvent = (eventData) => apiFetch('/events/create', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(eventData)
});

export const deleteEvent = (eventId) => apiFetch(`/events/${eventId}`, { 
    method: 'DELETE' 
});

export const createGrade = (gradeForm) => apiFetch('/grades/create', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(gradeForm)
});

export const deleteGrade = (gradeId) => apiFetch(`/grades/${gradeId}`, {
    method: 'DELETE'
});

export const createPayment = (paymentForm) => apiFetch('/payments/create', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(paymentForm)
});

export const updatePaymentStatus = (paymentId, newStatus) => apiFetch(`/payments/${paymentId}/status`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status: newStatus })
});

export const deletePayment = (paymentId) => apiFetch(`/payments/${paymentId}`, {
    method: 'DELETE'
});

export const uploadDocument = (formData) => apiFetch('/documents/upload', {
    method: 'POST',
    body: formData, // FormData define o 'Content-Type' automaticamente (multipart/form-data)
});

export const deleteDocument = (docId) => apiFetch(`/documents/${docId}`, {
    method: 'DELETE'
});

// Você não tinha um 'login' no dashboard, mas ele deveria ficar aqui:
export const login = (username, password) => apiFetch('/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password })
}); 

// --- FUNÇÕES DO PAINEL DO ATLETA ---

export const fetchUserDetails = (userId) => apiFetch(`/users/${userId}/details`);

export const fetchMyGrades = (userId) => apiFetch(`/grades-report/${userId}`);

export const fetchMyPayments = (userId) => apiFetch(`/payments-report/${userId}`);

export const fetchMyDocuments = (userId) => apiFetch(`/documents/${userId}`);