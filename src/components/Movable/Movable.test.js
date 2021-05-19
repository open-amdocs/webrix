import React, {useRef} from 'react';
import {act} from 'react-dom/test-utils';
import {shallow, mount} from 'enzyme';
import {expect} from 'chai';
import sinon from 'sinon';
import * as number from 'utility/number';
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

    describe('Hooks', () => {
        describe('useMove()', () => {
            it('move()', () => {
                let wrapper;
                const onMove = sinon.spy();
                const {useMove} = Movable;
                const {move, update} = Movable.Operations;
                const Elem = () => {
                    const props = useMove([
                        move(useRef({getBoundingClientRect: () => ({top: 0, left: 0})})),
                        update(onMove),
                    ]);
                    return <Movable {...props} ref={undefined}/>;
                };

                act(() => {wrapper = mount(<Elem/>)});
                wrapper.find('Movable').prop('onBeginMove')();
                wrapper.find('Movable').prop('onMove')({dx: 10, dy: 10});
                expect(onMove.callCount).to.eql(2);
                expect(onMove.calledWith({top: 10, left: 10})).to.eql(true);

                act(() => {wrapper.unmount()});
            });

            it('trackpad()', () => {
                let wrapper;
                const onMove = sinon.spy();
                const {useMove} = Movable;
                const {trackpad, update} = Movable.Operations;
                const Elem = () => {
                    const props = useMove([
                        trackpad(useRef({getBoundingClientRect: () => ({top: 0, left: 0, width: 20, height: 20})})),
                        update(onMove),
                    ]);
                    return <Movable {...props} ref={undefined}/>;
                };

                act(() => {wrapper = mount(<Elem/>)});
                wrapper.find('Movable').prop('onBeginMove')({x: 10, y: 10});
                expect(onMove.callCount).to.eql(1);
                expect(onMove.calledWith({top: 10, left: 10})).to.eql(true);

                wrapper.find('Movable').prop('onMove')({x: 10.5, y: 10.5});
                expect(onMove.callCount).to.eql(2);
                expect(onMove.calledWith({top: 10, left: 10})).to.eql(true);

                wrapper.find('Movable').prop('onMove')({x: 30, y: 30});
                expect(onMove.callCount).to.eql(3);
                expect(onMove.calledWith({top: 20, left: 20})).to.eql(true);

                act(() => {wrapper.unmount()});
            });
        });
    });

    describe('Operations', () => {
        it('contain()', () => {
            const {contain} = Movable.Operations;
            const shared = {};
            const ref = {current: {getBoundingClientRect: () => ({width: 0, height: 0})}};

            contain(ref, ref).onBeginMove({}, shared);
            expect(shared.bounds).to.eql({width: 0, height: 0});
            expect(shared.size).to.eql({width: 0, height: 0});

            shared.next = {top: 0, left: 0};
            shared.size = {width: 20, height: 20};
            shared.bounds = {top: 0, left: 0, bottom: 40, right: 40};
            contain({}, {}).onMove({}, shared);
            expect(shared.next).to.eql({top: 0, left: 0});

            shared.next = {top: 30, left: 30};
            shared.size = {width: 20, height: 20};
            shared.bounds = {top: 0, left: 0, bottom: 40, right: 40};
            contain({}, {}).onMove({}, shared);
            expect(shared.next).to.eql({top: 20, left: 20});

            shared.next = {top: -10, left: -10};
            shared.size = {width: 20, height: 20};
            shared.bounds = {top: 0, left: 0, bottom: 40, right: 40};
            contain({}, {}).onMove({}, shared);
            expect(shared.next).to.eql({top: 0, left: 0});
        });

        it('snap()', () => {
            const {snap} = Movable.Operations;
            const shared = {};

            shared.next = {top: 0, left: 0};
            snap(20, 20).onMove({}, shared);
            expect(shared.next).to.eql({top: 0, left: 0});

            shared.next = {top: 10, left: 10};
            snap(20, 20).onMove({}, shared);
            expect(shared.next).to.eql({top: 20, left: 20});

            shared.next = {top: 10, left: 10};
            snap(20, 20, 0.3).onMove({}, shared);
            expect(shared.next).to.eql({top: 10, left: 10});

            shared.next = {top: 4, left: 4};
            snap(20, 20, 0.3).onMove({}, shared);
            expect(shared.next).to.eql({top: 4, left: 4});

            shared.next = {top: 3, left: 3};
            snap(20, 20, 0.3).onMove({}, shared);
            expect(shared.next).to.eql({top: 0, left: 0});
        });

        it('upadate()', () => {
            const {update} = Movable.Operations;
            const spy = sinon.spy();
            const shared = {next: 0, prev: 0};

            shared.next++;
            update(spy).onBeginMove({}, shared);
            expect(spy.callCount).to.eql(1);
            expect(spy.calledWith(shared.next)).to.eql(true);

            shared.next++;
            update(spy).onMove({}, shared);
            expect(spy.callCount).to.eql(2);
            expect(spy.calledWith(shared.next)).to.eql(true);

            // Should not call onUpdate when prev/next are the same
            update(spy).onMove({}, shared);
            expect(spy.callCount).to.eql(2);

            shared.next++;
            update(spy).onEndMove({}, shared);
            expect(spy.callCount).to.eql(3);
            expect(spy.calledWith(shared.next)).to.eql(true);
        });

        it('relative()', () => {
            const {relative} = Movable.Operations;
            const shared = {next: {top: 10, left: 10}};
            const ref = {current: {getBoundingClientRect: () => ({top: 10, left: 10})}};

            relative(ref).onBeginMove({}, shared);
            expect(shared.next).to.eql({top: 0, left: 0});

            shared.next = {top: 20, left: 20};
            relative(ref).onMove({}, shared);
            expect(shared.next).to.eql({top: 10, left: 10});
        });

        it('transform()', () => {
            const {transform} = Movable.Operations;
            const shared = {next: 10};

            transform(v => v + 10).onMove({}, shared);
            expect(shared.next).to.eql(20);

            shared.next = 10;
            transform(v => v + 10, v => v / 2).onMove({}, shared);
            expect(shared.next).to.eql(10);
        });
    });

    describe('Transformers', () => {
        it('map()', () => {
            const args = [0, 10, 0, 20];
            expect(Movable.Transformers.map(...args)(5)).to.eql(number.map(5, ...args));
        });
        it('clamp()', () => {
            const args = [0, 10];
            expect(Movable.Transformers.clamp(...args)(5)).to.eql(number.clamp(5, ...args));
        });
        it('interval()', () => {
            const args = [4];
            expect(Movable.Transformers.interval(...args)(5)).to.eql(number.interval(5, ...args));
        });
        it('decimals()', () => {
            const args = [2];
            expect(Movable.Transformers.decimals(...args)(4.1234)).to.eql(number.decimals(4.1234, ...args));
        });
        it('angle()', () => {
            expect(Movable.Transformers.angle({center: {x: 50, y: 50}, angle: {from: 0, range: 360}, output: {min: 0, max: 360}})({top: 0, left: 50})).to.eql(0);
            expect(Movable.Transformers.angle({center: {x: 50, y: 50}, angle: {from: 0, range: 360}, output: {min: 0, max: 360}})({top: 50, left: 0})).to.eql(270);
            expect(Movable.Transformers.angle({center: {x: 50, y: 50}, angle: {from: 0, range: 360}, output: {min: 0, max: 360}})({top: 50, left: 100})).to.eql(90);
            expect(Movable.Transformers.angle({center: {x: 50, y: 50}, angle: {from: 0, range: 360}, output: {min: 0, max: 360}})({top: 100, left: 50})).to.eql(180);
            expect(Movable.Transformers.angle({center: {x: 50, y: 50}, angle: {from: 180, range: 360}, output: {min: 0, max: 360}})({top: 100, left: 50})).to.eql(0);

            // Test when the angle is outside the range
            expect(Movable.Transformers.angle({center: {x: 50, y: 50}, angle: {from: 270, range: 180}, output: {min: 0, max: 180}})({top: 100, left: 0})).to.eql(0);
            expect(Movable.Transformers.angle({center: {x: 50, y: 50}, angle: {from: 270, range: 180}, output: {min: 0, max: 180}})({top: 100, left: 100})).to.eql(180);
        });
    });
});
