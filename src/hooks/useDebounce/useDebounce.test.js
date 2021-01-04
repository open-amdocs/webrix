import React, {useEffect, useState} from 'react';
import {act} from 'react-dom/test-utils';
import {expect} from 'chai';
import {mount} from 'enzyme';
import useDebounce from './useDebounce';

const waitFor = delay => new Promise(resolve => setTimeout(resolve, delay));

const Elem = ({value}) => {
    const [classname, setClassname] = useState('');
    const debounce = useDebounce(value => {
        setClassname(value);
    }, 10);
    useEffect(() => {
        debounce(value);
    }, [value, debounce]);
    return (
        <div className={classname}/>
    );
};

describe('useDebounce()', () => {
    it('Should return the previous value', async () => {
        let wrapper = null;
        act(() => {wrapper = mount(<Elem value='one'/>)});
        expect(wrapper.find('.one').length).to.eql(0);
        await waitFor(20);
        wrapper.update();
        expect(wrapper.find('.one').length).to.eql(1);
    });
});