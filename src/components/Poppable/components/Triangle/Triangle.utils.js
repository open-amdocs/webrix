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

import {intersection, midpoint} from 'utility/range';

export const getTop = (tbr, rbr, size) => {
    const isn = intersection([tbr.top, tbr.bottom], [rbr.top, rbr.bottom]);
    if (isn.length === 0) {
        return tbr.top > rbr.bottom ? tbr.top - size * 2 : tbr.bottom;
    }
    return midpoint(isn) - size;
};

export const getLeft = (tbr, rbr, size) => {
    const isn = intersection([tbr.left, tbr.right], [rbr.left, rbr.right]);
    if (isn.length === 0) {
        return tbr.left > rbr.right ? tbr.left - size * 2 : tbr.right;
    }
    return midpoint(isn) - size;
};

export const ready = (tbr, rbr) => tbr.top !== undefined && rbr.top !== undefined;