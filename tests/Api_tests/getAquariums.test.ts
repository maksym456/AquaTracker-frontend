import { getAquariums } from '../../app/lib/api';

global.fetch = jest.fn();

const consoleLogSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
const consoleWarnSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});
const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

describe('API Helpers – getAquariums (pobieranie listy akwariów)', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
  });

  afterAll(() => {
    jest.restoreAllMocks();
  });

  
  it('pobiera listę akwariów użytkownika – sukces 200 + token', async () => {
    const mockAquariums = [
      {
        id: 1,
        name: 'Akwarium słodkowodne',
        volume: 240,
        ownerId: 'uuid-test-1',
      },
      {
        id: 2,
        name: 'Nano akwarium',
        volume: 30,
        ownerId: 'uuid-test-1',
      },
    ];

    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      status: 200,
      statusText: 'OK',
      headers: new Headers({ 'content-length': '180' }),
      text: async () => JSON.stringify(mockAquariums),
    });

    localStorage.setItem(
      'user',
      JSON.stringify({
        token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.fake.token.list',
      }),
    );

    const result = await getAquariums();
    expect(result).toEqual(mockAquariums);
    expect(Array.isArray(result)).toBe(true);
    expect(global.fetch).toHaveBeenCalledTimes(1);
    expect(global.fetch).toHaveBeenCalledWith(
      'http://localhost:3001/api/v1/aquariums',
      expect.objectContaining({
        method: 'GET',
        headers: expect.objectContaining({
          'Content-Type': 'application/json',
          Authorization: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.fake.token.list',
        }),
        signal: expect.any(AbortSignal),
      }),
    );
    expect(consoleLogSpy).toHaveBeenCalledWith(
      'Fetched aquariums:',
      mockAquariums,
    );
  });

  
  it('zwraca pustą tablicę gdy użytkownik nie ma akwariów', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      status: 200,
      headers: new Headers(),
      text: async () => JSON.stringify([]),
    });

    const result = await getAquariums();

    expect(result).toEqual([]);
    expect(consoleLogSpy).toHaveBeenCalledWith('Fetched aquariums:', []);
  });

  it('używa endpointu /user/{userId} gdy podano userId', async () => {
    const userId = 'specjalny-user-999';

    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      status: 200,
      text: async () => JSON.stringify([]),
    });

    await getAquariums(userId);

    expect(global.fetch).toHaveBeenCalledWith(
      expect.stringContaining(`/v1/aquariums/user/${userId}`),
      expect.any(Object),
    );
  });

  it('nie dodaje nagłówka Authorization gdy brak tokenu w localStorage', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      status: 200,
      text: async () => JSON.stringify([]),
    });

    await getAquariums();

    expect(global.fetch).toHaveBeenCalledWith(
      expect.any(String),
      expect.objectContaining({
        headers: expect.not.objectContaining({
          Authorization: expect.any(String),
        }),
      }),
    );
  });


  it('zwraca pustą tablicę i loguje błąd przy 401 Unauthorized', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      status: 401,
      statusText: 'Unauthorized',
      text: async () => 'Invalid token',
    });

    const result = await getAquariums();

    expect(result).toEqual([]);

    expect(consoleErrorSpy).toHaveBeenCalledWith(
      'API request failed:',
      expect.any(Error),
    );

    expect(consoleErrorSpy).toHaveBeenCalledWith(
      'Error details:',
      expect.stringContaining('Invalid token'),
    );
  });

  it('zwraca pustą tablicę przy błędzie serwera 500', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      status: 500,
      statusText: 'Internal Server Error',
      text: async () => 'Database connection failed',
    });

    const result = await getAquariums();

    expect(result).toEqual([]);

    expect(consoleErrorSpy).toHaveBeenCalledWith(
      'API request failed:',
      expect.any(Error),
    );
  });
});