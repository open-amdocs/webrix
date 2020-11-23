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
});
