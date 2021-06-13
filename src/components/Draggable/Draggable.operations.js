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

import Movable from '../Movable';

export const update = ({ref, setRect, canDrag, onBeginDrag, onDrag, onDrop, context}) => Movable.Operations.createOperation({
    onBeginMove: (e, shared) => {
        context.event.current = e;
        shared.canDrag = canDrag();
        if (shared.canDrag) {
            e.stopPropagation(); // Allow nested draggable by preventing the event from bubbling up
            onBeginDrag();
        }
    },
    onMove: (e, shared) => {
        context.event.current = e;
        if (shared.canDrag) {
            onDrag();
            setRect({...shared.next});
            ref.current.classList.add('dragging');
        }
    },
    onEndMove: (e, shared) => {
        context.event.current = e;
        if (shared.canDrag) {
            onDrop();
            setRect(null);
            ref.current.classList.remove('dragging');
        }
        context.event.current = {};
    },
});