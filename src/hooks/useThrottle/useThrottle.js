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

import {useCallback, useEffect, useRef} from 'react';

export default (callback, threshold) => {
    const wait = useRef(false);
    const timeout = useRef(-1);

    useEffect(() => () => clearTimeout(timeout.current), []); // No need for deps here since 'timeout' is mutated

    return useCallback((...args) => {
        if (!wait.current) {
            callback(...args);
            wait.current = true;
            clearTimeout(timeout.current);
            timeout.current = setTimeout(() => {
                wait.current = false;
            }, threshold);
        }
    }, [callback, threshold]);
};