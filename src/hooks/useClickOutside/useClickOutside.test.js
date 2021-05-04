import React from 'react';
// https://reactjs.org/docs/hooks-faq.html#how-to-test-components-that-use-hooks
import {act} from 'react-dom/test-utils';
import sinon from 'sinon';
import {expect} from 'chai';
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
        expect(document.addEventListener.calledTwice).to.eql(true);
        expect(document.addEventListener.calledWith('mousedown')).to.eql(true);
        expect(document.addEventListener.calledWith('mouseup')).to.eql(true);
        act(() => {elem.unmount()});
        expect(document.removeEventListener.calledTwice).to.eql(true);
        expect(document.removeEventListener.calledWith('mousedown')).to.eql(true);
        expect(document.removeEventListener.calledWith('mouseup')).to.eql(true);
    });

    it('Should not trigger the callback on click inside', () => {
        const callback = sinon.spy();
        const elem = mount(<Elem callback={callback}/>);
        expect(elem.find('div'));
        elem.simulate('click');
        expect(callback.callCount).to.eql(0);
    });

    it('<ClickOutside/>', () => {
        const wrapper = shallow(<ClickOutside><div/></ClickOutside>);
        expect(() => shallow(<ClickOutside/>)).to.throw();
        expect(wrapper.find('div').prop('onMouseDownCapture')).to.be.a('function');
    });

    it('<ClickOutsideOverride/>', () => {
        const wrapper = shallow(<ClickOutsideOverride/>);
        expect(wrapper.find(OverrideContext.Provider)).to.have.length(1);
    });
});
