import React from 'react';
import {mount} from 'enzyme';
import {expect} from 'chai';
import sinon from 'sinon';
import {noop} from 'utility/memory';
import HorizontalScrollbar from './HorizontalScrollbar';
import {onUpdate} from './HorizontalScrollbar.utils';

describe('<HorizontalScrollbar/>', () => {

    describe('HTML structure', () => {
        it('should render a Scrollbar', () => {
            const wrapper = mount(<HorizontalScrollbar/>);
            expect(wrapper.find('.scrollbar-thumb')).to.have.length(2);
            expect(wrapper.find('.scrollbar-thumb-inner')).to.have.length(1);
        });
    });

    describe('Events', () => {
        it('handleOnClick()', () => {
            const container = {current: {style: {}, scrollLeft: 0, scrollWidth: 200}};
            const s = new HorizontalScrollbar({container});
            s.thumb = {current: {contains: () => true}};
            s.handleOnClick({});
            expect(container.current.scrollLeft).to.eql(0);

            s.track = {current: {getBoundingClientRect: () => ({left: 0, width: 100})}};
            s.thumb.current.contains = () => false;
            s.handleOnClick({clientX: 100});
            expect(container.current.scrollLeft).to.eql(200);
        });
        it('handleOnBeginMove()', () => {
            const style = {};
            const s = new HorizontalScrollbar({container: {current: {scrollLeft: 50, style}}});
            s.handleOnBeginMove({stopPropagation: noop, preventDefault: noop});
            expect(s.initialScroll).to.eql(s.props.container.current.scrollLeft);
            expect(style.scrollBehavior).to.eql('auto');
        });
        it('handleOnMove()', () => {
            const s = new HorizontalScrollbar({});
            s.props.container = {current: {clientWidth: 100, scrollWidth: 400}};
            s.thumb = {current: {clientWidth: 40}};
            s.initialMousePos = 25;
            s.initialScroll = 20;
            s.handleOnMove({dx: 75});
            expect(s.props.container.current.scrollLeft).to.eql(395);
        });
        it('handleOnEndMove()', () => {
            const style = {};
            const s = new HorizontalScrollbar({container: {current: {style}}});
            s.handleOnEndMove();
            expect(style.scrollBehavior).to.eql('smooth');
        });
    });

    describe('Class Methods', () => {
        it('update()', () => {
            const s = new HorizontalScrollbar({});
            s.props.container = {current: {clientWidth: 10, scrollWidth: 20}};
            s.props.onUpdate = sinon.spy();
            s.track = {current: {classList: {add: sinon.spy()}, style: {}}};
            s.update();
            expect(s.track.current.classList.add.calledOnce).to.eql(true);
            expect(s.props.onUpdate.calledOnce).to.eql(true);
        });
    });

    describe('Utils', () => {
        it('onUpdate()', () => {
            const track = {style: {}, clientHeight: 5, clientWidth: 100};
            const thumb = {style: {}};
            const container = {scrollWidth: 200, scrollLeft: 50, clientWidth: 100};
            onUpdate(track, thumb, container);
            expect(thumb.style).to.eql({left: '25px', width: '50px'});
        });
    });
});
