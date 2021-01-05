import {expect} from 'chai';
import {Types, getType, isType, isArray, isBoolean, isNull, isNumber, isObject, isString, isUndefined, isDate, isEmpty, toArray} from './types';

describe('Types', () => {
    it('getType()', () => {
        expect(getType(undefined)).to.eql('undefined');
        expect(getType(null)).to.eql('null');
        expect(getType('hello')).to.eql('string');
        expect(getType(true)).to.eql('boolean');
        expect(getType({})).to.eql('object');
        expect(getType([])).to.eql('array');
        expect(getType(12)).to.eql('number');
    });
    it('isType()', () => {
        expect(isType('', Types.STRING, Types.NUMBER)).to.eql(true);
        expect(isType('', Types.NUMBER)).to.eql(false);

        // Types
        expect(isType('', Types.STRING)).to.eql(true);
        expect(isType(0, Types.NUMBER)).to.eql(true);
        expect(isType(undefined, Types.UNDEFINED)).to.eql(true);
        expect(isType(null, Types.NULL)).to.eql(true);
        expect(isType({}, Types.OBJECT)).to.eql(true);
        expect(isType([], Types.ARRAY)).to.eql(true);
        expect(isType(true, Types.BOOLEAN)).to.eql(true);
    });
    it('isArray()', () => {
        expect(isArray([])).to.eql(true);
        expect(isArray({})).to.eql(false);
    });
    it('isBoolean()', () => {
        expect(isBoolean(true)).to.eql(true);
        expect(isBoolean({})).to.eql(false);
    });
    it('isNull()', () => {
        expect(isNull(null)).to.eql(true);
        expect(isNull({})).to.eql(false);
    });
    it('isNumber()', () => {
        expect(isNumber(0)).to.eql(true);
        expect(isNumber({})).to.eql(false);
        expect(isNumber(NaN)).to.eql(false);
    });
    it('isObject()', () => {
        expect(isObject({})).to.eql(true);
        expect(isObject([])).to.eql(false);
    });
    it('isString()', () => {
        expect(isString('')).to.eql(true);
        expect(isString({})).to.eql(false);
    });
    it('isUndefined()', () => {
        expect(isUndefined(undefined)).to.eql(true);
        expect(isUndefined({})).to.eql(false);
    });
    it('isDate()', () => {
        expect(isDate(new Date())).to.eql(true);
        expect(isDate({})).to.eql(false);
    });
    it('isEmpty()', () => {
        expect(isEmpty(undefined)).to.eql(true);
        expect(isEmpty({})).to.eql(true);
        expect(isEmpty([])).to.eql(true);
        expect(isEmpty(null)).to.eql(true);
        expect(isEmpty('')).to.eql(true);
        expect(isEmpty({foo: 'bar'})).to.eql(false);
        expect(isEmpty([1,2,3])).to.eql(false);
        expect(isEmpty('foobar')).to.eql(false);
    });
    it('toArray()', () => {
        expect(toArray(undefined)).to.eql([]);
        expect(toArray(null)).to.eql([]);
        expect(toArray([{}])).to.eql([{}]);
        expect(toArray(false)).to.eql([false]);
        expect(toArray('')).to.eql(['']);
    });
});