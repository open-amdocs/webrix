import React from 'react';
import {mount, shallow} from 'enzyme';
import {noop} from 'utility/memory';
import {move} from './HorizontalScrollbar.operations';
import {CSS_VARS} from '../../Scrollable.constants';
import HorizontalScrollbar, {__RewireAPI__ as rewire} from './HorizontalScrollbar';

describe('<HorizontalScrollbar/>', () => {

    describe('HTML structure', () => {
        it('should render a Scrollbar', () => {
            const wrapper = mount(<HorizontalScrollbar/>);
            expect(wrapper.find('.scrollbar-thumb')).toHaveLength(2);
            expect(wrapper.find('.scrollbar-thumb-inner')).toHaveLength(1);
            expect(wrapper.find('.scrollbar-track').prop('style')).toBeUndefined();
        });

        it('should have correct style with CSS variable', () => {
            const context = {
                container: {},
                scrollLeft: 10,
                cssVarsOnTracks: true,
            };
            rewire.__Rewire__('useContext', () => context);

            const wrapper = shallow(<HorizontalScrollbar/>);
            expect(wrapper.find('.scrollbar-track').prop('style')).toEqual({[CSS_VARS.scrollLeft]: context.scrollLeft});
        });
    });

    describe('Events', () => {
        it('handleOnClick()', () => {
            const container = {current: {style: {}, scrollLeft: 0, scrollWidth: 200}};
            const ref = {current: {contains: () => false, getBoundingClientRect: () => ({left: 0, width: 100})}};
            rewire.__Rewire__('useRef', () => ref);
            rewire.__Rewire__('useContext', () => ({container}));
            const wrapper = shallow(<HorizontalScrollbar/>);

            wrapper.find('.scrollbar-track').prop('onClick')({clientX: 0, stopPropagation: noop});
            expect(container.current.scrollLeft).toEqual(0);

            wrapper.find('.scrollbar-track').prop('onClick')({clientX: 50, stopPropagation: noop});
            expect(container.current.scrollLeft).toEqual(100);

            rewire.__ResetDependency__('useRef');
            rewire.__ResetDependency__('useContext');
        });
    });

    describe('Operations', () => {
        it('move()', () => {
            const container = {current: {clientWidth: 100, scrollWidth: 400}};
            const thumb = {current: {}};
            const track = {current: {}};
            const shared = {};
            const props = move(container, thumb, track);

            props.onBeginMove({stopPropagation: noop, preventDefault: noop}, shared);
            expect(shared.initial).toEqual(container.current.scrollLeft);

            thumb.current.clientWidth = 40;
            track.current.clientWidth = 100;
            shared.initial = 20;
            props.onMove({dx: 75}, shared);
            expect(container.current.scrollLeft).toEqual(395)
        });
    });
});
