import React from 'react';
import {act} from 'react-dom/test-utils';
import {expect} from 'chai';
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
        let wrapper = null;
        act(() => {wrapper = mount(<Elem/>)});
        expect(wrapper.find('.unmounted').length).to.eql(1);
        expect(wrapper.find('.mounted').length).to.eql(0);
        wrapper.setProps({foo: 'bar'}); // Force an update...
        expect(wrapper.find('.mounted').length).to.eql(1);
        expect(wrapper.find('.unmounted').length).to.eql(0);
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
        let wrapper = null;
        act(() => {wrapper = mount(<Elem/>)});
        expect(wrapper.find('.unmounted').length).to.eql(0);
        expect(wrapper.find('.mounted').length).to.eql(1);
        wrapper.setProps({foo: 'bar'}); // Force an update...
        expect(wrapper.find('.mounted').length).to.eql(1);
        expect(wrapper.find('.unmounted').length).to.eql(0);
    });
});