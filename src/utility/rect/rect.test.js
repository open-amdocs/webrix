import {getCenterPoint, getRelativePosition, equal, contained, intersect, union, area, add, readResizeObserverEntry} from './rect';

describe('rect', () => {

    it('getCenterPoint()', () => {
        expect(getCenterPoint(new DOMRect(0, 0, 20, 20))).toEqual([10, 10]);
        expect(getCenterPoint(new DOMRect(10, 10, 20, 20))).toEqual([20, 20]);
        expect(getCenterPoint(new DOMRect(10, 10, 40, 40))).toEqual([30, 30]);
    });

    it('getRelativePosition()', () => {
        const reference = new DOMRect(0, 0, 50, 50);
        expect(getRelativePosition(reference, new DOMRect(0, 0, 50, 50))).toEqual([0, 0]);
        expect(getRelativePosition(reference, new DOMRect(50, 0, 50, 50))).toEqual([-1, 0]);
        expect(getRelativePosition(reference, new DOMRect(-50, 0, 50, 50))).toEqual([1, 0]);
        expect(getRelativePosition(reference, new DOMRect(0, 50, 50, 50))).toEqual([0, -1]);
        expect(getRelativePosition(reference, new DOMRect(0, -50, 50, 50))).toEqual([0, 1]);
        expect(getRelativePosition(reference, new DOMRect(50, 50, 50, 50))).toEqual([-1, -1]);
        expect(getRelativePosition(reference, new DOMRect(-50, -50, 50, 50))).toEqual([1, 1]);
    });

    it('equal()', () => {
        expect(equal(new DOMRect(0, 0, 20, 20), new DOMRect(0, 0, 20, 20))).toEqual(true);
        expect(equal(new DOMRect(10, 10, 20, 20), new DOMRect(0, 0, 20, 20))).toEqual(false);
        expect(equal(new DOMRect(0, 0, 10, 10), new DOMRect(0, 0, 20, 20))).toEqual(false);
    });

    it('contained()', () => {
        expect(contained(new DOMRect(0, 0, 100, 100), new DOMRect(0, 0, 100, 100))).toEqual(true);
        expect(contained(new DOMRect(0, 0, 101, 100), new DOMRect(0, 0, 100, 100))).toEqual(false);
        expect(contained(new DOMRect(25, 25, 50, 50), new DOMRect(0, 0, 100, 100))).toEqual(true);
        expect(contained(new DOMRect(25, 75, 50, 50), new DOMRect(0, 0, 100, 100))).toEqual(false);
        expect(contained(new DOMRect(75, 25, 50, 50), new DOMRect(0, 0, 100, 100))).toEqual(false);
        expect(contained(new DOMRect(75, 75, 50, 50), new DOMRect(0, 0, 100, 100))).toEqual(false);
        expect(contained(new DOMRect(-25, -25, 50, 50), new DOMRect(0, 0, 100, 100))).toEqual(false);
        expect(contained(new DOMRect(25, -25, 50, 50), new DOMRect(0, 0, 100, 100))).toEqual(false);
        expect(contained(new DOMRect(-25, 25, 50, 50), new DOMRect(0, 0, 100, 100))).toEqual(false);
    });

    it('intersects()', () => {
        const a = new DOMRect(0, 0, 100, 100);
        expect(intersect(a, new DOMRect(0, 0, 100, 100))).toEqual(true);
        expect(intersect(a, new DOMRect(10, 10, 10, 10))).toEqual(true);
        expect(intersect(a, new DOMRect(-10, -10, 20, 20))).toEqual(true);
        expect(intersect(a, new DOMRect(90, -10, 20, 20))).toEqual(true);
        expect(intersect(a, new DOMRect(90, 90, 20, 20))).toEqual(true);
        expect(intersect(a, new DOMRect(-10, 90, 20, 20))).toEqual(true);
        expect(intersect(a, new DOMRect(-21, -21, 20, 20))).toEqual(false);
        expect(intersect(a, new DOMRect(101, -21, 20, 20))).toEqual(false);
        expect(intersect(a, new DOMRect(101, 101, 20, 20))).toEqual(false);
        expect(intersect(a, new DOMRect(-21, 101, 20, 20))).toEqual(false);
    });

    it('union()', () => {
        const r = (...args) => new DOMRect(...args);
        expect(union(r(0, 0, 20, 20), r(0, 0, 20, 20))).toEqual(r(0, 0, 20, 20));
        expect(union(r(0, 0, 20, 20), r(10, 10, 20, 20))).toEqual(r(10, 10, 10, 10));
        expect(union(r(0, 0, 20, 20), r(20, 20, 20, 20))).toEqual(r(20, 20, 0, 0));
        expect(union(r(0, 0, 20, 20), r(-10, -10, 20, 20))).toEqual(r(0, 0, 10, 10));
        expect(union(r(0, 0, 20, 20), r(40, 40, 20, 20))).toEqual(undefined);
    });

    it('area()', () => {
        expect(area(new DOMRect(0, 0, 10, 10))).toEqual(100);
        expect(area(new DOMRect(0, 0, 5, 20))).toEqual(100);
    });

    it('add()', () => {
        const r = (...args) => new DOMRect(...args);
        expect(add(r(0, 0, 10, 10), r(0, 0, 0, 0))).toEqual(r(0, 0, 10, 10));
        expect(add(r(0, 0, 10, 10), r(10, 10, 0, 0))).toEqual(r(10, 10, 10, 10));
        expect(add(r(0, 0, 10, 10), r(10, 10, 10, 10))).toEqual(r(10, 10, 20, 20));
        expect(add(r(0, 0, 10, 10), r(10, 10, -5, -5))).toEqual(r(10, 10, 5, 5));
    });

    it('readResizeObserverEntry()', () => {
        const output = {width: 100, height: 100};
        expect(
            readResizeObserverEntry({borderBoxSize: [{inlineSize: 100, blockSize: 100}]})
        ).toEqual(output);
        expect(
            readResizeObserverEntry({borderBoxSize: {inlineSize: 100, blockSize: 100}})
        ).toEqual(output);
        expect(
            readResizeObserverEntry({target: {getBoundingClientRect: () => ({width: 100, height: 100})}})
        ).toEqual(output);
    });
});
