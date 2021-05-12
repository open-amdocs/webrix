import React from 'react';
import {mount} from 'enzyme';
import {act} from 'react-dom/test-utils';
import {expect} from 'chai';
import sinon from 'sinon';
import ResizeObserver from './ResizeObserver';

describe('<ResizeObserver>', () => {
    describe('HTML structure', () => {
        it('should render ResizeObserver', () => {
            let observed = 0, disconnected = 0;
            window.ResizeObserver = class {
                disconnect = () => disconnected++;
                observe = () => observed++;
            };

            const handleOnResize = sinon.spy();
            const wrapper = mount(<ResizeObserver onResize={handleOnResize}><div style={{width: 100}}/></ResizeObserver>);
            expect(observed).to.eql(1);
            expect(disconnected).to.eql(0);

            act(() => {wrapper.unmount()});
            expect(observed).to.eql(1);
            expect(disconnected).to.eql(1);
        });
    });
});
