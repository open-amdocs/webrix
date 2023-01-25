import React from 'react';
import {shallow} from 'enzyme';
import {Scalable, NAMESPACE, __RewireAPI__ as rewire} from './Scalable';

const SELECTOR = '.' + NAMESPACE;

describe('Scalable', () => {
    describe('HTML Structure', () => {
        it('should render Scalable', () => {
            const wrapper = shallow(<Scalable/>);
            expect(wrapper.find(SELECTOR).length).toEqual(1);
            expect(wrapper.find(SELECTOR + '-inner').length).toEqual(1);
            expect(wrapper.find(SELECTOR + '-inner').get(0).props.style.transform).toEqual('scale(1, 1)');
        });
        it('should render scaled Scalable', () => {
            const wrapper = shallow(<Scalable scalex={2} scaley={3}/>);
            expect(wrapper.find(SELECTOR + '-inner').get(0).props.style.transform).toEqual('scale(2, 3)');
        });
        it('should scale', () => {
            const ref = {current: {style: {}, clientHeight: 100, clientWidth: 100}};
            rewire.__Rewire__('useRef', () => ref);
            const wrapper = shallow(<Scalable scalex={1.5} scaley={1.5}/>);
            wrapper.find('ResizeObserver').prop('onResize')();
            expect(ref.current.style).toEqual({width: '150px', height: '150px'});
            rewire.__ResetDependency__('useRef');
        });
    });
});
