import {expect} from 'chai';
import {intersection, midpoint, inRange} from './range';

describe('Range', () => {
    it('intersection()', () => {
        expect(intersection([0, 10], [0, 10])).to.eql([0, 10]);
        expect(intersection([0, 10], [5, 15])).to.eql([5, 10]);
        expect(intersection([0, 10], [-5, 5])).to.eql([0, 5]);
        expect(intersection([0, 10], [10, 20])).to.eql([10, 10]);
        expect(intersection([0, 10], [20, 30])).to.eql([]);
    });
    it('midpoint()', () => {
        expect(midpoint([0, 10])).to.eql(5);
        expect(midpoint([10, 20])).to.eql(15);
    });
    it('inRange()', () => {
        expect(inRange(5, 0, 10)).to.equal(true);
        expect(inRange(5, 10, 0)).to.equal(true);
        expect(inRange(0, 0, 10)).to.equal(true);
        expect(inRange(10, 0, 10)).to.equal(true);
        expect(inRange(-1, 0, 10)).to.equal(false);
        expect(inRange(11, 0, 10)).to.equal(false);
    });
});