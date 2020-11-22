const addNextRect = (current, delta) => ({
    top: current.top + delta.top,
    left: current.left + delta.left,
    width: current.width + delta.width,
    height: current.height + delta.height,
});

const getVerticalDimensions = (delta, current, next, sizes) => {
    let nextTop = next.top, nextHeight = next.height;
    // exceeds min limit
    const minVLimit = sizes.minHeight;
    if (next.height <= minVLimit) {
        nextTop = current.top + current.height - minVLimit;
        nextHeight = minVLimit;
    // exceeds max limit
    } else if (sizes.maxHeight && next.height >= sizes.maxHeight) {
        nextTop = current.top + current.height - sizes.maxHeight;
        nextHeight = sizes.maxHeight;
    }
    return ({
        top: delta.top ? nextTop : current.top,
        height: delta.height ? nextHeight : current.height,
    });
};

const getHorizontalDimensions = (delta, current, next, sizes) => {
    let nextLeft = next.left, nextWidth = next.width;
    // exceeds min limit
    const minHLimit = sizes.minWidth;
    if (next.width <= minHLimit) {
        nextLeft = current.left + current.width - minHLimit;
        nextWidth = minHLimit;
    // exceeds max limit
    } else if (sizes.maxWidth && next.width >= sizes.maxWidth) {
        nextLeft = current.left + current.width - sizes.maxWidth;
        nextWidth = sizes.maxWidth;
    }
    return ({
        left: delta.left ? nextLeft : current.left,
        width: delta.width ? nextWidth : current.width,
    });
};

export const getRectWithinLimitsRange = (delta, current, sizes) => {
    const next = addNextRect(current, delta);
    return ({
        ...getVerticalDimensions(delta, current, next, sizes),
        ...getHorizontalDimensions(delta, current, next, sizes),
    });
};
