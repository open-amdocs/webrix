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

import {useContext, useCallback, useRef} from 'react';
import {noop} from 'utility/memory';
import {Context} from './Draggable.context';

export const useMonitor = () => {
    const state = useContext(Context);
};

export const useSource = ({data, onDrop = noop, canDrag = () => true}) => {
    const {setSource, getTarget} = useContext(Context);
    const source = useRef({data, onDrop, canDrag});
    return {
        onBeginDrag: useCallback(() => {
            setSource(source.current);
        }, []),
        onDrop: useCallback(() => {
            const target = getTarget();
            if (target) {
                target.onDrop(source.current.data);
                target.onEndHover(target.data);
                source.current.onDrop(target.data);
            }
            setSource(null);
        }, []),
        canDrag: e => {
            return source.current.canDrag(e);
        },
    };
};

export const useTarget = ({data, onDrop = noop, onBeginHover = noop, onEndHover = noop}) => {
    const {setTarget, getSource} = useContext(Context);
    const target = useRef({data, onDrop, onBeginHover, onEndHover});
    return {
        onBeginHover: useCallback(() => {
            setTarget(target.current);
            const source = getSource();
            if (source) { // Hover can occur without dragging, in which case source will be null
                target.current.onBeginHover(source.data);
            }
        }, []),
        onEndHover: useCallback(() => {
            const source = getSource();
            if (source) { // Hover can occur without dragging, in which case source will be null
                target.current.onEndHover(source.data);
            }
            setTarget(null);
        }, []),
        canDrag: () => false,
    }
};