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

import React, {useContext, useRef} from 'react';
import cls from 'classnames';
import Draggable from 'components/Draggable';
import Context from '../Sortable.context';
import {propTypes, defaultProps} from './Item.props';
import './Item.scss';

const Item = ({children, index, ...props}) => {
    const ref = useRef();
    const context = useContext(Context);
    const source = Draggable.useSource({
        data: {index},
        onBeginDrag: () => {
            context.sort.current.from = index;
            context.sort.current.displacement = ref.current.getBoundingClientRect().height;
            context.onBeginSort();
        },
        onDrop: () => {
            context.sort.current = {};
            context.onEndSort();
        },
    });
    const target = Draggable.useTarget({
        data: {index},
        onBeginHover: source => {
            // When swapping, the dragged element moves below the clone, triggering a 'mouseover'
            // event on itself. To prevent an infinite loop, we verify that the dragged item is not the target.
            if (source.data.index !== index && context.sort.current.to !== index) {
                context.sort.current.to = index;
                context.onSort(context.sort.current)
                context.sort.current.from = index;
            }
        },
    });
    const combined = Draggable.useCombined(source, target);
    return (
        <Draggable {...props} {...combined} className={cls('sortable-item', props.className)} ref={ref}>
            {children}
        </Draggable>
    );
};

Item.propTypes = propTypes;
Item.defaultProps = defaultProps;

export default Item;