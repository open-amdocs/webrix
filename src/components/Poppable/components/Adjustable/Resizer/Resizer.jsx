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

import React, {memo, useCallback, useContext} from 'react';
import {node} from 'prop-types';
import Resizable from '../../../../Resizable';
import PoppableContext from '../../../Poppable.context';
import AdjustableContext from '../Adjustable.context';
import {getCurrentRect} from '../Adjustable.utils';
import {getRectWithinLimitsRange} from './Resizer.utils';

export const Resizer = ({children}) => {
    const {boundingRect, setBoundingRect, sizes} = useContext(AdjustableContext);
    const {tbr} = useContext(PoppableContext);

    const handleOnResize = useCallback(({delta}) => {
        const currentRect = getCurrentRect(boundingRect, tbr);
        const inRangeRect = getRectWithinLimitsRange(delta, currentRect, sizes);
        setBoundingRect({...inRangeRect});
    }, [setBoundingRect, boundingRect, tbr]);

    return (
        <Resizable onResize={handleOnResize}>
            {children || <Resizable.Resizer.All/>}
        </Resizable>
    );
};

Resizer.propTypes = {children: node};
Resizer.defaultProps = {children: null};
Resizer.displayName = 'Poppable.Adjustable.Resizer';

export default memo(Resizer);
