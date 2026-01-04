const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

async function fetchAPI(endpoint, options = {}) {
  try {
    if (typeof fetch === 'undefined') {
      throw new Error('fetch is not available in this environment');
    }

    const url = `${API_BASE_URL}${endpoint}`;
    
    const defaultOptions = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    };

    const user = typeof window !== 'undefined' ? localStorage.getItem('user') : null;
    if (user) {
      try {
        const userData = JSON.parse(user);
        if (userData.token) {
          defaultOptions.headers['Authorization'] = `Bearer ${userData.token}`;
        }
      } catch (e) {
      }
    }

    const finalOptions = { ...defaultOptions, ...options };
    
    if (options.headers) {
      finalOptions.headers = { ...defaultOptions.headers, ...options.headers };
    }

    if (finalOptions.body && typeof finalOptions.body === 'object') {
      finalOptions.body = JSON.stringify(finalOptions.body);
    }

    let timeoutId;
    let controller;
    
    if (typeof AbortController !== 'undefined') {
      controller = new AbortController();
      timeoutId = setTimeout(() => {
        controller.abort();
      }, 5000);
    }
    
    try {
      const fetchOptions = controller 
        ? { ...finalOptions, signal: controller.signal }
        : finalOptions;
        
      const response = await fetch(url, fetchOptions);
      
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
      
      console.log(`API Request: ${options.method || 'GET'} ${url}`);
      console.log(`API Response Status: ${response.status} ${response.statusText}`);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error(`API Error Response:`, errorText);
        throw new Error(`API Error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      console.log(`API Response Data:`, data);
      return data;
      
    } catch (fetchError) {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
      
      if (fetchError.name === 'AbortError' || fetchError.message?.includes('aborted')) {
        throw new Error('API request timeout');
      }
      
      if (fetchError.message === 'Failed to fetch' || fetchError.name === 'TypeError') {
        console.warn('Nie można połączyć się z API:', url);
        throw new Error('Nie można połączyć się z API. Sprawdź czy serwer jest dostępny.');
      }
      
      throw fetchError;
    }
    
  } catch (error) {
    console.warn('API Request failed:', error.message);
    throw error;
  }
}

export async function getContacts(userId) {
  try {
    if (typeof window === 'undefined') return [];
    if (!userId) return [];
    const contacts = await fetchAPI(`/v1/contacts/${userId}`);
    return Array.isArray(contacts) ? contacts : [];
  } catch (error) {
    console.warn('API request failed, returning empty array:', error.message);
    return [];
  }
}

export async function getFishes() {
  try {
    if (typeof window === 'undefined') {
      console.warn('Running on server, cannot fetch data');
      return [];
    }

    const fishes = await fetchAPI('/v1/fish');
    
    if (fishes && Array.isArray(fishes)) {
      return fishes;
    }
    
    console.warn('API returned invalid data format');
    return [];
    
  } catch (error) {
    console.warn('API request failed, returning empty array:', error.message);
    return [];
  }
}

export async function getFishById(id) {
  try {
    const fish = await fetchAPI(`/v1/fish/${id}`);
    return fish;
  } catch (error) {
    console.error(`Error fetching fish with id ${id}:`, error);
    return null;
  }
}

export async function searchFishes(filters = {}) {
  try {
    const queryParams = new URLSearchParams();
    
    if (filters.waterType) {
      queryParams.append('waterType', filters.waterType);
    }
    if (filters.temperament) {
      queryParams.append('temperament', filters.temperament);
    }
    if (filters.biotope) {
      queryParams.append('biotope', filters.biotope);
    }

    const endpoint = `/v1/fish/search?${queryParams.toString()}`;
    const fishes = await fetchAPI(endpoint);
    return fishes;
  } catch (error) {
    console.error('Error searching fishes:', error);
    return [];
  }
}

export async function getPlants() {
  try {
    if (typeof window === 'undefined') {
      console.warn('Running on server, cannot fetch data');
      return [];
    }

    const plants = await fetchAPI('/v1/plants');
    
    if (plants && Array.isArray(plants)) {
      return plants;
    }
    
    console.warn('API returned invalid data format');
    return [];
    
  } catch (error) {
    console.warn('API request failed, returning empty array:', error.message);
    return [];
  }
}

export async function getPlantById(id) {
  try {
    const plant = await fetchAPI(`/v1/plants/${id}`);
    return plant;
  } catch (error) {
    console.error(`Error fetching plant with id ${id}:`, error);
    return null;
  }
}

export async function searchPlants(filters = {}) {
  try {
    const queryParams = new URLSearchParams();
    
    if (filters.biotope) {
      queryParams.append('biotope', filters.biotope);
    }
    if (filters.temperature) {
      queryParams.append('temperature', filters.temperature);
    }
    if (filters.ph) {
      queryParams.append('ph', filters.ph);
    }

    const endpoint = `/v1/plants/search?${queryParams.toString()}`;
    const plants = await fetchAPI(endpoint);
    return plants;
  } catch (error) {
    console.error('Error searching plants:', error);
    return [];
  }
}

// ============================================
// FUNKCJE API DLA AKWARIÓW
// ============================================

// Pobiera wszystkie akwaria użytkownika (backend zwraca akwaria zalogowanego użytkownika na podstawie tokenu JWT)
export async function getAquariums() {
  try {
    if (typeof window === 'undefined') return [];
    const aquariums = await fetchAPI('/v1/aquariums');
    console.log('Fetched aquariums:', aquariums);
    return Array.isArray(aquariums) ? aquariums : [];
  } catch (error) {
    console.error('API request failed:', error);
    console.error('Error details:', error.message);
    return [];
  }
}


// Pobiera jedno akwarium po ID
export async function getAquariumById(id) {
  try {
    const aquarium = await fetchAPI(`/v1/aquariums/${id}`);
    return aquarium;
  } catch (error) {
    console.error(`Error fetching aquarium with id ${id}:`, error);
    return null;
  }
}

// Tworzy nowe akwarium
export async function createAquarium(aquariumData) {
  try {
    const aquarium = await fetchAPI('/v1/aquariums', {
      method: 'POST',
      body: aquariumData
    });
    return aquarium;
  } catch (error) {
    console.error('Error creating aquarium:', error);
    throw error;
  }
}

// Aktualizuje akwarium
export async function updateAquarium(id, aquariumData) {
  try {
    const aquarium = await fetchAPI(`/v1/aquariums/${id}`, {
      method: 'PUT',
      body: aquariumData
    });
    return aquarium;
  } catch (error) {
    console.error(`Error updating aquarium with id ${id}:`, error);
    throw error;
  }
}

// Usuwa akwarium
export async function deleteAquarium(id) {
  try {
    await fetchAPI(`/v1/aquariums/${id}`, {
      method: 'DELETE'
    });
    return true;
  } catch (error) {
    console.error(`Error deleting aquarium with id ${id}:`, error);
    throw error;
  }
}

// Dodaje rybę do akwarium
export async function addFishToAquarium(aquariumId, fishId, count = 1) {
  try {
    const result = await fetchAPI(`/v1/aquariums/${aquariumId}/fish`, {
      method: 'POST',
      body: { fishId, count }
    });
    // Backend zwraca {aquarium: ..., logEntry: ...}
    // Zwracamy zaktualizowane akwarium, jeśli jest w odpowiedzi
    if (result && result.aquarium) {
      return result.aquarium;
    }
    return result;
  } catch (error) {
    console.error(`Error adding fish to aquarium ${aquariumId}:`, error);
    throw error;
  }
}

// Usuwa rybę z akwarium
export async function removeFishFromAquarium(aquariumId, fishId) {
  try {
    console.log('removeFishFromAquarium called with:', { aquariumId, fishId });
    const endpoint = `/v1/aquariums/${aquariumId}/fish/${fishId}`;
    console.log('Calling DELETE endpoint:', endpoint);
    
    const result = await fetchAPI(endpoint, {
      method: 'DELETE'
    });
    
    console.log('removeFishFromAquarium response:', result);
    console.log('removeFishFromAquarium response type:', typeof result);
    console.log('removeFishFromAquarium response keys:', result ? Object.keys(result) : 'null');
    console.log('removeFishFromAquarium result.aquarium:', result?.aquarium);
    console.log('removeFishFromAquarium result.logEntry:', result?.logEntry);
    console.log('removeFishFromAquarium result.LogEntry:', result?.LogEntry);
    
    // Backend zwraca {aquarium: ..., logEntry: ...}
    // Sprawdzamy wszystkie możliwe warianty
    if (result && result.aquarium) {
      console.log('Returning result.aquarium (lowercase)');
      return result.aquarium;
    }
    if (result && result.Aquarium) {
      console.log('Returning result.Aquarium (uppercase)');
      return result.Aquarium;
    }
    // Jeśli result ma id i fishes, to może jest już akwarium (nie obiekt z aquarium i logEntry)
    // To może się zdarzyć, jeśli backend zwraca bezpośrednio akwarium
    if (result && result.id && Array.isArray(result.fishes)) {
      console.log('Result is already aquarium (has id and fishes array), returning as is');
      return result;
    }
    // Jeśli result ma LogEntry (z wielkiej litery) i aquarium, to może backend zwraca inny format
    if (result && result.LogEntry && result.aquarium) {
      console.log('Returning result.aquarium (with LogEntry uppercase)');
      return result.aquarium;
    }
    console.log('No aquarium found in response, returning result or true');
    return result || true;
  } catch (error) {
    console.error(`Error removing fish from aquarium ${aquariumId}:`, error);
    console.error('Error details:', {
      message: error.message,
      stack: error.stack,
      aquariumId,
      fishId
    });
    throw error;
  }
}

// Dodaje roślinę do akwarium
export async function addPlantToAquarium(aquariumId, plantId, count = 1) {
  try {
    const result = await fetchAPI(`/v1/aquariums/${aquariumId}/plants`, {
      method: 'POST',
      body: { plantId, count }
    });
    // Backend zwraca {aquarium: ..., logEntry: ...}
    // Zwracamy zaktualizowane akwarium, jeśli jest w odpowiedzi
    if (result && result.aquarium) {
      return result.aquarium;
    }
    return result;
  } catch (error) {
    console.error(`Error adding plant to aquarium ${aquariumId}:`, error);
    throw error;
  }
}

// Usuwa roślinę z akwarium
export async function removePlantFromAquarium(aquariumId, plantId) {
  try {
    const result = await fetchAPI(`/v1/aquariums/${aquariumId}/plants/${plantId}`, {
      method: 'DELETE'
    });
    // Backend zwraca {aquarium: ..., logEntry: ...}
    // Zwracamy zaktualizowane akwarium, jeśli jest w odpowiedzi
    if (result && result.aquarium) {
      return result.aquarium;
    }
    return result || true;
  } catch (error) {
    console.error(`Error removing plant from aquarium ${aquariumId}:`, error);
    throw error;
  }
}

// ============================================
// FUNKCJE API DLA UŻYTKOWNIKÓW (AUTH)
// ============================================

// Logowanie użytkownika
export async function loginUser(email, password) {
  try {
    const response = await fetchAPI('/auth/login', {
      method: 'POST',
      body: { email, password }
    });
    return response;
  } catch (error) {
    console.error('Error logging in:', error);
    throw error;
  }
}

// Rejestracja użytkownika
export async function registerUser(name, email, password) {
  try {
    const response = await fetchAPI('/auth/register', {
      method: 'POST',
      body: { name, email, password }
    });
    return response;
  } catch (error) {
    console.error('Error registering user:', error);
    throw error;
  }
}

// Pobiera dane zalogowanego użytkownika
export async function getCurrentUser() {
  try {
    const user = await fetchAPI('/auth/me');
    return user;
  } catch (error) {
    console.error('Error fetching current user:', error);
    return null;
  }
}

// Aktualizuje dane użytkownika
export async function updateUser(userData) {
  try {
    const user = await fetchAPI('/auth/me', {
      method: 'PUT',
      body: userData
    });
    return user;
  } catch (error) {
    console.error('Error updating user:', error);
    throw error;
  }
}

export default {
  getContacts,
  getFishes,
  getFishById,
  searchFishes,
  getPlants,
  getPlantById,
  searchPlants,
  getAquariums,
  getAquariumById,
  createAquarium,
  updateAquarium,
  deleteAquarium,
  addFishToAquarium,
  removeFishFromAquarium,
  addPlantToAquarium,
  removePlantFromAquarium,
  loginUser,
  registerUser,
  getCurrentUser,
  updateUser,
};
