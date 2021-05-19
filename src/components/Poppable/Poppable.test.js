import React from 'react';
import {mount} from 'enzyme';
import {expect} from 'chai';
import Poppable from './Poppable';
import defaultStrategy, {reposition, hide, trap} from './strategies';
import {sortPlacements, filterPlacements} from './strategies/reposition';
import {getBoundingRects} from './Poppable.utils';
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
        it('getBoundingRects()', () => {
            const ref = {current: {getBoundingClientRect: () => new DOMRect()}};
            expect(getBoundingRects(ref, ref, ref, {})).to.eql({tbr: new DOMRect(), rbr: new DOMRect(), cbr: new DOMRect()});

            ref.current = undefined;
            expect(getBoundingRects(ref, ref, ref, {})).to.eql({tbr: new DOMRect(), rbr: new DOMRect(), cbr: new DOMRect()});
        });
    });

    describe('Strategies', () => {
        it('hide()', () => {
            const r = (...args) => new DOMRect(...args);
            const tbr = r(0, 0, 0, 0);
            expect(hide({tbr, cbr: r(0, 0, 100, 100), rbr: r(0, 0, 50, 50)})).to.eql(tbr);
            expect(hide({tbr, cbr: r(0, 0, 100, 100), rbr: r(50, 50, 100, 100)})).to.eql(tbr);
            expect(hide({tbr, cbr: r(0, 0, 100, 100), rbr: r(101, 101, 100, 100)})).to.eql(HIDDEN_PLACEMENT);
        });
        it('trap()', () => {
            const r = (...args) => new DOMRect(...args);
            const cbr = r(0, 0, 100, 100);
            expect(trap({tbr: r(0, 0, 50, 50), cbr})).to.eql(r(0, 0, 50, 50));
            expect(trap({tbr: r(50, 50, 50, 50), cbr})).to.eql(r(50, 50, 50, 50));
            expect(trap({tbr: r(100, 100, 50, 50), cbr})).to.eql(r(50, 50, 50, 50));
            expect(trap({tbr: r(-100, -100, 50, 50), cbr})).to.eql(r(0, 0, 50, 50));
        });
        describe('reposition()', () => {
            it('sortPlacements()', () => {
                const r = (...args) => new DOMRect(...args);
                expect(sortPlacements([{top: 0, left: 1}, {top: 0, left: 0}], r(0, 0, 0, 0), r(0, 0, 10, 10), r(0, 0, 20, 20))).to.eql([{top: 0, left: 0}, {top: 0, left: 1}]);
                expect(sortPlacements([{top: 1, left: 1}, {top: 2, left: 2}], r(0, 0, 0, 0), r(0, 0, 10, 10), r(0, 0, 20, 20))).to.eql([{top: 1, left: 1}, {top: 2, left: 2}]);
                expect(sortPlacements([{top: 15, left: 15}, {top: 10, left: 10}], r(0, 0, 0, 0), r(0, 0, 10, 10), r(0, 0, 20, 20))).to.eql([{top: 10, left: 10}, {top: 15, left: 15}]);
            });
            it('filterPlacements()', () => {
                const r = (...args) => new DOMRect(...args);
                expect(filterPlacements([{top: 0, left: 0}, {top: 100, left: 100}], r(0, 0, 50, 50), r(0, 0, 100, 100))).to.have.length(2);
                expect(filterPlacements([{top: 0, left: 0}, {top: 100, left: 100}], r(0, 0, 50, 50), r(0, 0, 50, 50))).to.have.length(1);
                expect(filterPlacements([{top: -51, left: -51}, {top: -100, left: -100}], r(0, 0, 50, 50), r(0, 0, 100, 100))).to.have.length(0);
            });
            it('reposition()', () => {
                const rbr = {top: 40, left: 40, width: 20, height: 20};
                const tbr = {width: 20, height: 20};
                const cbr = {top: 0, left: 0, width: 100, height: 100, bottom: 100, right: 100};
                const placements = () => [{top: 20, left: 20}];
                expect(reposition({rbr, tbr, cbr}, {placements, default: 0})).to.eql(new DOMRect(20, 20, tbr.width, tbr.height));
            });
        });
        it('Default Strategy', () => {
            expect(defaultStrategy({
                rbr: new DOMRect(-20, -20, 20, 20),
                cbr: new DOMRect(0, 0, 100, 100),
                tbr: new DOMRect(20, 0, 20, 20),
                wbr: new DOMRect(0, 0, 150, 150),
            }, {placements: () => [{top: 0, left: 20}]})).to.eql(new DOMRect(20, 0, 20, 20));
            expect(defaultStrategy({
                rbr: new DOMRect(0, 0, 20, 20),
                tbr: new DOMRect(0, 20, 20, 20),
                cbr: new DOMRect(0, 0, 100, 100),
                wbr: new DOMRect(0, 0, 150, 150),
            }, {placements: () => [{top: 0, left: 20}]})).to.eql(new DOMRect(20, 0, 20, 20));
            expect(defaultStrategy({
                rbr: new DOMRect(0, 0, 20, 20),
                tbr: new DOMRect(0, 20, 20, 20),
                cbr: new DOMRect(0, 21, 100, 100),
                wbr: new DOMRect(0, 0, 150, 150),
            }, {placements: () => [{top: 0, left: 20}]})).to.eql(HIDDEN_PLACEMENT);
            expect(defaultStrategy({
                rbr: new DOMRect(0, 0, 20, 20),
                tbr: new DOMRect(0, 20, 120, 120),
                cbr: new DOMRect(0, 0, 100, 100),
                wbr: new DOMRect(0, 0, 120, 120),
            }, {placements: () => [{top: 0, left: 20}]})).to.eql(new DOMRect(0, 0, 120, 120));
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
