import {expect} from 'chai';
import {get} from './object';

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

});
