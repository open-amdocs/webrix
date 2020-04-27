import React from 'react';
import {shallow} from 'enzyme';
import {expect} from 'chai';
import HelloWorld from './HelloWorld';

describe('<HelloWorld/>', () => {
    describe('HTML structure', () => {
        it('should render a <HelloWorld/>', () => {
            const wrapper = shallow(<HelloWorld/>);
            expect(wrapper.text()).to.eql('Hello World!');
        });
    });
});
