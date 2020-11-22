export const or = (...args) => args.find(v => typeof v !== 'undefined');

export const getCurrentRect = (br, tbr) => ({
    top: or(br.top, tbr.top),
    left: or(br.left, tbr.left),
    width: or(br.width, tbr.width),
    height: or(br.height, tbr.height),
});
