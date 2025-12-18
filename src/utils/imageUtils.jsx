// Image URL utility functions
// This utility handles proper construction of image URLs for Payload CMS media

const API_BASE = import.meta.env.VITE_PAYLOAD_API_URL || 'http://localhost:3011';

/**
 * Constructs a full image URL from a relative path
 * @param {string} imagePath - The relative image path from Payload CMS
 * @returns {string} - The full image URL
 */
export function getImageUrl(imagePath) {
  if (!imagePath) return '';
  
  // If it's already a full URL, return as is
  if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
    return imagePath;
  }
  
  // If it starts with /api/media, it's already the correct path
  if (imagePath.startsWith('/api/media')) {
    return `${API_BASE}${imagePath}`;
  }
  
  // If it's just a filename, construct the full API path
  if (imagePath && !imagePath.includes('/') && !imagePath.startsWith('/')) {
    // Encode the filename for URL safety
    const encodedFilename = encodeURIComponent(imagePath);
    return `${API_BASE}/api/media/file/${encodedFilename}`;
  }
  
  // If it's a relative path starting with /, prepend the API base
  if (imagePath.startsWith('/')) {
    return `${API_BASE}${imagePath}`;
  }
  
  // Default: prepend API base
  return `${API_BASE}/${imagePath}`;
}

/**
 * Handles image error by hiding the broken image
 * @param {Event} e - The error event
 */
export function handleImageError(e) {
  e.target.style.display = 'none';
}

/**
 * Gets the API base URL
 * @returns {string} - The API base URL
 */
export function getApiBase() {
  return API_BASE;
}
