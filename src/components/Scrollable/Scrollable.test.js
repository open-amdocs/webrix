import React from 'react';
import {mount} from 'enzyme';
import sinon from 'sinon';
import Scrollable from './Scrollable';
import {MIN_THUMB_LENGTH, SCROLLING_CLASS_REMOVAL_DELAY} from './Scrollable.constants';
import {getThumbLength, getThumbPosition} from './Scrollable.utils';

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
            const s = new Scrollable({onUpdate});
            s.vertical = {current: {update: sinon.spy()}};
            s.horizontal = {current: {update: sinon.spy()}};
            s.updateScrollbars();
            expect(s.vertical.current.update.callCount).toEqual(0);
            expect(s.horizontal.current.update.callCount).toEqual(0);
            expect(onUpdate.callCount).toEqual(0);

            s.container.current = {};
            s.updateScrollbars();
            expect(s.vertical.current.update.callCount).toEqual(1);
            expect(s.horizontal.current.update.callCount).toEqual(1);
            expect(onUpdate.callCount).toEqual(1);
        });

        it('ResizeUpdate', () => {
            const s = new Scrollable({onScroll: sinon.spy(), onUpdate: sinon.spy()});
            s.container = {current: {clientHeight: 100, clientWidth: 100, scrollHeight: 200, scrollWidth: 200, scrollTop: 50, scrollLeft: 50}};
            s.vertical = {current: {update: sinon.spy()}};
            s.horizontal = {current: {update: sinon.spy()}};

            s.updateScrollbars();
            expect(s.vertical.current.update.callCount).toEqual(1);
            expect(s.horizontal.current.update.callCount).toEqual(1);

            s.container = {current: {clientHeight: 100, clientWidth: 100, scrollHeight: 500, scrollWidth: 200, scrollTop: 50, scrollLeft: 50}};
            expect(s.vertical.current.update.callCount).toEqual(1);
            expect(s.horizontal.current.update.callCount).toEqual(1);

            s.container = {current: {clientHeight: 100, clientWidth: 100, scrollHeight: 500, scrollWidth: 500, scrollTop: 50, scrollLeft: 50}};
            expect(s.vertical.current.update.callCount).toEqual(1);
            expect(s.horizontal.current.update.callCount).toEqual(1);
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

    describe('Utils', () => {
        it('getThumbLength()', () => {
            expect(getThumbLength(100, 100, 100)).toEqual(100);
            expect(getThumbLength(100, 100, 200)).toEqual(50);
            expect(getThumbLength(100, 100, 300)).toEqual(33);
            expect(getThumbLength(200, 100, 300)).toEqual(67);
            expect(getThumbLength(100, 100, 20000)).toEqual(MIN_THUMB_LENGTH);
        });
        it('getThumbPosition()', () => {
            expect(getThumbPosition(100, 100, 200, 0)).toEqual(0);
            expect(getThumbPosition(100, 100, 200, 100)).toEqual(50);
            expect(getThumbPosition(200, 100, 200, 100)).toEqual(100);
        });
    });
});
