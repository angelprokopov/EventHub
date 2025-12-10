
import { describe, expect, test } from 'vitest';
import { normalizeCity } from './city.ts';

describe('normalizeCity', () => {
    test('handles "Venue, City, Country"', () => {
        expect(
            normalizeCity('National Palace of Culture (NDK), Sofia, Bulgaria')
        ).toBe('Sofia');
    });

    test('handles "City, Country"', () => {
        expect(normalizeCity('Varna, Bulgaria')).toBe('Varna');
    });

    test('handles "City"', () => {
        expect(normalizeCity('Sofia')).toBe('Sofia');
    });
});
