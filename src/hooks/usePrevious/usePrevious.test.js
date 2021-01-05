import React, {useState} from 'react';
import {act} from 'react-dom/test-utils';
import {expect} from 'chai';
import {shallow} from 'enzyme';
import usePrevious from './usePrevious';

const Elem = ({next}) => {
    const prev = usePrevious(next);
    const [counter, setCounter] = useState(0);
    return (
        <div className={`prev ${counter}`} onClick={() => setCounter(counter + 1)}>{prev}</div>
    );
};

describe('usePrevious()', () => {
    it('Should return the previous value', () => {
        let wrapper = null;
        act(() => {wrapper = shallow(<Elem next={1}/>)});
        expect(wrapper.find('.prev').text()).to.eql('1');
    });
});
