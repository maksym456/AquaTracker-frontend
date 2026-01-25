import { deleteAquarium } from '../../app/lib/api';

global.fetch = jest.fn();

const consoleLogSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
const consoleWarnSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});
const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

describe('API Helpers – deleteAquarium (usuwanie akwarium)', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
  });

  afterAll(() => {
    jest.restoreAllMocks();
  });

  it('usuwa akwarium – sukces 204 No Content + token', async () => {
    const aquariumId = 42;

    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      status: 204,
      statusText: 'No Content',
      headers: new Headers(),
      text: async () => '',
    });

    localStorage.setItem(
      'user',
      JSON.stringify({
        token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.delete.fake.token',
      })
    );

    const result = await deleteAquarium(aquariumId);

    expect(result).toBe(true);

    expect(global.fetch).toHaveBeenCalledTimes(1);
    expect(global.fetch).toHaveBeenCalledWith(
      `http://localhost:3001/api/v1/aquariums/${aquariumId}`,
      expect.objectContaining({
        method: 'DELETE',
        headers: expect.objectContaining({
          'Content-Type': 'application/json',
          Authorization: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.delete.fake.token',
        }),
        signal: expect.any(AbortSignal),
      })
    );
  });

  it('zwraca true po udanym usunięciu nawet przy pustej odpowiedzi', async () => {
    const aquariumId = 100;

    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      status: 204,
      statusText: 'No Content',
      headers: new Headers(),
      text: async () => '',
    });

    const result = await deleteAquarium(aquariumId);

    expect(result).toBe(true);
  });

  it('nie dodaje nagłówka Authorization gdy nie ma tokenu', async () => {
    const aquariumId = 15;

    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      status: 204,
      statusText: 'No Content',
      headers: new Headers(),
      text: async () => '',
    });

    const result = await deleteAquarium(aquariumId);

    expect(result).toBe(true);

    expect(global.fetch).toHaveBeenCalledWith(
      expect.any(String),
      expect.objectContaining({
        headers: expect.not.objectContaining({
          Authorization: expect.any(String),
        }),
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

    await expect(deleteAquarium(aquariumId)).rejects.toThrow();

    expect(consoleErrorSpy).toHaveBeenCalledWith(
      `Error deleting aquarium with id ${aquariumId}:`,
      expect.any(Error)
    );

    expect(consoleErrorSpy).toHaveBeenCalledWith(
      `Error deleting aquarium with id ${aquariumId}:`,
      expect.objectContaining({
        message: 'Akwarium nie znaleziono'
      })
    );
  });

  it('rzuca błąd przy braku uprawnień (403)', async () => {
    const aquariumId = 10;

    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      status: 403,
      statusText: 'Forbidden',
      headers: new Headers(),
      text: async () => 'You do not have permission to delete this aquarium',
    });

    await expect(deleteAquarium(aquariumId)).rejects.toThrow(
      /permission|Forbidden/
    );

    expect(consoleErrorSpy).toHaveBeenCalledWith(
      `Error deleting aquarium with id ${aquariumId}:`,
      expect.any(Error)
    );
  });

  it('rzuca błąd przy braku autoryzacji (401)', async () => {
    const aquariumId = 5;

    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      status: 401,
      statusText: 'Unauthorized',
      headers: new Headers(),
      text: async () => 'Invalid or missing token',
    });

    await expect(deleteAquarium(aquariumId)).rejects.toThrow(
      /Invalid or missing token|Unauthorized/
    );

    expect(consoleErrorSpy).toHaveBeenCalledWith(
      `Error deleting aquarium with id ${aquariumId}:`,
      expect.any(Error)
    );
  });

  it('rzuca błąd przy wewnętrznym błędzie serwera (500)', async () => {
    const aquariumId = 777;

    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      status: 500,
      statusText: 'Internal Server Error',
      headers: new Headers(),
      text: async () => 'Database error occurred',
    });

    await expect(deleteAquarium(aquariumId)).rejects.toThrow();

    expect(consoleErrorSpy).toHaveBeenCalledWith(
      `Error deleting aquarium with id ${aquariumId}:`,
      expect.any(Error)
    );
  });
});