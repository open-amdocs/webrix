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

import React, {useState, memo, forwardRef} from 'react';
import {getCurrentBreakpoint} from 'utility/screen';
import {isEmpty} from 'utility/types';
import Poppable from '../../Poppable';
import {propTypes, defaultProps} from './Adjustable.props';
import AdjustableContext from './Adjustable.context';
import './Adjustable.scss';

export const AdjustablePoppable = forwardRef(({style, sizes, ...props}, ref) => {
    const [boundingRect, setBoundingRect] = useState({});
    const [placement, setPlacement] = useState();
    const _sizes = sizes[getCurrentBreakpoint()];
    return (
        <AdjustableContext.Provider value={{boundingRect, setBoundingRect, sizes: _sizes, placement}}>
            <Poppable {...props} style={{...style, ..._sizes}} placement={isEmpty(boundingRect) ? placement : boundingRect} onPlacement={setPlacement} ref={ref}/>
        </AdjustableContext.Provider>
    );
});

AdjustablePoppable.displayName = 'Poppable.Adjustable';
AdjustablePoppable.propTypes = propTypes;
AdjustablePoppable.defaultProps = defaultProps;

export default memo(AdjustablePoppable);
