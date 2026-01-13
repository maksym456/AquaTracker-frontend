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
        
        // Spróbuj sparsować JSON z błędem z backendu
        let errorMessage = `API Error: ${response.status} ${response.statusText}`;
        try {
          const errorJson = JSON.parse(errorText);
          if (errorJson.message) {
            errorMessage = errorJson.message;
          } else if (errorJson.error) {
            errorMessage = errorJson.error;
          }
        } catch (e) {
          // Jeśli nie jest JSON, użyj oryginalnego tekstu
          if (errorText && errorText.trim()) {
            errorMessage = errorText;
          }
        }
        
        // Loguj tylko raz, na poziomie debugowania
        if (process.env.NODE_ENV === 'development') {
          console.warn(`API Error (${response.status}):`, errorMessage);
        }
        
        const error = new Error(errorMessage);
        error.status = response.status;
        error.statusText = response.statusText;
        error.originalResponse = errorText;
        throw error;
      }

      // Sprawdź, czy odpowiedź ma zawartość (DELETE może zwracać 204 No Content)
      const contentType = response.headers.get('content-type');
      const contentLength = response.headers.get('content-length');
      
      // Jeśli odpowiedź jest pusta (204 No Content) lub nie ma content-type JSON, zwróć null
      if (response.status === 204 || 
          contentLength === '0' || 
          !contentType || 
          !contentType.includes('application/json')) {
        return null;
      }

      // Spróbuj sparsować JSON, ale obsłuż przypadek pustej odpowiedzi
      try {
        const text = await response.text();
        if (!text || text.trim() === '') {
          return null;
        }
        const data = JSON.parse(text);
        console.log(`API Response Data:`, data);
        return data;
      } catch (jsonError) {
        // Jeśli nie można sparsować JSON, zwróć null (dla DELETE 204)
        if (response.status === 204) {
          return null;
        }
        console.warn('Failed to parse JSON response:', jsonError);
        throw new Error(`Failed to parse response: ${jsonError.message}`);
      }
      
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

// Pomocnicza funkcja do konwersji cognitoSub na userId w formacie "u_123"
async function getUserIdFromCognitoSub(cognitoSub, userEmail = null) {
  try {
    if (!cognitoSub) return null;
    
    // Sprawdź czy to już jest w formacie "u_123"
    if (cognitoSub.startsWith('u_')) {
      return cognitoSub;
    }
    
    // Jeśli to UUID (cognitoSub), użyj endpointu /v1/auth/me który zwraca id w formacie "u_123"
    // Endpoint /v1/auth/me wymaga cognitoSub jako query parameter
    try {
      const user = await fetchAPI(`/v1/auth/me?cognitoSub=${encodeURIComponent(cognitoSub)}`);
      if (user && user.id) {
        return user.id; // user.id jest w formacie "u_123" z AuthController
      }
    } catch (error) {
      // Jeśli użytkownik nie istnieje (404), spróbuj zsynchronizować
      if (error.status === 404 && userEmail) {
        console.log('User not found in database, attempting to sync...');
        try {
          // Spróbuj zsynchronizować użytkownika
          const syncResponse = await fetchAPI('/v1/users/sync', {
            method: 'POST',
            body: {
              cognitoSub: cognitoSub,
              email: userEmail,
              username: userEmail.split('@')[0] // Domyślny username z email
            }
          });
          
          // Po synchronizacji spróbuj ponownie pobrać użytkownika
          if (syncResponse) {
            try {
              const syncedUser = await fetchAPI(`/v1/auth/me?cognitoSub=${encodeURIComponent(cognitoSub)}`);
              if (syncedUser && syncedUser.id) {
                console.log('User synced successfully, userId:', syncedUser.id);
                return syncedUser.id;
              }
            } catch (retryError) {
              console.error('Error fetching user after sync:', retryError);
              // Jeśli nadal nie działa, zwróć null zamiast rzucać błąd
            }
          }
        } catch (syncError) {
          console.error('Error syncing user:', syncError);
          // Nie rzucaj błędu, tylko zwróć null
        }
      } else {
        // Jeśli to nie 404 lub nie ma email, loguj i zwróć null
        console.warn('Could not get user ID:', error.status === 404 ? 'User not found' : error.message);
      }
      // Nie rzucaj błędu dalej, zwróć null
      return null;
    }
    
    return null;
  } catch (error) {
    console.error('Error getting user ID from cognitoSub:', error);
    return null;
  }
}

export async function getContacts(userId, userEmail = null) {
  try {
    if (typeof window === 'undefined') return [];
    if (!userId) return [];
    
    // Konwertuj cognitoSub na userId jeśli potrzeba
    const actualUserId = await getUserIdFromCognitoSub(userId, userEmail);
    if (!actualUserId) {
      console.warn('Could not convert userId to proper format');
      return [];
    }
    
    const contacts = await fetchAPI(`/v1/contacts/${actualUserId}`);
    return Array.isArray(contacts) ? contacts : [];
  } catch (error) {
    console.warn('API request failed, returning empty array:', error.message);
    return [];
  }
}

// Wysyła zaproszenie do kontaktu
export async function sendInvitation(senderId, recipientEmail, senderEmail = null) {
  try {
    if (typeof window === 'undefined') return null;
    if (!senderId || !recipientEmail) {
      throw new Error('senderId and recipientEmail are required');
    }
    
    // Konwertuj cognitoSub na userId jeśli potrzeba
    const actualSenderId = await getUserIdFromCognitoSub(senderId, senderEmail);
    if (!actualSenderId) {
      throw new Error('Could not convert senderId to proper format. User may not exist in database. Please try logging in again.');
    }
    
    const invitation = await fetchAPI('/v1/contacts/invitations', {
      method: 'POST',
      body: {
        senderId: actualSenderId,
        recipientEmail: recipientEmail.trim()
      }
    });
    return invitation;
  } catch (error) {
    console.error('Error sending invitation:', error);
    throw error;
  }
}

// Usuwa kontakt
export async function deleteContact(contactId) {
  try {
    if (typeof window === 'undefined') return;
    if (!contactId) {
      throw new Error('contactId is required');
    }
    await fetchAPI(`/v1/contacts/${contactId}`, {
      method: 'DELETE'
    });
    return true;
  } catch (error) {
    console.error('Error deleting contact:', error);
    throw error;
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

// Pobiera wszystkie akwaria użytkownika
export async function getAquariums(userId = null) {
  try {
    if (typeof window === 'undefined') return [];
    
    // Jeśli podano userId, użyj endpointu specyficznego dla użytkownika
    // W przeciwnym razie spróbuj pobrać userId z localStorage
    let targetUserId = userId;
    if (!targetUserId) {
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        try {
          const userData = JSON.parse(storedUser);
          targetUserId = userData.id;
        } catch (e) {
          console.warn('Could not parse user data from localStorage');
        }
      }
    }
    
    // Jeśli mamy userId, użyj endpointu /user/{userId}
    // Backend obsługuje konwersję userId przez IdMapper (akceptuje UUID z prefiksem "u_" lub bez)
    if (targetUserId) {
      const aquariums = await fetchAPI(`/v1/aquariums/user/${targetUserId}`);
      console.log('Fetched aquariums for user:', targetUserId, aquariums);
      return Array.isArray(aquariums) ? aquariums : [];
    }
    
    // Fallback: jeśli nie ma userId, zwróć pustą tablicę
    console.warn('No userId provided, returning empty array');
    return [];
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
    console.log('🔵 getAquariumById: received data from API:', aquarium);
    
    if (aquarium) {
      // Mapowanie danych z backendu do formatu oczekiwanego przez frontend
      const mapped = {
        ...aquarium,
        // Backend zwraca fish, frontend oczekuje fishes
        fishes: aquarium.fish || aquarium.fishes || [],
        // Backend zwraca plants (może być już OK)
        plants: aquarium.plants || [],
        // Mapowanie nazw pól (jeśli backend zwraca inne nazwy)
        temperature: aquarium.temperatureC !== undefined ? aquarium.temperatureC : aquarium.temperature,
        hardness: aquarium.hardnessDGH !== undefined ? aquarium.hardnessDGH : aquarium.hardness,
        volume: aquarium.volumeLiters !== undefined ? aquarium.volumeLiters : aquarium.volume,
        // Zachowaj status akwarium (kompatybilność, ostrzeżenia)
        status: aquarium.status || null
      };
      
      // Usuń stare pola, jeśli były zmapowane
      if (aquarium.fish && !aquarium.fishes) {
        delete mapped.fish;
      }
      if (aquarium.temperatureC !== undefined && aquarium.temperature === undefined) {
        delete mapped.temperatureC;
      }
      if (aquarium.hardnessDGH !== undefined && aquarium.hardness === undefined) {
        delete mapped.hardnessDGH;
      }
      if (aquarium.volumeLiters !== undefined && aquarium.volume === undefined) {
        delete mapped.volumeLiters;
      }
      
      console.log('🔵 getAquariumById: mapped data, fishes:', mapped.fishes?.length || 0, 'items');
      return mapped;
    }
    
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
    // Spróbuj sparsować komunikat błędu z backendu
    let errorMessage = error.message || "Nie udało się usunąć akwarium.";
    
    // Jeśli błąd zawiera informację o foreign key constraint, pokaż bardziej zrozumiały komunikat
    if (errorMessage.includes('foreign key constraint') || 
        errorMessage.includes('log_entries') || 
        errorMessage.includes('still referenced')) {
      errorMessage = "Nie można usunąć akwarium, ponieważ ma powiązane wpisy w historii. Skontaktuj się z administratorem.";
    }
    
    // Loguj tylko raz, jeśli to development
    if (process.env.NODE_ENV === 'development') {
      console.warn(`Error deleting aquarium ${id}:`, errorMessage);
    }
    
    // Utwórz nowy błąd z lepszym komunikatem
    const improvedError = new Error(errorMessage);
    improvedError.originalError = error;
    throw improvedError;
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
    const aquariumData = result?.aquarium || result;
    
    if (aquariumData) {
      // Mapowanie danych jak w getAquariumById
      const mapped = {
        ...aquariumData,
        fishes: aquariumData.fish || aquariumData.fishes || [],
        plants: aquariumData.plants || [],
        temperature: aquariumData.temperatureC !== undefined ? aquariumData.temperatureC : aquariumData.temperature,
        hardness: aquariumData.hardnessDGH !== undefined ? aquariumData.hardnessDGH : aquariumData.hardness,
        volume: aquariumData.volumeLiters !== undefined ? aquariumData.volumeLiters : aquariumData.volume,
        // Zachowaj status akwarium (kompatybilność, ostrzeżenia)
        status: aquariumData.status || null
      };
      
      if (aquariumData.fish && !aquariumData.fishes) {
        delete mapped.fish;
      }
      if (aquariumData.temperatureC !== undefined && aquariumData.temperature === undefined) {
        delete mapped.temperatureC;
      }
      if (aquariumData.hardnessDGH !== undefined && aquariumData.hardness === undefined) {
        delete mapped.hardnessDGH;
      }
      if (aquariumData.volumeLiters !== undefined && aquariumData.volume === undefined) {
        delete mapped.volumeLiters;
      }
      
      return mapped;
    }
    
    return aquariumData;
  } catch (error) {
    console.error(`Error adding fish to aquarium ${aquariumId}:`, error);
    throw error;
  }
}

// Usuwa rybę z akwarium
export async function removeFishFromAquarium(aquariumId, fishId) {
  try {
    console.log('🔴 removeFishFromAquarium called with:', { aquariumId, fishId });
    const endpoint = `/v1/aquariums/${aquariumId}/fish/${fishId}`;
    
    const result = await fetchAPI(endpoint, {
      method: 'DELETE'
    });
    
    console.log('🔴 removeFishFromAquarium response:', result);
    
    // Backend zwraca {aquarium: ..., logEntry: ...}
    const aquariumData = result?.aquarium || result?.Aquarium || (result?.id ? result : null);
    
    if (aquariumData) {
      // Mapowanie danych jak w getAquariumById
      const mapped = {
        ...aquariumData,
        fishes: aquariumData.fish || aquariumData.fishes || [],
        plants: aquariumData.plants || [],
        temperature: aquariumData.temperatureC !== undefined ? aquariumData.temperatureC : aquariumData.temperature,
        hardness: aquariumData.hardnessDGH !== undefined ? aquariumData.hardnessDGH : aquariumData.hardness,
        volume: aquariumData.volumeLiters !== undefined ? aquariumData.volumeLiters : aquariumData.volume,
        // Zachowaj status akwarium (kompatybilność, ostrzeżenia)
        status: aquariumData.status || null
      };
      
      if (aquariumData.fish && !aquariumData.fishes) {
        delete mapped.fish;
      }
      if (aquariumData.temperatureC !== undefined && aquariumData.temperature === undefined) {
        delete mapped.temperatureC;
      }
      if (aquariumData.hardnessDGH !== undefined && aquariumData.hardness === undefined) {
        delete mapped.hardnessDGH;
      }
      if (aquariumData.volumeLiters !== undefined && aquariumData.volume === undefined) {
        delete mapped.volumeLiters;
      }
      
      console.log('🔴 removeFishFromAquarium: mapped data, fishes:', mapped.fishes?.length || 0, 'items');
      return mapped;
    }
    
    console.log('🔴 removeFishFromAquarium: no aquarium in response');
    return result || true;
  } catch (error) {
    console.error(`Error removing fish from aquarium ${aquariumId}:`, error);
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
    const aquariumData = result?.aquarium || result;
    
    if (aquariumData) {
      // Mapowanie danych jak w getAquariumById
      const mapped = {
        ...aquariumData,
        fishes: aquariumData.fish || aquariumData.fishes || [],
        plants: aquariumData.plants || [],
        temperature: aquariumData.temperatureC !== undefined ? aquariumData.temperatureC : aquariumData.temperature,
        hardness: aquariumData.hardnessDGH !== undefined ? aquariumData.hardnessDGH : aquariumData.hardness,
        volume: aquariumData.volumeLiters !== undefined ? aquariumData.volumeLiters : aquariumData.volume,
        // Zachowaj status akwarium (kompatybilność, ostrzeżenia)
        status: aquariumData.status || null
      };
      
      if (aquariumData.fish && !aquariumData.fishes) {
        delete mapped.fish;
      }
      if (aquariumData.temperatureC !== undefined && aquariumData.temperature === undefined) {
        delete mapped.temperatureC;
      }
      if (aquariumData.hardnessDGH !== undefined && aquariumData.hardness === undefined) {
        delete mapped.hardnessDGH;
      }
      if (aquariumData.volumeLiters !== undefined && aquariumData.volume === undefined) {
        delete mapped.volumeLiters;
      }
      
      return mapped;
    }
    
    return aquariumData;
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
    const aquariumData = result?.aquarium || (result?.id ? result : null);
    
    if (aquariumData) {
      // Mapowanie danych jak w getAquariumById
      const mapped = {
        ...aquariumData,
        fishes: aquariumData.fish || aquariumData.fishes || [],
        plants: aquariumData.plants || [],
        temperature: aquariumData.temperatureC !== undefined ? aquariumData.temperatureC : aquariumData.temperature,
        hardness: aquariumData.hardnessDGH !== undefined ? aquariumData.hardnessDGH : aquariumData.hardness,
        volume: aquariumData.volumeLiters !== undefined ? aquariumData.volumeLiters : aquariumData.volume,
        // Zachowaj status akwarium (kompatybilność, ostrzeżenia)
        status: aquariumData.status || null
      };
      
      if (aquariumData.fish && !aquariumData.fishes) {
        delete mapped.fish;
      }
      if (aquariumData.temperatureC !== undefined && aquariumData.temperature === undefined) {
        delete mapped.temperatureC;
      }
      if (aquariumData.hardnessDGH !== undefined && aquariumData.hardness === undefined) {
        delete mapped.hardnessDGH;
      }
      if (aquariumData.volumeLiters !== undefined && aquariumData.volume === undefined) {
        delete mapped.volumeLiters;
      }
      
      return mapped;
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

// Synchronizuje użytkownika z Cognito (tworzy lub aktualizuje)
export async function syncUser(cognitoSub, email, username = null) {
  try {
    const response = await fetchAPI('/v1/users/sync', {
      method: 'POST',
      body: {
        cognitoSub: cognitoSub,
        email: email,
        username: username || email.split('@')[0]
      }
    });
    return response;
  } catch (error) {
    console.error('Error syncing user:', error);
    throw error;
  }
}

// Pobiera dane zalogowanego użytkownika wraz z ustawieniami
export async function getCurrentUser(cognitoSub = null) {
  try {
    let endpoint = '/v1/auth/me';
    if (cognitoSub) {
      endpoint += `?cognitoSub=${encodeURIComponent(cognitoSub)}`;
    }
    const user = await fetchAPI(endpoint);
    return user;
  } catch (error) {
    console.error('Error fetching current user:', error);
    return null;
  }
}

// Aktualizuje dane użytkownika
export async function updateUser(userData) {
  try {
    const user = await fetchAPI('/v1/auth/me', {
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
  sendInvitation,
  deleteContact,
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
  getLogs,
};

// Pobiera logi aktywności
export async function getLogs(filters = {}) {
  try {
    const queryParams = new URLSearchParams();
    
    if (filters.actionType) {
      queryParams.append('actionType', filters.actionType);
    }
    if (filters.aquariumId) {
      queryParams.append('aquariumId', filters.aquariumId);
    }
    if (filters.sort) {
      queryParams.append('sort', filters.sort);
    }
    if (filters.limit) {
      queryParams.append('limit', filters.limit.toString());
    }
    if (filters.offset) {
      queryParams.append('offset', filters.offset.toString());
    }

    const endpoint = `/v1/logs${queryParams.toString() ? '?' + queryParams.toString() : ''}`;
    const logs = await fetchAPI(endpoint);
    return Array.isArray(logs) ? logs : [];
  } catch (error) {
    console.error('Error fetching logs:', error);
    return [];
  }
}
