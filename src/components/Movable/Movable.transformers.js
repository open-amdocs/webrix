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

import {clamp as _clamp} from 'utility/number';

// Map the given value based on the given in/out limits
export const map = (imin, imax, omin, omax) => v => (v - imin) / (imax - imin) * (omax - omin) + omin;

// Enforce number precision based on the given number of decimal places
export const decimals = p => v => Math.round(v * Math.pow(10, p)) / Math.pow(10, p);

// Round the given number to the given interval
export const interval = i => v => Math.round(v / i) * i;

export const clamp = (min, max) => v => _clamp(v, min, max);

export const angle = (cx, cy) => ({left, top}) => {
    const adjacent = left - cx;
    const opposite = top - cy;
    const radians = Math.atan(opposite / adjacent) + (adjacent < 0 ? Math.PI : 0) + Math.PI / 2;
    return radians * (180 / Math.PI);
};

export const transform = (v, ...t) => t.reduce((acc, cur) => cur(acc), v);
