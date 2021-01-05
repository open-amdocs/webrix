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

import {useCallback, useMemo, useRef} from 'react';
import {debounce} from 'utility/synchronization';

export default (callback, wait) => {
    const timeout = useRef();
    const _debounce = useMemo(() => {
        // When the debounce function is regenerated, there could be outstanding
        // timeoutes that will not be cleared when we call the new debounce function,
        // so we manually clear them here.
        clearTimeout(timeout.current);
        return debounce(callback, wait);
    }, [timeout, callback, wait]);
    return useCallback((...args) => {
        timeout.current = _debounce(...args);
    }, [timeout, _debounce]);
};