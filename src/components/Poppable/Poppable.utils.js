import {getType} from 'utility/types';
import {getRelativePosition, contained} from 'utility/rect';

/**
 * Returns true if all the given refs have a non-falsy 'current' property
 *
 * @param refs
 * @returns {boolean}
 */
export const refsReady = (...refs) => refs.every(ref => ref instanceof DOMRect || ref.current);

/**
 * Get the bounding rects of the given elements.
 *
 * @param target
 * @param reference
 * @param container
 * @returns {{cbr: *, rbr: *, tbr: *, wbr: *}}
 */
export const getBoundingRects = (target, reference, container) => {
    const wbr = new DOMRect(0, 0, window.innerWidth, window.innerHeight);
    return ({
        tbr: target.current.getBoundingClientRect(),
        rbr: reference instanceof DOMRect ? reference : reference.current.getBoundingClientRect(),
        cbr: getType(container.current) === 'window' ? wbr : container.current.getBoundingClientRect(),
        wbr,
    });
};

/**
 * Measure the horizontal & vertical distance between a & b and return an absolute value
 * representing the addition of the two (to be used for sorting based on distance).
 * NOTE: this is not the real distance between two rectangles, but it is good enough
 * for sorting purposes.
 *
 * @param a
 * @param b
 * @return {number}
 */
export const distance = (a, b) => (
    Math.abs(a.left - b.left) + Math.abs(a.top - b.top)
);

/**
 *
 * @param placements
 * @param desired
 * @returns {*}
 */
export const sortPlacements = (placements, desired) =>
    placements.sort((a, b) => distance(a, desired) - distance(b, desired));

/**
 * Remove any invalid placement (i.e. a placement that will result in the target element overflowing the container)
 *
 * @param {Array} placements
 * @param {Object} tbr Target Bounding Rect
 * @param {Object} cbr Container Bounding Rect
 * @returns {Array}
 */
export const filterPlacements = (placements, tbr, cbr) =>
    placements.filter(p =>
        contained(new DOMRect(p.left, p.top, tbr.width, tbr.height), cbr)
    );

/**
 * Get the final placement of the target after filtering & sorting the supported placements
 * and clamping it into the container.
 *
 * @param {Array} placements
 * @param {Object} desired The desired positioning
 * @param {Object} rbr Reference Bounding Rect
 * @param {Object} tbr Target Bounding Rect
 * @param {Object} cbr Container Bounding Rect
 * @param {Object} wbr Window Bounding Rect
 * @param {func} overflow The overflow recovery function
 * @returns {{top: *, left: *}}
 */
export const getPlacement = ({tbr, cbr, rbr, wbr}, placements, desired, overflow) => {
    const final = sortPlacements(filterPlacements(placements, tbr, cbr), desired)[0] || desired;
    return overflow({tbr: new DOMRect(final.left, final.top, tbr.width, tbr.height), cbr, rbr, wbr});
};

/**
 * get the relative locations from the reference element
 *
 * @param {Object} tbr Target Bounding Rect
 * @param {Object} rbr Reference Bounding Rect
 * @returns string with locations
 */
export const getPositionClass = (tbr, rbr) => getRelativePosition(tbr, rbr).reduce((acc, cur, i) => (
    acc + (acc.length ? ' ' : '') + [
        ['west', '', 'east'],
        ['north', '', 'south'],
    ][i][cur + 1]
), '');
