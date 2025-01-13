import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:5124/api',
    headers: {
        'Content-Type': 'application/json',
    },
});

export const getAppointments = async () => {
    try {
        const response = await api.get('/appointments');
        return response.data;
    } catch (error) {
        console.error('Error al obtener las citas:', error);
        throw error;
    }
};