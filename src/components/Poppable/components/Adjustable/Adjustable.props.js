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

import {propTypes as _propTypes, defaultProps as _defaultProps} from '../../Poppable.props';
import {Breakpoints} from 'utility/screen';
import {shape, number} from 'prop-types';

export const propTypes = {
    ..._propTypes,
    sizes: shape(Object.keys(Breakpoints).reduce((acc, breakpoint) => {
        acc[breakpoint] = shape({
            minWidth: number,
            minHeight: number,
            maxWidth: number,
            maxHeight: number,
        });
        return acc;
    }, {})),
};

export const defaultProps = {
    ..._defaultProps,
    sizes: Object.keys(Breakpoints).reduce((acc, breakpoint) => ({...acc, [breakpoint]: {}}), {}),
};
