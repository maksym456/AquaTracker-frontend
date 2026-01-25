import { removeFishFromAquarium } from '../../app/lib/api';

global.fetch = jest.fn();

const consoleLogSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
const consoleWarnSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});
const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

describe('API Helpers – removeFishFromAquarium (usuwanie ryby z akwarium)', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
  });

  afterAll(() => {
    jest.restoreAllMocks();
  });

  it('usuwa wszystkie sztuki ryby gdy count nie jest podany', async () => {
    const aquariumId = 42;
    const fishId = 5;
  
    const mockResponse = {
      aquarium: {
        id: 42,
        name: 'Moje akwarium',
        fishes: [], 
      },
      logEntry: { id: 200, action: 'REMOVE_FISH' },
    };
  
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      status: 200,
      statusText: 'OK',
      headers: new Headers(),
      text: async () => JSON.stringify(mockResponse),
    });
  
    localStorage.setItem(
      'user',
      JSON.stringify({ token: 'fake-token-remove' })
    );
  
    const result = await removeFishFromAquarium(aquariumId, fishId);
  
    expect(result).toEqual(mockResponse.aquarium);
    expect(consoleLogSpy).toHaveBeenCalledWith(
      'removeFishFromAquarium called with:',
      { aquariumId: 42, fishId: 5, count: null }
    );
  
    expect(consoleLogSpy).toHaveBeenCalledWith(
      'Calling DELETE endpoint:',
      `/v1/aquariums/${aquariumId}/fish/${fishId}`   
    );
  
 
    expect(consoleLogSpy).toHaveBeenCalledWith(
      'API Request: DELETE http://localhost:3001/api/v1/aquariums/42/fish/5'
    );
  });


  it('usuwa określoną liczbę sztuk gdy podano count > 0', async () => {
    const aquariumId = 10;
    const fishId = 3;
    const count = 2;
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      status: 200,
      headers: new Headers(),
      text: async () => JSON.stringify({
        aquarium: { id: 10, fishes: [{ fishId: 3, count: 5 }] },
      }),
    });

    await removeFishFromAquarium(aquariumId, fishId, count);
    expect(global.fetch).toHaveBeenCalledWith(
      `http://localhost:3001/api/v1/aquariums/${aquariumId}/fish/${fishId}?count=2`,
      expect.any(Object)
    );
  });


  it('zwraca zaktualizowane akwarium gdy backend zwraca pole aquarium', async () => {
    const aquariumId = 20;
    const fishId = 8;
    const mockAquarium = { id: 20, fishes: [] };
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      status: 200,
      headers: new Headers(),
      text: async () => JSON.stringify({
        aquarium: mockAquarium,
        logEntry: {},
      }),
    });

    const result = await removeFishFromAquarium(aquariumId, fishId);

    expect(result).toEqual(mockAquarium);
  });

  it('obsługuje pole Aquarium z wielkiej litery', async () => {
    const aquariumId = 25;
    const fishId = 9;
    const mockAquarium = { id: 25, fishes: [] };
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      status: 200,
      headers: new Headers(),
      text: async () => JSON.stringify({
        Aquarium: mockAquarium,
      }),
    });

    const result = await removeFishFromAquarium(aquariumId, fishId);
    expect(result).toEqual(mockAquarium);
  });


  it('zwraca obiekt jeśli backend zwrócił akwarium bezpośrednio (ma id i fishes)', async () => {
    const aquariumId = 30;
    const fishId = 10;
    const mockAquarium = {
      id: 30,
      fishes: [],
    };

    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      status: 200,
      headers: new Headers(),
      text: async () => JSON.stringify(mockAquarium),
    });

    const result = await removeFishFromAquarium(aquariumId, fishId);
    expect(result).toEqual(mockAquarium);
  });


  it('nie dodaje nagłówka Authorization gdy nie ma tokenu', async () => {
    const aquariumId = 40;
    const fishId = 12;
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      status: 200,
      headers: new Headers(),
      text: async () => JSON.stringify({ aquarium: { id: 40 } }),
    });

    const result = await removeFishFromAquarium(aquariumId, fishId);
    expect(result).toEqual({ id: 40 });
    expect(global.fetch).toHaveBeenCalledWith(
      expect.any(String),
      expect.objectContaining({
        headers: expect.not.objectContaining({
          Authorization: expect.any(String),
        }),
      })
    );
  });


  it('rzuca błąd gdy akwarium lub ryba nie istnieje (404)', async () => {
    const aquariumId = 999;
    const fishId = 1;
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      status: 404,
      statusText: 'Not Found',
      headers: new Headers(),
      text: async () => 'Resource not found',
    });

    await expect(
      removeFishFromAquarium(aquariumId, fishId)
    ).rejects.toThrow();

    expect(consoleErrorSpy).toHaveBeenCalledWith(
      `Error removing fish from aquarium ${aquariumId}:`,
      expect.any(Error)
    );
  });

 
  it('rzuca błąd przy braku uprawnień (401)', async () => {
    const aquariumId = 50;
    const fishId = 7;
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      status: 401,
      statusText: 'Unauthorized',
      headers: new Headers(),
      text: async () => 'Invalid token',
    });

    await expect(
      removeFishFromAquarium(aquariumId, fishId)
    ).rejects.toThrow(/Invalid token|Unauthorized/);
    expect(consoleErrorSpy).toHaveBeenCalledWith(
      `Error removing fish from aquarium ${aquariumId}:`,
      expect.any(Error)
    );
  });

  it('rzuca błąd przy niepoprawnym parametrze count (400)', async () => {
    const aquariumId = 60;
    const fishId = 20;
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      status: 400,
      statusText: 'Bad Request',
      headers: new Headers(),
      text: async () => JSON.stringify({
        error: 'Count must be positive',
      }),
    });

    await expect(
      removeFishFromAquarium(aquariumId, fishId, -1)
    ).rejects.toThrow(/Count must be positive/);
    expect(consoleErrorSpy).toHaveBeenCalledWith(
      `Error removing fish from aquarium ${aquariumId}:`,
      expect.any(Error)
    );
  });
});