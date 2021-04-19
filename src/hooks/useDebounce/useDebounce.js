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

import {useCallback, useEffect, useMemo, useRef} from 'react';
import {debounce} from 'utility/synchronization';

export default (callback, wait) => {
    const timeout = useRef();
    const _debounce = useMemo(() => {
        return debounce(callback, wait);
    }, [callback, wait]);

    useEffect(() => () => {
        clearTimeout(timeout.current);
    }, []); // No need for deps here since 'timeout' is mutated

    return useCallback((...args) => {
        // When the debounce function is regenerated, there could be outstanding
        // timeoutes that will not be cleared when we call the new debounce function,
        // so we manually clear them here before calling it again.
        clearTimeout(timeout.current);
        timeout.current = _debounce(...args);
    }, [_debounce]);
};