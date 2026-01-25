import { getAquariumById } from '../../app/lib/api';

global.fetch = jest.fn();
const consoleLogSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
const consoleWarnSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});
const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

describe('API Helpers – getAquariumById', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
  });

  afterAll(() => {
    jest.restoreAllMocks();
  });

  it('pobiera akwarium – status 200 + poprawny JSON', async () => {
    const mockAquarium = {
      id: 42,
      name: 'Akwarium testowe',
      volume: 180,
      ownerId: 'user-xyz-123',
    };

    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      status: 200,
      statusText: 'OK',
      headers: new Headers({ 'content-length': '120' }),
      text: async () => JSON.stringify(mockAquarium),
    });

    const result = await getAquariumById(42);

    expect(result).toEqual(mockAquarium);

    expect(global.fetch).toHaveBeenCalledWith(
      'http://localhost:3001/api/v1/aquariums/42',
      expect.objectContaining({
        method: 'GET',
        headers: expect.objectContaining({
          'Content-Type': 'application/json',
        }),
        signal: expect.any(AbortSignal),
      })
    );

    expect(consoleLogSpy).toHaveBeenCalledWith(
      'API Request: GET http://localhost:3001/api/v1/aquariums/42'
    );
    expect(consoleLogSpy).toHaveBeenCalledWith(
      'API Response Status: 200 OK'
    );
    expect(consoleLogSpy).toHaveBeenCalledWith('API Response Data:', mockAquarium);
  });

  it('zwraca null i loguje ostrzeżenie przy 404', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      status: 404,
      statusText: 'Not Found',
      headers: new Headers(),
      text: async () => 'Akwarium nie znaleziono',
    });

    const result = await getAquariumById(999);

    expect(result).toBeNull();

    expect(consoleLogSpy).toHaveBeenCalledWith(
      'API Request: GET http://localhost:3001/api/v1/aquariums/999'
    );
    expect(consoleLogSpy).toHaveBeenCalledWith('API Response Status: 404 Not Found');

    expect(consoleWarnSpy).toHaveBeenCalledWith(
      'API Request failed:',
      'Akwarium nie znaleziono'
    );

    expect(consoleErrorSpy).toHaveBeenCalledWith(
      'Error fetching aquarium with id 999:',
      expect.objectContaining({ message: 'Akwarium nie znaleziono' })
    );
  });

  it('zwraca null i loguje timeout przy AbortError', async () => {
    (global.fetch as jest.Mock).mockRejectedValueOnce(
      new DOMException('The operation was aborted', 'AbortError')
    );

    const result = await getAquariumById(5);

    expect(result).toBeNull();

    expect(consoleWarnSpy).toHaveBeenCalledWith(
      'API Request failed:',
      'API request timeout'
    );

    expect(consoleErrorSpy).toHaveBeenCalledWith(
      'Error fetching aquarium with id 5:',
      expect.objectContaining({ message: 'API request timeout' })
    );
  });

  it('dodaje nagłówek Authorization gdy token jest w localStorage', async () => {
    localStorage.setItem(
      'user',
      JSON.stringify({ token: 'test-jwt-token-abc123' })
    );

    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: async () => ({ id: 7, name: 'Małe akwarium' }),
    });

    await getAquariumById(7);

    expect(global.fetch).toHaveBeenCalledWith(
      expect.any(String),
      expect.objectContaining({
        headers: expect.objectContaining({
          'Content-Type': 'application/json',
          Authorization: 'Bearer test-jwt-token-abc123',
        }),
      })
    );
  });

  it('zwraca null dla odpowiedzi 204 No Content', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      status: 204,
      statusText: 'No Content',
      headers: new Headers(),
      text: async () => '',
    });

    const result = await getAquariumById(10);

    expect(result).toBeNull();

    expect(consoleLogSpy).toHaveBeenCalledWith('API Response: 204 No Content');
  });

  it('zwraca null dla odpowiedzi z content-length: 0', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      status: 200,
      statusText: 'OK',
      headers: new Headers({ 'content-length': '0' }),
      text: async () => '',
    });

    const result = await getAquariumById(15);

    expect(result).toBeNull();

    expect(consoleLogSpy).toHaveBeenCalledWith(
      'API Response: Empty body (content-length: 0)'
    );
  });

  it('zwraca null dla pustego JSON body', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      status: 200,
      statusText: 'OK',
      headers: new Headers(),
      text: async () => ' ',
    });

    const result = await getAquariumById(20);

    expect(result).toBeNull();

    expect(consoleLogSpy).toHaveBeenCalledWith('API Response: Empty body');
  });
});