import { updateAquarium } from '../../app/lib/api';

global.fetch = jest.fn();

const consoleLogSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
const consoleWarnSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});
const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

describe('API Helpers – updateAquarium (edycja akwarium)', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
  });

  afterAll(() => {
    jest.restoreAllMocks();
  });

  it('aktualizuje nazwę i pojemność akwarium – sukces 200 + token', async () => {
    const aquariumId = 42;
    const updateData = {
      name: 'Nowe super akwarium',
      volume: 450,
      description: 'Zaktualizowane w teście',
    };

    const mockUpdatedAquarium = {
      id: aquariumId,
      name: 'Nowe super akwarium',
      volume: 450,
      description: 'Zaktualizowane w teście',
      ownerId: 'uuid-test-123',
      updatedAt: '2025-04-12T10:15:00Z',
    };

    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      status: 200,
      statusText: 'OK',
      headers: new Headers({ 'content-length': '210' }),
      text: async () => JSON.stringify(mockUpdatedAquarium),
    });

    localStorage.setItem(
      'user',
      JSON.stringify({
        token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.update.fake.token',
      })
    );

    const result = await updateAquarium(aquariumId, updateData);

    expect(result).toEqual(mockUpdatedAquarium);

    expect(global.fetch).toHaveBeenCalledTimes(1);
    expect(global.fetch).toHaveBeenCalledWith(
      `http://localhost:3001/api/v1/aquariums/${aquariumId}`,
      expect.objectContaining({
        method: 'PUT',
        headers: expect.objectContaining({
          'Content-Type': 'application/json',
          Authorization: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.update.fake.token',
        }),
        body: JSON.stringify(updateData),
        signal: expect.any(AbortSignal),
      })
    );
  });

  it('pozwala na częściową aktualizację (tylko jedno pole)', async () => {
    const aquariumId = 7;
    const partialData = {
      name: 'Zmieniona nazwa tylko',
    };

    const mockResponse = {
      id: 7,
      name: 'Zmieniona nazwa tylko',
      volume: 100,
      ownerId: 'uuid-test',
    };

    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      status: 200,
      statusText: 'OK',
      headers: new Headers(),
      text: async () => JSON.stringify(mockResponse),
    });

    const result = await updateAquarium(aquariumId, partialData);

    expect(result).toEqual(mockResponse);

    expect(global.fetch).toHaveBeenCalledWith(
      `http://localhost:3001/api/v1/aquariums/${aquariumId}`,
      expect.objectContaining({
        method: 'PUT',
        body: JSON.stringify(partialData),
        signal: expect.any(AbortSignal),
      })
    );
  });

  it('nie dodaje nagłówka Authorization gdy nie ma tokenu', async () => {
    const aquariumId = 15;
    const updateData = { volume: 500 };

    const mockResponse = {
      id: 15,
      name: 'Stara nazwa',
      volume: 500,
      ownerId: 'uuid-test',
    };

    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      status: 200,
      statusText: 'OK',
      headers: new Headers(),
      text: async () => JSON.stringify(mockResponse),
    });

    const result = await updateAquarium(aquariumId, updateData);

    expect(result).toEqual(mockResponse);

    expect(global.fetch).toHaveBeenCalledWith(
      expect.any(String),
      expect.objectContaining({
        headers: expect.not.objectContaining({
          Authorization: expect.any(String),
        }),
        body: JSON.stringify(updateData),
        signal: expect.any(AbortSignal),
      })
    );
  });

  it('rzuca błąd gdy akwarium nie istnieje (404)', async () => {
    const aquariumId = 999;

    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      status: 404,
      statusText: 'Not Found',
      headers: new Headers(),
      text: async () => 'Akwarium nie znaleziono',
    });

    await expect(
      updateAquarium(aquariumId, { name: 'Test' })
    ).rejects.toThrow();

    expect(consoleErrorSpy).toHaveBeenCalledWith(
      `Error updating aquarium with id ${aquariumId}:`,
      expect.any(Error)
    );

    expect(consoleErrorSpy).toHaveBeenCalledWith(
      `Error updating aquarium with id ${aquariumId}:`,
      expect.objectContaining({
        message: 'Akwarium nie znaleziono'
      })
    );
  });

  it('rzuca błąd przy niepoprawnych danych (400)', async () => {
    const aquariumId = 10;

    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      status: 400,
      statusText: 'Bad Request',
      headers: new Headers(),
      text: async () => JSON.stringify({
        error: 'Volume must be positive',
        validationErrors: ['volume must be greater than 0'],
      }),
    });

    await expect(
      updateAquarium(aquariumId, { volume: -50 })
    ).rejects.toThrow(/Volume must be positive|must be greater than 0/);

    expect(consoleErrorSpy).toHaveBeenCalledWith(
      `Error updating aquarium with id ${aquariumId}:`,
      expect.any(Error)
    );
  });

  it('rzuca błąd przy braku uprawnień (401)', async () => {
    const aquariumId = 5;
    const updateData = { name: 'Próba bez uprawnień' };

    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      status: 401,
      statusText: 'Unauthorized',
      headers: new Headers(),
      text: async () => 'Invalid or missing token',
    });

    await expect(
      updateAquarium(aquariumId, updateData)
    ).rejects.toThrow(/Invalid or missing token|Unauthorized/);

    expect(consoleErrorSpy).toHaveBeenCalledWith(
      `Error updating aquarium with id ${aquariumId}:`,
      expect.any(Error)
    );
  });
});