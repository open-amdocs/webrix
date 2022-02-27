import React, {useState} from 'react';
import {act} from 'react-dom/test-utils';
import {mount} from 'enzyme';
import sinon from 'sinon';
import useThrottle from './useThrottle';

const waitFor = delay => new Promise(resolve => setTimeout(resolve, delay));
const DELAY = 10;

const Elem = () => {
    const [count, setCount] = useState(0);
    const increment = useThrottle(() => {
        setCount(c => c + 1);
    }, DELAY);
    return (
        <div className='counter' onClick={increment}>{count}</div>
    );
};

describe('useThrottle()', () => {
    it('Should delay calls', async () => {
        let wrapper = null;
        act(() => {wrapper = mount(<Elem/>)});
        expect(wrapper.find('.counter').text()).toEqual('0');

        wrapper.find('.counter').simulate('click');
        expect(wrapper.find('.counter').text()).toEqual('1');
        await waitFor(DELAY);
        wrapper.update();
        expect(wrapper.find('.counter').text()).toEqual('1');

        wrapper.find('.counter').simulate('click');
        wrapper.find('.counter').simulate('click');
        wrapper.find('.counter').simulate('click');
        expect(wrapper.find('.counter').text()).toEqual('2');
        await waitFor(DELAY);
        wrapper.update();
        expect(wrapper.find('.counter').text()).toEqual('2');
        act(() => {wrapper.unmount()});
    });
    it('Should cleanup', async () => {
        let wrapper = null;
        const spy = sinon.spy(global, 'clearTimeout');
        act(() => {wrapper = mount(<Elem/>)});
        act(() => {wrapper.unmount()});
        expect(spy.callCount).toEqual(1);
        spy.restore();
    });
});