import {noop} from './memory';

describe('memory', () => {
    it('noop()', () => {
        expect(noop()).toEqual(null);
    });
});