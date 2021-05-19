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

import {useEffect, useRef} from 'react';

export default (type, handler, ref, options = {}) => {
    const cache = useRef({});

    // We're maintaining the handler & options in cache
    // so that we can avoid adding them to the deps array
    // of the last useEffect call, and reduce the calls
    // to add/remove listeners.
    useEffect(() => {
        cache.current = {handler, options};
    }, [handler, options]);

    useEffect(() => {
        const handler = e => cache.current.handler(e);
        const options = {...cache.current.options};
        const element = ref.current;
        element?.addEventListener?.(type, handler, options);
        return () => element?.removeEventListener?.(type, handler, options);
    }, [type, ref]);
};