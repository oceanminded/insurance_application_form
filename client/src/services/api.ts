import axios from 'axios';
import { InsuranceApplication } from '../types/insuranceApplication.models';

const API_BASE_URL = 'http://localhost:3000';

export const api = {
    createApplication: async (data: Partial<InsuranceApplication>) => {
        const response = await axios.post(`${API_BASE_URL}/applications`, data);
        return response.data;
    },

    getApplication: async (id: string) => {
        const response = await axios.get(`${API_BASE_URL}/applications/${id}`);
        return response.data;
    },

    updateApplication: async (id: string, data: Partial<InsuranceApplication>) => {
        const response = await axios.put(`${API_BASE_URL}/applications/${id}`, data);
        return response.data;
    },

    getQuote: async (id: string) => {
        const response = await axios.post(`${API_BASE_URL}/applications/${id}/quote`);
        return response.data;
    },
};
