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
import Poppable, {NAMESPACE} from './Poppable';
import {propTypes, defaultProps} from './Poppable.props';

export const StatefulPoppable = forwardRef((props, ref) => {
    const [placement, setPlacement] = useState();

    return (
        <Poppable {...props} placement={placement} onPlacement={setPlacement} ref={ref}/>
    );
});

StatefulPoppable.propTypes = propTypes;
StatefulPoppable.defaultProps = defaultProps;
StatefulPoppable.displayName = NAMESPACE.replace(/({{PREFIX}}.)/, v => v.toUpperCase());

export default memo(StatefulPoppable);
