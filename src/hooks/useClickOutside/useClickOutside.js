/**
 * Copyright (c) 2020, Amdocs Corp.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import React, {useRef, useCallback, useContext} from 'react';
import {func, node} from 'prop-types';
import {_document} from 'utility/mocks';
import useEventListener from '../useEventListener';
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
export const useClickOutside = callback => {
    const isClickedInside = useRef(false);
    const isClickedOutside = useContext(OverrideContext);

    useEventListener('mousedown', e => {
        isClickedInside.current = !isClickedOutside(isClickedInside.current, e)
    }, {current: _document});

    useEventListener('mouseup', e => {
        isClickedOutside(isClickedInside.current, e) ? callback(e) : (isClickedInside.current = false)
    }, {current: _document});

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
