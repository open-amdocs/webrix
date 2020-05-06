import {noop} from "./memory";
import {expect} from 'chai';

describe('memory', () => {
    it('noop()', () => {
        expect(noop()).to.eql(null);
    });
});