import React from 'react';
import {act} from 'react-dom/test-utils';
import {shallow} from 'enzyme';
import useObject from './useObject';

const Elem = ({object}) => {
    const obj = useObject(object);
    return (
        <div object={obj}/>
    );
};

describe('useObject()', () => {
    it('Should return the previous value', () => {
        let wrapper = null;
        const object = {foo: 'bar'};
        act(() => {wrapper = shallow(<Elem object={object}/>)});

        expect(wrapper.find('div').prop('object') === object).toEqual(true);
        wrapper.setProps({object: {foo: 'bar'}});
        expect(wrapper.find('div').prop('object') === object).toEqual(true);
        wrapper.setProps({object: {foo: 'bars'}});
        expect(wrapper.find('div').prop('object')).toEqual({foo: 'bars'});
        expect(wrapper.find('div').prop('object') === object).toEqual(false);
    });
});
