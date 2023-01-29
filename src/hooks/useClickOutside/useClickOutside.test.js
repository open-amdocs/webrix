import React from 'react';
// https://reactjs.org/docs/hooks-faq.html#how-to-test-components-that-use-hooks
import {act} from 'react-dom/test-utils';
import sinon from 'sinon';
import {mount} from 'enzyme';
import {useClickOutside} from './useClickOutside';

let clickInsideHandler;
const Elem = ({callback}) => {
    clickInsideHandler = useClickOutside(callback);
    return <div/>;
};

describe('useClickOutside()', () => {
    it('Should add an event listener to the document', () => {
        const addEventListenerSpy = sinon.spy(document, 'addEventListener');
        const removeEventListenerSpy = sinon.spy(document, 'removeEventListener');

        let elem;
        act(() => {elem = mount(<Elem/>)});

        expect(addEventListenerSpy.callCount).toEqual(4); // 2 calls are done regardless, not sure why, but it only happens during testing
        expect(addEventListenerSpy.calledWith('mousedown')).toEqual(true);
        expect(addEventListenerSpy.calledWith('mouseup')).toEqual(true);

        act(() => {elem.unmount()});
        expect(removeEventListenerSpy.calledTwice).toEqual(true);
        expect(removeEventListenerSpy.calledWith('mousedown')).toEqual(true);
        expect(removeEventListenerSpy.calledWith('mouseup')).toEqual(true);

        addEventListenerSpy.restore();
        removeEventListenerSpy.restore();
    });

    it('Should not trigger the callback on click inside', () => {
        const callback = sinon.spy();
        const elem = mount(<Elem callback={callback}/>);

        expect(elem.find('div'));
        elem.simulate('click');
        expect(callback.callCount).toEqual(0);
    });

    it('Should trigger the "click outside" callback', () => {
        const callback = sinon.spy();
        const addEventListenerSpy = sinon.spy(document, 'addEventListener');
        const removeEventListenerSpy = sinon.spy(document, 'removeEventListener');

        mount(<Elem callback={callback}/>);

        const mousedownCall = document.addEventListener.getCall(-2);
        const mouseupCall = document.addEventListener.getCall(-1);

        // manually trigger the mousedown event callback with a fake event
        mousedownCall.args[1]({isMouseDown: true});
        mouseupCall.args[1]({isMouseUp: true});
        expect(callback.callCount).toEqual(1);
        expect(callback.calledWith({isMouseUp: true})).toEqual(true);

        addEventListenerSpy.restore();
        removeEventListenerSpy.restore();
    });

    it('Should not trigger the "click outside" callback when clicked inside', () => {
        const callback = sinon.spy();
        const addEventListenerSpy = sinon.spy(document, 'addEventListener');
        const removeEventListenerSpy = sinon.spy(document, 'removeEventListener');

        mount(<Elem callback={callback}/>);

        const mousedownCall = document.addEventListener.getCall(-2);
        const mouseupCall = document.addEventListener.getCall(-1);

        // 1 - simulate a mousedown event on the "outside"
        clickInsideHandler();
        // 2 - simulate the internal, global, "mousedown" event
        mousedownCall.args[1]({isMouseDown: true});
        // 3 - simulate the internal, global, "mouseup" event
        mouseupCall.args[1]({isMouseUp: true});

        expect(callback.callCount).toEqual(0);

        addEventListenerSpy.restore();
        removeEventListenerSpy.restore();
    });
});
