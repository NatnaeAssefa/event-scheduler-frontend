import axios from 'axios';
import { Event, EventFormData } from '@/types/event';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to include auth token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const eventApi = {
  getEvents: async (startDate: Date, endDate: Date): Promise<Event[]> => {
    const response = await api.get('/event', {
      params: {
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
      },
    });
    return response.data.data;
  },

  getEvent: async (id: string): Promise<Event> => {
    const response = await api.get(`/event/${id}`);
    return response.data.data;
  },

  createEvent: async (eventData: EventFormData): Promise<Event> => {
    const response = await api.post('/event', eventData);
    return response.data.data;
  },

  updateEvent: async (eventData: EventFormData): Promise<Event> => {
    const response = await api.put('/event', eventData);
    return response.data.data;
  },

  deleteEvent: async (id: string): Promise<void> => {
    await api.delete('/event', { data: { id } });
  },
};

export default api; 