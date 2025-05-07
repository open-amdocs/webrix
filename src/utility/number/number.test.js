import {clamp, interval, map, decimals} from './number.js';

describe('Number', () => {
    it('clamp()', () => {
        expect(clamp(5, 0, 10)).toBe(5);
        expect(clamp(10, 0, 10)).toBe(10);
        expect(clamp(15, 0, 10)).toBe(10);
        expect(clamp(0, 0, 10)).toBe(0);
        expect(clamp(-5, 0, 10)).toBe(0);
        // Cyclic
        expect(clamp(5, 0, 10, true)).toBe(5);
        expect(clamp(10, 0, 10, true)).toBe(10);
        expect(clamp(15, 0, 10, true)).toBe(0);
        expect(clamp(0, 0, 10, true)).toBe(0);
        expect(clamp(-5, 0, 10, true)).toBe(10);
    });
	
    it('map()', () => {
        expect(map(5, 0, 10, 0, 20)).toBe(10);
        expect(map(10, 0, 10, 0, 20)).toBe(20);
        expect(map(15, 0, 10, 0, 20)).toBe(30);
        expect(map(-5, 0, 10, 0, 20)).toBe(-10);
        expect(map(10, 0, 10, 10, 0)).toBe(0);
    });
	
    it('interval()', () => {
        expect(interval(5, 1)).toBe(5);
        expect(interval(5, 4)).toBe(4);
        expect(interval(0.5, 0.1)).toBe(0.5);
        expect(interval(0.5, 0.3)).toBe(0.6);
    });
	
    it('decimals()', () => {
        expect(decimals(0.0001, 4)).toBe(0.0001);
        expect(decimals(0.0001, 3)).toBe(0);
        expect(decimals(0.0009, 3)).toBe(0.001);
        expect(decimals(0.1 + 0.2, 17)).toBe(0.30000000000000004);
        expect(decimals(0.1 + 0.2, 1)).toBe(0.3);
        expect(decimals(4.27, 2)).toBe(4.27);
    });
});