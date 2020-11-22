import React from 'react';
import {act} from 'react-dom/test-utils';
import {expect} from 'chai';
import {shallow} from 'enzyme';
import {useVisibilityState} from './useBooleanState';

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
