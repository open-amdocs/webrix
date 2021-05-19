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

        act(() => {wrapper.unmount()});
        expect(addEventListener.callCount).to.eql(1);
        expect(removeEventListener.callCount).to.eql(1);
    });
});