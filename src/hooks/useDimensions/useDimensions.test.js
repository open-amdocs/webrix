import React from 'react';
import {act} from 'react-dom/test-utils';
import {expect} from 'chai';
import {mount} from 'enzyme';
import useDimensions from './useDimensions';

const Elem = () => {
    const {width, height} = useDimensions({current: {}});
    return (
        <div>{width},{height}</div>
    );
};

describe('useDimensions()', () => {
    it('Should return the previous value', async () => {
        let wrapper = null;
        let observed = 0, disconnected = 0;
        window.ResizeObserver = class {
            disconnect = () => disconnected++;
            observe = () => observed++;
        };
        act(() => {wrapper = mount(<Elem/>)});
        expect(wrapper.text()).to.eql('0,0');
        expect(observed).to.eql(1);
        expect(disconnected).to.eql(0);

        act(() => {wrapper.unmount()});
        expect(observed).to.eql(1);
        expect(disconnected).to.eql(1);
    });
});