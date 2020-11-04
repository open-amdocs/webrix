import React from 'react';
import {expect} from 'chai';
import sinon from 'sinon';
import {copyComponentRef, findChildByType, findChildrenByType, memoizeChildren} from './react';

describe('React', () => {
    it('copyComponentRef()', () => {
        const node = 'mock', internal = {current: null};
        let external = {current: null};

        copyComponentRef(external, internal)(node)
        expect(internal.current).to.eql(node);
        expect(external.current).to.eql(node);

        external = sinon.spy();
        internal.current = null;
        copyComponentRef(external, internal)(node)
        expect(internal.current).to.eql(node);
        expect(external.calledOnce).to.eql(true);

        external = null;
        internal.current = null;
        copyComponentRef(external, internal)(node)
        expect(internal.current).to.eql(node);
        expect(external).to.eql(null);
    });

    it('findChildByType()', () => {
        const ChildA = () => null;
        const ChildB = () => null;
        expect(findChildByType(React.createElement(ChildA), ChildA).type).to.eql(ChildA);
        expect(findChildByType(React.createElement(ChildA), ChildB)).to.eql(undefined);
        expect(findChildByType([
            React.createElement(ChildA),
            React.createElement(ChildB),
        ], ChildB).type).to.eql(ChildB);
        expect(() => findChildByType(React.createElement(ChildA), ChildB, true)).to.throw();
    });

    it('findChildrenByType()', () => {
        const ChildA = () => null;
        const ChildB = () => null;
        const ElemA = React.createElement(ChildA);
        const ElemB = React.createElement(ChildB, {}, ElemA);
        expect(findChildrenByType(ChildA, ElemA)[0].type).to.eql(ChildA);

        const res = findChildrenByType(ChildA, [ElemB, ElemB, ElemB]);
        expect(res.length).to.eql(3);
        expect(res.some(ch => ch.type !== ChildA)).to.eql(false);
    });

    it('memoizeChildren()', () => {
        expect(memoizeChildren({a: {}}, {a: {}})).to.eql(false);
        expect(memoizeChildren({a: 1, b: 2, c: '3'}, {a: 1, b: 2, c: '3'})).to.eql(true);
        expect(memoizeChildren({a: 1, b: 2, c: '3'}, {a: 1, b: 2, c: '4'})).to.eql(false);

        expect(memoizeChildren({children: 'Child 1'}, {children: 'Child 1'})).to.eql(true);
        expect(memoizeChildren({children: 'Child 1'}, {children: 'Child 2'})).to.eql(false);

        expect(memoizeChildren({children: 0}, {children: 0})).to.eql(true);
        expect(memoizeChildren({children: 0}, {children: 1})).to.eql(false);

        expect(memoizeChildren({children: ['Child 1']}, {children: ['Child 1']})).to.eql(true);
        expect(memoizeChildren({children: ['Child 1']}, {children: ['Child 2']})).to.eql(false);

        expect(memoizeChildren({children: [[1, 2, 3]]}, {children: [[1, 2, 3]]})).to.eql(true);
        expect(memoizeChildren({children: [[1, 2, 3]]}, {children: [[1, 2, 4]]})).to.eql(false);

        expect(memoizeChildren({children: ['Child 1', null, false, undefined]}, {children: ['Child 1', null, false, undefined]})).to.eql(true);
        expect(memoizeChildren({children: ['Child 1', null, false, undefined]}, {children: ['Child 1', null, true, undefined]})).to.eql(true);
        expect(memoizeChildren({children: ['Child 1', null, false, undefined]}, {children: ['Child 1']})).to.eql(true);
        expect(memoizeChildren({children: ['Child 1', null, false, undefined]}, {children: ['Child 2']})).to.eql(false);

        expect(memoizeChildren({children: <div {...{a: 1, b: 2}}/>}, {children: <div {...{a: 1, b: 2}}/>})).to.eql(true);
        expect(memoizeChildren({children: <div {...{a: 1, b: 2}}/>}, {children: <div {...{a: 1, b: 3}}/>})).to.eql(false);

        expect(memoizeChildren({children: <div><div {...{a: 1, b: 2}}/></div>}, {children: <div><div {...{a: 1, b: 2}}/></div>})).to.eql(true);
        expect(memoizeChildren({children: <div><div {...{a: 1, b: 2}}/></div>}, {children: <div><div {...{a: 1, b: 3}}/></div>})).to.eql(false);

        expect(memoizeChildren({children: [<div {...{a: 1, b: 2}}/>]}, {children: [<div {...{a: 1, b: 2}}/>]})).to.eql(true);
        expect(memoizeChildren({children: [<div {...{a: 1, b: 2}}/>]}, {children: [<div {...{a: 1, b: 3}}/>]})).to.eql(false);

        expect(memoizeChildren({children: [<div {...{a: 1, b: 2}}/>, 'child 2']}, {children: [<div {...{a: 1, b: 2}}/>, 'child 2']})).to.eql(true);
        expect(memoizeChildren({children: [<div {...{a: 1, b: 2}}/>, 'child 2']}, {children: [<div {...{a: 1, b: 2}}/>, 'child 3']})).to.eql(false);
    });
});
