import React from 'react';
// https://reactjs.org/docs/hooks-faq.html#how-to-test-components-that-use-hooks
import { shallow} from 'enzyme';
import OverrideContext from 'hooks/useClickOutside/useClickOutside.context';
import {ClickOutside, ClickOutsideOverride} from './ClickOutside';

describe('ClickOutside', () => {
    it('<ClickOutside/>', () => {
        const wrapper = shallow(<ClickOutside><div/></ClickOutside>);
        expect(() => shallow(<ClickOutside/>)).toThrow();
        expect(typeof wrapper.find('div').prop('onMouseDownCapture')).toBe('function');
    });

    it('<ClickOutsideOverride/>', () => {
        const wrapper = shallow(<ClickOutsideOverride/>);
        expect(wrapper.find(OverrideContext.Provider)).toHaveLength(1);
    });
});
