import { addFishToAquarium } from '../../app/lib/api';

global.fetch = jest.fn();

const consoleLogSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
const consoleWarnSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});
const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

describe('API Helpers – addFishToAquarium (dodawanie ryby do akwarium)', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
  });

  afterAll(() => {
    jest.restoreAllMocks();
  });

  it('dodaje 1 sztukę ryby do akwarium – sukces 200 + token', async () => {
    const aquariumId = 42;
    const fishId = 5;
    const count = 1;

    const mockResponse = {
      aquarium: {
        id: aquariumId,
        name: 'Moje akwarium',
        volume: 300,
        fishes: [{ fishId: 5, count: 1 }],
      },
      logEntry: { id: 100, action: 'ADD_FISH' },
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
      JSON.stringify({
        token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.addfish.fake.token',
      })
    );

    const result = await addFishToAquarium(aquariumId, fishId, count);
    expect(result).toEqual(mockResponse.aquarium);
    expect(global.fetch).toHaveBeenCalledTimes(1);
    expect(global.fetch).toHaveBeenCalledWith(
      `http://localhost:3001/api/v1/aquariums/${aquariumId}/fish`,
      expect.objectContaining({
        method: 'POST',
        headers: expect.objectContaining({
          'Content-Type': 'application/json',
          Authorization: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.addfish.fake.token',
        }),
        body: JSON.stringify({ fishId, count }),
        signal: expect.any(AbortSignal),
      })
    );
  });

  it('dodaje więcej niż jedną sztukę ryby (count = 3)', async () => {
    const aquariumId = 8;
    const fishId = 12;
    const count = 3;

    const mockResponse = {
      aquarium: {
        id: 8,
        fishes: [{ fishId: 12, count: 3 }],
      },
    };

    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      status: 200,
      headers: new Headers(),
      text: async () => JSON.stringify(mockResponse),
    });

    const result = await addFishToAquarium(aquariumId, fishId, count);

    expect(result).toEqual(mockResponse.aquarium);

    expect(global.fetch).toHaveBeenCalledWith(
      expect.any(String),
      expect.objectContaining({
        body: JSON.stringify({ fishId, count: 3 }),
      })
    );
  });


  it('używa domyślnego count = 1 gdy parametr count nie został podany', async () => {
    const aquariumId = 3;
    const fishId = 7;

    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      status: 200,
      headers: new Headers(),
      text: async () => JSON.stringify({
        aquarium: { id: 3, fishes: [{ fishId: 7, count: 1 }] },
      }),
    });

    await addFishToAquarium(aquariumId, fishId); // bez count

    expect(global.fetch).toHaveBeenCalledWith(
      expect.any(String),
      expect.objectContaining({
        body: JSON.stringify({ fishId, count: 1 }),
      })
    );
  });


  it('zwraca cały wynik jeśli backend nie zwrócił pola aquarium', async () => {
    const aquariumId = 20;
    const fishId = 4;

    const mockFullResponse = {
      success: true,
      addedCount: 2,
      message: 'Fish added successfully',
    };

    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      status: 200,
      headers: new Headers(),
      text: async () => JSON.stringify(mockFullResponse),
    });

    const result = await addFishToAquarium(aquariumId, fishId);

    expect(result).toEqual(mockFullResponse);
  });


  it('nie dodaje nagłówka Authorization gdy nie ma tokenu', async () => {
    const aquariumId = 9;
    const fishId = 6;

    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      status: 200,
      headers: new Headers(),
      text: async () => JSON.stringify({ aquarium: { id: 9 } }),
    });

    const result = await addFishToAquarium(aquariumId, fishId);

    expect(result).toEqual({ id: 9 });

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
    const fishId = 1;

    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      status: 404,
      statusText: 'Not Found',
      headers: new Headers(),
      text: async () => 'Akwarium nie znaleziono',
    });

    await expect(
      addFishToAquarium(aquariumId, fishId)
    ).rejects.toThrow();

    expect(consoleErrorSpy).toHaveBeenCalledWith(
      `Error adding fish to aquarium ${aquariumId}:`,
      expect.any(Error)
    );

    expect(consoleErrorSpy).toHaveBeenCalledWith(
      `Error adding fish to aquarium ${aquariumId}:`,
      expect.objectContaining({
        message: 'Akwarium nie znaleziono'
      })
    );
  });


  it('rzuca błąd gdy ryba nie istnieje (404)', async () => {
    const aquariumId = 10;
    const fishId = 777;

    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      status: 404,
      statusText: 'Not Found',
      headers: new Headers(),
      text: async () => 'Fish species not found',
    });

    await expect(
      addFishToAquarium(aquariumId, fishId)
    ).rejects.toThrow(/Fish species not found/);

    expect(consoleErrorSpy).toHaveBeenCalledWith(
      `Error adding fish to aquarium ${aquariumId}:`,
      expect.any(Error)
    );
  });


  it('rzuca błąd przy niepoprawnym count (400)', async () => {
    const aquariumId = 20;
    const fishId = 8;

    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      status: 400,
      statusText: 'Bad Request',
      headers: new Headers(),
      text: async () => JSON.stringify({
        error: 'Count must be positive',
        validationErrors: ['count must be greater than 0'],
      }),
    });

    await expect(
      addFishToAquarium(aquariumId, fishId, -2)
    ).rejects.toThrow(/Count must be positive|greater than 0/);

    expect(consoleErrorSpy).toHaveBeenCalledWith(
      `Error adding fish to aquarium ${aquariumId}:`,
      expect.any(Error)
    );
  });
});