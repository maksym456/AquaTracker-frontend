/**
 * API Service - Serwis do komunikacji z backendem
 */
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

/**
 * Funkcja pomocnicza do wykonywania zapytań HTTP
 * @param {string} endpoint - ścieżka do endpointu API
 * @param {object} options - opcje zapytania
 * @returns {Promise} - obietnica z danymi z API lub błędem
 */
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

    const finalOptions = { ...defaultOptions, ...options };

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
      
      if (!response.ok) {
        throw new Error(`API Error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      return data;
      
    } catch (fetchError) {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
      
      if (fetchError.name === 'AbortError' || fetchError.message?.includes('aborted')) {
        throw new Error('API request timeout');
      }
      
      throw fetchError;
    }
    
  } catch (error) {
    console.error('API Request failed:', error);
    throw error;
  }
}

/**
 * Mock data - tymczasowe dane do testowania, dopóki API nie będzie gotowe
 */
const mockFishesData = [
  {
    id: 1,
    name: "Welonka (Złota rybka)",
    description: "Welonka to klasyczna, spokojna ryba akwariowa, idealna dla początkujących. Jest odporna i łatwa w utrzymaniu.",
    image: "/fish/Welonka__Złota_rybka.png",
    waterType: "freshwater",
    tempRange: [18, 24],
    biotope: "Azja",
    phRange: [6.0, 8.0],
    hardness: [5, 19],
    temperament: "spokojne",
    minSchoolSize: 1,
    lifespan: "10-15 lat"
  },
  {
    id: 2,
    name: "Gupik (Głupik)",
    description: "Gupik to mała, kolorowa ryba, która najlepiej czuje się w grupie. Jest bardzo aktywna i łatwa w hodowli.",
    image: "/fish/Gupik__Głupik.png",
    waterType: "freshwater",
    tempRange: [22, 28],
    biotope: "Ameryka Południowa",
    phRange: [6.8, 8.0],
    hardness: [10, 30],
    temperament: "spokojne",
    minSchoolSize: 5,
    lifespan: "2-3 lata"
  },
  {
    id: 3,
    name: "Bojownik syjamski",
    description: "Bojownik syjamski to efektowna, majestatyczna ryba znana z długich, falujących płetw i intensywnych barw. Samce są terytorialne i potrafią być agresywne wobec innych samców oraz ryb o podobnych płetwach, dlatego zwykle trzyma się je pojedynczo.",
    image: "/fish/Bojownik_syjamski.png",
    waterType: "freshwater",
    tempRange: [25, 30],
    biotope: "Azja",
    phRange: [6.0, 8.0],
    hardness: [1, 19],
    temperament: "pół-agresywne",
    minSchoolSize: 1,
    lifespan: "3-5 lat"
  },
  {
    id: 4,
    name: "Neon Innesa",
    description: "Neon Innesa to drobna, energiczna ryba ławicowa, znana z intensywnego niebieskiego połysku widocznego nawet w słabym oświetleniu.",
    image: "/fish/Neon_Innesa.png",
    waterType: "freshwater",
    tempRange: [22, 26],
    biotope: "Ameryka Południowa",
    phRange: [6.5, 7.5],
    hardness: [1, 12],
    temperament: "spokojne",
    minSchoolSize: 10,
    lifespan: "3-5 lat"
  },
  {
    id: 5,
    name: "Skalar (Żaglowiec)",
    description: "Skalar (Żaglowiec) to ryba pół-agresywna, która najlepiej czuje się w grupie. Lubi dużo miejsca do pływania i rośliny, przy których może się chować. Może pokazywać dominujące zachowania wobec innych ryb, dlatego najlepiej trzymać ją z gatunkami o podobnym temperamencie.",
    image: "/fish/Skalar__Żaglowiec.png",
    waterType: "freshwater",
    tempRange: [25, 29],
    biotope: "Ameryka Południowa",
    phRange: [6.0, 7.4],
    hardness: [5, 13],
    temperament: "pół-agresywne",
    minSchoolSize: 5,
    lifespan: "10-15 lat"
  },
  {
    id: 6,
    name: "Mieczyk Hellera",
    description: "Mieczyk Hellera to żyworodna, wyrazista ryba znana z charakterystycznego 'mieczyka' na ogonie samców. Jest ruchliwa, wytrzymała i dobrze odnajduje się w większych akwariach. Choć generalnie towarzyska, potrafi wykazywać lekko dominujące zachowania, zwłaszcza samce między sobą, dlatego najlepiej trzymać ją w większej grupie.",
    image: "/fish/Mieczyk_Hellera.png",
    waterType: "freshwater",
    tempRange: [24, 28],
    biotope: "Ameryka Północna",
    phRange: [6.0, 8.5],
    hardness: [10, 30],
    temperament: "pół-agresywne",
    minSchoolSize: 8,
    lifespan: "3-5 lat"
  },
  {
    id: 7,
    name: "Molinezja",
    description: "Molinezja to spokojna ryba, która najlepiej czuje się w grupie. Jest aktywna i lubi pływać wśród roślin. Jest odporna i łatwa w utrzymaniu, dobrze nadaje się do akwarium z innymi spokojnymi rybami.",
    image: "/fish/Molinezja.png",
    waterType: "freshwater",
    tempRange: [24, 28],
    biotope: "Ameryka Południowa",
    phRange: [7.5, 8.5],
    hardness: [15, 30],
    temperament: "spokojne",
    minSchoolSize: 3,
    lifespan: "3-5 lat"
  },
  {
    id: 8,
    name: "Gurami mozaikowy",
    description: "Gurami mozaikowy to spokojna ryba o charakterystycznym, drobnym, mozaikowym wzorze na ciele. Porusza się powoli i często wykorzystuje wydłużone płetwy piersiowe do badania otoczenia.",
    image: "/fish/Gurami_mozaikowy.png",
    waterType: "freshwater",
    tempRange: [24, 28],
    biotope: "Azja",
    phRange: [5.5, 8.0],
    hardness: [2, 30],
    temperament: "spokojne",
    minSchoolSize: 2,
    lifespan: "3-5 lat"
  },
  {
    id: 9,
    name: "Danio pręgowany",
    description: "Danio pręgowany to szybka, energiczna ryba ławicowa o smukłym ciele i wyraźnych, poziomych pręgach. Jest bardzo odporna i dobrze adaptuje się do różnych warunków, dzięki czemu świetnie nadaje się dla początkujących.",
    image: "/fish/Danio_pręgowany.png",
    waterType: "freshwater",
    tempRange: [20, 25],
    biotope: "Azja",
    phRange: [6.0, 8.0],
    hardness: [5, 20],
    temperament: "spokojne",
    minSchoolSize: 8,
    lifespan: "3-5 lat"
  },
  {
    id: 10,
    name: "Kardynałek chiński",
    description: "Kardynałek chiński to niewielka, żywa i spokojna ryba o metalicznym połysku i czerwonym zabarwieniu płetw. Jest wyjątkowo odporna i dobrze czuje się nawet w chłodniejszych akwariach. W grupie prezentuje naturalne, harmonijne zachowania, tworząc efektowne mini-ławice.",
    image: "/fish/Kardynałek_chiński.png",
    waterType: "freshwater",
    tempRange: [18, 24],
    biotope: "Azja",
    phRange: [6.0, 8.5],
    hardness: [5, 25],
    temperament: "spokojne",
    minSchoolSize: 6,
    lifespan: "4-5 lat"
  },
  {
    id: 11,
    name: "Razbora klinowa",
    description: "Razbora klinowa to spokojna ryba ławicowa, która najlepiej czuje się w grupie. Jest aktywna i porusza się wśród roślin, tworząc efektowne grupy. Lubi dobrze oświetlone akwaria z miejscami do pływania i kryjówkami.",
    image: "/fish/Razbora_klinowa.png",
    waterType: "freshwater",
    tempRange: [24, 27],
    biotope: "Azja",
    phRange: [5.0, 7.5],
    hardness: [1, 12],
    temperament: "spokojne",
    minSchoolSize: 10,
    lifespan: "5-8 lat"
  },
  {
    id: 12,
    name: "Tęczanka neonowa",
    description: "Tęczanka neonowa to spokojna ryba ławicowa, która najlepiej czuje się w grupie. Ma kolorowe, metaliczne ubarwienie i lubi poruszać się wśród roślin. Jest odporna i łatwa w utrzymaniu, dobrze nadaje się do akwarium z innymi spokojnymi rybami.",
    image: "/fish/Tęczanka_neonowa.png",
    waterType: "freshwater",
    tempRange: [25, 28],
    biotope: "Austalia/Oceania",
    phRange: [6.5, 7.5],
    hardness: [5, 15],
    temperament: "spokojne",
    minSchoolSize: 6,
    lifespan: "4-6 lat"
  },
  {
    id: 13,
    name: "Kirys pstry",
    description: "Kirysek pstry to spokojna ryba, która lubi przebywać przy dnie akwarium i chować się między roślinami. Najlepiej czuje się w grupie, wtedy porusza się naturalnie i aktywnie.",
    image: "/fish/Kirys_pstry.png",
    waterType: "freshwater",
    tempRange: [23, 27],
    biotope: "Ameryka Południowa",
    phRange: [6.0, 7.0],
    hardness: [5, 15],
    temperament: "spokojne",
    minSchoolSize: 6,
    lifespan: "3-5 lat"
  },
  {
    id: 14,
    name: "Glonojad (Zbrojnik)",
    description: "Glonojad / Zbrojnik to spokojna ryba, która pomaga utrzymać akwarium w czystości, zjadając glony z roślin i szybów. Lubi kryjówki i spokojne miejsca w zbiorniku. Jest odporna i łatwa w utrzymaniu, dobrze nadaje się do akwarium z innymi spokojnymi rybami.",
    image: "/fish/GlonojadZbrojnik-.png",
    waterType: "freshwater",
    tempRange: [23, 28],
    biotope: "Ameryka Południowa",
    phRange: [6.5, 7.5],
    hardness: [1, 15],
    temperament: "spokojne",
    minSchoolSize: 1,
    lifespan: "3-7 lat"
  },
  {
    id: 15,
    name: "Błazenek pomarańczowy",
    description: "Błazenek pomarańczowy to spokojna ryba, która najlepiej czuje się w parze. Lubi miejsca do ukrycia, np. między skałami lub wśród korali. Jest odporna, ale wymaga stabilnych warunków wody słonowodnej i odpowiedniej temperatury.",
    image: "/fish/Błazenek_pomarańczowy.png",
    waterType: "saltwater",
    tempRange: [25, 27],
    biotope: "Azja",
    phRange: [7.8, 8.4],
    hardness: [8, 25],
    temperament: "spokojne",
    minSchoolSize: 2,
    lifespan: "1 rok"
  },
  {
    id: 16,
    name: "Pirania czerwona",
    description: "Pirania czerwona to agresywna ryba, która najlepiej żyje w grupie. Potrzebuje dużo miejsca do pływania i odpowiedniego akwarium, aby mogła wykazywać naturalne zachowania.",
    image: "/fish/Pirania_czerwona.png",
    waterType: "freshwater",
    tempRange: [25, 30],
    biotope: "Ameryka Południowa",
    phRange: [6.0, 7.0],
    hardness: [0, 18],
    temperament: "agresywne",
    minSchoolSize: 5,
    lifespan: "10-13 lat"
  },
  {
    id: 17,
    name: "Pokolec królewski",
    description: "Pokolec królewski to spokojna ryba, która najlepiej trzymać pojedynczo. Lubi mieć miejsca do ukrycia, np. między skałami lub koralami. Jest odporna i może żyć długo w akwarium słonowodnym przy stabilnych warunkach wody.",
    image: "/fish/Pokolec_królewski.png",
    waterType: "saltwater",
    tempRange: [25, 27],
    biotope: "Azja",
    phRange: [8.1, 8.5],
    hardness: [8, 12],
    temperament: "spokojne",
    minSchoolSize: 1,
    lifespan: "8-12 lat"
  },
  {
    id: 18,
    name: "Proporczykowiec",
    description: "Proporczykowiec to ryba pół-agresywna, która najlepiej czuje się w grupie. Lubi mieć kryjówki i miejsca do pływania. Może wykazywać dominujące zachowania wobec innych ryb, dlatego najlepiej trzymać ją z gatunkami o podobnym temperamencie.",
    image: "/fish/Proporczykowiec.png",
    waterType: "freshwater",
    tempRange: [22, 26],
    biotope: "Afryka",
    phRange: [6.0, 7.5],
    hardness: [2, 10],
    temperament: "pół-agresywne",
    minSchoolSize: 4,
    lifespan: "10-15 lat"
  },
  {
    id: 19,
    name: "Pyszczak (Malawi)",
    description: "Pyszczak (Malawi) to agresywna ryba, która najlepiej czuje się w swoim terytorium. Lubi mieć kryjówki i przestrzeń do pływania.",
    image: "/fish/Pyszczak__Malawi.png",
    waterType: "freshwater",
    tempRange: [25, 28],
    biotope: "Afryka",
    phRange: [7.6, 8.8],
    hardness: [10, 25],
    temperament: "agresywne",
    minSchoolSize: 1,
    lifespan: "8-10 lat"
  },
  {
    id: 20,
    name: "Księżniczka z Burundi",
    description: "Księżniczka z Burundi to agresywna ryba, która najlepiej czuje się w grupie. Lubi mieć kryjówki i dużo miejsca do pływania.",
    image: "/fish/Księżniczka_z_Burundi.png",
    waterType: "freshwater",
    tempRange: [24, 28],
    biotope: "Afryka",
    phRange: [7.5, 9.0],
    hardness: [9, 19],
    temperament: "agresywne",
    minSchoolSize: 6,
    lifespan: "5-10 lat"
  },
  {
    id: 21,
    name: "Kolcobrzuch karłowaty",
    description: "Kolcobrzuch karłowaty to agresywna ryba, która najlepiej trzymać pojedynczo. Ma mocny charakter i potrafi bronić swojego terytorium. Lubi kryjówki i miejsca do ukrycia. Jest odporna, ale wymaga stabilnych warunków wody.",
    image: "/fish/Kolcobrzuch_karłowaty.png",
    waterType: "freshwater",
    tempRange: [24, 28],
    biotope: "Azja",
    phRange: [6.8, 8.0],
    hardness: [5, 25],
    temperament: "agresywne",
    minSchoolSize: 1,
    lifespan: "2-3 lata"
  },
  {
    id: 22,
    name: "Mandaryn wspaniały",
    description: "Mandaryn wspaniały to spokojna ryba, która najlepiej trzymać pojedynczo. Lubi miejsca do ukrycia i rośliny lub koralowce, w których może się poruszać. Jest wrażliwa na warunki wody, dlatego wymaga stabilnego akwarium słonowodnego.",
    image: "/fish/Mandaryn_wspaniały.png",
    waterType: "saltwater",
    tempRange: [25, 27],
    biotope: "Azja",
    phRange: [8.1, 8.4],
    hardness: [4, 16],
    temperament: "spokojne",
    minSchoolSize: 1,
    lifespan: "4-5 lat"
  },
  {
    id: 23,
    name: "Ustnik słoneczny",
    description: "Ustnik słoneczny to spokojna ryba, którą najlepiej trzymać pojedynczo. Lubi mieć miejsca do ukrycia, np. między skałami lub koralami. Jest odporna i może żyć długo w akwarium słonowodnym przy stabilnych warunkach wody.",
    image: "/fish/Ustnik_żółty_ryba.png",
    waterType: "saltwater",
    tempRange: [24, 27],
    biotope: "Azja",
    phRange: [8.1, 8.3],
    hardness: [5, 15],
    temperament: "spokojne",
    minSchoolSize: 1,
    lifespan: "8-10 lat"
  },
  {
    id: 24,
    name: "Babka złota",
    description: "Babka złota to spokojna ryba, która najlepiej czuje się w grupie. Jest aktywna i lubi pływać wśród roślin oraz kryjówek. Jest odporna i łatwa w utrzymaniu, dobrze nadaje się do akwarium z innymi spokojnymi rybami.",
    image: "/fish/Babka_złota.png",
    waterType: "freshwater",
    tempRange: [24, 28],
    biotope: "Azja",
    phRange: [6.5, 7.5],
    hardness: [5, 15],
    temperament: "spokojne",
    minSchoolSize: 6,
    lifespan: "4-6 lat"
  }
];

/**
 * Pobiera listę wszystkich ryb z API
 * @returns {Promise<Array>} - tablica z obiektami ryb
 */
export async function getFishes() {
  const useAPI = process.env.NEXT_PUBLIC_USE_API === 'true';
  
  if (!useAPI) {
    await new Promise(resolve => setTimeout(resolve, 300));
    return mockFishesData;
  }

  try {
    if (typeof window === 'undefined') {
      console.warn('Running on server, using mock data');
      return mockFishesData;
    }

    const fishes = await fetchAPI('/fishes');
    
    if (fishes && Array.isArray(fishes) && fishes.length > 0) {
      return fishes;
    }
    
    console.warn('API returned empty array, using mock data');
    return mockFishesData;
    
  } catch (error) {
    console.warn('API request failed, using mock data as fallback:', error.message);
    return mockFishesData;
  }
}

/**
 * Pobiera pojedynczą rybę po ID
 * @param {string|number} id - identyfikator ryby
 * @returns {Promise<Object>} - obiekt z danymi ryby lub null jeśli nie znaleziono
 */
export async function getFishById(id) {
  try {
    const fish = await fetchAPI(`/fishes/${id}`);
    return fish;
  } catch (error) {
    console.error(`Error fetching fish with id ${id}:`, error);
    return null;
  }
}

/**
 * Wyszukuje ryby według kryteriów
 * @param {object} filters - obiekt z kryteriami filtrowania
 * @param {string} filters.waterType - typ wody ('freshwater' lub 'saltwater')
 * @param {string} filters.temperament - usposobienie ryby
 * @param {string} filters.biotope - biotop
 * @returns {Promise<Array>} - tablica z przefiltrowanymi rybami
 */
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

    const endpoint = `/fishes/search?${queryParams.toString()}`;
    const fishes = await fetchAPI(endpoint);
    return fishes;
  } catch (error) {
    console.error('Error searching fishes:', error);
    return [];
  }
}

export default {
  getFishes,
  getFishById,
  searchFishes,
};
