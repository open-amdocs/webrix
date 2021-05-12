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

export default (callback, recurring = false) => {
    const cb = useRef(callback);
    const id = useRef(-1);

    cb.current = callback;

    const start = useCallback((...args) => {
        window.cancelAnimationFrame(id.current);
        id.current = window.requestAnimationFrame(() => {
            cb.current(...args);
            if (recurring) {
                start(...args);
            }
        });
    }, [recurring]);

    const stop = useCallback(() => {
        window.cancelAnimationFrame(id.current);
    }, []);

    useEffect(() => () => window.cancelAnimationFrame(id.current), []);

    return {start, stop};
};