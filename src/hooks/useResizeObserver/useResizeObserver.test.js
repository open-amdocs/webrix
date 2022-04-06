import React from 'react';
import {act} from 'react-dom/test-utils';
import {mount} from 'enzyme';
import useResizeObserver, {__RewireAPI__ as rewireAPI} from './useResizeObserver';

const Elem = () => {
    const {width, height} = useResizeObserver({current: {}});
    return (
        <div>{width},{height}</div>
    );
};

describe('useResizeObserver()', () => {
    it('Should return the previous value', async () => {
        let wrapper = null;
        let observed = 0, disconnected = 0;
        rewireAPI.__Rewire__('ResizeObserver', class {
            disconnect = () => disconnected++;
            observe = () => observed++;
        });
        act(() => {wrapper = mount(<Elem/>)});
        expect(wrapper.text()).toEqual('0,0');
        expect(observed).toEqual(1);
        expect(disconnected).toEqual(0);

        act(() => {wrapper.unmount()});
        expect(observed).toEqual(1);
        expect(disconnected).toEqual(1);
        rewireAPI.__ResetDependency__('ResizeObserver');
    });
});