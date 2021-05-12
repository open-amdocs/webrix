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

import {node, func, shape, number, instanceOf, oneOfType} from 'prop-types';
import {noop} from 'utility/memory';
import strategy from './strategies';
import {HIDDEN_PLACEMENT} from './Poppable.constants';

export const propTypes = {
    container: oneOfType([
        func,
        shape({current: oneOfType([instanceOf(Element), instanceOf(window.constructor)])}),
    ]),
    reference: oneOfType([
        func,
        instanceOf(DOMRect),
        shape({current: instanceOf(Element)}),
    ]),
    placements: func,
    placement: shape({
        top: number,
        left: number,
    }),
    overflow: func,
    onPlacement: func,
    default: number,
    children: node,
};

export const defaultProps = {
    container: window,
    reference: document.body,
    placements: () => [{top: 0, left: 0}],
    placement: HIDDEN_PLACEMENT,
    overflow: strategy,
    onPlacement: noop,
    default: 0,
    children: null,
};
