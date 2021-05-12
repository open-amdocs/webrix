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

import {useRef} from 'react';
import {equal} from 'utility/rect';
import {getType} from 'utility/types';
import useAnimationFrame from 'hooks/useAnimationFrame';

export const getBoundingRects = refs => (
    refs.map(ref => {
        if (ref.current) {
            return ref.current.getBoundingClientRect();
        }
        if (ref instanceof Element) {
            return ref.getBoundingClientRect();
        }
        if (ref instanceof DOMRect) {
            return ref;
        }
        if (getType(ref) === 'window') {
            return new DOMRect(0, 0, window.innerWidth, window.innerHeight)
        }
    })
);

export default (callback, ...refs) => {
    const prev = useRef([]);
    return useAnimationFrame(() => {
        const rects = getBoundingRects(refs);
        if (rects.every(r => r !== undefined) && rects.some((rect, i) => !equal(rect, prev.current[i] || {}))) {
            callback(...rects);
            prev.current = rects;
        }
    }, true);
};