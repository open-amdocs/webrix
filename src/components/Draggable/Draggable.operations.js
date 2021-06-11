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

export const update = (ref, setRect, canDrag, onBeginDrag, onDrag, onDrop) => Movable.Operations.createOperation({
    onBeginMove: (e, shared) => {
        shared.canDrag = canDrag(e);
        if (shared.canDrag) {
            onBeginDrag(e);
        }
    },
    onMove: (e, shared) => {
        if (shared.canDrag) {
            onDrag(e);
            setRect({...shared.next});
            ref.current.classList.add('dragging');
        }
    },
    onEndMove: (e, shared) => {
        if (shared.canDrag) {
            onDrop(e);
            setRect(null);
            ref.current.classList.remove('dragging');
        }
    },
});