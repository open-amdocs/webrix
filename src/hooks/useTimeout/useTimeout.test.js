import React from 'react';
import {act} from 'react-dom/test-utils';
import {mount} from 'enzyme';
import useTimeout from './useTimeout';

const waitFor = delay => new Promise(resolve => setTimeout(resolve, delay));
let spy = 1, stopSpy;

const Timeout = ({delay, recurring}) => {
    const {start, stop} = useTimeout(() => { spy += 1 }, delay, recurring);
    start();
    stopSpy = stop;
    return null;
};

describe('useTimeout()', () => {
    beforeEach(() => {
        spy = 1;
    });

    it('Should execute the timeout callback once, when no other prameters specified', async () => {
        await act(async () => {
            const wrapper = mount(<Timeout />);

            expect(spy).toEqual(1);

            await waitFor(0); // make sure the timeout has had enough time to fire
            wrapper.update();
            expect(spy).toEqual(2);
        });
    });

    it('Should execute the timeout callback once', async () => {
        await act(async () => {
            const DELAY = 100;
            const wrapper = mount(<Timeout delay={DELAY}/>);

            expect(spy).toEqual(1);

            await waitFor(DELAY/2);

            // should remain "1" as the timeout has yet to be executed
            expect(spy).toEqual(1);

            await waitFor(DELAY/2);

            wrapper.update();
            expect(spy).toEqual(2);
        });
    });

    it('Should not be recurring by default (called only once)', async () => {
        await act(async () => {
            const wrapper = await mount(<Timeout/>);

            expect(spy).toEqual(1);

            await waitFor(0);
            wrapper.update();
            expect(spy).toEqual(2);

            // wait some more time to make sure the timeout is not recurring
            await waitFor(50);
            wrapper.update();
            expect(spy).toEqual(2);
        });
    });

    it('Should stop recurring', async () => {
        await act(async () => {
            const DELAY = 50;
            const wrapper = await mount(<Timeout delay={DELAY} recurring={true}/>);

            expect(spy).toEqual(1);

            await waitFor(DELAY * 3);
            wrapper.update();
            expect(spy).toEqual(3);

            stopSpy();
            await waitFor(DELAY * 2);
            wrapper.update();
            // should remain unchanged since last time
            expect(spy).toEqual(3);
        });
    });
});