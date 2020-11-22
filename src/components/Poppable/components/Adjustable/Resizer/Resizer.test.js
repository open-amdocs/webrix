import React from 'react';
import {shallow} from 'enzyme';
import {expect} from 'chai';
import {Resizer} from './Resizer';
import {getRectWithinLimitsRange} from './Resizer.utils';

describe('<Resizer>', () => {
    describe('HTML Structure', () => {
        it('should render Resizer', () => {
            const wrapper = shallow(<Resizer/>);
            expect(wrapper.find('Resizable'));
        });
    });
    describe('Utils', () => {
        describe('getRectWithinLimitsRange', () => {
            it('should stay in current rect if no changes in delta', () => {
                const delta = {top: 0, left: 0, width: 0, height: 0};
                const current = {top: 100, left: 100, height: 100, width: 100};
                expect(getRectWithinLimitsRange(delta, current, {})).to.eql(current);
            });
            it('should change current rect by delta', () => {
                const delta = {top: 10, left: 10, width: 10, height: 10};
                const current = {top: 100, left: 100, height: 100, width: 100};
                expect(getRectWithinLimitsRange(delta, current, {}))
                    .to.eql(Object.keys(current).reduce((acc, key) => ({...acc, [key]: current[key] + delta[key]}), {}));
            });
            it('should limit by min size on squeezing from right-bottom', () => {
                const delta = {top: 0, left: 0, height: -50, width: -50};
                const current = {top: 100, left: 100, width: 150, height: 150};
                expect(getRectWithinLimitsRange(delta, current, {})).to.eql({...current, width: 100, height: 100});
            });
            it('should limit by min size on squeezing from left-top', () => {
                const delta = {top: 500, left: 500, height: 0, width: 0};
                const current = {top: 0, left: 0, width: 150, height: 150};
                expect(getRectWithinLimitsRange(delta, current, {})).to.eql({top: 500, left: 500, width: 150, height: 150});
            });
            it('should limit by maxSize on enlarging from right-bottom', () => {
                const delta = {top: 0, left: 0, height: 500, width: 500};
                const current = {top: 100, left: 100, height: 100, width: 100};
                const sizes = {maxWidth: 150, maxHeight: 150};
                expect(getRectWithinLimitsRange(delta, current, sizes)).to.eql({...current, width: sizes.maxWidth, height: sizes.maxHeight});
            });
            it('should limit by maxSize on enlarging from left-top', () => {
                const delta = {top: -100, left: -100, height: 100, width: 100};
                const current = {top: 100, left: 100, height: 100, width: 100};
                const sizes = {maxWidth: 150, maxHeight: 150};
                expect(getRectWithinLimitsRange(delta, current, sizes)).to.eql({top: 50, left: 50, width: sizes.maxWidth, height: sizes.maxHeight});
            });
        });
    });
});
