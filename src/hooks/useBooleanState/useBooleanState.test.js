import React from 'react';
import {act} from 'react-dom/test-utils';
import {expect} from 'chai';
import {shallow} from 'enzyme';
import {useVisibilityState, useFocusabilityState} from './useBooleanState';

const Elem = () => {
    const {visible, show, hide, toggle} = useVisibilityState();
    return (
        <div className={visible ? 'visible' : 'hidden'}>
            <div className='show' onClick={show}/>
            <div className='hide' onClick={hide}/>
            <div className='toggle' onClick={toggle}/>
        </div>
    );
};

describe('useVisibilityState()', () => {
    it('Should toggle visibility', () => {
        let wrapper = null;
        act(() => {wrapper = shallow(<Elem/>)});

        expect(wrapper.find('.hidden')).to.have.length(1);
        wrapper.find('.show').simulate('click');
        expect(wrapper.find('.visible')).to.have.length(1);
        wrapper.find('.hide').simulate('click');
        expect(wrapper.find('.hidden')).to.have.length(1);
        wrapper.find('.toggle').simulate('click');
        expect(wrapper.find('.visible')).to.have.length(1);
        wrapper.find('.toggle').simulate('click');
        expect(wrapper.find('.hidden')).to.have.length(1);
    });
});

const FocusedElem = () => {
    const {focused, focus, blur, toggle} = useFocusabilityState();
    return (
        <div className={focused ? 'focused' : ''}>
            <div className='focus' onClick={focus}/>
            <div className='blur' onClick={blur}/>
            <div className='toggle' onClick={toggle}/>
        </div>
    );
};

describe('useFocusabilityState()', () => {
    it('Should toggle focusability', () => {
        let wrapper = null;
        act(() => {wrapper = shallow(<FocusedElem/>)});

        expect(wrapper.find('.focus')).to.have.length(1);
        wrapper.find('.focus').simulate('click');
        expect(wrapper.find('.blur')).to.have.length(1);
        wrapper.find('.blur').simulate('click');
        expect(wrapper.find('.focused')).to.have.length(0);
        wrapper.find('.toggle').simulate('click');
        expect(wrapper.find('.focused')).to.have.length(1);
    });
});
