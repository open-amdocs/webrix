import React, {useState} from 'react';
import {act} from 'react-dom/test-utils';
import sinon from 'sinon';
import {mount} from 'enzyme';
import useDebounce from './useDebounce';

const waitFor = delay => new Promise(resolve => setTimeout(resolve, delay));
const DELAY = 10;
const Elem = () => {
    const [count, setCount] = useState(0);
    const increment = useDebounce(() => {
        setCount(c => c + 1);
    }, DELAY);
    return (
        <div className='counter' onClick={increment}>{count}</div>
    );
};

describe('useDebounce()', () => {
    it('Should delay calls', async () => {
        await act(async () => {
            const wrapper = mount(<Elem/>);
            expect(wrapper.find('.counter').text()).toEqual('0');

            wrapper.find('.counter').simulate('click');
            expect(wrapper.find('.counter').text()).toEqual('0');
            await waitFor(DELAY);
            wrapper.update();
            expect(wrapper.find('.counter').text()).toEqual('1');

            wrapper.find('.counter').simulate('click');
            wrapper.find('.counter').simulate('click');
            wrapper.find('.counter').simulate('click');
            expect(wrapper.find('.counter').text()).toEqual('1');
            await waitFor(DELAY);
            wrapper.update();
            expect(wrapper.find('.counter').text()).toEqual('2');
            wrapper.unmount();
        });
    });
    it('Should cleanup', async () => {
        await act(async () => {
            const spy = sinon.spy(global, 'clearTimeout');
            const wrapper = mount(<Elem/>);
            wrapper.unmount();
            await waitFor(0); // Wait for unmounting
            expect(spy.callCount).toEqual(1);
            spy.restore();
        });
    });
});