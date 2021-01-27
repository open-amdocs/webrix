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

import {clamp, add, toCSS} from 'utility/rect';

export const inscribe = (initial, delta, max) => {
    const rect = add(initial, delta);
    return toCSS(clamp(
        rect,
        new DOMRect(
            delta.left === 0 ? initial.left : initial.left + initial.width,
            delta.top === 0 ? initial.top : initial.top + initial.height,
            0,
            0,
        ),
        new DOMRect(
            delta.left === 0 ? initial.left : max.left,
            delta.top === 0 ? initial.top : max.top,
            delta.left === 0 ? max.left + max.width - initial.left : initial.left + initial.width - max.left,
            delta.top === 0 ? max.top + max.height - initial.top : initial.top + initial.height - max.top,
        ),
    ));
};