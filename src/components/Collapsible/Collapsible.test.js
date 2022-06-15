import React from 'react';
import {mount} from 'enzyme';
import sinon from 'sinon';
import {act} from 'react-dom/test-utils';
import Collapsible, {NAMESPACE} from './Collapsible';

describe('<Collapsible/>', () => {
    describe('HTML Structure', () => {
        it('should render empty Collapsible if no children supplied', () => {
            const wrapper = mount(<Collapsible></Collapsible>);
            expect(wrapper.find(`.${NAMESPACE}`).children()).toHaveLength(0)
            wrapper.unmount();
        });

        it('should render a collapsed Collapsible', () => {
            const wrapper = mount(<Collapsible>foo</Collapsible>);
            expect(wrapper.find(`.${NAMESPACE}`)).toHaveLength(1);
            wrapper.unmount();
        });
        it('should render an expanded Collapsible', () => {
            const wrapper = mount(<Collapsible expanded>foo</Collapsible>);
            expect(wrapper.find(`.${NAMESPACE}--expanded`)).toHaveLength(1);
            wrapper.unmount();
        });
    });

    describe('Props', () => {
        it('should support custom class name', () => {
            const wrapper = mount(<Collapsible className='bar'>foo</Collapsible>);
            expect(wrapper.find(`.${NAMESPACE}.bar`)).toHaveLength(1);
            wrapper.unmount();
        });
    });

    describe('Events', () => {
        it('should trigger onTransitionEnd for transform', () => {
            act(() => {
                const onTransitionEnd = sinon.spy();
                const wrapper = mount(<Collapsible onTransitionEnd={onTransitionEnd}><div/></Collapsible>);

                wrapper.find(`.${NAMESPACE}`).prop('onTransitionEnd')({propertyName: 'transform'});
                expect(onTransitionEnd.callCount).toEqual(1);

                wrapper.find(`.${NAMESPACE}`).prop('onTransitionEnd')({propertyName: 'width'});
                expect(onTransitionEnd.callCount).toEqual(1);
                wrapper.unmount();
            });
        });
        it('should toggle from collapsed to expanded', async () => {
            const wrapper = mount(<Collapsible>foo</Collapsible>);
            expect(wrapper.find(`.${NAMESPACE}--expanded`)).toHaveLength(0);

            wrapper.setProps({expanded: true});
            wrapper.update();
            expect(wrapper.find(`.${NAMESPACE}--expanded`)).toHaveLength(0); // should not have the "expanded" until transition is done
            expect(wrapper.find(`.${NAMESPACE}--expanding`)).toHaveLength(1);

            wrapper.find(`.${NAMESPACE}`).simulate('transitionEnd', {propertyName: 'transform'});

            expect(wrapper.find(`.${NAMESPACE}--expanding`)).toHaveLength(0); // expading class should be removed once transition is done
            wrapper.unmount();
        });
        it('should toggle from expanded to collapsed', async () => {
            const wrapper = mount(<Collapsible expanded>foo</Collapsible>);
            expect(wrapper.find(`.${NAMESPACE}--expanded`)).toHaveLength(1);

            wrapper.setProps({expanded: false});
            wrapper.update();
            expect(wrapper.find(`.${NAMESPACE}--collapsing`)).toHaveLength(1);

            wrapper.find(`.${NAMESPACE}`).simulate('transitionEnd', {propertyName: 'transform'});

            expect(wrapper.find(`.${NAMESPACE}--collapsing`)).toHaveLength(0);
            expect(wrapper.find(`.${NAMESPACE}`).exists()).toBe.true;
            wrapper.unmount();
        });
    });
});
