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

import {intersect} from 'utility/rect';
import {HIDDEN_PLACEMENT} from '../Poppable.constants';

/**
 * This overflow recovery strategy hides the target as soon as the
 * reference is completely outside the container.
 *
 * @param tbr {DOMRect} Target Bounding Rect
 * @param cbr {DOMRect} Container Bounding Rect
 * @param rbr {DOMRect} Reference Bounding Rect
 * @returns {{top: *, left: *}|{top: number, left: number}}
 */
export default ({tbr, cbr, rbr}) => {
    if (!intersect(rbr, cbr)) {
        return HIDDEN_PLACEMENT;
    }
    return tbr;
};