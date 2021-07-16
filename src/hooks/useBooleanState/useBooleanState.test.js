import React from 'react';
import {act} from 'react-dom/test-utils';
import {shallow} from 'enzyme';
import {useVisibilityState, useFocusabilityState} from './useBooleanState';

const Elem = ({initial}) => {
    const {visible, show, hide, toggle} = useVisibilityState(initial);
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

        expect(wrapper.find('.hidden')).toHaveLength(1);
        wrapper.find('.show').simulate('click');
        expect(wrapper.find('.visible')).toHaveLength(1);
        wrapper.find('.hide').simulate('click');
        expect(wrapper.find('.hidden')).toHaveLength(1);
        wrapper.find('.toggle').simulate('click');
        expect(wrapper.find('.visible')).toHaveLength(1);
        wrapper.find('.toggle').simulate('click');
        expect(wrapper.find('.hidden')).toHaveLength(1);

        act(() => {wrapper = shallow(<Elem initial={true}/>)});
        expect(wrapper.find('.visible')).toHaveLength(1);
        wrapper.find('.hide').simulate('click');
        expect(wrapper.find('.hidden')).toHaveLength(1);
    });
});

const FocusedElem = ({initial}) => {
    const {focused, focus, blur, toggle} = useFocusabilityState(initial);
    return (
        <div className={focused ? 'focused' : 'blurred'}>
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

        expect(wrapper.find('.blurred')).toHaveLength(1);
        wrapper.find('.focus').simulate('click');
        expect(wrapper.find('.focused')).toHaveLength(1);
        wrapper.find('.blur').simulate('click');
        expect(wrapper.find('.blurred')).toHaveLength(1);
        wrapper.find('.toggle').simulate('click');
        expect(wrapper.find('.focused')).toHaveLength(1);

        act(() => {wrapper = shallow(<FocusedElem initial={true}/>)});
        expect(wrapper.find('.focused')).toHaveLength(1);
        wrapper.find('.blur').simulate('click');
        expect(wrapper.find('.blurred')).toHaveLength(1);
    });
});
