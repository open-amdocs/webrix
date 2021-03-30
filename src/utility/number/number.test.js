import {clamp, interval, map, decimals} from './number.js';
import {expect} from 'chai';

describe('Number', () => {
    it('clamp()', () => {
        expect(clamp(5, 0, 10)).to.equal(5);
        expect(clamp(10, 0, 10)).to.equal(10);
        expect(clamp(15, 0, 10)).to.equal(10);
        expect(clamp(0, 0, 10)).to.equal(0);
        expect(clamp(-5, 0, 10)).to.equal(0);
        // Cyclic
        expect(clamp(5, 0, 10, true)).to.equal(5);
        expect(clamp(10, 0, 10, true)).to.equal(10);
        expect(clamp(15, 0, 10, true)).to.equal(0);
        expect(clamp(0, 0, 10, true)).to.equal(0);
        expect(clamp(-5, 0, 10, true)).to.equal(10);
    });
    it('map()', () => {
        expect(map(5, 0, 10, 0, 20)).to.equal(10);
        expect(map(10, 0, 10, 0, 20)).to.equal(20);
        expect(map(15, 0, 10, 0, 20)).to.equal(30);
        expect(map(-5, 0, 10, 0, 20)).to.equal(-10);
        expect(map(10, 0, 10, 10, 0)).to.equal(0);
    });
    it('interval()', () => {
        expect(interval(5, 1)).to.equal(5);
        expect(interval(5, 4)).to.equal(4);
        expect(interval(0.5, 0.1)).to.equal(0.5);
        expect(interval(0.5, 0.3)).to.equal(0.6);
    });
    it('decimals()', () => {
        expect(decimals(0.0001, 4)).to.equal(0.0001);
        expect(decimals(0.0001, 3)).to.equal(0);
        expect(decimals(0.0009, 3)).to.equal(0.001);
        expect(decimals(0.1 + 0.2, 17)).to.equal(0.30000000000000004);
        expect(decimals(0.1 + 0.2, 1)).to.equal(0.3);
        expect(decimals(4.27, 2)).to.equal(4.27);
    });
});