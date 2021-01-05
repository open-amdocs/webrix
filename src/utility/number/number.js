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

/**
 * Take a number and return a value based on a specific range. If the number falls within the given range, return that number. If it falls outside of that range, return either the top of that range or the bottom of that range.</br></br>
 * The naming comes from computer graphics {@link https://en.wikipedia.org/wiki/Clamping_(graphics)|(Wikipedia)}
 *
 * @example
 * clamp(5, 0, 10); // Outputs 5
 * clamp(15, 0, 10); // Outputs 10
 * clamp(1, 5, 10); // Outputs 5
 *
 * // If true is added as a fourth param, then: return min if num > max, and vice versa
 * clamp(15, 0, 10, true); // Outputs 0
 * clamp(1, 5, 10, true); // Outputs 10
 *
 * @param {number} num The number to evaluate
 * @param {number} min The minimum boundary of the range
 * @param {number} max The maximum boundary of the range
 * @param {boolean} [cyclic = false] Whether to cycle the value between boundaries (i.e. if the value > max, return min, and vice versa)
 *
 * @returns {Number}
 */
export const clamp = (num, min, max, cyclic = false) => {
    if (cyclic) {
        if (num > max) {
            return min;
        }
        if (num < min) {
            return max;
        }
    }
    return Math.min(Math.max(num, min), max);
};