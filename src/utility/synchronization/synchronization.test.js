import {expect} from 'chai';
import sinon from 'sinon';
import {debounce, throttle} from './synchronization';

const waitFor = delay => new Promise(resolve => setTimeout(resolve, delay));

describe('Synchronization', () => {
    it('debounce()', async () => {
        const spy = sinon.spy();
        const db = debounce(spy, 100);
        db();
        db();
        db();
        await waitFor(200);
        expect(spy.callCount).to.eql(1);
    });

    it('throttle()', async () => {
        const spy = sinon.spy();
        const db = throttle(spy, 100);
        db();
        db();
        expect(spy.callCount).to.eql(1);
        await waitFor(200);
        expect(spy.callCount).to.eql(2);
        db();
        expect(spy.callCount).to.eql(3);
        await waitFor(200);
        expect(spy.callCount).to.eql(3);
    });
});
