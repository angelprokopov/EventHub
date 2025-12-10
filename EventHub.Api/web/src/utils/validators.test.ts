import { describe, expect, test } from 'vitest';
import { required, min, isValidUrl } from './validators';

describe('validators', () => {
    test('isRequired rejects empty values', () => {
        expect(required('')).toBeDefined();
        expect(required('   ')).toBeDefined();
        expect(required('EventHub')).toBeUndefined();
    });

    test('minLength(3) enforces minimum length', () => {
        const validate = min(3);

        expect(validate('ab')).toBeDefined();
        expect(validate('abc')).toBeUndefined();
        expect(validate('long title')).toBeUndefined();
    });

    test('isValidUrl accepts http/https and rejects invalid URLs', () => {
        expect(isValidUrl('https://example.com')).toBeUndefined();
        expect(isValidUrl('http://localhost:3000')).toBeUndefined();

        expect(isValidUrl('not-a-url')).toBeDefined();
        expect(isValidUrl('ftp://example.com')).toBeDefined();
    });
});
