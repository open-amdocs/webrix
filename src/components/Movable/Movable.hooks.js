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

export const useMove = ops => {
    const opsRef = useRef(ops);
    const shared = useRef({});

    opsRef.current = ops;

    const onBeginMove = useCallback(e => {
        opsRef.current.forEach(({onBeginMove}) => onBeginMove(e, shared.current));
    }, []);

    const onMove = useCallback(e => {
        opsRef.current.forEach(({onMove}) => onMove(e, shared.current));
    }, []);

    const onEndMove = useCallback(e => {
        opsRef.current.forEach(({onEndMove}) => onEndMove(e, shared.current))
    }, []);

    return {onBeginMove, onMove, onEndMove};
};