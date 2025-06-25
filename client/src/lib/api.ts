export const API_ENDPOINTS = {
  NASA_APOD: 'https://api.nasa.gov/planetary/apod',
  ISS_LOCATION: 'http://api.open-notify.org/iss-now.json',
  N8N_CHATBOT: import.meta.env.VITE_N8N_CHATBOT_WEBHOOK || '',
  N8N_TOURISM: import.meta.env.VITE_N8N_TOURISM_WEBHOOK || '',
};

export const NASA_API_KEY = import.meta.env.VITE_NASA_API_KEY || 'DEMO_KEY';

export async function fetchWithTimeout(url: string, options: RequestInit = {}, timeout = 10000) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
    });
    clearTimeout(timeoutId);
    return response;
  } catch (error) {
    clearTimeout(timeoutId);
    throw error;
  }
}
