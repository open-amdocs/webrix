import React from 'react';
// https://reactjs.org/docs/hooks-faq.html#how-to-test-components-that-use-hooks
import {act} from 'react-dom/test-utils';
import sinon from 'sinon';
import {mount, shallow} from 'enzyme';
import OverrideContext from './useClickOutside.context';
import {useClickOutside, ClickOutside, ClickOutsideOverride} from './useClickOutside';

const Elem = callback => {
    useClickOutside(callback);
    return <div/>;
};

describe('useClickOutside()', () => {
    it('Should add an event listener to the document', () => {
        document.addEventListener = sinon.spy();
        document.removeEventListener = sinon.spy();
        let elem;
        act(() => {elem = mount(<Elem/>)});
        expect(document.addEventListener.callCount).toEqual(4); // 2 calls are done regardless, not sure why, but it only happens during testing
        expect(document.addEventListener.calledWith('mousedown')).toEqual(true);
        expect(document.addEventListener.calledWith('mouseup')).toEqual(true);
        act(() => {elem.unmount()});
        expect(document.removeEventListener.calledTwice).toEqual(true);
        expect(document.removeEventListener.calledWith('mousedown')).toEqual(true);
        expect(document.removeEventListener.calledWith('mouseup')).toEqual(true);
    });

    it('Should not trigger the callback on click inside', () => {
        const callback = sinon.spy();
        const elem = mount(<Elem callback={callback}/>);
        expect(elem.find('div'));
        elem.simulate('click');
        expect(callback.callCount).toEqual(0);
    });

    it('<ClickOutside/>', () => {
        const wrapper = shallow(<ClickOutside><div/></ClickOutside>);
        expect(() => shallow(<ClickOutside/>)).toThrow();
        expect(typeof wrapper.find('div').prop('onMouseDownCapture')).toBe('function');
    });

    it('<ClickOutsideOverride/>', () => {
        const wrapper = shallow(<ClickOutsideOverride/>);
        expect(wrapper.find(OverrideContext.Provider)).toHaveLength(1);
    });
});
