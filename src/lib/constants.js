// Override at build time with VITE_API_BASE_URL, e.g. in .env:
//   VITE_API_BASE_URL=https://crisiswatch-ohrl.onrender.com
export const API_BASE_URL =
  import.meta.env?.VITE_API_BASE_URL || 'https://crisiswatch-ohrl.onrender.com'
