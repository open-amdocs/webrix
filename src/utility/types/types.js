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

export const Types = {
    NUMBER: 'number',
    OBJECT: 'object',
    NULL: 'null',
    ARRAY: 'array',
    UNDEFINED: 'undefined',
    BOOLEAN: 'boolean',
    STRING: 'string',
    DATE: 'date',
};

/**
 * Get the type of the given variable.
 * Returns one of js primitive types as a string ('object', 'array', 'null', 'undefined', 'string', 'number', 'boolean')
 *
 * @param {*} v
 * @returns {string}
 */
export const getType = v => Object.prototype.toString.call(v).slice(8, -1).toLowerCase();

/**
 * Check whether the given variable is of one of the given types.
 *
 * @param {*} v
 * @param {...string} types
 * @returns {boolean}
 */
export const isType = (v, ...types) => types.includes(getType(v));

/**
 * Check whether the given variable is of type number.
 *
 * @param {*} v
 * @returns {boolean}
 */
export const isNumber = v => !isNaN(v) && isType(v, Types.NUMBER);

/**
 * Check whether the given variable is of type object.
 *
 * @param {*} v
 * @returns {boolean}
 */
export const isObject = v => isType(v, Types.OBJECT);

/**
 * Check whether the given variable is of type null.
 *
 * @param {*} v
 * @returns {boolean}
 */
export const isNull = v => isType(v, Types.NULL);

/**
 * Check whether the given variable is of type array.
 *
 * @param {*} v
 * @returns {boolean}
 */
export const isArray = v => isType(v, Types.ARRAY);

/**
 * Check whether the given variable is of type undefined.
 *
 * @param {*} v
 * @returns {boolean}
 */
export const isUndefined = v => isType(v, Types.UNDEFINED);

/**
 * Check whether the given variable is of type boolean.
 *
 * @param {*} v
 * @returns {boolean}
 */
export const isBoolean = v => isType(v, Types.BOOLEAN);

/**
 * Check whether the given variable is of type string.
 *
 * @param {*} v
 * @returns {boolean}
 */
export const isString = v => isType(v, Types.STRING);

/**
 * Check whether the given variable is of type Date.
 *
 * @param {*} v
 * @returns {boolean}
 */
export const isDate = v => isType(v, Types.DATE);

/**
 * Check whether the given variable is empty.
 * Returns true for: null, undefined, '', [], {}
 *
 * @param {*} v
 * @returns {boolean}
 */
export const isEmpty = v =>
    v === null ||
    v === undefined ||
    v === '' ||
    (isType(v, Types.ARRAY, Types.OBJECT) && Object.keys(v).length === 0);

/**
 * If the given variable is not an array, returns the value wrapped with an array.
 * Returns an empty array for: null, undefined
 *
 * @param {*} o
 * @returns {array}
 */
export const toArray = o => {
    if (Array.isArray(o)) {
        return o;
    }

    return o !== undefined && o !== null ? [o] : [];
};
