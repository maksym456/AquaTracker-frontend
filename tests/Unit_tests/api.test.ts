import { getAquariumById } from '../../app/lib/api';


global.fetch = jest.fn();
const consoleWarnSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});
const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

describe('API Helpers – pobieranie pojedynczego akwarium (getAquariumById)', () => {
  afterEach(() => {
    jest.clearAllMocks(); 
  });

  it('pobiera dane akwarium poprawnie (sukces 200 + JSON)', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      status: 200,
      headers: new Map([['content-length', '100']]), 
      text: async () => JSON.stringify({
        id: 1,
        name: 'Moje testowe akwarium',
        volume: 200,
        ownerId: 'uuid-test',
      }),
    });

    const data = await getAquariumById(1);
    expect(data).toEqual({
      id: 1,
      name: 'Moje testowe akwarium',
      volume: 200,
      ownerId: 'uuid-test',
    });

    expect(global.fetch).toHaveBeenCalledTimes(1);
    expect(consoleWarnSpy).not.toHaveBeenCalled(); 
  });

  it('obsługuje 404 – zwraca null i loguje error', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      status: 404,
      statusText: 'Not Found',
      text: async () => 'Akwarium nie znaleziono',
    });

    const data = await getAquariumById(999);
    expect(data).toBeNull(); 
    expect(consoleErrorSpy).toHaveBeenCalledWith(
      'API Error Response:',
      'Akwarium nie znaleziono'
    );
    expect(consoleWarnSpy).toHaveBeenCalledWith(
      'API Request failed:',
      expect.stringContaining('API Error: 404 Not Found')
    );
  });

  it('obsługuje timeout / AbortError – zwraca null i loguje warn', async () => {
    (global.fetch as jest.Mock).mockRejectedValueOnce(new Error('API request timeout'));

    const data = await getAquariumById(1);
    expect(data).toBeNull();
    expect(consoleWarnSpy).toHaveBeenCalledTimes(1);
    expect(consoleWarnSpy).toHaveBeenCalledWith(
      'API Request failed:',
      'API request timeout'
    );
    expect(consoleWarnSpy).not.toHaveBeenCalledWith(
      expect.stringContaining('Nie można połączyć się z API:')
    );
  });
});