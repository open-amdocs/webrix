import React from 'react';
import {act} from 'react-dom/test-utils';
import sinon from 'sinon';
import {expect} from 'chai';
import {mount} from 'enzyme';
import useEventListener from './useEventListener';

describe('useEventListener()', () => {
    it('Should add an event listener', () => {
        let wrapper;
        const addEventListener = sinon.spy();
        const removeEventListener = sinon.spy();
        const onClick = sinon.spy();
        const Component = () => {
            useEventListener('click', onClick, {current: {addEventListener, removeEventListener}});
            return null;
        };

        act(() => {wrapper = mount(<Component/>)});
        expect(addEventListener.callCount).to.eql(1);
        expect(removeEventListener.callCount).to.eql(0);
        wrapper.unmount();
        expect(addEventListener.callCount).to.eql(1);
        expect(removeEventListener.callCount).to.eql(1);
    });
    it('Should update handler', () => {
        let handler = null;
        const onClick1 = () => 'handler1';
        const onClick2 = () => 'handler2';
        const Component = ({onClick}) => {
            useEventListener('click', onClick, {current: {addEventListener: (type, func) => handler = func()}});
            return null;
        };

        const wrapper = mount(<Component onClick={onClick1}/>);
        expect(handler).to.eql(onClick1());

        wrapper.setProps({onClick: onClick2});
        wrapper.update();
        expect(handler).to.eql(onClick2());
    });
});