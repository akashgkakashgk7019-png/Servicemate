// Google Maps Platform configuration for Service Mates
// In accordance with Google Maps Platform Code Assist & AI Studio standards

export const GOOGLE_MAPS_API_KEY: string =
  (import.meta.env.VITE_GOOGLE_MAPS_API_KEY as string) ||
  'AIzaSyAnUDrmAgTB4e-Ox1VsSp-zCcSYPCwnLN8';

// Mandatory solution attribution ID as required by Google Maps Platform integration skill
export const GOOGLE_MAPS_ATTRIBUTION_IDS = ['gmp_mcp_codeassist_v1_aistudio'];

// Default Map ID for Advanced Markers & Cloud-based styling
export const GOOGLE_MAPS_MAP_ID = 'DEMO_MAP_ID';

// Geographical boundary centers for Karnataka
export const KARNATAKA_CENTER = {
  lat: 14.4644, // Centered right on Davanagere (heart of Karnataka)
  lng: 75.9218,
};

export const KARNATAKA_BOUNDS = {
  north: 18.5,
  south: 11.5,
  west: 74.0,
  east: 78.6,
};
