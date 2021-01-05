import React from 'react';
import {mount} from 'enzyme';
import {expect} from 'chai';
import sinon from 'sinon';
import Scrollable from './Scrollable';
import {getThumbSize, getThumbPosition} from './Scrollable.utils';

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
        it('getThumbSize()', () => {
            expect(getThumbSize(10, 10)).to.eql(10);
            expect(getThumbSize(10, 20)).to.eql(6);
            expect(getThumbSize(10, 20000)).to.eql(2);
        });
        it('getThumbPosition()', () => {
            expect(getThumbPosition(10, 10, 0)).to.eql(0);
            expect(getThumbPosition(10, 20, 10)).to.eql(4);
        });
    });
});
