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

import React, {useRef, forwardRef, memo, useCallback} from 'react';
import classNames from 'classnames';
import {copyComponentRef} from 'utility/react';
import puppet from 'tools/Puppeteer/Puppet.hoc';
import Puppeteer from 'tools/Puppeteer/Puppeteer';
import Stackable from '../Stackable';
import {usePosition} from './Poppable.hooks';
import {getClassNames, getBoundingRects} from './Poppable.utils';
import PoppableContext from './Poppable.context';
import {propTypes, defaultProps} from './Poppable.props';
import './Poppable.scss';

export const Poppable = forwardRef(({children, container, reference, placements, default: _default, onPlacement, placement, overflow, className, style, ...props}, ref) => {
    const target = useRef();
    const handleOnContextMenu = useCallback(e => e.stopPropagation(), []); // prevent onContextMenu event bubbling from the react portal to the react tree
    const rects = getBoundingRects(target, reference, container, placement);
    usePosition({target, container, reference, placements, default: _default, onPlacement, strategy: overflow});

    return (
        <Puppeteer.Break namespace='poppable'>
            <Stackable {...props} className={classNames('poppable', {[`placement-${placement.name}`]: placement.name}, className, getClassNames(rects.tbr, rects.rbr))} style={{...style, ...placement}}
                ref={copyComponentRef(ref, target)} parent={reference} onContextMenu={handleOnContextMenu}>
                <PoppableContext.Provider value={rects}>
                    {children}
                </PoppableContext.Provider>
            </Stackable>
        </Puppeteer.Break>
    );
});

Poppable.propTypes = propTypes;
Poppable.defaultProps = defaultProps;
Poppable.displayName = 'Poppable.Manual';

export default memo(puppet('poppable')(Poppable));
