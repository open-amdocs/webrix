import React from 'react';
import {shallow, mount} from 'enzyme';
import {expect} from 'chai';
import sinon from 'sinon';
import AdjustableContext from '../Adjustable.context';
import {Handle} from './Handle.jsx';

describe('<Handle/>', () => {
    describe('HTML structure', () => {
        it('should render a Handle', () => {
            const wrapper = shallow(<Handle>Foo</Handle>);
            expect(wrapper.find('.poppable-movable')).to.have.length(1);
        });
    });
    describe('Events', () => {
        it('handleOnMove()', () => {
            const setBoundingRect = sinon.spy();
            const wrapper = mount(
                <AdjustableContext.Provider value={{boundingRect: {top: 0, left: 0}, setBoundingRect}}>
                    <Handle>Foo</Handle>
                </AdjustableContext.Provider>
            );
            console.log(wrapper.debug());
            wrapper.find('.poppable-movable').first().prop('onMove')({dx: 10, dy: 10});
            expect(setBoundingRect.callCount).to.eql(1);
            expect(setBoundingRect.calledWith({top: 10, left: 10})).to.eql(true);
        });
    });
});
