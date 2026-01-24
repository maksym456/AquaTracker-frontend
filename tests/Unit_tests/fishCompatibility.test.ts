import {
    normalizeTemperament,
    checkTemperamentCompatibility,
  } from '../../app/lib/fishCompatibility';

jest.mock('../../app/i18n', () => ({
  t: (key, params) => {
    switch (key) {
      case 'aggressiveCannotBeWithPeaceful':
        return `${params.aggressiveName} (agresywne) nie może być z ${params.peacefulName} (spokojne). Spokojna ryba może zostać pożarta.`;
      case 'aggressiveCannotBeWithSemiAggressive':
        return `${params.aggressiveName} (agresywne) nie może być z ${params.semiAggressiveName} (pół-agresywne). Agresywna ryba może zaatakować pół-agresywną.`;
      case 'semiAggressiveWithPeacefulConflict':
        return `${params.semiAggressiveName} (pół-agresywne) z ${params.peacefulName} (spokojne) - konflikt może spowodować pożarcie spokojnego osobnika.`;
      default:
        return key;
    }
  },
}));

  describe('Fish Compatibility – podstawowe funkcje temperamentu', () => {
    describe('normalizeTemperament', () => {
      it('normalizuje różne warianty spokojnego temperamentu', () => {
        expect(normalizeTemperament('Spokojne')).toBe('spokojne');
        expect(normalizeTemperament('spokojna')).toBe('spokojne');
        expect(normalizeTemperament('')).toBe('spokojne');
        expect(normalizeTemperament(null)).toBe('spokojne');
      });
  
      it('rozpoznaje pół-agresywne (różne zapisy)', () => {
        expect(normalizeTemperament('Pół agresywne')).toBe('pół-agresywne');
        expect(normalizeTemperament('pół-agresywne')).toBe('pół-agresywne');
        expect(normalizeTemperament('semi-aggressive')).toBe('pół-agresywne');
        expect(normalizeTemperament('pół')).toBe('pół-agresywne');
      });
  
      it('rozpoznaje agresywne', () => {
        expect(normalizeTemperament('Agresywne')).toBe('agresywne');
        expect(normalizeTemperament('aggressive')).toBe('agresywne');
      });
    });
  
    describe('checkTemperamentCompatibility', () => {
      const spokojna = { name: 'Neon', temperament: 'spokojne', id: 'neon' };
      const polAgresywna = { name: 'Skalar', temperament: 'pół-agresywne', id: 'skalar' };
      const agresywna = { name: 'Oskalarek', temperament: 'agresywne', id: 'oskar' };
      const innaAgresywna = { name: 'Cychlazoma', temperament: 'agresywne', id: 'cychla' };
  
      it('spokojne + spokojne → w pełni kompatybilne', () => {
        const result = checkTemperamentCompatibility(spokojna, spokojna);
        expect(result.compatible).toBe(true);
        expect(result.severity).toBe(null);
        expect(result.message).toBe(null);
      });
  
      it('agresywne + spokojne → ERROR (nie mogą być razem)', () => {
        const result = checkTemperamentCompatibility(agresywna, spokojna);
        expect(result.compatible).toBe(false);
        expect(result.severity).toBe('ERROR');
        expect(result.message).toContain('agresywne');
        expect(result.message).toContain('pożarta');
      });
  
      it('agresywne + pół-agresywne → ERROR', () => {
        const result = checkTemperamentCompatibility(agresywna, polAgresywna);
        expect(result.compatible).toBe(false);
        expect(result.severity).toBe('ERROR');
      });
  
      it('dwie agresywne różne gatunki → WARNING (możliwy konflikt)', () => {
        const result = checkTemperamentCompatibility(agresywna, innaAgresywna);
        expect(result.compatible).toBe(true);
        expect(result.severity).toBe('WARNING');
        expect(result.message).toContain('konflikt');
        expect(result.message).toContain('konfliktu');  
      });
  
      it('pół-agresywne + spokojne → WARNING', () => {
        const result = checkTemperamentCompatibility(polAgresywna, spokojna);
        expect(result.compatible).toBe(true);
        expect(result.severity).toBe('WARNING');
        expect(result.message).toContain('pożarcie');
      });
    });
  });