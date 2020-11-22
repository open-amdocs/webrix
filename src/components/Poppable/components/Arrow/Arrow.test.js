import React from 'react';
import {mount} from 'enzyme';
import {expect} from 'chai';
import PoppableContext from '../../Poppable.context';
import Arrow from './Arrow';

describe('<Arrow/>', () => {
    describe('HTML structure', () => {
        it('should render Arrow', () => {
            const wrapper = mount(
                <PoppableContext.Provider value={{tbr: {top: 0, bottom: 0, left: 0, right: 0}, rbr: {top: 10, bottom: 10, left: 10, right: 10}}}>
                    <Arrow/>
                </PoppableContext.Provider>
            );
            expect(wrapper.find('.poppable-arrow')).to.have.length(1);
        });
        it('shouldn\'t render Arrow', () => {
            const wrapper = mount(
                <PoppableContext.Provider value={{tbr: {}, rbr: {}}}>
                    <Arrow/>
                </PoppableContext.Provider>
            );
            expect(wrapper.html()).to.eql(null);
        });
    });
});
