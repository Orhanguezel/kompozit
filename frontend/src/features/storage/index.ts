import api from '@/lib/axios';

export const storageService = {
  upload: async (file: File, folder = 'quote-requests', bucket = 'uploads') => {
    const formData = new FormData();
    formData.append('file', file);
    const safeName = file.name.replace(/[^\w.\-]+/g, '_');
    const path = `${folder}/${Date.now()}-${safeName}`;
    const res = await api.post(`/storage/${bucket}/upload`, formData, {
      params: { path, upsert: '1' },
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return res.data;
  },
};
