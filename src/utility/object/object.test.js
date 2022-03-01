import {get, set, isEqual, omit, clone, EqualityIterators} from './object';

describe('Object', () => {

    it('get()', () => {
        const data = {foo: [{bar: {foobar: 'foobar', empty: null}}]};

        expect(get(data, 'foo')).toEqual(data.foo);
        expect(get(data, 'foo.0')).toEqual(data.foo[0]);
        expect(get(data, 'foo[0]')).toEqual(data.foo[0]);
        expect(get(data, 'foo[0].bar')).toEqual(data.foo[0].bar);
        expect(get(data, 'foo[0][bar]')).toEqual(data.foo[0].bar);
        expect(get(data, 'foo[0].bar.foobar')).toEqual(data.foo[0].bar.foobar);
        expect(get(data, 'foo[0][bar][foobar]')).toEqual(data.foo[0].bar.foobar);
        expect(get(data, 'foo[0].bar.empty')).toEqual(null);
        expect(get(data, 'foo[1].bar.empty')).toEqual(undefined);
        expect(get(data.foo, '[0]')).toEqual(data.foo[0]);
        expect(get(data.foo, '[0].bar')).toEqual(data.foo[0].bar);

        // Test primitive data types
        expect(get({})).toEqual(undefined);
        expect(get({}, 'id')).toEqual(undefined);
        expect(get(data, 'bar')).toEqual(undefined);
        expect(get(data, 'null')).toEqual(undefined);
        expect(get(data, '0')).toEqual(undefined);
        expect(get(data, 'false')).toEqual(undefined);
        expect(get(data, '')).toEqual(data);
        expect(get(data, '5.2')).toEqual(undefined);
        expect(get(data, 'string')).toEqual(undefined);
        expect(get(data, null)).toEqual(undefined);
        expect(get(data, undefined)).toEqual(undefined);
        expect(get(null, 'id')).toEqual(undefined);
        expect(get({null: 'null', id: 'test'}, 'id')).toEqual('test');
        expect(get({null: 'null', id: 'test'}, 'null')).toEqual('null');
        expect(get({undefined: 'test', name: 'jack'}, 'name')).toEqual('jack');

        //default value check
        expect(get({}, 'name', 'default')).toEqual('default');
        expect(get(null, 'name', 'default')).toEqual('default');
        expect(get(undefined, 'name', 'default')).toEqual('default');
        expect(get({name: undefined}, 'name', 'default')).toEqual('default');
        expect(get({name: undefined}, 'name')).toEqual(undefined);
        expect(get({name: 0}, 'name', 'default')).toEqual(0);
        expect(get({name: ''}, 'name', 'default')).toEqual('');
        expect(get({name: false}, 'name', 'default')).toEqual(false);
        expect(get({name: null}, 'name', 'default')).toEqual(null);
        expect(get({name: 'Jack'}, 'name', 'default')).toEqual('Jack');
    });

    it('set()', () => {
        expect(set({}, 'foo', 'bar')).toEqual({foo: 'bar'});
        expect(set({foo: 'foo'}, 'foo', 'bar')).toEqual({foo: 'bar'});
        expect(set({}, 'foo', 'bar')).toEqual({foo: 'bar'});
        expect(set({}, 'foo.bar', 'bar')).toEqual({foo: {bar: 'bar'}});
        expect(set({}, 'foo.bar[0]', 'bar')).toEqual({foo: {bar: ['bar']}});
        expect(set({}, 'foo.bar[0].foo', 'bar')).toEqual({foo: {bar: [{foo: 'bar'}]}});
        expect(set({}, 'foo.bar[0][0]', 'bar')).toEqual({foo: {bar: [['bar']]}});
        expect(set({}, 'foo.bar[1]', 'bar')).toEqual({foo: {bar: [undefined, 'bar']}});
        expect(set([], '[0]', 'bar')).toEqual(['bar']);
        expect(set([], '[0][0]', 'bar')).toEqual([['bar']]);
    });

    it('isEqual()', () => {
        expect(isEqual(1, 1)).toEqual(true);
        expect(isEqual(true, false)).toEqual(false);
        expect(isEqual('hello', 'hello')).toEqual(true);
        expect(isEqual([1, 2, 3], [1, 2, 3])).toEqual(true);
        expect(isEqual([1, 2, 3], [3, 2, 1])).toEqual(false);
        expect(isEqual([{id: 1}], [{id: 2}])).toEqual(false);
        expect(isEqual({foo: 'bar'}, {foo: 'bar'})).toEqual(true);
        expect(isEqual({foo: 'bar'}, {bar: 'foo'})).toEqual(false);
        expect(isEqual({foo: [1, 2, {a: 1}]}, {foo: [1, 2, {a: 1}]})).toEqual(true);
        expect(isEqual({foo: [1, 2, {a: 1}]}, {foo: [1, 2, {a: 2}]})).toEqual(false);

        /* Check Circular Traversal */
        const sub1 = {foo: [1, 2, {a: 1}]};
        const sub2 = {foo: [1, 2, {a: 1}]};
        const parent1 = {foo: [1, 2, {a: 1}], sub1, sub2};
        const parent2 = {foo: [1, 2, {a: 1}], sub1, sub2};
        parent1.aaa = parent2;
        parent1.bbb = parent1;
        parent2.aaa = parent1;
        parent2.bbb = parent2;
        expect(isEqual(parent1, parent2)).toEqual(true);
        parent2.ccc = 6;
        expect(isEqual(parent1, parent2)).toEqual(false);
    });

    it('isEqual() with shallow comparison', () => {
        expect(isEqual(1, 1, EqualityIterators.SHALLOW)).toEqual(true);
        expect(isEqual(true, false, EqualityIterators.SHALLOW)).toEqual(false);
        expect(isEqual('hello', 'hello', EqualityIterators.SHALLOW)).toEqual(true);
        expect(isEqual([1, 2, 3], [1, 2, 3], EqualityIterators.SHALLOW)).toEqual(true);
        expect(isEqual([1, 2, 3], [3, 2, 1], EqualityIterators.SHALLOW)).toEqual(false);
        expect(isEqual([{id: 1}], [{id: 2}], EqualityIterators.SHALLOW)).toEqual(false);
        expect(isEqual({foo: 'bar'}, {foo: 'bar'}, EqualityIterators.SHALLOW)).toEqual(true);
        expect(isEqual({foo: 'bar'}, {bar: 'foo'}, EqualityIterators.SHALLOW)).toEqual(false);
        expect(isEqual({foo: [1, 2, {a: 1}]}, {foo: [1, 2, {a: 1}]}, EqualityIterators.SHALLOW)).toEqual(false);
        expect(isEqual({foo: [1, 2, {a: 1}]}, {foo: [1, 2, {a: 2}]}, EqualityIterators.SHALLOW)).toEqual(false);

        /* Check Circular Traversal */
        const sub1 = {foo: [1, 2, {a: 1}]};
        const sub2 = {foo: [1, 2, {a: 1}]};
        const parent1 = {foo: [1, 2, {a: 1}], sub1, sub2};
        const parent2 = {foo: [1, 2, {a: 1}], sub1, sub2};
        parent1.aaa = parent2;
        parent1.bbb = parent1;
        parent2.aaa = parent1;
        parent2.bbb = parent2;
        expect(isEqual(parent1, parent2, EqualityIterators.SHALLOW)).toEqual(false);
        parent2.ccc = 6;
        expect(isEqual(parent1, parent2, EqualityIterators.SHALLOW)).toEqual(false);
    });

    it('clone()', () => {
        const source = {foo: 1, bar: 'hello', baz: {baq: 23, test: [1, 2, 3]}};
        const target = clone(source);

        expect(source).toEqual(target);
        expect(source === target).toEqual(false);
        expect(source.baz === target.baz).toEqual(false);
        expect(source.baz.test === target.baz.test).toEqual(false);

        expect([1, 2, 3]).toEqual(clone([1, 2, 3]));
        expect([{foo: 'bar'}, {}, 'foo', []]).toEqual(clone([{foo: 'bar'}, {}, 'foo', []]));
        expect([{foo: {bar: 'foobar'}}, {foo: [1, 2, 3]}]).toEqual(clone([{foo: {bar: 'foobar'}}, {foo: [1, 2, 3]}]));
        expect({foo: {bar: 'foobar'}, bar: []}).toEqual(clone({foo: {bar: 'foobar'}, bar: []}));
    });

    it('omit()', () => {
        const obj = {a: 1, b: 2, c: {d: {e: 3}}, f: [{g: 4}, {h: 5}]};

        expect(omit()).toEqual(undefined);
        expect(omit({})).toEqual({});
        expect(omit(obj)).toEqual(obj);
        expect(omit(obj, 'a')).not.toHaveProperty('a');
        expect(omit(obj, 'a', 'b')).toEqual({c: {d: {e: 3}}, f: [{g: 4}, {h: 5}]});
        expect(omit(obj, 'a', 'b', 'c.d')).toEqual({c: {}, f: [{g: 4}, {h: 5}]});
        expect(omit(obj, 'a', 'b', 'c.d.e')).toEqual({c: {d: {}}, f: [{g: 4}, {h: 5}]});
        expect(omit(obj, 'f[0]')).toEqual({a: 1, b: 2, c: {d: {e: 3}}, f: [undefined, {h: 5}]});
        expect(omit(obj, 'f[0].g')).toEqual({a: 1, b: 2, c: {d: {e: 3}}, f: [{}, {h: 5}]});
    });
});
