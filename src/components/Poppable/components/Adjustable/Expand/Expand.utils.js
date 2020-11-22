import {or, getCurrentRect} from '../Adjustable.utils';

const getMinimizedDimensions = sizes => ({width: sizes.minWidth, height: sizes.minHeight});

const getMaximizedDimensions = (cbr, sizes) => {
    // viewport width/height
    const vw = cbr.left + cbr.width;
    const vh = cbr.top + cbr.height;
    return ({
        vw, vh,
        width: Math.min(vw, or(sizes.maxWidth, Infinity)),
        height: Math.min(vh, or(sizes.maxHeight, Infinity)),
    });
};

const getPosWithinViewport = (current, length, view) => {
    // right/bottom out of viewport
    if (current + length > view) {
        return view - length;
    // left/top out of viewport
    } else if (current < 0) {
        return 0;
    }
    return current;
};

export const expandPopover = (br, tbr, cbr, sizes, setBoundingRect) => {
    const {vw, vh, width, height} = getMaximizedDimensions(cbr, sizes);
    setBoundingRect({
        ...br, width, height,
        top: getPosWithinViewport(or(br.top, tbr.top), height, vh),
        left: getPosWithinViewport(or(br.left, tbr.left), width, vw),
    });
};

export const minimizePopover = (br, tbr, sizes, setBoundingRect) => {
    const {top, left} = getCurrentRect(br, tbr);
    const {width, height} = getMinimizedDimensions(sizes);
    setBoundingRect({
        width, height,
        top: Math.max(0, top), left: Math.max(0, left),
    });
};

export const isExpanded = (br, tbr, cbr, sizes) => {
    const current = getCurrentRect(br, tbr);
    const {width, height} = getMaximizedDimensions(cbr, sizes);
    return current.width >= width && current.height >= height;
};

export const isDisabled = (expanded, br, tbr, cbr, sizes) => {
    const current = getCurrentRect(br, tbr);
    const maxLimit = getMaximizedDimensions(cbr, sizes);
    const minLimit = getMinimizedDimensions(sizes);
    return expanded
        ? current.width <= minLimit.width && current.height <= minLimit.height
        : current.width >= maxLimit.width && current.height >= maxLimit.height;
};
