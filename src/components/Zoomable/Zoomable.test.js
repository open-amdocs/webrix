import React from 'react';
import {shallow, mount} from 'enzyme';
import {expect} from 'chai';
import {Zoomable, __RewireAPI__ as rewire} from './Zoomable';

describe('Zoomable', () => {

    describe('HTML Structure', () => {
        it('should render Zoomable', () => {
            const wrapper = shallow(<Zoomable/>);
            expect(wrapper.find('.zoomable').length).to.eql(1);
            expect(wrapper.find('.zoomable-inner').length).to.eql(1);
            expect(wrapper.find('.zoomable-inner').get(0).props.style.transform).to.eql('scale(1, 1)');
        });
        it('should render scaled Zoomable', () => {
            const wrapper = shallow(<Zoomable zoomx={2} zoomy={3}/>);
            expect(wrapper.find('.zoomable-inner').get(0).props.style.transform).to.eql('scale(2, 3)');
        });
        it('should zoom', () => {
            const ref = {current: {style: {}, clientHeight: 100, clientWidth: 100}};
            rewire.__Rewire__('useRef', () => ref);
            const wrapper = shallow(
                <Zoomable zoomx={1.5} zoomy={1.5}/>
            );
            wrapper.find('ResizeObserver').prop('onResize')();
            expect(ref.current.style).to.eql({width: '150px', height: '150px'});
            rewire.__ResetDependency__('useRef');
        });
    });
});
