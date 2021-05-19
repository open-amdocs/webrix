import React from 'react';
import {act} from 'react-dom/test-utils';
import {expect} from 'chai';
import {mount} from 'enzyme';
import sinon from 'sinon';
import useAnimationFrame from './useAnimationFrame';

const Elem = ({onChange, recurring}) => {
    const {start, stop} = useAnimationFrame(onChange, recurring);
    return <div start={start} stop={stop}/>;
};

describe('useAnimationFrame()', () => {
    it('Should call requestAnimationFrame',  () => {
        global.window.requestAnimationFrame.resetHistory();
        global.window.cancelAnimationFrame.resetHistory();

        let wrapper = null;
        const onChange = sinon.spy();
        act(() => {wrapper = mount(<Elem onChange={onChange}/>)});

        // Verify a requestAnimationFrame() call is made
        wrapper.find('div').prop('start')();
        expect(global.window.cancelAnimationFrame.callCount).to.eql(1);
        expect(global.window.requestAnimationFrame.callCount).to.eql(1);

        // Verify that the call is executing our given callback
        global.window.requestAnimationFrame.args[0][0](); // Call the first argument given to requestAnimationFrame()
        expect(onChange.callCount).to.eql(1);

        act(() => {wrapper.unmount()});
    });
    it('Should cleanup', () => {
        global.window.cancelAnimationFrame.resetHistory();
        let wrapper = null;
        act(() => {wrapper = mount(<Elem onChange={() => null}/>)});

        // Verify a single cancelAnimationFrame() call is made initially
        wrapper.find('div').prop('start')();
        expect(global.window.cancelAnimationFrame.callCount).to.eql(1);

        // Verify a single cancelAnimationFrame() call is made when stopping
        wrapper.find('div').prop('stop')();
        expect(global.window.cancelAnimationFrame.callCount).to.eql(2);

        // Verify a second cancelAnimationFrame() call is made when unmounting
        act(() => {wrapper.unmount()});
        expect(global.window.cancelAnimationFrame.callCount).to.eql(3);
    });
    it('Should call requestAnimationFrame recursively',  () => {
        global.window.requestAnimationFrame.resetHistory();
        let wrapper = null;
        const onChange = sinon.spy();
        act(() => {wrapper = mount(<Elem onChange={onChange} recurring/>)});

        // Verify a single cancelAnimationFrame() call is made initially
        wrapper.find('div').prop('start')();
        expect(global.window.requestAnimationFrame.callCount).to.eql(1);

        // Verify that onChange is called once
        global.window.requestAnimationFrame.args[0][0]();
        expect(global.window.requestAnimationFrame.callCount).to.eql(2);
        expect(onChange.callCount).to.eql(1);

        // Verify that onChange is called again recursively
        global.window.requestAnimationFrame.args[1][0]();
        expect(global.window.requestAnimationFrame.callCount).to.eql(3);
        expect(onChange.callCount).to.eql(2);

        act(() => {wrapper.unmount()});
    });
});