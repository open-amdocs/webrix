import {Types, getType, isType, isArray, isBoolean, isNull, isNumber, isObject, isString, isUndefined, isDate, isEmpty, toArray} from './types';

describe('Types', () => {
    it('getType()', () => {
        expect(getType(undefined)).toEqual('undefined');
        expect(getType(null)).toEqual('null');
        expect(getType('hello')).toEqual('string');
        expect(getType(true)).toEqual('boolean');
        expect(getType({})).toEqual('object');
        expect(getType([])).toEqual('array');
        expect(getType(12)).toEqual('number');
    });
	
    it('isType()', () => {
        expect(isType('', Types.STRING, Types.NUMBER)).toEqual(true);
        expect(isType('', Types.NUMBER)).toEqual(false);

        // Types
        expect(isType('', Types.STRING)).toEqual(true);
        expect(isType(0, Types.NUMBER)).toEqual(true);
        expect(isType(undefined, Types.UNDEFINED)).toEqual(true);
        expect(isType(null, Types.NULL)).toEqual(true);
        expect(isType({}, Types.OBJECT)).toEqual(true);
        expect(isType([], Types.ARRAY)).toEqual(true);
        expect(isType(true, Types.BOOLEAN)).toEqual(true);
    });
	
    it('isArray()', () => {
        expect(isArray([])).toEqual(true);
        expect(isArray({})).toEqual(false);
    });
	
    it('isBoolean()', () => {
        expect(isBoolean(true)).toEqual(true);
        expect(isBoolean({})).toEqual(false);
    });
	
    it('isNull()', () => {
        expect(isNull(null)).toEqual(true);
        expect(isNull({})).toEqual(false);
    });
	
    it('isNumber()', () => {
        expect(isNumber(0)).toEqual(true);
        expect(isNumber({})).toEqual(false);
        expect(isNumber(NaN)).toEqual(false);
    });
	
    it('isObject()', () => {
        expect(isObject({})).toEqual(true);
        expect(isObject([])).toEqual(false);
    });
	
    it('isString()', () => {
        expect(isString('')).toEqual(true);
        expect(isString({})).toEqual(false);
    });
	
    it('isUndefined()', () => {
        expect(isUndefined(undefined)).toEqual(true);
        expect(isUndefined({})).toEqual(false);
    });
	
    it('isDate()', () => {
        expect(isDate(new Date())).toEqual(true);
        expect(isDate({})).toEqual(false);
    });
	
    it('isEmpty()', () => {
        expect(isEmpty(undefined)).toEqual(true);
        expect(isEmpty({})).toEqual(true);
        expect(isEmpty([])).toEqual(true);
        expect(isEmpty(null)).toEqual(true);
        expect(isEmpty('')).toEqual(true);
        expect(isEmpty({foo: 'bar'})).toEqual(false);
        expect(isEmpty([1,2,3])).toEqual(false);
        expect(isEmpty('foobar')).toEqual(false);
    });
	
    it('toArray()', () => {
        expect(toArray(undefined)).toEqual([]);
        expect(toArray(null)).toEqual([]);
        expect(toArray([{}])).toEqual([{}]);
        expect(toArray(false)).toEqual([false]);
        expect(toArray('')).toEqual(['']);
    });
});