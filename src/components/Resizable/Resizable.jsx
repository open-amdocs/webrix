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

import React, {memo} from 'react';
import {propTypes, defaultProps} from './Resizable.props';
import './Resizable.scss';

export const NAMESPACE = '{{PREFIX}}resizable';

export const Resizable = ({onBeginResize, onResize, onEndResize, children}) => (
    React.Children.toArray(children).map(child => (
        React.cloneElement(child, {onBeginResize, onResize, onEndResize})
    ))
);

Resizable.propTypes = propTypes;
Resizable.defaultProps = defaultProps;
Resizable.displayName = NAMESPACE.replace(/({{PREFIX}}.)/, v => v.toUpperCase());

export default memo(Resizable);
