import React from 'react';
// import {shallow} from 'enzyme';
import {expect} from 'chai';
// import Poppable from '../../Poppable';
// import {AdjustablePoppable} from './Adjustable';
import {or, getCurrentRect} from './Adjustable.utils';

describe('<AdjustablePoppable>', () => {
    // describe('HTML Structure', () => {
    //     it('should render AdjustablePoppable', () => {
    //         const wrapper = shallow(<AdjustablePoppable/>);
    //         expect(wrapper.find(Poppable)).to.have.length(1);
    //     });
    // });
    describe('Utils', () => {
        it('or', () => {
            expect(or(0, 10)).to.eql(0);
            expect(or(undefined, 10)).to.eql(10);
            expect(or(undefined, undefined, 0)).to.eql(0);
        });
        it('getCurrentRect', () => {
            const boundingRect = {top: 0, left: 0};
            const tbr = {top: 1, left:1 , width: 0, height: 0};
            expect(getCurrentRect(boundingRect, tbr)).to.eql({top: boundingRect.top, left: boundingRect.left, width: tbr.width, height: tbr.height});
        });
    });
});
