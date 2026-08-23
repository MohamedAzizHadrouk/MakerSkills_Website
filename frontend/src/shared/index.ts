import { API_BASE_URL } from "./apiBase";

// Export du client API partagé
export { default as ApiService } from "./apiClient";
export { API_BASE_URL } from "./apiBase";

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
  BASE_URL: API_BASE_URL,
  TIMEOUT: 10000,
  RETRY_ATTEMPTS: 3,
};
