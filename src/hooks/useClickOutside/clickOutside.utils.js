
export const getZindex = element => Number.parseInt(element.style.getPropertyValue('z-index'));

export const isAbove = (el1, el2) => {
    const el1Stackable = el1.closest('.stackable');
    const el2Stackable = el2.closest('.stackable');
    if (el1Stackable && el2Stackable && getZindex(el1Stackable) > getZindex(el2Stackable)) {
        return true;
    }
    return false;
};
