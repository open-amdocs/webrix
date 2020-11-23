import {clamp} from './number.js';
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
});