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
 * Check whether the given keys are defined within an object, and return their values.
 * You can define nested keys, and multiple paths.
 *
 * @example
 * var obj = {a: 'a', b: [1, 2, 3]};
 *
 * get(obj, 'a'); // 'a'
 * get(obj, 'b[0]'); // 1
 * get(obj, 'b[5]'); // undefined
 * get(obj, 'b[5]', 'hello'); // 'hello' (If the value is unable to be found, return the third param)
 * 
 *
 * @param {Object|Array} object The initial object
 * @param {string} path The path leading to the property we want to grab values from within the object
 * @param {*} defaultValue The value to return if the given path is undefined in the object
 * @return {*}
 */
export const get = (object, path, defaultValue = undefined) => {
    if (!object || typeof path !== 'string') {
        return defaultValue;
    }
    let value = object;
    path.split(/[.[\]]/).filter(key => key !== '').every(key => {
        // NULL & undefined are the only primitive data types that don't support hasOwnProperty
        if (value !== null && undefined !== value && Object.prototype.hasOwnProperty.call(value, key)) {
            value = value[key];
            return true;
        }
        value = defaultValue;
        return false;
    });
    if (typeof value === 'undefined') {
        return defaultValue;
    }
    return value;
};
