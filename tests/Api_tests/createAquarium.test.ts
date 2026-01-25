import { createAquarium } from '../../app/lib/api';

global.fetch = jest.fn();

const consoleLogSpy   = jest.spyOn(console, 'log').mockImplementation(() => {});
const consoleWarnSpy  = jest.spyOn(console, 'warn').mockImplementation(() => {});
const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

describe('API Helpers – createAquarium', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
  });

  afterAll(() => {
    jest.restoreAllMocks();
  });

  it('tworzy akwarium z poprawnymi danymi + tokenem → zwraca nowo utworzony obiekt', async () => {
    const inputData = {
      name: 'Moje nowe akwarium',
      volume: 320,
      description: 'Test z Jestem',
    };

    const mockCreatedAquarium = {
      id: 1001,
      name: 'Moje nowe akwarium',
      volume: 320,
      description: 'Test z Jestem',
      ownerId: '550e8400-e29b-41d4-a716-446655440000',
      createdAt: '2025-04-10T14:22:33Z',
    };

    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      status: 201,
      statusText: 'Created',
      headers: new Headers(),
      text: async () => JSON.stringify(mockCreatedAquarium),
    });

    localStorage.setItem(
      'user',
      JSON.stringify({
        token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.fake.token',
      }),
    );

    const result = await createAquarium(inputData);

    expect(result).toEqual(mockCreatedAquarium);

    expect(global.fetch).toHaveBeenCalledTimes(1);
    expect(global.fetch).toHaveBeenCalledWith(
      'http://localhost:3001/api/v1/aquariums',
      expect.objectContaining({
        method: 'POST',
        headers: expect.objectContaining({
          'Content-Type': 'application/json',
          Authorization: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.fake.token',
        }),
        body: JSON.stringify(inputData),
        signal: expect.any(AbortSignal),
      }),
    );

    expect(consoleLogSpy).toHaveBeenCalledWith(
      expect.stringContaining('API Request: POST http://localhost:3001/api/v1/aquariums'),
    );
  });

  it('dodaje ownerId do body gdy podano userId jako drugi argument', async () => {
    const inputData = {
      name: 'Akwarium z userId',
      volume: 150,
    };

    const userId = 'user-uuid-1234-5678';

    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      status: 201,
      headers: new Headers(),
      text: async () =>
        JSON.stringify({
          id: 1002,
          ...inputData,
          ownerId: userId,
        }),
    });

    await createAquarium(inputData, userId);

    expect(global.fetch).toHaveBeenCalledWith(
      expect.any(String),
      expect.objectContaining({
        body: JSON.stringify({
          ...inputData,
          ownerId: userId,
        }),
      }),
    );
  });

  it('nie dodaje nagłówka Authorization gdy nie ma tokenu w localStorage', async () => {
    const inputData = { name: 'Bez tokenu', volume: 100 };

    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      status: 201,
      headers: new Headers(),
      text: async () => JSON.stringify({ id: 1003, ...inputData }),
    });

    await createAquarium(inputData);

    expect(global.fetch).toHaveBeenCalledWith(
      expect.any(String),
      expect.objectContaining({
        headers: expect.not.objectContaining({
          Authorization: expect.any(String),
        }),
      }),
    );
  });

  it('przekazuje błąd 400 z backendu (np. brak nazwy)', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      status: 400,
      statusText: 'Bad Request',
      headers: new Headers(),
      text: async () =>
        JSON.stringify({
          error: 'name is required',
          validationErrors: ['name must not be empty'],
        }),
    });

    await expect(createAquarium({ volume: 200 })).rejects.toThrow(
      /name is required/,
    );
  });

  it('przekazuje błąd 401 gdy backend odrzuci request', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      status: 401,
      statusText: 'Unauthorized',
      headers: new Headers(),
      text: async () => 'Invalid or missing token',
    });

    await expect(
      createAquarium({ name: 'Test', volume: 100 }),
    ).rejects.toThrow(/Invalid or missing token|Unauthorized/);
  });
});