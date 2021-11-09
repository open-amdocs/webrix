import React from 'react';
import {mount, shallow} from 'enzyme';
import {noop} from 'utility/memory';
import {move} from './VerticalScrollbar.operations';
import {CSS_VARS} from '../../Scrollable.constants';
import VerticalScrollbar, {__RewireAPI__ as rewire} from './VerticalScrollbar';

describe('<VerticalScrollbar/>', () => {

    describe('HTML structure', () => {
        it('should render a Scrollbar', () => {
            const wrapper = mount(<VerticalScrollbar/>);
            expect(wrapper.find('.scrollbar-thumb')).toHaveLength(2);
            expect(wrapper.find('.scrollbar-thumb-inner')).toHaveLength(1);
            expect(wrapper.find('.scrollbar-track').prop('style')).toBeUndefined();
        });

        it('should have correct style with CSS variable', () => {
            const context = {
                container: {},
                scrollTop: 10,
                cssVarsOnTracks: true,
            };
            rewire.__Rewire__('useContext', () => context);

            const wrapper = shallow(<VerticalScrollbar/>);
            expect(wrapper.find('.scrollbar-track').prop('style')).toEqual({[CSS_VARS.scrollTop]: context.scrollTop});
        });
    });

    describe('Events', () => {
        it('handleOnClick()', () => {
            const container = {current: {style: {}, scrollTop: 0, scrollHeight: 200}};
            const ref = {current: {contains: () => false, getBoundingClientRect: () => ({top: 0, height: 100})}};
            rewire.__Rewire__('useRef', () => ref);
            rewire.__Rewire__('useContext', () => ({container}));
            const wrapper = shallow(<VerticalScrollbar/>);

            wrapper.find('.scrollbar-track').prop('onClick')({clientY: 0, stopPropagation: noop});
            expect(container.current.scrollTop).toEqual(0);

            wrapper.find('.scrollbar-track').prop('onClick')({clientY: 50, stopPropagation: noop});
            expect(container.current.scrollTop).toEqual(100);

            rewire.__ResetDependency__('useRef');
            rewire.__ResetDependency__('useContext');
        });

        it('handleOnClick() on thumb', () => {
            const container = {current: {style: {}, scrollTop: 0, scrollHeight: 200}};
            const ref = {current: {contains: () => true, getBoundingClientRect: () => ({top: 0, height: 100})}};
            rewire.__Rewire__('useRef', () => ref);
            rewire.__Rewire__('useContext', () => ({container}));
            const wrapper = shallow(<VerticalScrollbar/>);

            wrapper.find('.scrollbar-track').prop('onClick')({clientY: 50, stopPropagation: noop});
            expect(container.current.scrollTop).toEqual(0);

            rewire.__ResetDependency__('useRef');
            rewire.__ResetDependency__('useContext');
        });
    });

    describe('Operations', () => {
        it('move()', () => {
            const container = {current: {clientHeight: 100, scrollHeight: 400}};
            const thumb = {current: {}};
            const track = {current: {}};
            const shared = {};
            const props = move(container, thumb, track);

            props.onBeginMove({stopPropagation: noop, preventDefault: noop}, shared);
            expect(shared.initial).toEqual(container.current.scrollTop);

            thumb.current.clientHeight = 40;
            track.current.clientHeight = 100;
            shared.initial = 20;
            props.onMove({dy: 75}, shared);
            expect(container.current.scrollTop).toEqual(395)
        });
    });
});
