import React from 'react';
import {act} from 'react-dom/test-utils';
import {expect} from 'chai';
import {mount} from 'enzyme';
import sinon from 'sinon';
import useBoundingRectObserver, {getBoundingRects} from './useBoundingRectObserver';

const Elem = ({onChange, refs}) => {
    const {start, stop} = useBoundingRectObserver(onChange, ...refs);
    return <div start={start} stop={stop}/>;
};

describe('useBoundingRectObserver()', () => {
    it('Should call requestAnimationFrame', () => {
        global.window.requestAnimationFrame.resetHistory();
        let wrapper = null;
        const onChange = sinon.spy();
        act(() => {wrapper = mount(<Elem refs={[new DOMRect()]} onChange={onChange}/>)});

        // Verify that requestAnimationFrame() and onChange() are called, passing the DOMRect
        wrapper.find('div').prop('start')();
        expect(global.window.requestAnimationFrame.callCount).to.eql(1);
        global.window.requestAnimationFrame.args[0][0]();
        expect(onChange.callCount).to.eql(1);
        expect(onChange.calledWith(new DOMRect())).to.eql(true);

        act(() => {wrapper.unmount()});
    });
    it('getBoundingRects()', async () => {
        expect(getBoundingRects([{}])).to.eql([undefined]);
        expect(getBoundingRects([{current: {getBoundingClientRect: () => 'mock'}}])).to.eql(['mock']);
        expect(getBoundingRects([document.createElement('div')])).to.eql([{width:  0, height: 0, top: 0, left: 0, bottom: 0, right: 0}]);
        expect(getBoundingRects([new DOMRect()])).to.eql([new DOMRect()]);
    });
});