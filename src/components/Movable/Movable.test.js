import React from 'react';
import {shallow, mount} from 'enzyme';
import {expect} from 'chai';
import sinon from 'sinon';
import Movable from './';

describe('<Movable/>', () => {

    describe('HTML structure', () => {
        it('should render a Movable', () => {
            const wrapper = shallow(<Movable className='mock'/>);
            expect(wrapper.find('.mock')).to.have.length(1);
        });
    });

    describe('Events', () => {
        it('onBeginMove()', () => {
            const handleOnBeginMove = sinon.spy();
            const stopPropagation = sinon.spy();
            const preventDefault = sinon.spy();
            const wrapper = mount(<Movable onBeginMove={handleOnBeginMove}/>);

            document.addEventListener = sinon.spy();
            wrapper.simulate('mousedown', {stopPropagation, preventDefault});
            expect(handleOnBeginMove.calledOnce).to.eql(true);
            expect(document.addEventListener.callCount).to.eql(2);

            const event = handleOnBeginMove.args[0][0];
            event.stopPropagation();
            event.preventDefault();
            expect(stopPropagation.calledOnce).to.eql(true);
            expect(preventDefault.calledOnce).to.eql(true);
        });
        it('onMove()', () => {
            const handleOnMove = sinon.spy();
            const wrapper = mount(<Movable onMove={handleOnMove}/>);
            const handlers = {};
            let event;

            document.addEventListener = (type, handler) => handlers[type] = handler;
            wrapper.simulate('mousedown', {clientX: 10, clientY: 10});
            wrapper.simulate('touchstart', {changedTouches: [{clientX: 10, clientY: 10}]});

            // Move the cursor by 10 pixels in both x/y
            handlers.mousemove({clientX: 20, clientY: 20});
            handlers.touchmove({changedTouches: [{clientX: 20, clientY: 20}]});
            event = handleOnMove.args[0][0];
            expect(handleOnMove.callCount).to.eql(2);
            expect(event.x).to.eql(20);
            expect(event.y).to.eql(20);
            expect(event.cx).to.eql(10);
            expect(event.cy).to.eql(10);
            expect(event.dx).to.eql(10);
            expect(event.dy).to.eql(10);

            // Move the cursor by another 10 pixels in both x/y
            handlers.mousemove({clientX: 30, clientY: 30});
            handlers.touchmove({changedTouches: [{clientX: 30, clientY: 30}]});
            event = handleOnMove.args[2][0];
            expect(handleOnMove.callCount).to.eql(4);
            expect(event.x).to.eql(30);
            expect(event.y).to.eql(30);
            expect(event.cx).to.eql(10);
            expect(event.cy).to.eql(10);
            expect(event.dx).to.eql(20);
            expect(event.dy).to.eql(20);

            // Move the cursor by -30 pixels in both x/y
            handlers.mousemove({clientX: 0, clientY: 0});
            handlers.touchmove({changedTouches: [{clientX: 0, clientY: 0}]});
            event = handleOnMove.args[4][0];
            expect(handleOnMove.callCount).to.eql(6);
            expect(event.x).to.eql(0);
            expect(event.y).to.eql(0);
            expect(event.cx).to.eql(-30);
            expect(event.cy).to.eql(-30);
            expect(event.dx).to.eql(-10);
            expect(event.dy).to.eql(-10);
        });
        it('onEndMove()', () => {
            const handleOnEndMove = sinon.spy();
            const wrapper = mount(<Movable onEndMove={handleOnEndMove}/>);
            const handlers = {};

            document.addEventListener = (type, handler) => handlers[type] = handler;
            document.removeEventListener = sinon.spy();

            wrapper.simulate('mousedown', {clientX: 10, clientY: 10});
            handlers.mouseup({clientX: 20, clientY: 20});

            expect(document.removeEventListener.callCount).to.eql(2);
            expect(handleOnEndMove.callCount).to.eql(1);
            const event = handleOnEndMove.args[0][0];
            expect(event.x).to.eql(20);
            expect(event.y).to.eql(20);
            expect(event.cx).to.eql(10);
            expect(event.cy).to.eql(10);
            expect(event.dx).to.eql(10);
            expect(event.dy).to.eql(10);
        });
    });

    // describe('Utils', () => {
    //     it('Movable.inscribe', () => {
    //         const r = (x, y, w, h) => ({left: x, top: y, width: w, height: h});
    //         expect(Movable.inscribe(r(0, 0, 10, 10), r(0, 0, 20, 20))).to.eql(r(0, 0, 10, 10));
    //         expect(Movable.inscribe(r(20, 20, 10, 10), r(0, 0, 20, 20))).to.eql(r(10, 10, 10, 10));
    //         expect(Movable.inscribe(r(-20, -20, 10, 10), r(0, 0, 20, 20))).to.eql(r(0, 0, 10, 10));
    //         expect(Movable.inscribe(r(0, 0, 20, 20), r(0, 0, 20, 20))).to.eql(r(0, 0, 20, 20));
    //     });
    // });
});
