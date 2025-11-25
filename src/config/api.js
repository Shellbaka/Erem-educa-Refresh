const sanitizeBaseUrl = (value) => {
  if (!value) return '';
  return value.endsWith('/') ? value.slice(0, -1) : value;
};

const fallbackUrl = typeof window === 'undefined'
  ? 'http://localhost:8787'
  : `${window.location.origin}/api`;

const apiBase = sanitizeBaseUrl(import.meta?.env?.VITE_API_URL ?? '') || fallbackUrl;

export const getApiBaseUrl = () => apiBase;

