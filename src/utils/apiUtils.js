/**
 * Normalizes the API base URL by removing trailing slashes
 * to prevent double slashes when concatenating with paths
 */
export function getApiBase() {
  const apiBase = import.meta.env.VITE_PAYLOAD_API_URL || "http://localhost:3011";
  // Remove trailing slashes to prevent double slashes
  return apiBase.replace(/\/+$/, '');
}

/**
 * Constructs a full API URL, ensuring no double slashes
 * @param {string} path - The API path (e.g., 'api/testimonials' or '/api/testimonials')
 * @returns {string} - The full normalized API URL
 */
export function getApiUrl(path) {
  const apiBase = getApiBase();
  // Ensure path starts with / and remove any duplicate slashes
  const normalizedPath = '/' + path.replace(/^\/+/, '').replace(/\/+/g, '/');
  return `${apiBase}${normalizedPath}`;
}
