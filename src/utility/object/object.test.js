import {expect} from 'chai';
import {get, set, isEqual, omit, clone} from './object';

describe('Object', () => {

    it('get()', () => {
        const data = {foo: [{bar: {foobar: 'foobar', empty: null}}]};

        expect(get(data, 'foo')).to.eql(data.foo);
        expect(get(data, 'foo.0')).to.eql(data.foo[0]);
        expect(get(data, 'foo[0]')).to.eql(data.foo[0]);
        expect(get(data, 'foo[0].bar')).to.eql(data.foo[0].bar);
        expect(get(data, 'foo[0][bar]')).to.eql(data.foo[0].bar);
        expect(get(data, 'foo[0].bar.foobar')).to.eql(data.foo[0].bar.foobar);
        expect(get(data, 'foo[0][bar][foobar]')).to.eql(data.foo[0].bar.foobar);
        expect(get(data, 'foo[0].bar.empty')).to.eql(null);
        expect(get(data, 'foo[1].bar.empty')).to.eql(undefined);
        expect(get(data.foo, '[0]')).to.eql(data.foo[0]);
        expect(get(data.foo, '[0].bar')).to.eql(data.foo[0].bar);

        // Test primitive data types
        expect(get({})).to.eql(undefined);
        expect(get({}, 'id')).to.eql(undefined);
        expect(get(data, 'bar')).to.eql(undefined);
        expect(get(data, 'null')).to.eql(undefined);
        expect(get(data, '0')).to.eql(undefined);
        expect(get(data, 'false')).to.eql(undefined);
        expect(get(data, '')).to.eql(data);
        expect(get(data, '5.2')).to.eql(undefined);
        expect(get(data, 'string')).to.eql(undefined);
        expect(get(data, null)).to.eql(undefined);
        expect(get(data, undefined)).to.eql(undefined);
        expect(get(null, 'id')).to.eql(undefined);
        expect(get({null: 'null', id: 'test'}, 'id')).to.eql('test');
        expect(get({null: 'null', id: 'test'}, 'null')).to.eql('null');
        expect(get({undefined: 'test', name: 'jack'}, 'name')).to.eql('jack');

        //default value check
        expect(get({}, 'name', 'default')).to.eql('default');
        expect(get(null, 'name', 'default')).to.eql('default');
        expect(get(undefined, 'name', 'default')).to.eql('default');
        expect(get({name: undefined}, 'name', 'default')).to.eql('default');
        expect(get({name: undefined}, 'name')).to.eql(undefined);
        expect(get({name: 0}, 'name', 'default')).to.eql(0);
        expect(get({name: ''}, 'name', 'default')).to.eql('');
        expect(get({name: false}, 'name', 'default')).to.eql(false);
        expect(get({name: null}, 'name', 'default')).to.eql(null);
        expect(get({name: 'Jack'}, 'name', 'default')).to.eql('Jack');
    });

    it('set()', () => {
        expect(set({}, 'foo', 'bar')).to.eql({foo: 'bar'});
        expect(set({foo: 'foo'}, 'foo', 'bar')).to.eql({foo: 'bar'});
        expect(set({}, 'foo', 'bar')).to.eql({foo: 'bar'});
        expect(set({}, 'foo.bar', 'bar')).to.eql({foo: {bar: 'bar'}});
        expect(set({}, 'foo.bar[0]', 'bar')).to.eql({foo: {bar: ['bar']}});
        expect(set({}, 'foo.bar[0].foo', 'bar')).to.eql({foo: {bar: [{foo: 'bar'}]}});
        expect(set({}, 'foo.bar[0][0]', 'bar')).to.eql({foo: {bar: [['bar']]}});
        expect(set({}, 'foo.bar[1]', 'bar')).to.eql({foo: {bar: [undefined, 'bar']}});
        expect(set([], '[0]', 'bar')).to.eql(['bar']);
        expect(set([], '[0][0]', 'bar')).to.eql([['bar']]);
    });

    it('isEqual()', () => {
        expect(isEqual(1, 1)).to.eql(true);
        expect(isEqual(true, false)).to.eql(false);
        expect(isEqual('hello', 'hello')).to.eql(true);
        expect(isEqual([1, 2, 3], [1, 2, 3])).to.eql(true);
        expect(isEqual([1, 2, 3], [3, 2, 1])).to.eql(false);
        expect(isEqual([{id: 1}], [{id: 2}])).to.eql(false);
        expect(isEqual({foo: 'bar'}, {foo: 'bar'})).to.eql(true);
        expect(isEqual({foo: 'bar'}, {bar: 'foo'})).to.eql(false);
        expect(isEqual({foo: [1, 2, {a: 1}]}, {foo: [1, 2, {a: 1}]})).to.eql(true);
        expect(isEqual({foo: [1, 2, {a: 1}]}, {foo: [1, 2, {a: 2}]})).to.eql(false);

        /* Check Circular Traversal */
        const sub1 = {foo: [1, 2, {a: 1}]};
        const sub2 = {foo: [1, 2, {a: 1}]};
        const parent1 = {foo: [1, 2, {a: 1}], sub1, sub2};
        const parent2 = {foo: [1, 2, {a: 1}], sub1, sub2};
        parent1.aaa = parent2;
        parent1.bbb = parent1;
        parent2.aaa = parent1;
        parent2.bbb = parent2;
        expect(isEqual(parent1, parent2)).to.eql(true);
        parent2.ccc = 6;
        expect(isEqual(parent1, parent2)).to.eql(false);
    });

    it('clone()', () => {
        const source = {foo: 1, bar: 'hello', baz: {baq: 23, test: [1, 2, 3]}};
        const target = clone(source);

        expect(source).to.eql(target);
        expect(source === target).to.eql(false);
        expect(source.baz === target.baz).to.eql(false);
        expect(source.baz.test === target.baz.test).to.eql(false);

        expect([1, 2, 3]).to.eql(clone([1, 2, 3]));
        expect([{foo: 'bar'}, {}, 'foo', []]).to.eql(clone([{foo: 'bar'}, {}, 'foo', []]));
        expect([{foo: {bar: 'foobar'}}, {foo: [1, 2, 3]}]).to.eql(clone([{foo: {bar: 'foobar'}}, {foo: [1, 2, 3]}]));
        expect({foo: {bar: 'foobar'}, bar: []}).to.eql(clone({foo: {bar: 'foobar'}, bar: []}));
    });

    it('omit()', () => {
        const obj = {a: 1, b: 2, c: {d: {e: 3}}, f: [{g: 4}, {h: 5}]};

        expect(omit()).to.eql(undefined);
        expect(omit({})).to.eql({});
        expect(omit(obj)).to.eql(obj);
        expect(omit(obj, 'a')).to.not.have.property('a');
        expect(omit(obj, 'a', 'b')).to.eql({c: {d: {e: 3}}, f: [{g: 4}, {h: 5}]});
        expect(omit(obj, 'a', 'b', 'c.d')).to.eql({c: {}, f: [{g: 4}, {h: 5}]});
        expect(omit(obj, 'a', 'b', 'c.d.e')).to.eql({c: {d: {}}, f: [{g: 4}, {h: 5}]});
        expect(omit(obj, 'f[0]')).to.eql({a: 1, b: 2, c: {d: {e: 3}}, f: [undefined, {h: 5}]});
        expect(omit(obj, 'f[0].g')).to.eql({a: 1, b: 2, c: {d: {e: 3}}, f: [{}, {h: 5}]});
    });
});
