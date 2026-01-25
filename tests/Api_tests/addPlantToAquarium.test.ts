import { addPlantToAquarium } from '../../app/lib/api';

global.fetch = jest.fn();

const consoleLogSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
const consoleWarnSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});
const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

describe('API Helpers – addPlantToAquarium (dodawanie rośliny do akwarium)', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
  });

  afterAll(() => {
    jest.restoreAllMocks();
  });


  it('dodaje 1 sztukę rośliny do akwarium – sukces 200 + token', async () => {
    const aquariumId = 42;
    const plantId = 8;
    const count = 1;
    const mockResponse = {
      aquarium: {
        id: aquariumId,
        name: 'Moje akwarium',
        volume: 300,
        plants: [{ plantId: 8, count: 1 }],
      },
      logEntry: { id: 150, action: 'ADD_PLANT' },
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
        token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.addplant.fake.token',
      })
    );

    const result = await addPlantToAquarium(aquariumId, plantId, count);


    expect(result).toEqual(mockResponse.aquarium);
    expect(global.fetch).toHaveBeenCalledTimes(1);
    expect(global.fetch).toHaveBeenCalledWith(
      `http://localhost:3001/api/v1/aquariums/${aquariumId}/plants`,
      expect.objectContaining({
        method: 'POST',
        headers: expect.objectContaining({
          'Content-Type': 'application/json',
          Authorization: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.addplant.fake.token',
        }),
        body: JSON.stringify({ plantId, count }),
        signal: expect.any(AbortSignal),
      })
    );
  });


  it('dodaje więcej niż jedną sztukę rośliny (count = 4)', async () => {
    const aquariumId = 15;
    const plantId = 22;
    const count = 4;
    const mockResponse = {
      aquarium: {
        id: 15,
        plants: [{ plantId: 22, count: 4 }],
      },
    };

    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      status: 200,
      headers: new Headers(),
      text: async () => JSON.stringify(mockResponse),
    });

    const result = await addPlantToAquarium(aquariumId, plantId, count);
    expect(result).toEqual(mockResponse.aquarium);
    expect(global.fetch).toHaveBeenCalledWith(
      expect.any(String),
      expect.objectContaining({
        body: JSON.stringify({ plantId, count: 4 }),
      })
    );
  });

  it('używa domyślnego count = 1 gdy parametr count nie został podany', async () => {
    const aquariumId = 9;
    const plantId = 14;
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      status: 200,
      headers: new Headers(),
      text: async () => JSON.stringify({
        aquarium: { id: 9, plants: [{ plantId: 14, count: 1 }] },
      }),
    });

    await addPlantToAquarium(aquariumId, plantId); 
    expect(global.fetch).toHaveBeenCalledWith(
      expect.any(String),
      expect.objectContaining({
        body: JSON.stringify({ plantId, count: 1 }),
      })
    );
  });


  it('zwraca cały wynik jeśli backend nie zwrócił pola aquarium', async () => {
    const aquariumId = 30;
    const plantId = 6;
    const mockFullResponse = {
      success: true,
      addedCount: 3,
      message: 'Plant added successfully',
    };

    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      status: 200,
      headers: new Headers(),
      text: async () => JSON.stringify(mockFullResponse),
    });

    const result = await addPlantToAquarium(aquariumId, plantId);
    expect(result).toEqual(mockFullResponse);
  });


  it('nie dodaje nagłówka Authorization gdy nie ma tokenu', async () => {
    const aquariumId = 25;
    const plantId = 11;

    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      status: 200,
      headers: new Headers(),
      text: async () => JSON.stringify({ aquarium: { id: 25 } }),
    });

    const result = await addPlantToAquarium(aquariumId, plantId);
    expect(result).toEqual({ id: 25 });
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
    const plantId = 1;
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      status: 404,
      statusText: 'Not Found',
      headers: new Headers(),
      text: async () => 'Akwarium nie znaleziono',
    });

    await expect(
      addPlantToAquarium(aquariumId, plantId)
    ).rejects.toThrow();

    expect(consoleErrorSpy).toHaveBeenCalledWith(
      `Error adding plant to aquarium ${aquariumId}:`,
      expect.any(Error)
    );

    expect(consoleErrorSpy).toHaveBeenCalledWith(
      `Error adding plant to aquarium ${aquariumId}:`,
      expect.objectContaining({
        message: 'Akwarium nie znaleziono'
      })
    );
  });


  it('rzuca błąd gdy roślina nie istnieje (404)', async () => {
    const aquariumId = 20;
    const plantId = 777;
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      status: 404,
      statusText: 'Not Found',
      headers: new Headers(),
      text: async () => 'Plant species not found',
    });

    await expect(
      addPlantToAquarium(aquariumId, plantId)
    ).rejects.toThrow(/Plant species not found/);

    expect(consoleErrorSpy).toHaveBeenCalledWith(
      `Error adding plant to aquarium ${aquariumId}:`,
      expect.any(Error)
    );
  });


  it('rzuca błąd przy niepoprawnym count (400)', async () => {
    const aquariumId = 35;
    const plantId = 18;
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
      addPlantToAquarium(aquariumId, plantId, -3)
    ).rejects.toThrow(/Count must be positive|greater than 0/);

    expect(consoleErrorSpy).toHaveBeenCalledWith(
      `Error adding plant to aquarium ${aquariumId}:`,
      expect.any(Error)
    );
  });
});