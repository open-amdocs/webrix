import React from 'react';
import {mount} from 'enzyme';
import sinon from 'sinon';
import {expect} from 'chai';
import Resizable from './';

describe('<Resizable>', () => {
    describe('HTML structure', () => {
        it('should render Resizable', () => {
            const wrapper = mount(
                <Resizable>
                    <Resizable.Resizer.All/>
                </Resizable>
            );
            expect(wrapper.find('Movable.resizable')).to.have.length(8);
        });
    });
    describe('Methods', () => {
        let addEventListener;
        const events = {};

        before(() => {
            addEventListener = document.addEventListener;
            document.addEventListener = (type, callback) => events[type] = callback;
        });

        after(() => {
            document.addEventListener = addEventListener;
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

            wrapper.find('Movable.resizable').forEach(el => {
                onBeginResize.resetHistory();
                onResize.resetHistory();
                onEndResize.resetHistory();

                el.simulate('mousedown');
                events.mousemove({dx: 1, dy: 1});
                events.mouseup({dx: 1, dy: 1});

                expect(onBeginResize.calledOnce).to.eql(true);
                expect(onResize.calledOnce).to.eql(true);
                expect(onEndResize.calledOnce).to.eql(true);
            });
        });
    });
    describe('Utils', () => {
        it('Resizable.inscribe', () => {
            const r = (x, y, w, h) => ({left: x, top: y, width: w, height: h});

            // No change
            expect(Resizable.inscribe(r(10, 10, 10, 10), r(0, 0, 0, 0), r(0, 0, 20, 20))).to.eql(r(10, 10, 10, 10))

            // Left resize
            expect(Resizable.inscribe(r(10, 10, 10, 10), r(10, 0, -10, 0), r(0, 0, 20, 20))).to.eql(r(20, 10, 0, 10))
            expect(Resizable.inscribe(r(10, 10, 10, 10), r(20, 0, -20, 0), r(0, 0, 20, 20))).to.eql(r(20, 10, 0, 10))
            expect(Resizable.inscribe(r(10, 10, 10, 10), r(-20, 0, 20, 0), r(0, 0, 20, 20))).to.eql(r(0, 10, 20, 10))

            // Right resize
            expect(Resizable.inscribe(r(10, 10, 10, 10), r(0, 0, -10, 0), r(0, 0, 20, 20))).to.eql(r(10, 10, 0, 10))
            expect(Resizable.inscribe(r(10, 10, 10, 10), r(0, 0, -20, 0), r(0, 0, 20, 20))).to.eql(r(10, 10, 0, 10))
            expect(Resizable.inscribe(r(10, 10, 10, 10), r(0, 0, 20, 0), r(0, 0, 20, 20))).to.eql(r(10, 10, 10, 10))

            // Top resize
            expect(Resizable.inscribe(r(10, 10, 10, 10), r(0, 10, 10, -10), r(0, 0, 20, 20))).to.eql(r(10, 20, 10, 0))
            expect(Resizable.inscribe(r(10, 10, 10, 10), r(0, 20, 0, -20), r(0, 0, 20, 20))).to.eql(r(10, 20, 10, 0))
            expect(Resizable.inscribe(r(10, 10, 10, 10), r(0, -20, 0, 20), r(0, 0, 20, 20))).to.eql(r(10, 0, 10, 20))

            // Bottom resize
            expect(Resizable.inscribe(r(10, 10, 10, 10), r(0, 0, 0, -10), r(0, 0, 20, 20))).to.eql(r(10, 10, 10, 0))
            expect(Resizable.inscribe(r(10, 10, 10, 10), r(0, 0, 0, -20), r(0, 0, 20, 20))).to.eql(r(10, 10, 10, 0))
            expect(Resizable.inscribe(r(10, 10, 10, 10), r(0, 0, 0, 20), r(0, 0, 20, 20))).to.eql(r(10, 10, 10, 10))
        });
    });
});
