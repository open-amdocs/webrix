import React from 'react';
import {mount} from 'enzyme';
import {expect} from 'chai';
import sinon from 'sinon';
import Scrollable from './Scrollable';
import {MIN_THUMB_LENGTH, SCROLLING_CLASS_REMOVAL_DELAY} from './Scrollable.constants';
import {getThumbLength, getThumbPosition} from './Scrollable.utils';

const waitFor = delay => new Promise(resolve => setTimeout(resolve, delay));

describe('<Scrollable/>', () => {

    describe('HTML structure', () => {
        it('should render a Scrollbar', () => {
            const wrapper = mount(<Scrollable/>);
            expect(wrapper.find('.scrollbar')).to.have.length(1);
            expect(wrapper.find('ResizeObserver')).to.have.length(1);
            expect(wrapper.find('VerticalScrollbar')).to.have.length(1);
            expect(wrapper.find('HorizontalScrollbar')).to.have.length(1);
        });
    });

    describe('Life Cycle', () => {
        it('componentDidMount()', () => {
            const s = new Scrollable();
            s.updateScrollbars = sinon.spy();
            s.componentDidMount();
            expect(s.updateScrollbars.calledOnce).to.eql(true);
        });
    });

    describe('Class Methods', () => {
        it('handleOnScroll()', async () => {
            const add = sinon.spy(), remove = sinon.spy();
            const container = {parentElement: {classList: {add, remove}}};
            const s = new Scrollable({onScroll: sinon.spy()});
            s.container = {current: container};
            s.updateScrollbars = sinon.spy();

            // Should not add class
            s.handleOnScroll({});
            expect(s.updateScrollbars.callCount).to.eql(1);
            expect(add.callCount).to.eql(0);
            expect(remove.callCount).to.eql(0);

            // Should add and remove class
            s.handleOnScroll({target: container});
            expect(s.updateScrollbars.callCount).to.eql(2);
            expect(add.callCount).to.eql(1);
            expect(remove.callCount).to.eql(0);
            await waitFor(SCROLLING_CLASS_REMOVAL_DELAY);
            expect(remove.callCount).to.eql(1);
        });
        it('updateScrollbars()', () => {
            const s = new Scrollable({onScroll: sinon.spy()});
            s.container = {current: {clientHeight: 100, clientWidth: 100, scrollHeight: 200, scrollWidth: 200, scrollTop: 50, scrollLeft: 50}};
            s.vertical = {current: {update: sinon.spy()}};
            s.horizontal = {current: {update: sinon.spy()}};
            s.updateScrollbars();
            expect(s.vertical.current.update.calledOnce).to.eql(true);
            expect(s.horizontal.current.update.calledOnce).to.eql(true);
            expect(s.props.onScroll.calledOnce).to.eql(true);
            expect(s.props.onScroll.calledWith({clientHeight: 100, clientWidth: 100, scrollTop: 50, scrollLeft: 50, scrollHeight: 200, scrollWidth: 200, top: 0.5, left: 0.5})).to.eql(true);
        });

        it('componentDidUpdate()', () => {
            const s = new Scrollable({scrollOnDOMChange: false});
            s.container = {current: {scrollTop: 0}};
            s.componentDidUpdate(null, null, {scrollTop: 50, scrollLeft: 50});
            expect(s.container.current.scrollTop).to.eql(50);
            expect(s.container.current.scrollLeft).to.eql(50);

            // Should call updateScrollbars()
            s.container = {current: {scrollHeight: 50}};
            s.updateScrollbars = sinon.spy();
            s.componentDidUpdate(null, null, {scrollHeight: 50});
            expect(s.updateScrollbars.callCount).to.eql(0);
            s.componentDidUpdate(null, null, {scrollHeight: 100});
            expect(s.updateScrollbars.callCount).to.eql(1);
        });

        it('ResizeUpdate', () => {
            const s = new Scrollable({onScroll: sinon.spy()});
            s.container = {current: {clientHeight: 100, clientWidth: 100, scrollHeight: 200, scrollWidth: 200, scrollTop: 50, scrollLeft: 50}};
            s.vertical = {current: {update: sinon.spy()}};
            s.horizontal = {current: {update: sinon.spy()}};

            s.updateScrollbars();
            expect(s.vertical.current.update.callCount).to.eql(1);
            expect(s.horizontal.current.update.callCount).to.eql(1);
            expect(s.props.onScroll.callCount).to.eql(1);

            s.container = {current: {clientHeight: 100, clientWidth: 100, scrollHeight: 500, scrollWidth: 200, scrollTop: 50, scrollLeft: 50}};
            expect(s.vertical.current.update.callCount).to.eql(1);
            expect(s.horizontal.current.update.callCount).to.eql(1);
            expect(s.props.onScroll.callCount).to.eql(1);

            s.container = {current: {clientHeight: 100, clientWidth: 100, scrollHeight: 500, scrollWidth: 500, scrollTop: 50, scrollLeft: 50}};
            expect(s.vertical.current.update.callCount).to.eql(1);
            expect(s.horizontal.current.update.callCount).to.eql(1);
            expect(s.props.onScroll.callCount).to.eql(1);
        });
    });

    describe('Utils', () => {
        it('getThumbLength()', () => {
            expect(getThumbLength(100, 100, 100)).to.eql(100);
            expect(getThumbLength(100, 100, 200)).to.eql(50);
            expect(getThumbLength(100, 100, 300)).to.eql(33);
            expect(getThumbLength(200, 100, 300)).to.eql(67);
            expect(getThumbLength(100, 100, 20000)).to.eql(MIN_THUMB_LENGTH);
        });
        it('getThumbPosition()', () => {
            expect(getThumbPosition(100, 100, 200, 0)).to.eql(0);
            expect(getThumbPosition(100, 100, 200, 100)).to.eql(50);
            expect(getThumbPosition(200, 100, 200, 100)).to.eql(100);
        });
    });
});
