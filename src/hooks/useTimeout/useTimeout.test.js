import React, {useState} from 'react';
import {act} from 'react-dom/test-utils';
import {mount} from 'enzyme';
import useTimeout from './useTimeout';

const waitFor = delay => new Promise(resolve => setTimeout(resolve, delay));

const Elem = () => {
    const [classname, setClassname] = useState('first');
    const {start} = useTimeout(() => {
        setClassname('second');
    }, 0);
    return (
        <div className={classname} onClick={start}/>
    );
};

describe('useTimeout()', () => {
    it('Should return the previous value', async () => {
        await act(async () => {
            const wrapper = mount(<Elem/>);
            expect(wrapper.find('.first').length).toEqual(1);
            expect(wrapper.find('.second').length).toEqual(0);
            wrapper.find('.first').simulate('click');
            await waitFor(0);
            wrapper.update();
            expect(wrapper.find('.first').length).toEqual(0);
            expect(wrapper.find('.second').length).toEqual(1);
        });
    });
});