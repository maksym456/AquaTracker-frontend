// Podstawowe typy dla systemu AquaTracker

export interface User {
  id: string;
  email: string;
  name: string;
  role: 'user' | 'admin' | 'superadmin';
  createdAt: Date;
  updatedAt: Date;
}

export interface Aquarium {
  id: string;
  name: string;
  description?: string;
  volume: number; // w litrach
  temperature: number; // w °C
  ph: number;
  hardness: number; // w dGH
  ownerId: string;
  sharedWith: string[]; // ID użytkowników z dostępem
  createdAt: Date;
  updatedAt: Date;
}

export interface Fish {
  id: string;
  name: string;
  species: string;
  scientificName: string;
  aquariumId: string;
  addedAt: Date;
  // Parametry środowiskowe
  minTemperature: number;
  maxTemperature: number;
  minPh: number;
  maxPh: number;
  minHardness: number;
  maxHardness: number;
  // Kompatybilność
  compatibleWith: string[]; // ID innych ryb
  incompatibleWith: string[]; // ID ryb z którymi nie może żyć
}

export interface Plant {
  id: string;
  name: string;
  species: string;
  scientificName: string;
  aquariumId: string;
  addedAt: Date;
  // Parametry środowiskowe
  minTemperature: number;
  maxTemperature: number;
  minPh: number;
  maxPh: number;
  minHardness: number;
  maxHardness: number;
  // Wymagania
  lightRequirements: 'low' | 'medium' | 'high';
  co2Requirements: 'none' | 'low' | 'medium' | 'high';
}

export interface ActivityLog {
  id: string;
  userId: string;
  action: string;
  entityType: 'aquarium' | 'fish' | 'plant' | 'user';
  entityId: string;
  details: Record<string, any>;
  timestamp: Date;
}

// Typy dla formularzy
export interface CreateAquariumData {
  name: string;
  description?: string;
  volume: number;
  temperature: number;
  ph: number;
  hardness: number;
}

export interface AddFishData {
  name: string;
  species: string;
  scientificName: string;
  aquariumId: string;
}

export interface AddPlantData {
  name: string;
  species: string;
  scientificName: string;
  aquariumId: string;
}

// Typy dla API responses
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
