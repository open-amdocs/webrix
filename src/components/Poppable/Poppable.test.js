import React from 'react';
import {mount} from 'enzyme';
import {expect} from 'chai';
import Poppable from './Poppable';
import defaultOverflow from './Poppable.overflow';
import {sortPlacements, filterPlacements, getPlacement, getBoundingRects, refsReady} from './Poppable.utils';
import {vbefore, vcenter, vafter, hbefore, hcenter, hafter} from './Poppable.placements';
import {HIDDEN_PLACEMENT} from './Poppable.constants';

describe('<Poppable/>', () => {

    describe('HTML structure', () => {
        it('should render a Poppable', () => {
            const wrapper = mount(<Poppable/>);
            expect(wrapper.find('.poppable').hostNodes()).to.have.length(1);
        });
    });

    describe('Hooks', () => {
        it('updatePosition()');
        it('usePositioning()');
    });

    describe('Utils', () => {
        it('refsReady()', () => {
            expect(refsReady({})).to.eql(false);
            expect(refsReady({}, {})).to.eql(false);
            expect(refsReady({current: true})).to.eql(true);
            expect(refsReady({current: true}, {current: false})).to.eql(false);
            expect(refsReady({current: true}, {current: true})).to.eql(true);
        });
        it('getBoundingRects()', () => {
            const ref = {current: {getBoundingClientRect: () => 'mock'}};
            const wbr = new DOMRect(0, 0, window.innerWidth, window.innerHeight);
            expect(getBoundingRects(ref, ref, ref)).to.eql({tbr: 'mock', rbr: 'mock', cbr: 'mock', wbr});
        });
        it('sortPlacements()', () => {
            expect(sortPlacements([{top: 0, left: 1}, {top: 0, left: 0}], {top: 0, left: 0})).to.eql([{top: 0, left: 0}, {top: 0, left: 1}]);
            expect(sortPlacements([{top: 1, left: 1}, {top: 2, left: 2}], {top: 0, left: 0})).to.eql([{top: 1, left: 1}, {top: 2, left: 2}]);
        });
        it('filterPlacements()', () => {
            expect(filterPlacements([{top: 0, left: 0}, {top: 100, left: 100}], {top: 0, left: 0, width: 50, height: 50}, {top: 0, left: 0, width: 100, height: 100})).to.have.length(1);
            expect(filterPlacements([{top: -50, left: -50}, {top: 100, left: 100}], {top: 0, left: 0, width: 50, height: 50}, {top: 0, left: 0, width: 100, height: 100})).to.have.length(0);
        });
        it('getPlacement()', () => {
            const rbr = {top: 40, left: 40, width: 20, height: 20};
            const tbr = {width: 20, height: 20};
            const cbr = {top: 0, left: 0, width: 100, height: 100, bottom: 100, right: 100};
            const overflow = ({tbr: {top, left}}) => ({top, left});
            expect(getPlacement({rbr, tbr, cbr}, [{top: 20, left: 20}], {top: 20, left: 20}, overflow)).to.eql({top: 20, left: 20});
        });
    });

    describe('Overflow', () => {
        it('defaultOverflow()', () => {
            expect(defaultOverflow({
                rbr: new DOMRect(-20, -20, 20, 20),
                cbr: new DOMRect(0, 0, 100, 100),
                tbr: new DOMRect(20, 0, 20, 20),
                wbr: new DOMRect(0, 0, 150, 150),
            })).to.eql({top: 0, left: 20});
            expect(defaultOverflow({
                rbr: new DOMRect(0, 0, 20, 20),
                tbr: new DOMRect(0, 20, 20, 20),
                cbr: new DOMRect(0, 0, 100, 100),
                wbr: new DOMRect(0, 0, 150, 150),
            })).to.eql({top: 20, left: 0});
            expect(defaultOverflow({
                rbr: new DOMRect(0, 0, 20, 20),
                tbr: new DOMRect(0, 20, 20, 20),
                cbr: new DOMRect(0, 21, 100, 100),
                wbr: new DOMRect(0, 0, 150, 150),
            })).to.eql(HIDDEN_PLACEMENT);
            expect(defaultOverflow({
                rbr: new DOMRect(0, 0, 20, 20),
                tbr: new DOMRect(0, 20, 120, 120),
                cbr: new DOMRect(0, 0, 100, 100),
                wbr: new DOMRect(0, 0, 120, 120),
            })).to.eql({top: 0, left: 0});
        });
    });

    it('Placements', () => {
        expect(vbefore(new DOMRect(100, 100, 100, 100), new DOMRect(0, 0, 50, 50))).to.eql({top: 50});
        expect(vcenter(new DOMRect(100, 100, 100, 100), new DOMRect(0, 0, 50, 50))).to.eql({top: 125});
        expect(vafter(new DOMRect(100, 100, 100, 100), new DOMRect(0, 0, 50, 50))).to.eql({top: 200});
        expect(hbefore(new DOMRect(100, 100, 100, 100), new DOMRect(0, 0, 50, 50))).to.eql({left: 50});
        expect(hcenter(new DOMRect(100, 100, 100, 100), new DOMRect(0, 0, 50, 50))).to.eql({left: 125});
        expect(hafter(new DOMRect(100, 100, 100, 100), new DOMRect(0, 0, 50, 50))).to.eql({left: 200});
    });
});
