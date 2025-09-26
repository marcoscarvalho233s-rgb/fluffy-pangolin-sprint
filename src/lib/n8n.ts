const N8N_WEBHOOK_URL = import.meta.env.VITE_N8N_WEBHOOK_URL || 'https://webhook.shampooautomat.shop/webhook/aplicativoft';

export const notifyN8N = async (evento: string, dados: any) => {
  try {
    await fetch(N8N_WEBHOOK_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        evento,
        dados,
        timestamp: new Date().toISOString()
      })
    });
  } catch (error) {
    console.error('N8N notification error:', error);
  }
};