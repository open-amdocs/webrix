import React from 'react';
import {mount, shallow} from 'enzyme';
import sinon from 'sinon';
import Movable from '../Movable';
import Pannable, {__RewireAPI__ as rewireAPI, NAMESPACE} from './Pannable';
import Scrollable from '../Scrollable';

const TestPannable = ({remove}) => {
    const pannableRef = React.useRef({classList: {remove}});

    return (
        <Pannable ref={pannableRef} />
    );
};

describe('Pannable', () => {
    describe('HTML Structure', () => {
        it('should render component', () => {
            const wrapper = shallow(<Pannable/>);
            expect(wrapper.find(Scrollable)).toHaveLength(1);
            expect(wrapper.find(Movable)).toHaveLength(1);
            // should have namespaced class
            expect(wrapper.find(`.${NAMESPACE}`)).toHaveLength(1);

        });
    });

    describe('Events', () => {
        it('handleOnMove()', () => {
            const wrapper = mount(<TestPannable/>);
            wrapper.find(Movable).first().prop('onMove')({dx: 1, dy: 2});
            expect(wrapper.find(Scrollable).instance().container.current.scrollTop).toEqual(-2);
            expect(wrapper.find(Scrollable).instance().container.current.scrollLeft).toEqual(-1);
        });
        it('handleOnBeginMove()', () => {
            const add = sinon.spy();
            rewireAPI.__Rewire__('copyComponentRef', (external, internal) => () => internal.current = {classList: {add}});
            const wrapper = mount(<TestPannable/>);
            wrapper.find(Movable).first().prop('onBeginMove')();
            expect(wrapper.find(Scrollable).instance().container.current.scrollTop).toEqual(0);
            expect(wrapper.find(Scrollable).instance().container.current.scrollLeft).toEqual(0);
            expect(add.callCount).toEqual(1);
            rewireAPI.__ResetDependency__('copyComponentRef');
        });
        it('handleOnEndMove()', () => {
            const remove = sinon.spy();
            rewireAPI.__Rewire__('copyComponentRef', (external, internal) => () => internal.current = {classList: {remove}});
            const wrapper = mount(<TestPannable remove={remove}/>);
            wrapper.find(Movable).first().prop('onEndMove')();
            expect(remove.callCount).toEqual(1);
            rewireAPI.__ResetDependency__('copyComponentRef');
        });
    });
});