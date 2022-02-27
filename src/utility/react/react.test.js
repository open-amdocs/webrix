import React from 'react';
import sinon from 'sinon';
import {copyComponentRef, findChildByType, findChildrenByType, memoizeChildren} from './react';

describe('React', () => {
    it('copyComponentRef()', () => {
        const node = 'mock', internal = {current: null};
        let external = {current: null};

        copyComponentRef(external, internal)(node)
        expect(internal.current).toEqual(node);
        expect(external.current).toEqual(node);

        external = sinon.spy();
        internal.current = null;
        copyComponentRef(external, internal)(node)
        expect(internal.current).toEqual(node);
        expect(external.calledOnce).toEqual(true);

        external = null;
        internal.current = null;
        copyComponentRef(external, internal)(node)
        expect(internal.current).toEqual(node);
        expect(external).toEqual(null);
    });

    it('findChildByType()', () => {
        const ChildA = () => null;
        const ChildB = () => null;
        expect(findChildByType(React.createElement(ChildA), ChildA).type).toEqual(ChildA);
        expect(findChildByType(React.createElement(ChildA), ChildB)).toEqual(undefined);
        expect(findChildByType([
            React.createElement(ChildA),
            React.createElement(ChildB),
        ], ChildB).type).toEqual(ChildB);
        expect(() => findChildByType(React.createElement(ChildA), ChildB, true)).toThrow();
    });

    it('findChildrenByType()', () => {
        const ChildA = () => null;
        const ChildB = () => null;
        const ElemA = React.createElement(ChildA);
        const ElemB = React.createElement(ChildB, {}, ElemA);
        expect(findChildrenByType(ChildA, ElemA)[0].type).toEqual(ChildA);

        const res = findChildrenByType(ChildA, [ElemB, ElemB, ElemB]);
        expect(res.length).toEqual(3);
        expect(res.some(ch => ch.type !== ChildA)).toEqual(false);
    });

    it('memoizeChildren()', () => {
        expect(memoizeChildren({a: {}}, {a: {}})).toEqual(false);
        expect(memoizeChildren({a: 1, b: 2, c: '3'}, {a: 1, b: 2, c: '3'})).toEqual(true);
        expect(memoizeChildren({a: 1, b: 2, c: '3'}, {a: 1, b: 2, c: '4'})).toEqual(false);

        expect(memoizeChildren({children: 'Child 1'}, {children: 'Child 1'})).toEqual(true);
        expect(memoizeChildren({children: 'Child 1'}, {children: 'Child 2'})).toEqual(false);

        expect(memoizeChildren({children: 0}, {children: 0})).toEqual(true);
        expect(memoizeChildren({children: 0}, {children: 1})).toEqual(false);

        expect(memoizeChildren({children: ['Child 1']}, {children: ['Child 1']})).toEqual(true);
        expect(memoizeChildren({children: ['Child 1']}, {children: ['Child 2']})).toEqual(false);

        expect(memoizeChildren({children: [[1, 2, 3]]}, {children: [[1, 2, 3]]})).toEqual(true);
        expect(memoizeChildren({children: [[1, 2, 3]]}, {children: [[1, 2, 4]]})).toEqual(false);

        expect(
            memoizeChildren({children: ['Child 1', null, false, undefined]}, {children: ['Child 1', null, false, undefined]})
        ).toEqual(true);
        expect(
            memoizeChildren({children: ['Child 1', null, false, undefined]}, {children: ['Child 1', null, true, undefined]})
        ).toEqual(true);
        expect(
            memoizeChildren({children: ['Child 1', null, false, undefined]}, {children: ['Child 1']})
        ).toEqual(true);
        expect(
            memoizeChildren({children: ['Child 1', null, false, undefined]}, {children: ['Child 2']})
        ).toEqual(false);

        expect(
            memoizeChildren({children: <div {...{a: 1, b: 2}}/>}, {children: <div {...{a: 1, b: 2}}/>})
        ).toEqual(true);
        expect(
            memoizeChildren({children: <div {...{a: 1, b: 2}}/>}, {children: <div {...{a: 1, b: 3}}/>})
        ).toEqual(false);

        expect(
            memoizeChildren({children: <div><div {...{a: 1, b: 2}}/></div>}, {children: <div><div {...{a: 1, b: 2}}/></div>})
        ).toEqual(true);
        expect(
            memoizeChildren({children: <div><div {...{a: 1, b: 2}}/></div>}, {children: <div><div {...{a: 1, b: 3}}/></div>})
        ).toEqual(false);

        expect(
            memoizeChildren({children: [<div {...{a: 1, b: 2}}/>]}, {children: [<div {...{a: 1, b: 2}}/>]})
        ).toEqual(true);
        expect(
            memoizeChildren({children: [<div {...{a: 1, b: 2}}/>]}, {children: [<div {...{a: 1, b: 3}}/>]})
        ).toEqual(false);

        expect(
            memoizeChildren({children: [<div {...{a: 1, b: 2}}/>, 'child 2']}, {children: [<div {...{a: 1, b: 2}}/>, 'child 2']})
        ).toEqual(true);
        expect(
            memoizeChildren({children: [<div {...{a: 1, b: 2}}/>, 'child 2']}, {children: [<div {...{a: 1, b: 2}}/>, 'child 3']})
        ).toEqual(false);
    });
});
