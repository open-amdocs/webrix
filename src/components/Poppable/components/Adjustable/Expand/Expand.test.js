// import React from 'react';
// import sinon from 'sinon';
// import {shallow, mount} from 'enzyme';
// import {expect} from 'chai';
// import PoppableContext from '../../../Poppable.context';
// import AdjustableContext from '../Adjustable.context';
// import Expand from './Expand';
// import {expandPopover, minimizePopover, isExpanded, isDisabled} from './Expand.utils';
//
// describe('<Expand>', () => {
//     const cbr = {top: 0, left: 0, width: 1000, height: 1000};
//     describe('HTML structure', () => {
//         it('should render Expand', () => {
//             const wrapper = shallow(<Expand/>);
//             expect(wrapper.find('IconButton')).to.have.length(1);
//         });
//         it('should render Expand disabled', () => {
//             const sizes = {minWidth: 100, minHeight: 100, maxWidth: 100, maxHeight: 100};
//             const tbr = {top: 0, left: 0, width: sizes.maxWidth, height: sizes.maxHeight};
//             const wrapper = mount(
//                 <PoppableContext.Provider value={{tbr, cbr}}>
//                     <AdjustableContext.Provider value={{sizes, boundingRect: {}, setBoundingRect: () => null}}>
//                         <Expand/>
//                     </AdjustableContext.Provider>
//                 </PoppableContext.Provider>
//             );
//             expect(wrapper.find('.disabled')).to.have.length(1);
//         });
//     });
//     describe('Methods', () => {
//         it('onClick while expanded', () => {
//             const setBoundingRect = sinon.spy();
//             const sizes = {minWidth: 10, minHeight: 10, maxWidth: 100, maxHeight: 100};
//             const boundingRect = {top: -10, left: 10, width: sizes.maxWidth, height: sizes.maxHeight};
//             const wrapper = mount(
//                 <PoppableContext.Provider value={{cbr, tbr: boundingRect}}>
//                     <AdjustableContext.Provider value={{sizes, boundingRect, setBoundingRect}}>
//                         <Expand/>
//                     </AdjustableContext.Provider>
//                 </PoppableContext.Provider>
//             );
//             wrapper.simulate('click');
//             expect(setBoundingRect.calledOnce).to.eql(true);
//             expect(setBoundingRect.getCall(0).args[0]).to.eql({top: 0, left: 10, width: sizes.minWidth, height: sizes.minHeight});
//         });
//         it('onClick while not expanded', () => {
//             const setBoundingRectMock = sinon.spy();
//             const wrapper = mount(
//                 <AdjustableContext.Provider value={{boundingRect: {}, setBoundingRect: setBoundingRectMock, sizes: {}}}>
//                     <Expand/>
//                 </AdjustableContext.Provider>
//             );
//             wrapper.simulate('click');
//             expect(setBoundingRectMock.calledOnce).to.eql(true);
//             expect(setBoundingRectMock.getCall(0).args[0]).to.have.own.property('width');
//             expect(setBoundingRectMock.getCall(0).args[0]).to.have.own.property('height');
//         });
//     });
//     describe('Utils', () => {
//         it('expandPopover', () => {
//             const sizes = {
//                 maxWidth: 720,
//                 maxHeight: 480,
//             };
//             const setBoundingRectMock = sinon.spy();
//             // without constraints
//             expandPopover({}, {top: 0, left: 0}, cbr, {}, setBoundingRectMock);
//             expect(setBoundingRectMock.getCall(0).args[0]).to.eql(cbr);
//             // within container boundaries
//             expandPopover({}, {top: 0, left: 0}, cbr, sizes, setBoundingRectMock);
//             expect(setBoundingRectMock.getCall(1).args[0]).to.eql({top: 0, left: 0, width: 720, height: 480});
//             // within container boundaries, but the container is smaller then expand dimensions
//             expandPopover({}, {top: 0, left: 0}, {...cbr, width: 100, height: 100}, sizes, setBoundingRectMock);
//             expect(setBoundingRectMock.getCall(2).args[0]).to.eql({top: 0, left: 0, width: 100, height: 100});
//             // overlaps container right and bottom boundaries
//             expandPopover({}, {top: 1100, left: 1100}, cbr, sizes, setBoundingRectMock);
//             expect(setBoundingRectMock.getCall(3).args[0]).to.eql({top: 520, left: 280, width: 720, height: 480});
//             // overlaps container left and top boundaries
//             expandPopover({}, {top: -100, left: -100}, cbr, sizes, setBoundingRectMock);
//             expect(setBoundingRectMock.getCall(4).args[0]).to.eql({top: 0, left: 0, width: 720, height: 480});
//         });
//         it('minimizePopover', () => {
//             const setBoundingRectMock = sinon.spy();
//             // without constraints and the left-top corner out of viewport
//             minimizePopover({top: -10, left: -10, width: 100, height: 100}, {}, {}, setBoundingRectMock);
//             expect(setBoundingRectMock.getCall(0).args[0]).to.eql({top: 0, left: 0, width: undefined, height: undefined});
//             // with constraints
//             minimizePopover({top: 10, left: 10, width: 100, height: 100}, {}, {minWidth: 50, minHeight: 50}, setBoundingRectMock);
//             expect(setBoundingRectMock.getCall(1).args[0]).to.eql({top: 10, left: 10, width: 50, height: 50});
//         });
//         it('isExpanded', () => {
//             expect(isExpanded({width: 0, height: 0}, {}, cbr, {})).to.eql(false);
//             // expanded to viewport size
//             expect(isExpanded({width: 1000, height: 1000}, {}, cbr, {})).to.eql(true);
//             // expanded to max size
//             expect(isExpanded({width: 100, height: 100}, {}, cbr, {maxWidth: 100, maxHeight: 100})).to.eql(true);
//         });
//         it('isDisabled', () => {
//             const sizes = {minWidth: 10, minHeight: 10, maxWidth: 100, maxHeight: 100};
//             // maximized, but can be minimized
//             expect(isDisabled(true, {width: sizes.maxWidth, height: sizes.maxHeight}, {}, cbr, sizes)).to.eql(false);
//             // maximized in width only
//             expect(isDisabled(true, {width: sizes.maxWidth, height: sizes.minHeight}, {}, cbr, sizes)).to.eql(false);
//             // maximized in height only
//             expect(isDisabled(true, {width: sizes.minWidth, height: sizes.maxHeight}, {}, cbr, sizes)).to.eql(false);
//             // maximized and can't be minimized
//             expect(isDisabled(true, {width: sizes.maxWidth, height: sizes.maxHeight}, {}, cbr, {...sizes, minWidth: sizes.maxWidth, minHeight: sizes.maxHeight})).to.eql(true);
//             // minimized, but can be maximized
//             expect(isDisabled(false, {width: 10, height: 10}, {}, cbr, sizes)).to.eql(false);
//             // minimized in width only
//             expect(isDisabled(false, {width: sizes.minWidth, height: sizes.maxHeight}, {}, cbr, sizes)).to.eql(false);
//             // minimized in height only
//             expect(isDisabled(false, {width: sizes.maxWidth, height: sizes.minHeight}, {}, cbr, sizes)).to.eql(false);
//             // minimized and can't be maximized
//             expect(isDisabled(false, {width: sizes.minWidth, height: sizes.minHeight}, {}, cbr, {...sizes, maxWidth: sizes.minWidth, maxHeight: sizes.minHeight})).to.eql(true);
//         });
//     });
// });
