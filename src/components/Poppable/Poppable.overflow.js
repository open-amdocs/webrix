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

import {clamp} from 'utility/number';
import {intersect} from 'utility/rect';
import {HIDDEN_PLACEMENT} from './Poppable.constants';

/**
 * This overflow recovery strategy "traps" the target within the window
 *
 * @param tbr Target Bounding Rect
 * @param wbr Window Bounding Rect
 * @returns {{top: number, left: number}}
 */
const trap = ({tbr, wbr}) => ({
    top: Math.round(clamp(tbr.top, wbr.top, wbr.bottom - tbr.height)),
    left: Math.round(clamp(tbr.left, wbr.left, wbr.right - tbr.width)),
});

/**
 * This overflow recovery strategy hides the target as soon as the
 * reference overflows the container.
 *
 * @param tbr Target Bounding Rect
 * @param cbr Container Bounding Rect
 * @param rbr Reference Bounding Rect
 * @returns {{top: *, left: *}|{top: number, left: number}}
 */
const hide = ({tbr, cbr, rbr}) => {
    if (!intersect(rbr, cbr)) {
        return HIDDEN_PLACEMENT;
    }
    return {top: tbr.top, left: tbr.left};
};

export default ({tbr, cbr, rbr, wbr}) => {
    const posByReference = hide({tbr, cbr, rbr});
    return posByReference === HIDDEN_PLACEMENT ? posByReference : trap({tbr, wbr});
};
