import React from 'react';
import {mount} from 'enzyme';
import {noop} from 'utility/memory';
import Stackable from './Stackable';
import {DEFAULT_Z_INDEX} from './Stackable.constants';
import Context from './Stackable.context';
import {getAncestors} from './Stackable.utils';

describe('<Stackable/>', () => {
    describe('HTML structure', () => {
        it('should render a Stackable', () => {
            const wrapper = mount(<Stackable/>);

            expect(wrapper.find('.stackable')).toHaveLength(1);
            expect(wrapper.find('.depth-0')).toHaveLength(1);
        });
    });

    describe('Methods', () => {
        it('getProps()', () => {
            const initialValue = {depth: 100, register: noop};
            const sp = mount(<Context.Provider value={initialValue}><Stackable/></Context.Provider>);
            const el = sp.find(`.stackable.depth-${initialValue.depth}`);

            expect(el).toHaveLength(1);
            expect(el.props().style).toEqual({zIndex: DEFAULT_Z_INDEX});
        });

        it('should increment the depth of nested portals', () => {
            const initialValue = {depth: 100, ancestors: ''};
            const sp = mount(<Context.Provider value={initialValue}><Stackable><Stackable/></Stackable></Context.Provider>);

            expect(sp.find(`div.stackable.depth-${initialValue.depth}`)).toHaveLength(1);
            expect(sp.find(`div.stackable.depth-${initialValue.depth + 1}`)).toHaveLength(1);
        });

        it('should increment the depth of nested portals', () => {
            const parent = {current: {parentNode: {className: 'foobar'}}};
            const sp = mount(<Stackable parent={parent}><Stackable/></Stackable>);

            expect(sp.find('[data-ancestors=".foobar"]')).toHaveLength(1);
            expect(sp.find('[data-ancestors=".foobar .stackable.depth-0"]')).toHaveLength(1);
        });

        it('should create a path based on ancestors classnames up to the body', () => {
            const parent = {current: {parentNode: {className: 'bar', parentNode: {className: 'foo', parentNode: {tagName: 'BODY'}}}}};
            const sp = mount(<Stackable parent={parent}><Stackable/></Stackable>);
            expect(sp.find('[data-ancestors=".foo .bar .stackable.depth-0"]')).toHaveLength(1);
        });
    });

    describe('Utils', () => {
        it('getAncestors', () => {
            const parent = document.createElement('div');
            parent.className = 'stackable';
            parent.setAttribute('data-ancestors', 'test');
            const child = document.createElement('div');
            parent.append(child);
            expect(getAncestors(child)).toEqual('test');
            expect(getAncestors(parent)).toEqual('test');
            expect(getAncestors(document.createElement('div'))).toEqual('');
        });
    });
});
