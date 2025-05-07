import {intersection, midpoint, inRange} from './range';

describe('Range', () => {
    it('intersection()', () => {
        expect(intersection([0, 10], [0, 10])).toEqual([0, 10]);
        expect(intersection([0, 10], [5, 15])).toEqual([5, 10]);
        expect(intersection([0, 10], [-5, 5])).toEqual([0, 5]);
        expect(intersection([0, 10], [10, 20])).toEqual([10, 10]);
        expect(intersection([0, 10], [20, 30])).toEqual([]);
    });

    it('midpoint()', () => {
        expect(midpoint([0, 10])).toEqual(5);
        expect(midpoint([10, 20])).toEqual(15);
    });

    it('inRange()', () => {
        expect(inRange(5, 0, 10)).toBe(true);
        expect(inRange(5, 10, 0)).toBe(true);
        expect(inRange(0, 0, 10)).toBe(true);
        expect(inRange(10, 0, 10)).toBe(true);
        expect(inRange(-1, 0, 10)).toBe(false);
        expect(inRange(11, 0, 10)).toBe(false);
    });
});