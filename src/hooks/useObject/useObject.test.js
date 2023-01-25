import React from 'react';
import {act} from 'react-dom/test-utils';
import {shallow} from 'enzyme';
import useObject from './useObject';

let obj;

const Elem = ({object}) => {
    obj = useObject(object);
    return null;
};

describe('useObject()', () => {
    it('Should return the previous value', () => {
        let wrapper = null;
        const object = {foo: 'bar'};
        act(() => {wrapper = shallow(<Elem object={object}/>)});

        expect(obj === object).toEqual(true);
        wrapper.setProps({object: {foo: 'bar'}});
        expect(obj === object).toEqual(true);
        wrapper.setProps({object: {foo: 'bars'}});
        expect(obj).toEqual({foo: 'bars'});
        expect(obj === object).toEqual(false);
    });
});
