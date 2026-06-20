import axios from 'axios';
import { IQuotation } from '../types/quotation';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const quotationApi = {
  getQuotations: async (search?: string): Promise<IQuotation[]> => {
    const response = await api.get<IQuotation[]>('/quotations', {
      params: { search },
    });
    return response.data;
  },

  getQuotationById: async (id: string): Promise<IQuotation> => {
    const response = await api.get<IQuotation>(`/quotations/${id}`);
    return response.data;
  },

  createQuotation: async (data: Partial<IQuotation>): Promise<IQuotation> => {
    const response = await api.post<IQuotation>('/quotations', data);
    return response.data;
  },

  updateQuotation: async (id: string, data: Partial<IQuotation>): Promise<IQuotation> => {
    const response = await api.put<IQuotation>(`/quotations/${id}`, data);
    return response.data;
  },

  deleteQuotation: async (id: string): Promise<{ message: string }> => {
    const response = await api.delete<{ message: string }>(`/quotations/${id}`);
    return response.data;
  },

  duplicateQuotation: async (id: string): Promise<IQuotation> => {
    const response = await api.post<IQuotation>(`/quotations/${id}/duplicate`);
    return response.data;
  },
};
