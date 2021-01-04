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

import {useRef, useCallback} from 'react';

const start = (args, timeout, callback, delay, recurring) => {
    clearTimeout(timeout.current);
    timeout.current = setTimeout(() => {
        callback(...args);
        if (recurring) {
            start(args, timeout, callback, delay, recurring);
        }
    }, delay);
};

const stop = timeout => {
    clearTimeout(timeout.current);
};

export default (callback, delay = 0, recurring = false) => {
    const timeout = useRef();
    return {
        start: useCallback((...args) => start(args, timeout, callback, delay, recurring), [timeout, callback, delay, recurring]),
        stop: useCallback(() => stop(timeout), [timeout]),
    };
};
