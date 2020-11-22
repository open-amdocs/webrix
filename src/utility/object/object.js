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

import {getType, isObject, isArray, isString, isUndefined} from '../types';

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

/**
 * Set a property on the given object/array at a given path, creating that path if necessary.
 * **Note**: This function mutates the original object
 *
 * @example
 * const a = {};
 * set(a, 'a.b', 'c'); // a = {a: {b: 'c'}};
 * set(a, 'a.b[0]', 'c'); // a = {a: {b: ['c']}};
 * set(a, 'a.b[0].hello', 'c'); // a = {a: {b: [{hello:'c'}]}};
 *
 * // If fourth param (forceDelete) = true, and the third param = undefined, remove the value located at the end of the given path.
 * // a = {a: {b: 'c'}};
 * set(a, 'a.b', undefined, true); // a = {a: {} };
 *
 * @param {object|array} object The initial object
 * @param {string} path The path leading to the property to set. If anything in the path is undefined, it will be created.
 * @param {*} value The value to set.
 * @param {boolean} forceDelete Flag to determine if property should be deleted when set to undefined
 * @return {object|array} Returns the original object.
 */
export const set = (object, path, value = undefined, forceDelete= false) => {
    const keys = path.replace(/]/g,'').split(/[.[]/).filter(e => e !== '');
    const types = path.replace(/]/g,'').split(/[^.[]+/).filter(e => e !== '');

    // If the path starts with a square bracket, remove it since we don't care about
    // the type of the given object
    if (path.startsWith('[')) {
        types.shift();
    }

    let current = object;
    keys.forEach((key, i) => {
        if (i < keys.length - 1) {
            if (!current.hasOwnProperty(key)) {
                current[key] = types[i] === '.' ? {} : [];
            }
            current = current[key];
        } else {
            if (isUndefined(value) && forceDelete) {
                delete current[key];
            } else {
                current[key] = value;
            }
        }
    });
    return object;
};

export const EqualityIterators = {
    SHALLOW: (a, b) => a === b,
    DEEP: (a, b, visited = []) => {
        // We maintain a list of visited objects to prevent an infinite loop
        // caused by a circular reference
        if (visited.includes(a)) {
            return true;
        }
        if (a instanceof Object) {
            visited.push(a);
        }
        return isEqual(a, b, (a, b) => EqualityIterators.DEEP(a, b, visited))
    },
};

/**
 * Check whether the two given objects are equal, optionally invoking
 * a comparison function to apply on each element in the object.
 *
 * @example
 * isEqual({foo: {}}, {foo: {}}, EqualityIterators.DEEP); // true
 * isEqual({foo: {}}, {foo: {}}, EqualityIterators.SHALLOW); // false
 * isEqual({foo: 'bar'}, {}); // false (defaults to DEEP)
 *
 * @param {object} a
 * @param {object} b
 * @param {function} [iterator = EqualityIterators.DEEP]
 * @returns {boolean}
 */
export const isEqual = (a, b, iterator = EqualityIterators.DEEP) => {
    if (a === b) {
        return true;
    }

    if (getType(a) !== getType(b)) {
        return false;
    }

    if (isObject(a) && Object.keys(a).length === Object.keys(b).length) {
        return Object.keys(a).every(key => iterator(a[key], b[key]));
    }

    if (isArray(a) && a.length === b.length) {
        return a.every((item, i) => iterator(a[i], b[i]))
    }

    return false;
};

/**
 * Deep clone an object (or an array)
 *
 * @example
 * let obj1 = {foo: {bar: 'foobar'}};
 * clone(obj1) // Creates an object with the structure: {foo: {bar: 'foobar'}}
 *
 * @param {object} obj The object to be cloned.
 * @returns {object} A deep clone of the given object.
 */
export const clone = obj => (
    Object.keys(obj).reduce((acc, key) => {
        acc[key] = isObject(obj[key]) || isArray(obj[key]) ? clone(obj[key]) : obj[key];
        return acc;
    }, isArray(obj) ? [] : {})
);

/**
 * Delete a property from the given object/array at the given path.
 *
 * @example
 * const a = {a: {b: ['c']}};
 * omit(a, 'a.b'); // a = {a: {}};
 * omit(a, 'a.b[0]'); // a = {a: {b: []}};
 *
 *
 * @param {object} obj The object to set the property for. The object can contain arrays or any other type, but the outer-most section of the element must be an object.
 * @param {...string} keys The paths to omit from object
 * @return {object|array} Returns a new version of the object, now altered.
 */
export const omit = (obj, ...keys) => (
    keys.length ? keys
            .filter(key => isString(key))
            .reduce((newObj, path) => set(newObj, path, undefined, true), clone(obj))
        : obj
);