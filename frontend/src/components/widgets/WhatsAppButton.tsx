'use client';

import { useState, useEffect } from 'react';
import { MessageCircle } from 'lucide-react';

const FALLBACK_WHATSAPP_NUMBER = '+90 531 880 31 51';

export function WhatsAppButton({ phone }: { phone?: string }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), 3000);
    return () => clearTimeout(timer);
  }, []);

  const whatsappNumber = phone || process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || FALLBACK_WHATSAPP_NUMBER;
  const cleanNumber = whatsappNumber.replace(/\D/g, '');
  if (!cleanNumber || !visible) return null;

  const url = `https://wa.me/${cleanNumber}`;

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="WhatsApp"
      className="fab-success fixed bottom-6 left-6 z-50 flex size-14 items-center justify-center rounded-full shadow-lg transition-transform hover:scale-110 active:scale-95"
    >
      <MessageCircle className="size-7" />
    </a>
  );
}
