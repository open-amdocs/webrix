import React from 'react';
import {mount} from 'enzyme';
import {expect} from 'chai';
import sinon from 'sinon';
import Collapsible from './Collapsible';

describe('<Collapsible/>', () => {
    describe('HTML Structure', () => {
        it('should render empty Collapsible if no children supplied', () => {
            const wrapper = mount(<Collapsible></Collapsible>);
            expect(wrapper.find('.collapsible').children()).to.have.lengthOf(0)
            wrapper.unmount();
        });

        it('should render a collapsed Collapsible', () => {
            const wrapper = mount(<Collapsible>foo</Collapsible>);
            expect(wrapper.find('.collapsible')).to.have.length(1);
            wrapper.unmount();
        });
        it('should render an expanded Collapsible', () => {
            const wrapper = mount(<Collapsible expanded>foo</Collapsible>);
            expect(wrapper.find('.collapsible.expanded')).to.have.length(1);
            wrapper.unmount();
        });
    });

    describe('Props', () => {
        it('should support custom class name', () => {
            const wrapper = mount(<Collapsible className='bar'>foo</Collapsible>);
            expect(wrapper.find('.collapsible.bar')).to.have.length(1);
            wrapper.unmount();
        });
    });

    describe('Events', () => {
        it('should trigger onTransitionEnd for transform', () => {
            const onTransitionEnd = sinon.spy();
            const wrapper = mount(<Collapsible onTransitionEnd={onTransitionEnd}><div/></Collapsible>);

            wrapper.find('.content-wrapper').prop('onTransitionEnd')({propertyName: 'transform'});
            expect(onTransitionEnd.callCount).to.eql(1);

            wrapper.find('.content-wrapper').prop('onTransitionEnd')({propertyName: 'width'});
            expect(onTransitionEnd.callCount).to.eql(1);
            wrapper.unmount();
        });
        it('should toggle visibility from collapsed to expanded', async () => {
            const wrapper = mount(<Collapsible>foo</Collapsible>);
            expect(wrapper.find('.collapsible.expanded')).to.have.length(0);

            wrapper.setProps({expanded: true});
            wrapper.update();
            expect(wrapper.find('.collapsible.expanded.expanding')).to.have.length(1);

            wrapper.find('.content-wrapper').simulate('transitionEnd', {propertyName: 'transform'});

            expect(wrapper.find('.collapsible.expanding')).to.have.length(0);
            wrapper.unmount();
        });
        it('should toggle visibility from expanded to collapsed', async () => {
            const wrapper = mount(<Collapsible expanded>foo</Collapsible>);
            expect(wrapper.find('.collapsible.expanded')).to.have.length(1);

            wrapper.setProps({expanded: false});
            wrapper.update();
            expect(wrapper.find('.collapsible.collapsing')).to.have.length(1);

            wrapper.find('.content-wrapper').simulate('transitionEnd', {propertyName: 'transform'});

            expect(wrapper.find('.collapsible.collapsing')).to.have.length(0);
            expect(wrapper.find('.collapsible').exists()).to.be.true;
            wrapper.unmount();
        });
    });
});
