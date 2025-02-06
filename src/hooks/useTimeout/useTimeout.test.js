import React, {useState} from 'react';
import {act} from 'react-dom/test-utils';
import {mount} from 'enzyme';
import useTimeout from './useTimeout';

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

    beforeAll(() => {
        jest.useFakeTimers();
    });

    afterAll(() => {
        jest.useRealTimers();
    });

    it('Should return the previous value', async () => {
        jest.spyOn(global, 'setTimeout');
        const wrapper = mount(<Elem/>);
        expect(wrapper.find('.first').length).toEqual(1);
        expect(wrapper.find('.second').length).toEqual(0);

        await act(async () => {
            wrapper.find('.first').props().onClick();
            jest.runAllTimers();
        });

        expect(setTimeout).toHaveBeenCalledTimes(1);
        expect(setTimeout).toHaveBeenLastCalledWith(expect.any(Function), 0);

        wrapper.update();

        expect(wrapper.find('.first').length).toEqual(0);
        expect(wrapper.find('.second').length).toEqual(1);
    });
});