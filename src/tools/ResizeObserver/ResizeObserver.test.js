import React from 'react';
import {mount} from 'enzyme';
import {act} from 'react-dom/test-utils';
import sinon from 'sinon';
import ResizeObserver, {__RewireAPI__ as rewireAPI} from './ResizeObserver';

describe('<ResizeObserver>', () => {
    describe('HTML structure', () => {
        it('should render ResizeObserver', () => {
            let observed = 0, disconnected = 0;
            rewireAPI.__Rewire__('NativeResizeObserver', class {
                disconnect = () => disconnected++;
                observe = () => observed++;
            });

            const handleOnResize = sinon.spy();
            const wrapper = mount(<ResizeObserver onResize={handleOnResize}><div style={{width: 100}}/></ResizeObserver>);
            expect(observed).toEqual(1);
            expect(disconnected).toEqual(0);

            act(() => {wrapper.unmount()});
            expect(observed).toEqual(1);
            expect(disconnected).toEqual(1);
            rewireAPI.__ResetDependency__('NativeResizeObserver');
        });
    });
});
