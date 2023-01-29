import React from 'react';
import {act} from 'react-dom/test-utils';
import {mount} from 'enzyme';
import {useMounted} from './useMounted';

describe('useMounted()', () => {
    let mounted;

    const Elem = () => {
        mounted = useMounted();
        return null;
    };

    it('Should be false on first render cycle and true afterwards', () => {
        let wrapper = null;
        act(() => {wrapper = mount(<Elem/>)});
        expect(mounted).toBeFalsy();
        wrapper.setProps({foo: 'bar'}); // Force an update...
        expect(mounted).toBeTruthy();
    });
});
