import React from 'react';
import {mount} from 'enzyme';
import {expect} from 'chai';
import sinon from 'sinon';
import Collapsible from './Collapsible';

const waitFor = delay => new Promise(resolve => setTimeout(resolve, delay));

describe('<Collapsible/>', () => {
    describe('HTML Structure', () => {
        it('should render a collapsed Collapsible', () => {
            window.requestAnimationFrame = () => null;
            const wrapper = mount(<Collapsible><div/></Collapsible>);
            expect(wrapper.find('.collapsible')).to.have.length(1);
            wrapper.unmount();
        });
        it('should render an expanded Collapsible', () => {
            const wrapper = mount(<Collapsible expanded><div/></Collapsible>);
            expect(wrapper.find('.collapsible.expanded')).to.have.length(1);
            wrapper.unmount();
        });
    });
    describe('Events', () => {
        it('should trigger onTransitionEnd for height', () => {
            const onTransitionEnd = sinon.spy();
            const wrapper = mount(<Collapsible onTransitionEnd={onTransitionEnd}><div/></Collapsible>);

            wrapper.find('.content-wrapper').prop('onTransitionEnd')({propertyName: 'height'});
            expect(onTransitionEnd.callCount).to.eql(1);

            wrapper.find('.content-wrapper').prop('onTransitionEnd')({propertyName: 'width'});
            expect(onTransitionEnd.callCount).to.eql(1);
            wrapper.unmount();
        });
        it('should toggle visibility from collapsed to expanded', async () => {
            window.requestAnimationFrame = sinon.spy();
            const wrapper = mount(<Collapsible><div/></Collapsible>);
            expect(wrapper.find('.collapsible.expanded')).to.have.length(0);

            wrapper.setProps({expanded: true});
            wrapper.update();
            expect(wrapper.find('.collapsible.expanded.expanding')).to.have.length(1);

            await waitFor(350);
            wrapper.update();
            expect(window.requestAnimationFrame.callCount).to.eql(1);
            expect(wrapper.find('.collapsible.expanding')).to.have.length(0);
            wrapper.unmount();
        });
        it('should toggle visibility from expanded to collapsed', async () => {
            window.requestAnimationFrame = sinon.spy();
            const wrapper = mount(<Collapsible expanded><div/></Collapsible>);
            expect(wrapper.find('.collapsible.expanded')).to.have.length(1);

            wrapper.setProps({expanded: false});
            wrapper.update();
            expect(wrapper.find('.collapsible.collapsing')).to.have.length(1);

            await waitFor(350);
            wrapper.update();
            expect(window.requestAnimationFrame.callCount).to.eql(1);
            expect(wrapper.find('.collapsible.collapsing')).to.have.length(0);
            wrapper.unmount();
        });
    });
});
