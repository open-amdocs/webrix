import React from 'react';
import {mount} from 'enzyme';
import sinon from 'sinon';
import Scrollable from './Scrollable';
import {SCROLLING_CLASS_REMOVAL_DELAY} from './Scrollable.constants';

const waitFor = delay => new Promise(resolve => setTimeout(resolve, delay));

describe('<Scrollable/>', () => {

    describe('HTML structure', () => {
        it('should render a Scrollbar', () => {
            const wrapper = mount(<Scrollable/>);
            expect(wrapper.find('.scrollbar')).toHaveLength(1);
            expect(wrapper.find('ResizeObserver')).toHaveLength(1);
            expect(wrapper.find('VerticalScrollbar')).toHaveLength(1);
            expect(wrapper.find('HorizontalScrollbar')).toHaveLength(1);
        });
    });

    describe('Life Cycle', () => {
        it('componentDidMount()', () => {
            const s = new Scrollable();
            s.updateScrollbars = sinon.spy();
            s.componentDidMount();
            expect(s.updateScrollbars.calledOnce).toEqual(true);
        });

        it('getSnapshotBeforeUpdate()', () => {
            const s = new Scrollable();
            s.container = {current: {scrollTop: 0, scrollLeft: 0}};
            expect(s.getSnapshotBeforeUpdate()).toEqual(s.container.current);
        });

        it('componentDidUpdate()', () => {
            const s = new Scrollable({scrollOnDOMChange: false});
            s.container = {current: {scrollTop: 0}};
            s.updateScrollbars = sinon.spy();
            s.componentDidUpdate(null, null, {scrollTop: 50, scrollLeft: 50});
            expect(s.container.current.scrollTop).toEqual(50);
            expect(s.container.current.scrollLeft).toEqual(50);
            expect(s.updateScrollbars.callCount).toEqual(1);
        });
    });

    describe('Class Methods', () => {
        it('getEvent()', async () => {
            const container = {clientHeight: 100, clientWidth: 100, scrollHeight: 200, scrollWidth: 200, scrollTop: 50, scrollLeft: 50};
            const s = new Scrollable({});

            s.container = {current: container};
            expect(s.getEvent()).toEqual({top: 0.5, left: 0.5, ...s.container.current});

            s.container.current = {clientHeight: 100, clientWidth: 100, scrollHeight: 200, scrollWidth: 200, scrollTop: 100, scrollLeft: 100};
            expect(s.getEvent()).toEqual({top: 1, left: 1, ...s.container.current});

            s.container.current = {clientHeight: 100, clientWidth: 100, scrollHeight: 200, scrollWidth: 200, scrollTop: 99.5, scrollLeft: 99.5};
            expect(s.getEvent()).toEqual({top: 1, left: 1, ...s.container.current, scrollTop: 100, scrollLeft: 100});

            s.container.current = null;
            expect(s.getEvent()).toEqual({});
        });

        it('handleOnScroll()', async () => {
            const add = sinon.spy(), remove = sinon.spy(), onScroll = sinon.spy();
            const container = {parentElement: {classList: {add, remove}}, clientHeight: 100, clientWidth: 100, scrollHeight: 200, scrollWidth: 200, scrollTop: 50, scrollLeft: 50};
            const s = new Scrollable({onScroll});
            s.container = {current: container};
            s.updateScrollbars = sinon.spy();

            // Should not add class
            s.event.next = s.getEvent();
            s.handleOnScroll({});
            expect(s.updateScrollbars.callCount).toEqual(1);
            expect(add.callCount).toEqual(0);
            expect(remove.callCount).toEqual(0);
            expect(onScroll.callCount).toEqual(1);
            expect(onScroll.calledWith(s.event.next)).toEqual(true);

            // Should add and remove class
            s.handleOnScroll({target: container});
            expect(s.updateScrollbars.callCount).toEqual(2);
            expect(add.callCount).toEqual(1);
            expect(remove.callCount).toEqual(0);
            await waitFor(SCROLLING_CLASS_REMOVAL_DELAY);
            expect(remove.callCount).toEqual(1);
            expect(onScroll.callCount).toEqual(2);
        });

        it('updateScrollbars()', () => {
            const onUpdate = sinon.spy();
            const remove = sinon.spy();
            const setProperty = sinon.spy();
            const s = new Scrollable({onUpdate});
            s.updateScrollbars();
            expect(onUpdate.callCount).toEqual(0);
            expect(remove.callCount).toEqual(0);

            s.container.current = {parentElement: {style: {setProperty}, classList: {remove}}};
            s.updateScrollbars();
            expect(onUpdate.callCount).toEqual(1);
            expect(remove.callCount).toEqual(2);
            expect(setProperty.callCount).toEqual(4);
        });

        it('ResizeUpdate', () => {
            const s = new Scrollable({onScroll: sinon.spy(), onUpdate: sinon.spy()});
            const parentElement = {classList: {add: sinon.spy()}, style: {setProperty: sinon.spy()}};
            s.container = {current: {parentElement, clientHeight: 100, clientWidth: 100, scrollHeight: 200, scrollWidth: 200, scrollTop: 50, scrollLeft: 50}};

            s.updateScrollbars();
            expect(parentElement.classList.add.callCount).toEqual(2);
            expect(parentElement.style.setProperty.callCount).toEqual(4);
        });

        it('onTransitionEnd()', () => {
            const s = new Scrollable();
            s.updateScrollbars = sinon.spy();
            s.handleOnTransitionEnd({propertyName: 'foo'});
            expect(s.updateScrollbars.callCount).toEqual(0);
            s.handleOnTransitionEnd({propertyName: 'height'});
            expect(s.updateScrollbars.callCount).toEqual(1);
            s.handleOnTransitionEnd({propertyName: 'width'});
            expect(s.updateScrollbars.callCount).toEqual(2);
        });
    });
});
