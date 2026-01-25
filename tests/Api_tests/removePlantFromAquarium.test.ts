import { removePlantFromAquarium } from '../../app/lib/api';

global.fetch = jest.fn();

const consoleLogSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
const consoleWarnSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});
const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

describe('API Helpers – removePlantFromAquarium', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
  });

  afterAll(() => {
    jest.restoreAllMocks();
  });

  it('usuwa wszystkie sztuki rośliny gdy count nie jest podany', async () => {
    const aquariumId = 101;
    const plantId = 7;

    const mockResponse = {
      aquarium: { id: 101, name: 'Akwarium testowe', plants: [] },
      logEntry: { id: 500, action: 'REMOVE_PLANT' },
    };

    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      status: 200,
      statusText: 'OK',
      headers: new Headers(),
      text: async () => JSON.stringify(mockResponse),
    });

    localStorage.setItem('user', JSON.stringify({ token: 'fake-token' }));

    const result = await removePlantFromAquarium(aquariumId, plantId);

    expect(result).toEqual(mockResponse.aquarium);
    expect(global.fetch).toHaveBeenCalledWith(
      `http://localhost:3001/api/v1/aquariums/${aquariumId}/plants/${plantId}`,
      expect.any(Object)
    );
  });

  it('usuwa określoną liczbę sztuk gdy podano count', async () => {
    const aquariumId = 102;
    const plantId = 8;
    const count = 3;

    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      status: 200,
      headers: new Headers(),
      text: async () => JSON.stringify({ aquarium: { id: 102, plants: [{ plantId: 8, count: 5 }] } }),
    });

    const result = await removePlantFromAquarium(aquariumId, plantId, count);

    expect(global.fetch).toHaveBeenCalledWith(
      `http://localhost:3001/api/v1/aquariums/${aquariumId}/plants/${plantId}?count=${count}`,
      expect.any(Object)
    );
    expect(result).toEqual({ id: 102, plants: [{ plantId: 8, count: 5 }] });
  });

  it('zwraca akwarium gdy backend zwraca pole aquarium', async () => {
    const aquariumId = 103;
    const plantId = 9;
    const mockAquarium = { id: 103, plants: [] };

    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      status: 200,
      headers: new Headers(),
      text: async () => JSON.stringify({ aquarium: mockAquarium }),
    });

    const result = await removePlantFromAquarium(aquariumId, plantId);
    expect(result).toEqual(mockAquarium);
  });

  it('zwraca bezpośredni obiekt akwarium jeśli backend zwraca akwarium bez pola aquarium', async () => {
    const aquariumId = 104;
    const plantId = 10;
    const mockAquarium = { id: 104, plants: [] };

    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      status: 200,
      headers: new Headers(),
      text: async () => JSON.stringify(mockAquarium),
    });

    const result = await removePlantFromAquarium(aquariumId, plantId);
    expect(result).toEqual(mockAquarium);
  });

  it('zwraca true gdy backend zwraca pusty body', async () => {
    const aquariumId = 105;
    const plantId = 11;

    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      status: 204,
      statusText: 'No Content',
      headers: new Headers(),
      text: async () => '',
    });

    const result = await removePlantFromAquarium(aquariumId, plantId);
    expect(result).toBe(true);
  });

  it('rzuca błąd 404', async () => {
    const aquariumId = 999;
    const plantId = 1;

    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      status: 404,
      statusText: 'Not Found',
      headers: new Headers(),
      text: async () => 'Resource not found',
    });

    await expect(removePlantFromAquarium(aquariumId, plantId)).rejects.toThrow();
    expect(consoleErrorSpy).toHaveBeenCalledWith(
      `Error removing plant from aquarium ${aquariumId}:`,
      expect.any(Error)
    );
  });

  it('rzuca błąd 401 Unauthorized', async () => {
    const aquariumId = 106;
    const plantId = 12;

    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      status: 401,
      statusText: 'Unauthorized',
      headers: new Headers(),
      text: async () => 'Unauthorized',
    });

    await expect(removePlantFromAquarium(aquariumId, plantId)).rejects.toThrow('Unauthorized');
  });

  it('rzuca timeout', async () => {
    const aquariumId = 107;
    const plantId = 13;

    jest.useFakeTimers();
    const mockAbortController = new AbortController();
    jest.spyOn(global, 'AbortController').mockImplementation(() => mockAbortController as any);

    const fetchPromise = removePlantFromAquarium(aquariumId, plantId);
    jest.advanceTimersByTime(6000); 

    await expect(fetchPromise).rejects.toThrow(
      'Nie można połączyć się z API. Sprawdź czy serwer jest dostępny.'
    );

    jest.useRealTimers();
  });

  it('rzuca błąd fetch failure', async () => {
    const aquariumId = 108;
    const plantId = 14;

    (global.fetch as jest.Mock).mockRejectedValueOnce(new Error('Failed to fetch'));

    const fetchPromise = removePlantFromAquarium(aquariumId, plantId);
    await expect(fetchPromise).rejects.toThrow(
      'Nie można połączyć się z API. Sprawdź czy serwer jest dostępny.'
    );
  });
});