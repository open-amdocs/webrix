import React from 'react';
import {act} from 'react-dom/test-utils';
import {mount} from 'enzyme';
import useDimensions, {__RewireAPI__ as rewireAPI} from './useDimensions';

const Elem = () => {
    const {width, height} = useDimensions({current: {}});
    return (
        <div>{width},{height}</div>
    );
};

describe('useDimensions()', () => {
    let observed = 0, disconnected = 0;

    beforeAll(() => {
        rewireAPI.__Rewire__('ResizeObserver', class {
            disconnect = () => disconnected++;
            observe = () => observed++;
        });
    });

    afterAll(() => {
        rewireAPI.__ResetDependency__('ResizeObserver');
    });

    it('Should return the previous value', async () => {
        const wrapper = mount(<Elem/>);

        expect(wrapper.text()).toEqual('0,0');
        expect(observed).toEqual(1);
        expect(disconnected).toEqual(0);

        act(() => {wrapper.unmount()});
        expect(observed).toEqual(1);
        expect(disconnected).toEqual(1);
    });
});