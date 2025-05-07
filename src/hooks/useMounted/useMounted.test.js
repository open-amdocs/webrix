import React from 'react';
import {act} from 'react-dom/test-utils';
import {mount} from 'enzyme';
import {useMounted, useUnmounted} from './useMounted';

describe('useMounted()', () => {
    it('Should return the previous value', () => {
        const Elem = () => {
            const mounted = useMounted();
            return (
                <div className={`${mounted ? '' : 'un'}mounted`}/>
            );
        };
        const wrapper = mount(<Elem/>);
        expect(wrapper.find('.unmounted').length).toEqual(1);
        expect(wrapper.find('.mounted').length).toEqual(0);

        act(() => {
            wrapper.setProps({foo: 'bar'}); // Force an update...
        });

        expect(wrapper.find('.mounted').length).toEqual(1);
        expect(wrapper.find('.unmounted').length).toEqual(0);
    });
});

describe('useUnmounted()', () => {
    it('Should return the previous value', () => {
        const Elem = () => {
            const unmounted = useUnmounted();
            return (
                <div className={`${unmounted ? 'un' : ''}mounted`}/>
            );
        };
        const wrapper = mount(<Elem/>);
        expect(wrapper.find('.unmounted').length).toEqual(0);
        expect(wrapper.find('.mounted').length).toEqual(1);
        wrapper.setProps({foo: 'bar'}); // Force an update...
        expect(wrapper.find('.mounted').length).toEqual(1);
        expect(wrapper.find('.unmounted').length).toEqual(0);
    });
});