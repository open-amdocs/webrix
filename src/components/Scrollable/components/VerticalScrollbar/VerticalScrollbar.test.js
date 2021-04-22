import React from 'react';
import {mount} from 'enzyme';
import {expect} from 'chai';
import sinon from 'sinon';
import {noop} from 'utility/memory';
import VerticalScrollbar from './VerticalScrollbar.jsx';
import {onUpdate} from './VerticalScrollbar.utils';

describe('<VerticalScrollbar/>', () => {

    describe('HTML structure', () => {
        it('should render a Scrollbar', () => {
            const wrapper = mount(<VerticalScrollbar/>);
            expect(wrapper.find('.scrollbar-thumb')).to.have.length(2);
            expect(wrapper.find('.scrollbar-thumb-inner')).to.have.length(1);
        });
    });

    describe('Events', () => {
        it('handleOnClick()', () => {
            const container = {current: {style: {}, scrollTop: 0, scrollHeight: 200}};
            const s = new VerticalScrollbar({container});
            s.thumb = {current: {contains: () => true}};
            s.handleOnClick({});
            expect(container.current.scrollTop).to.eql(0);

            s.track = {current: {getBoundingClientRect: () => ({top: 0, height: 100})}};
            s.thumb.current.contains = () => false;
            s.handleOnClick({clientY: 100});
            expect(container.current.scrollTop).to.eql(200);
        });
        it('handleOnBeginMove()', () => {
            const style = {};
            const s = new VerticalScrollbar({container: {current: {scrollTop: 50, style}}});
            s.handleOnBeginMove({stopPropagation: noop, preventDefault: noop});
            expect(s.initialScroll).to.eql(s.props.container.current.scrollTop);
            expect(style.scrollBehavior).to.eql('auto');
        });
        it('handleOnMove()', () => {
            const s = new VerticalScrollbar({});
            s.props.container = {current: {clientHeight: 100, scrollHeight: 400}};
            s.thumb = {current: {clientHeight: 40}};
            s.initialMousePos = 25;
            s.initialScroll = 20;
            s.handleOnMove({dy: 75});
            expect(s.props.container.current.scrollTop).to.eql(395);
        });
        it('handleOnEndMove()', () => {
            const style = {};
            const s = new VerticalScrollbar({container: {current: {style}}});
            s.handleOnEndMove();
            expect(style.scrollBehavior).to.eql('smooth');
        });
    });

    describe('Class Methods', () => {
        it('update()', () => {
            const s = new VerticalScrollbar({container: {current: {clientHeight: 10, scrollHeight: 20}}, onUpdate: sinon.spy()});
            s.track = {current: {classList: {add: sinon.spy()}, style: {}}};
            s.update();
            expect(s.track.current.classList.add.calledOnce).to.eql(true);
            expect(s.props.onUpdate.calledOnce).to.eql(true);
        });
    });

    describe('Utils', () => {
        it('onUpdate()', () => {
            const track = {style: {}, clientWidth: 5, clientHeight: 100};
            const thumb = {style: {}};
            const container = {scrollHeight: 200, scrollTop: 50, clientHeight: 100};
            onUpdate(track, thumb, container);
            expect(thumb.style).to.eql({top: '25px', height: '50px'});
        });
    });
});
