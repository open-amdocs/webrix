import React from 'react';
import {act} from 'react-dom/test-utils';
import {mount} from 'enzyme';
import sinon from 'sinon';
import useAnimationFrame from './useAnimationFrame';

const Elem = ({onChange, recurring}) => {
    const {start, stop} = useAnimationFrame(onChange, recurring);
    return (
        <>
            <div className='start' onClick={start}/>
            <div className='stop' onClick={stop}/>
        </>
    );
};

describe('useAnimationFrame()', () => {
    it('Should call requestAnimationFrame',  () => {
        global.window.requestAnimationFrame.resetHistory();
        global.window.cancelAnimationFrame.resetHistory();

        const onChange = sinon.spy();
        const wrapper = mount(<Elem onChange={onChange}/>);

        // Verify a requestAnimationFrame() call is made
        wrapper.find('.start').prop('onClick')();
        expect(global.window.cancelAnimationFrame.callCount).toEqual(1);
        expect(global.window.requestAnimationFrame.callCount).toEqual(1);

        // Verify that the call is executing our given callback
        global.window.requestAnimationFrame.args[0][0](); // Call the first argument given to requestAnimationFrame()
        expect(onChange.callCount).toEqual(1);

        act(() => {wrapper.unmount()});
    });
    it('Should cleanup', () => {
        global.window.cancelAnimationFrame.resetHistory();
        const wrapper = mount(<Elem onChange={() => null}/>);

        // Verify a single cancelAnimationFrame() call is made initially
        wrapper.find('.start').prop('onClick')();
        expect(global.window.cancelAnimationFrame.callCount).toEqual(1);

        // Verify a single cancelAnimationFrame() call is made when stopping
        wrapper.find('.stop').prop('onClick')();
        expect(global.window.cancelAnimationFrame.callCount).toEqual(2);

        // Verify a second cancelAnimationFrame() call is made when unmounting
        act(() => {wrapper.unmount()});
        expect(global.window.cancelAnimationFrame.callCount).toEqual(3);
    });
    it('Should call requestAnimationFrame recursively',  () => {
        global.window.requestAnimationFrame.resetHistory();
        const onChange = sinon.spy();
        const wrapper = mount(<Elem onChange={onChange} recurring/>);

        // Verify a single cancelAnimationFrame() call is made initially
        wrapper.find('.start').prop('onClick')();
        expect(global.window.requestAnimationFrame.callCount).toEqual(1);

        // Verify that onChange is called once
        global.window.requestAnimationFrame.args[0][0]();
        expect(global.window.requestAnimationFrame.callCount).toEqual(2);
        expect(onChange.callCount).toEqual(1);

        // Verify that onChange is called again recursively
        global.window.requestAnimationFrame.args[1][0]();
        expect(global.window.requestAnimationFrame.callCount).toEqual(3);
        expect(onChange.callCount).toEqual(2);

        act(() => {wrapper.unmount()});
    });
});