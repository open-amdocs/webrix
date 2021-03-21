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

import * as number from 'utility/number';

export const map = (...args) => v => number.map(v, ...args);
export const clamp = (...args) => v => number.clamp(v, ...args);
export const interval = (...args) => v => number.interval(v, ...args);
export const decimals = (...args) => v => number.decimals(v, ...args);

export const angle = ({center: {x, y}, angle, rotate, output: {min, max}}) => ({left, top}) => {
    const adjacent = left - x;
    const opposite = top - y;
    const radians = Math.atan(opposite / adjacent) + (adjacent < 0 ? Math.PI : 0) + Math.PI / 2;
    let degrees = radians * (180 / Math.PI);

    // If the angle + rotation is more than 360, and the current degree is passed 360,
    // we add 360 to it since otherwise it will start from zero again.
    // The last part is used for when the angle is outside of the given range.
    // In that case, we want to angle to go either to the start of the range, or to the end
    // of the range, based on proximity to either end.
    if (angle + rotate > 360 && degrees >= 0 && degrees < angle / 2 - 180 + rotate) {
        degrees += 360;
    }

    return map(rotate, angle + rotate, min, max)(number.clamp(degrees, rotate, angle + rotate));
};