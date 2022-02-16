import React from 'react';
import {func, node} from 'prop-types';
import OverrideContext from 'hooks/useClickOutside/useClickOutside.context';
import {useClickOutside} from 'hooks';

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