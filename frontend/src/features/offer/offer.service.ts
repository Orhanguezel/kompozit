import api from '@/lib/axios';

export interface OfferPayload {
  customer_name: string;
  email: string;
  phone?: string;
  company_name?: string;
  message?: string;
  subject?: string;
  form_data?: Record<string, unknown>;
  quantity?: string;
  source?: string;
}

export const offerService = {
  create: async (payload: OfferPayload) => {
    const res = await api.post('/offers', { ...payload, source: 'kompozit' });
    return res.data;
  },
};
