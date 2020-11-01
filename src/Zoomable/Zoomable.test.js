import React from 'react';
import {shallow} from 'enzyme';
import {expect} from 'chai';
import {Zoomable} from './Zoomable';

describe('Zoomable', () => {

    describe('HTML Structure', () => {
        it('should render wrapper', () => {
            const wrapper = shallow(<Zoomable/>);
            expect(wrapper.find('div').length).to.eql(1);
            expect(wrapper.find('div').get(0).props.style.transform).to.eql('scale(1)');
        });
        it('should zoom', () => {
            const wrapper = shallow(<Zoomable zoom={1.5}/>);
            expect(wrapper.find('div').get(0).props.style.transform).to.eql('scale(1.5)');
        });
    });
});
