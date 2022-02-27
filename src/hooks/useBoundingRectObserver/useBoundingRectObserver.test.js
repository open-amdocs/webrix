import React from 'react';
import {act} from 'react-dom/test-utils';
import {mount} from 'enzyme';
import sinon from 'sinon';
import useBoundingRectObserver, {getBoundingRects} from './useBoundingRectObserver';

const Elem = ({onChange, refs}) => {
    const {start, stop} = useBoundingRectObserver(onChange, ...refs);
    return (
        <>
            <div className='start' onClick={start}/>
            <div className='stop' onClick={stop}/>
        </>
    );
};

describe('useBoundingRectObserver()', () => {
    it('Should call requestAnimationFrame', () => {
        global.window.requestAnimationFrame.resetHistory();
        let wrapper = null;
        const onChange = sinon.spy();
        act(() => {wrapper = mount(<Elem refs={[new DOMRect()]} onChange={onChange}/>)});

        // Verify that requestAnimationFrame() and onChange() are called, passing the DOMRect
        wrapper.find('.start').prop('onClick')();
        expect(global.window.requestAnimationFrame.callCount).toEqual(1);
        global.window.requestAnimationFrame.args[0][0]();
        expect(onChange.callCount).toEqual(1);
        expect(onChange.calledWith(new DOMRect())).toEqual(true);

        act(() => {wrapper.unmount()});
    });
    it('getBoundingRects()', async () => {
        expect(getBoundingRects([{}])).toEqual([undefined]);
        expect(getBoundingRects([{current: {getBoundingClientRect: () => 'mock'}}])).toEqual(['mock']);
        expect(getBoundingRects([document.createElement('div')])).toEqual([{width:  0, height: 0, top: 0, left: 0, bottom: 0, right: 0, x: 0, y: 0}]);
        expect(getBoundingRects([new DOMRect()])).toEqual([new DOMRect()]);
    });
});