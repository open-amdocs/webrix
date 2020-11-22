import React, {useRef, useCallback, useEffect, useContext} from 'react';
import {func, node} from 'prop-types';
import OverrideContext from './useClickOutside.context';

/**
 * This custom hook receives a callback and returns a click capture handler to be used on the component
 * that you want to detect clicks outside of.
 *
 * NOTE: The callback must be wrapped in useCallback with the proper list of dependencies in order
 * to reattach document events when they change, otherwise this hook will not work properly.
 *
 * This solution is based on a similar solution taken from https://github.com/adazzle/react-data-grid/pull/1417/files#diff-fdcbe490b776c1eed24c88d4b5f27d66R4
 * In short, we leverage the power of event bubbling in React, which works based on React's Component tree
 * rather than the DOM tree, allowing us to accurately detect clicks through portals.
 * So once a click is detected in the component tree of the target component, we set a flag, which the
 * document event handler is checking against. When set to true, the click is considered to be "inside"
 * and so it is ignored.
 * 
 * This solution is further improved by separating the "click" event into "mousedown" and "mouseup",
 * allowing us to cover cases where the mouse is clicked inside the element, but released outside the 
 * element (for example, when dragging). In such cases the click is still considered as an inside click,
 * since it originated inside the element.
 *
 * @param {Function} callback
 */
const useClickOutside = callback => {
    const isClickedInside = useRef(false);
    const isClickedOutside = useContext(OverrideContext);

    const handleDocumentMouseDown = useCallback(e =>
        isClickedInside.current = !isClickedOutside(isClickedInside.current, e),
    [isClickedInside]);

    const handleDocumentMouseUp = useCallback(e =>
        isClickedInside.current ? isClickedInside.current = false : callback(e),
    [callback, isClickedInside]);

    useEffect(() => {
        document.addEventListener('mousedown', handleDocumentMouseDown);
        document.addEventListener('mouseup', handleDocumentMouseUp);
        return () => {
            document.removeEventListener('mousedown', handleDocumentMouseDown);
            document.removeEventListener('mouseup', handleDocumentMouseUp);
        }
    }, [handleDocumentMouseDown, handleDocumentMouseUp]);

    return useCallback(() => {
        isClickedInside.current = true;
    }, [isClickedInside]);
};

// Use this for class components
export const ClickOutside = ({children, onClickOutside}) => {
    const handleOnMouseDownCapture = useClickOutside(onClickOutside);
    // We're updating the contained element instead of adding a wrapper since adding
    // a wrapper can may affect the styling/behavior
    return React.cloneElement(
        React.Children.only(children), {onMouseDownCapture: handleOnMouseDownCapture}
    );
};

// It is sometimes necessary to modify the condition of the click-outside handler
// of one or more elements. This can be done using the ClickOutsideOverride
export const ClickOutsideOverride = ({condition, children}) => (
    <OverrideContext.Provider value={condition}>
        {children}
    </OverrideContext.Provider>
);

ClickOutsideOverride.propTypes = {
    condition: func,
    children: node,
};

export default useClickOutside;
