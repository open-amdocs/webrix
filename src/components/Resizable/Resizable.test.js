import React, {useRef} from 'react';
import {act} from 'react-dom/test-utils';
import {mount} from 'enzyme';
import sinon from 'sinon';
import Movable from '../Movable/Movable';
import {NAMESPACE} from './Resizable';
import Resizable from './';

describe('<Resizable>', () => {
    describe('HTML structure', () => {
        it('should render Resizable with 8 Resizer components for 4 sides & 4 corners', () => {
            const wrapper = mount(
                <Resizable>
                    <Resizable.Resizer.All/>
                </Resizable>
            );

            expect(wrapper.find(Movable).filter(`.${NAMESPACE}`)).toHaveLength(8);
        });
    });
    describe('Methods', () => {
        const _addEventListener = document.addEventListener;
        const events = {};

        beforeAll(() => {
            document.addEventListener = (type, callback) => events[type] = callback;
        });

        afterAll(() => {
            document.addEventListener = _addEventListener;
        });

        it('onBeginResize onResize onEndResize', () => {
            const onBeginResize = sinon.spy();
            const onResize = sinon.spy();
            const onEndResize = sinon.spy();
            const wrapper = mount(
                <Resizable onBeginResize={onBeginResize} onResize={onResize} onEndResize={onEndResize}>
                    <Resizable.Resizer.All/>
                </Resizable>
            );

            wrapper.find(Movable).filter(`.${NAMESPACE}`).forEach(el => {
                onBeginResize.resetHistory();
                onResize.resetHistory();
                onEndResize.resetHistory();

                el.simulate('mousedown');
                events.mousemove({dx: 1, dy: 1});
                events.mouseup({dx: 1, dy: 1});

                expect(onBeginResize.calledOnce).toEqual(true);
                expect(onResize.calledOnce).toEqual(true);
                expect(onEndResize.calledOnce).toEqual(true);
            });
        });
    });

    describe('Hooks', () => {
        it('useResize()', () => {
            let wrapper;
            const onResize = sinon.spy();
            const {useResize} = Resizable;
            const {resize, lock, update} = Resizable.Operations;
            const r = (x, y, w, h) => ({left: x, top: y, width: w, height: h});
            const Elem = () => {
                const props = useResize([
                    resize(useRef({getBoundingClientRect: () => r(0, 0, 20, 20)})),
                    lock(),
                    update(onResize),
                ]);

                return <Resizable {...props}/>;
            };

            act(() => {
                wrapper = mount(<Elem/>)
            });
            wrapper.find(Resizable).prop('onBeginResize')();
            wrapper.find(Resizable).prop('onResize')({delta: r(0, 0, 0, 0)});
            expect(onResize.callCount).toEqual(1);
            expect(onResize.calledWith(r(0, 0, 20, 20))).toEqual(true);

            wrapper.find(Resizable).prop('onResize')({delta: r(10, 10, -10, -10)});
            expect(onResize.callCount).toEqual(2);
            expect(onResize.calledWith(r(10, 10, 10, 10))).toEqual(true);

            wrapper.find(Resizable).prop('onResize')({delta: r(0, 0, 10, 10)});
            expect(onResize.callCount).toEqual(3);
            expect(onResize.calledWith(r(0, 0, 30, 30))).toEqual(true);

            wrapper.find(Resizable).prop('onResize')({delta: r(30, 30, -30, -30)});
            expect(onResize.callCount).toEqual(4);
            expect(onResize.calledWith(r(20, 20, 0, 0))).toEqual(true);
        });
    });

    describe('Operations', () => {
        it('contain()', () => {
            const {contain} = Resizable.Operations;
            const shared = {};
            const r = (x, y, w, h) => ({left: x, top: y, width: w, height: h});

            // No Change
            shared.initial = r(10, 10, 10, 10);
            shared.next = shared.initial;
            shared.max = r(0, 0, 20, 20);
            contain({}).onResize({delta: r(0, 0, 0, 0)}, shared);
            expect(shared.next).toEqual(r(10, 10, 10, 10));
        });
        it('min()', () => {
            const {min} = Resizable.Operations;
            const shared = {};

            shared.next = {width: 30, height: 30};
            min(20, 20).onResize({}, shared);
            expect(shared.next).toEqual({width: 30, height: 30});

            shared.next = {width: 30, height: 30};
            min(40, 40).onResize({}, shared);
            expect(shared.next).toEqual({width: 40, height: 40});
        });
        it('max()', () => {
            const {max} = Resizable.Operations;
            const shared = {};

            shared.next = {width: 30, height: 30};
            max(40, 40).onResize({}, shared);
            expect(shared.next).toEqual({width: 30, height: 30});

            shared.next = {width: 30, height: 30};
            max(20, 20).onResize({}, shared);
            expect(shared.next).toEqual({width: 20, height: 20});
        });
        it('snap()', () => {
            const {snap} = Resizable.Operations;
            const shared = {};

            shared.next = {width: 30, height: 30};
            snap(20, 20).onResize({}, shared);
            expect(shared.next).toEqual({width: 40, height: 40});

            shared.next = {width: 30, height: 30};
            snap(10, 10).onResize({}, shared);
            expect(shared.next).toEqual({width: 30, height: 30});

            shared.next = {width: 30, height: 30};
            snap(20, 20, 0.3).onResize({}, shared);
            expect(shared.next).toEqual({width: 30, height: 30});

            shared.next = {width: 23, height: 23};
            snap(20, 20, 0.3).onResize({}, shared);
            expect(shared.next).toEqual({width: 20, height: 20});

            shared.next = {width: 24, height: 24};
            snap(20, 20, 0.3).onResize({}, shared);
            expect(shared.next).toEqual({width: 24, height: 24});
        });
        it('ratio()', () => {
            const {ratio} = Resizable.Operations;
            const shared = {};

            shared.next = {width: 30, height: 30};
            ratio(2).onResize({}, shared);
            expect(shared.next).toEqual({width: 60, height: 30});

            shared.next = {width: 90, height: 30};
            ratio(2).onResize({}, shared);
            expect(shared.next).toEqual({width: 90, height: 45});
        });
        it('relative()', () => {
            const {relative} = Resizable.Operations;
            const shared = {};

            shared.reference = {top: 10, left: 10};
            shared.next = {top: 10, left: 10};
            relative({current: {getBoundingClientRect: () => ({top: 10, left: 10})}}).onBeginResize({}, shared);
            expect(shared.next).toEqual({top: 0, left: 0});

            shared.reference = {top: 10, left: 10};
            shared.next = {top: 10, left: 10};
            relative({}).onResize({}, shared);
            expect(shared.next).toEqual({top: 0, left: 0});

            shared.reference = {top: 10, left: 10};
            shared.next = {top: 10.002547, left: 10.005236};
            relative({}).onResize({}, shared);
            expect(shared.next).toEqual({top: 0, left: 0});
        });
        it('upadate()', () => {
            const {update} = Resizable.Operations;
            const spy = sinon.spy();
            const shared = {next: 0, prev: 0};

            shared.next++;
            update(spy).onBeginResize({}, shared);
            expect(spy.callCount).toEqual(1);
            expect(spy.calledWith(shared.next)).toEqual(true);

            shared.next++;
            update(spy).onResize({}, shared);
            expect(spy.callCount).toEqual(2);
            expect(spy.calledWith(shared.next)).toEqual(true);

            // Should not call onUpdate when prev/next are the same
            update(spy).onResize({}, shared);
            expect(spy.callCount).toEqual(2);

            shared.next++;
            update(spy).onEndResize({}, shared);
            expect(spy.callCount).toEqual(3);
            expect(spy.calledWith(shared.next)).toEqual(true);
        });
    });
});
