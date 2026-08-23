/**
 * API origin for browser requests.
 * - unset (local default): http://localhost:3020
 * - empty string (production same-origin): "" so paths like `/events` hit the site Nginx proxy
 */
export const API_BASE_URL =
  import.meta.env.VITE_API_URL ?? "http://localhost:3020";
