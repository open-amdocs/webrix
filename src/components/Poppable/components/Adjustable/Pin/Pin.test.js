// import React from 'react';
// import sinon from 'sinon';
// import {shallow, mount} from 'enzyme';
// import {expect} from 'chai';
// import AdjustableContext from '../Adjustable.context';
// import Pin from './Pin';
//
// describe('<Pin>', () => {
//     describe('HTML structure', () => {
//         it('Should render IconButton', () => {
//             const wrapper = shallow(<Pin/>);
//             expect(wrapper.find('IconButton')).to.have.length(1);
//             expect(wrapper.find('IconButton').shallow().find('.disabled')).to.have.length(1);
//         });
//         it('Should render IconButton not disabled', () => {
//             const wrapper = mount(
//                 <AdjustableContext.Provider value={{boundingRect: {top: 0}, placement: {top: 0}}}>
//                     <Pin/>
//                 </AdjustableContext.Provider>
//             );
//             expect(wrapper.find('IconButton')).to.have.length(1);
//             expect(wrapper.find('.disabled')).to.have.length(0);
//         });
//     });
//     describe('Methods', () => {
//         it('onClick', () => {
//             const setBoundingRectMock = sinon.spy();
//             const wrapper = mount(
//                 <AdjustableContext.Provider value={{boundingRect: {top: 0}, setBoundingRect: setBoundingRectMock, placement: {top: 0}}}>
//                     <Pin/>
//                 </AdjustableContext.Provider>
//             );
//             wrapper.simulate('click');
//             expect(setBoundingRectMock.calledOnce).to.eql(true);
//         });
//     });
// });
