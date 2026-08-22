// Export du client API partagé
export { default as ApiService } from "./apiClient";

// Export des composants partagés
export { default as ConfirmDialog } from "./components/ConfirmDialog";

// Types partagés pour les réponses API
export interface ApiResponse<T> {
  data: T;
  message?: string;
  success?: boolean;
}

// Configuration de l'API
export const API_CONFIG = {
  BASE_URL: import.meta.env.VITE_API_URL || "http://localhost:3020/api/v1",
  TIMEOUT: 10000,
  RETRY_ATTEMPTS: 3,
};
