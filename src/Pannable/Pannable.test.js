import React from 'react';
import {shallow} from 'enzyme';
import {expect} from 'chai';
import Movable from '../Movable';
import Pannable from './Pannable';
import Scrollable from '../Scrollable';

describe('Pannable', () => {
    describe('HTML Structure', () => {
        it('should render component', () => {
            const wrapper = shallow(<Pannable/>);
            expect(wrapper.find(Scrollable)).to.have.lengthOf(1);
            expect(wrapper.find(Movable)).to.have.lengthOf(1);
        });
    });
});