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

import {useCallback, useState} from 'react';

/**
 * Returns a stateful boolean value representing the current state, and 4 functions
 * to update it: setTrue, setFalse, toggle, setValue.
 *
 * @param initial The initial state value
 * @returns {{value: boolean, setTrue: (function(): void), setFalse: (function(): void), setValue: React.Dispatch<React.SetStateAction<boolean>>, toggle: (function(): void)}}
 */
export const useBooleanState = (initial = false) => {
    const [value, setValue] = useState(initial);
    const setTrue = useCallback(() => setValue(true), [setValue]);
    const setFalse = useCallback(() => setValue(false), [setValue]);
    const toggle = useCallback(() => setValue(v => !v), [setValue]);
    return {value, setTrue, setFalse, toggle, setValue};
};

/**
 * Returns a stateful boolean value representing the current focus state, and 4 functions
 * to update it: focus, blur, toggle and setFocused.
 *
 * @param {boolean} initial The initial state value
 * @return {{hide: (function(): void), visible: boolean, show: (function(): void), toggle: (function(): void), setVisible: (function(): void)}}
 */
export const useFocusabilityState = (initial = false) => {
    const {value, setTrue, setFalse, toggle, setValue} = useBooleanState(initial);
    return {focused: value, focus: setTrue, blur: setFalse, toggle, setFocused: setValue};
};

/**
 * Returns a stateful boolean value representing the current visibility, and 4 functions
 * to update it: show, hide, toggle and setVisible.
 *
 * @param {boolean} initial The initial state value
 * @return {{hide: (function(): void), visible: boolean, show: (function(): void), toggle: (function(): void), setVisible: (function(): void)}}
 */
export const useVisibilityState = (initial = false) => {
    const {value, setTrue, setFalse, toggle, setValue} = useBooleanState(initial);
    return {visible: value, show: setTrue, hide: setFalse, toggle, setVisible: setValue};
};