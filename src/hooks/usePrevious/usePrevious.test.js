import React from 'react';
import {act} from 'react-dom/test-utils';
import {mount} from 'enzyme';
import usePrevious from './usePrevious';

let prev;
const Elem = ({next}) => {
    prev = usePrevious(next);
    return null;
};

describe('usePrevious()', () => {
    it('Should return the previous value', () => {
        let wrapper = null;
        act(() => {wrapper = mount(<Elem next={1}/>)});
        expect(prev).toEqual(1);

        wrapper.setProps({next: 2});
        expect(prev).toEqual(1);

        wrapper.setProps({next: 3});
        expect(prev).toEqual(2);
    });
});
