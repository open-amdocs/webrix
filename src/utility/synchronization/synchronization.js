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
 * Creates a function that delays the execution of `callback` until `wait` milliseconds have passed.
 *
 * @example
 * const func = debounce(console.log, 500);
 * func(1); // Schedules 1 to be logged 500 milliseconds from now
 * func(2); // Cancels the previously scheduled execution, and schedules 2 to be logged 500 milliseconds from now.
 *
 * @see https://css-tricks.com/debouncing-throttling-explained-examples/ for the difference between debounce & throttle
 * @param {function} callback Specifies the function to be debounced.
 * @param {number} wait Specifies the delay in milliseconds.
 * @return {Function}
 */
export const debounce = (callback, wait) => {
    let timeout;
    return (...args) => {
        clearTimeout(timeout);
        timeout = setTimeout(() => {
            callback(...args);
        }, wait);
        return timeout;
    };
};

/**
 * Creates a function that prevents the execution of `callback` if less than `threshold` milliseconds
 * have passed since the last execution.
 *
 * @example
 * const func = throttle(console.log, 500);
 * func(1); // Logs 1 immediately
 * func(2); // Delays this call to 500ms from now
 * func(3); // Cancels the previous call, and delays this call to 500ms from now
 *
 * @see https://css-tricks.com/debouncing-throttling-explained-examples/ for the difference between debounce & throttle
 * @param {function} callback Specifies the function to be throttled.
 * @param {number} threshold Specifies the threshold in milliseconds.
 * @return {Function}
 */
export const throttle = (callback, threshold) => {
    let wait = false;
    let timeout;
    return (...args) => {
        if (!wait) {
            callback(...args);
            wait = true;
            clearTimeout(timeout);
            timeout = setTimeout(() => {
                wait = false;
            }, threshold);
        }
        return timeout;
    };
};