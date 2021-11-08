import React from 'react';
import {mount} from 'enzyme';
import sinon from 'sinon';
import {noop} from 'utility/memory';
import Scrollable from './';
import {normalizeScrollPosition} from './Scrollable.utils';
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

        it('should render a Scrollbar with custom vertical & horizontal scrollbars', () => {
            const wrapper = mount(<Scrollable>
                <Scrollable.VerticalScrollbar><div className='vsb-child'></div></Scrollable.VerticalScrollbar>
                <Scrollable.HorizontalScrollbar><div className='hsb-child'></div></Scrollable.HorizontalScrollbar>
            </Scrollable>);
            expect(wrapper.find('.scrollbar')).toHaveLength(1);
            expect(wrapper.find('ResizeObserver')).toHaveLength(1);
            expect(wrapper.find('.vsb-child')).toHaveLength(1);
            expect(wrapper.find('.hsb-child')).toHaveLength(1);
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

        describe('componentDidUpdate', () => {
            it('scrollOnDOMChange prop "true"', () => {
                const s = new Scrollable({scrollOnDOMChange: true});
                s.container = {current: {scrollTop: 0, scrollLeft: 0}};
                s.updateScrollbars = sinon.spy();
                s.componentDidUpdate(null, null, {scrollTop: 50, scrollLeft: 50});
                expect(s.container.current.scrollTop).toEqual(0);
                expect(s.container.current.scrollLeft).toEqual(0);
                expect(s.updateScrollbars.callCount).toEqual(1);
            });

            it('scrollOnDOMChange prop "false"', () => {
                const s = new Scrollable({scrollOnDOMChange: false});
                s.container = {current: {scrollTop: 0}};
                s.updateScrollbars = sinon.spy();
                s.componentDidUpdate(null, null, {scrollTop: 50, scrollLeft: 50});
                expect(s.container.current.scrollTop).toEqual(50);
                expect(s.container.current.scrollLeft).toEqual(50);
                expect(s.updateScrollbars.callCount).toEqual(1);
            });
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
            global.window.requestAnimationFrame.resetHistory();
            const onUpdate = sinon.spy();
            const toggle = sinon.spy();
            const setProperty = sinon.spy();

            const s = new Scrollable({onUpdate});
            s.updateScrollbars();
            expect(onUpdate.callCount).toEqual(0);
            expect(toggle.callCount).toEqual(0);

            s.container.current = {parentElement: {style: {setProperty}, classList: {toggle}}};
            s.updateScrollbars();
            expect(onUpdate.callCount).toEqual(1);
            expect(global.window.requestAnimationFrame.callCount).toEqual(1);
            global.window.requestAnimationFrame.args[0][0]();
            expect(toggle.callCount).toEqual(2);
            expect(setProperty.callCount).toEqual(4);
        });

        // makes sure the change was detected the the re-calc in requestAnimationFrame is fired
        it('ResizeUpdate', () => {
            global.window.requestAnimationFrame.resetHistory();
            const s = new Scrollable({onScroll: sinon.spy(), onUpdate: sinon.spy()});
            const parentElement = {classList: {toggle: sinon.spy()}, style: {setProperty: sinon.spy()}};
            s.container = {current: {parentElement, clientHeight: 100, clientWidth: 100, scrollHeight: 200, scrollWidth: 200, scrollTop: 50, scrollLeft: 50}};

            s.updateScrollbars();
            expect(global.window.requestAnimationFrame.callCount).toEqual(1);
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
        it('normalizeScrollPosition()', () => {
            expect(normalizeScrollPosition(100, 100, 0)).toEqual(0);
            expect(normalizeScrollPosition(101, 100, 0.5)).toEqual(0.5);
            expect(normalizeScrollPosition(200, 100, 0)).toEqual(0);
            expect(normalizeScrollPosition(200, 100, 50)).toEqual(0.5);
            expect(normalizeScrollPosition(200, 100, 33)).toEqual(0.33);
            expect(normalizeScrollPosition(2000, 1000, 333)).toEqual(0.333);
        });
    });

    describe('Props', () => {
        describe('cssVarsOnTracks', () => {
            it('updateScrollbars()', () => {
                global.window.requestAnimationFrame.resetHistory();
                const toggle = sinon.spy();
                const containerSetProperty = sinon.spy();
                const hTrackSetProperty = sinon.spy();
                const vTrackSetProperty = sinon.spy();

                const s = new Scrollable({onUpdate: noop, cssVarsOnTracks:true});
                s.container.current = {parentElement: {style: {setProperty: containerSetProperty}, classList: {toggle}}};
                s.hTrack.current = {style: {setProperty: hTrackSetProperty}};
                s.vTrack.current = {style: {setProperty: vTrackSetProperty}};
                s.event = {next: {top:5, left:10}, prev: {top:0, left:0}};

                s.updateScrollbars();
                expect(global.window.requestAnimationFrame.callCount).toEqual(1);
                global.window.requestAnimationFrame.args[0][0]();
                expect(toggle.callCount).toEqual(2);
                expect(containerSetProperty.callCount).toEqual(2);
                expect(hTrackSetProperty.callCount).toEqual(1);
                expect(vTrackSetProperty.callCount).toEqual(1);

                expect(hTrackSetProperty.calledWith('--scrollable-scroll-left', s.event.next.left)).toEqual(true);
                expect(vTrackSetProperty.calledWith('--scrollable-scroll-top', s.event.next.top)).toEqual(true);
            });
        });
    });
});
