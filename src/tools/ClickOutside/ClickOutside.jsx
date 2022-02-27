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