/**
 * Copyright (c) 2020, Amdocs Corp.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import React from 'react';
import {shallow, mount} from 'enzyme';
import {expect} from 'chai';
import sinon from 'sinon';
import {ScrollShadow, __RewireAPI__ as rewireAPI} from './Shadow';
import {getShadowCoefficient, getBoxShadow} from './Shadow.utils';
import {SHADOW_THRESHOLD} from './Shadow.constants';

describe('<Scrollbar.Shadow/>', () => {

    describe('HTML structure', () => {
        it('should render a ScrollShadow', () => {
            const wrapper = shallow(<ScrollShadow><div className='child'/></ScrollShadow>);
            expect(wrapper.find('.scroll-shadow')).to.have.length(1);
            expect(wrapper.find('.child')).to.have.length(1);
        });
    });

    describe('Events', () => {
        it('should render a Scrollbar', () => {
            const spy = sinon.spy();
            rewireAPI.__Rewire__('getBoxShadow', spy);
            const wrapper = mount(<ScrollShadow><div className='child' onScroll={() => null}/></ScrollShadow>);
            wrapper.find('.child').props().onScroll({});
            expect(spy.callCount).to.eql(1);
            rewireAPI.__ResetDependency__('getBoxShadow');
        });
    });

    describe('Utils', () => {
        it('getShadowCoefficient()', () => {
            expect(getShadowCoefficient(0)).to.eql(0);
            expect(getShadowCoefficient(30)).to.eql(30 / SHADOW_THRESHOLD);
            expect(getShadowCoefficient(SHADOW_THRESHOLD + 10)).to.eql(1);
        });
        it('getBoxShadow()', () => {
            const boxshadow = getBoxShadow({scrollTop: 0, scrollLeft: 0, scrollHeight: 100, scrollWidth: 100, clientHeight: 100, clientWidth: 100});
            expect(boxshadow.split(',').length).to.eql(40);
        });
    });
});
