import React from 'react';
import {mount} from 'enzyme';
import {expect} from 'chai';
import AdjustableContext from '../Adjustable.context';
import AdjustableArrow from './AdjustableArrow';

describe('<AdjustableArrow>', () => {
    describe('HTML Structure', () => {
        it('should render AdjustableArrow', () => {
            const wrapper = mount(
                <AdjustableContext.Provider value={{boundingRect: {}}}>
                    <AdjustableArrow/>
                </AdjustableContext.Provider>
            );
            expect(wrapper.find('Arrow')).to.have.length(1);
        });

        it('shouldn\'t render AdjustableArrow', () => {
            const wrapper = mount(
                <AdjustableContext.Provider value={{boundingRect: {top: 1}}}>
                    <AdjustableArrow/>
                </AdjustableContext.Provider>
            );
            expect(wrapper.find('Arrow')).to.have.length(0);
        });
    });
});
