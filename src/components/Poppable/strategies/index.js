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

import {HIDDEN_PLACEMENT} from '../Poppable.constants';
import hide from './hide';
import reposition from './reposition';
import trap from './trap';

export {default as hide} from './hide';
export {default as reposition} from './reposition';
export {default as trap} from './trap';

/**
 * This default overflow recovery strategy
 *
 * 1. Hide the target if the reference is outside the cbr or the wbr, otherwise:
 * 2. Reposition the target if it is overflowing the cbr/wbr
 * 3. Trap the target within the wbr if it overflows it
 */
export default (rects, props) => {
    if (HIDDEN_PLACEMENT !== hide(rects) && HIDDEN_PLACEMENT !== hide({...rects, cbr: rects.wbr})) {
        return trap({...rects, cbr: rects.wbr, tbr: reposition(rects, props)});
    }
    return HIDDEN_PLACEMENT;
};