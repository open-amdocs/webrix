import React from 'react';
import {mount} from 'enzyme';
import PoppableContext from '../../Poppable.context';
import Triangle from './Triangle';
import {getTop, getLeft} from './Triangle.utils';
import {NAMESPACE} from './../../Poppable';

describe('<Triangle/>', () => {
    describe('HTML structure', () => {
        it('should render Arrow', () => {
            const wrapper = mount(
                <PoppableContext.Provider value={{tbr: {top: 0, bottom: 0, left: 0, right: 0}, rbr: {top: 10, bottom: 10, left: 10, right: 10}}}>
                    <Triangle/>
                </PoppableContext.Provider>
            );
            expect(wrapper.find('.' + NAMESPACE +'-triangle')).toHaveLength(1);
        });
        it('shouldn\'t render Arrow', () => {
            const wrapper = mount(
                <PoppableContext.Provider value={{tbr: {}, rbr: {}}}>
                    <Triangle/>
                </PoppableContext.Provider>
            );
            expect(wrapper.html()).toEqual(null);
        });
    });
    describe('Utils', () => {
        it('getTop()', () => {
            expect(getTop({top: 10, bottom: 10}, {top: 0, bottom: 0}, 10)).toEqual(-10);
            expect(getTop({top: 0, bottom: 10}, {top: 0, bottom: 10}, 10)).toEqual(-5);
        });
        it('getLeft()', () => {
            expect(getLeft({left: 10}, {right: 0}, 10)).toEqual(-10);
            expect(getLeft({left: 0, right: 10}, {left: 0, right: 10}, 10)).toEqual(-5);
        });
    });
});
