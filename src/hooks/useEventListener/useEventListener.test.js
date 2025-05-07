import React from 'react';
import {act} from 'react-dom/test-utils';
import sinon from 'sinon';
import {mount} from 'enzyme';
import useEventListener from './useEventListener';

describe('useEventListener()', () => {
    it('Should add an event listener', () => {
        const addEventListener = sinon.spy();
        const removeEventListener = sinon.spy();
        const onClick = sinon.spy();
        const Component = () => {
            useEventListener('click', onClick, {current: {addEventListener, removeEventListener}});
            return null;
        };

        const wrapper = mount(<Component/>);
        expect(addEventListener.callCount).toEqual(1);
        expect(removeEventListener.callCount).toEqual(0);

        act(() => {wrapper.unmount()});
        expect(addEventListener.callCount).toEqual(1);
        expect(removeEventListener.callCount).toEqual(1);
    });
});