import React from 'react';
import {shallow} from 'enzyme';
import {expect} from 'chai';
import {Handle} from './Handle.jsx';

describe('<Handle/>', () => {
    describe('HTML structure', () => {
        it('should render a Handle', () => {
            const wrapper = shallow(<Handle>Foo</Handle>);
            expect(wrapper.find('.poppable-movable')).to.have.length(1);
        });
    });
});
