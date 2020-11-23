import React from 'react';
import {mount, shallow} from 'enzyme';
import {expect} from 'chai';
import sinon from 'sinon';
import Movable from '../Movable';
import Pannable, {__RewireAPI__ as rewireAPI} from './Pannable';
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
            expect(wrapper.find(Scrollable)).to.have.lengthOf(1);
            expect(wrapper.find(Movable)).to.have.lengthOf(1);
        });
    });

    describe('Events', () => {
        it('handleOnMove()', () => {
            const wrapper = mount(<TestPannable/>);
            wrapper.find(Movable).first().prop('onMove')({dx: 1, dy: 2});
            expect(wrapper.find(Scrollable).instance().container.current.scrollTop).to.eql(-2);
            expect(wrapper.find(Scrollable).instance().container.current.scrollLeft).to.eql(-1);
        });
        it('handleOnBeginMove()', () => {
            const add = sinon.spy();
            rewireAPI.__Rewire__('copyComponentRef', (external, internal) => () => internal.current = {classList: {add}});
            const wrapper = mount(<TestPannable/>);
            wrapper.find(Movable).first().prop('onBeginMove')();
            expect(wrapper.find(Scrollable).instance().container.current.scrollTop).to.eql(0);
            expect(wrapper.find(Scrollable).instance().container.current.scrollLeft).to.eql(0);
            expect(add.callCount).to.eql(1);
            rewireAPI.__ResetDependency__('copyComponentRef');
        });
        it('handleOnEndMove()', () => {
            const remove = sinon.spy();
            rewireAPI.__Rewire__('copyComponentRef', (external, internal) => () => internal.current = {classList: {remove}});
            const wrapper = mount(<TestPannable remove={remove}/>);
            wrapper.find(Movable).first().prop('onEndMove')();
            expect(remove.callCount).to.eql(1);
            rewireAPI.__ResetDependency__('copyComponentRef');
        });
    });
});