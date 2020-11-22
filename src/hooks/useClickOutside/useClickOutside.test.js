import React from 'react';
// https://reactjs.org/docs/hooks-faq.html#how-to-test-components-that-use-hooks
import {act} from 'react-dom/test-utils';
import sinon from 'sinon';
import {expect} from 'chai';
import {mount} from 'enzyme';
import useClickOutside from './useClickOutside';
import {getZindex, isAbove} from './clickOutside.utils';

const Elem = () => {
    let test = 1234;
    const ref = sinon.spy();
    useClickOutside(ref, () => test = 4321);
    return <div>{test}</div>;
};

describe('useClickOutside()', () => {
    it('Should add an event listener to the document', () => {
        document.addEventListener = sinon.spy();
        document.removeEventListener = sinon.spy();

        let elem;
        act(() => {
            elem = mount(<Elem/>);
        });
        expect(elem.text()).to.eql('1234');
        expect(document.addEventListener.calledTwice).to.eql(true);
        expect(document.addEventListener.calledWith('mousedown')).to.eql(true);
        expect(document.addEventListener.calledWith('mouseup')).to.eql(true);
        elem.unmount();
        expect(document.removeEventListener.calledWith('mousedown')).to.eql(true);
        expect(document.removeEventListener.calledWith('mouseup')).to.eql(true);
    });

    it('should test getZindex', () => {
        const  el = document.createElement('div');
        el.style['z-index'] = 10;
        expect(getZindex(el)).to.equal(10);
    });

    it('should test isAbove', () => {
        const  el1 = document.createElement('div');
        el1.className = 'stackable';
        el1.style['z-index'] = 10;
        const  el2 = document.createElement('div');
        el2.className = 'stackable';
        el2.style['z-index'] = 11;
        expect(isAbove(el1, el2)).to.eql(false);
        expect(isAbove(el2, el1)).to.eql(true);
    });
});
