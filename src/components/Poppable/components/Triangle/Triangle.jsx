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

import React, {useContext} from 'react';
import {number} from 'prop-types';
import PoppableContext from '../../Poppable.context';
import {ready, getLeft, getTop} from './Triangle.utils';
import './Triangle.scss';

const Arrow = ({size}) => {
    const {tbr, rbr} = useContext(PoppableContext);
    return !ready(tbr, rbr) ? null : (
        <div className='poppable-triangle' style={{
            top: getTop(tbr, rbr, size),
            left: getLeft(tbr, rbr, size),
            borderWidth: size,
        }}/>
    );
};

Arrow.propTypes = {
    size: number,
};

Arrow.defaultProps = {
    size: 0,
}

export default Arrow;
