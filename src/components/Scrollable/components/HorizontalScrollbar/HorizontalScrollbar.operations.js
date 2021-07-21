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

import Movable from 'components/Movable';

export const move = (container, thumb, track) => Movable.Operations.createOperation({
    onBeginMove: (e, shared) => {
        e.stopPropagation();
        e.preventDefault();
        shared.initial = container.current.scrollLeft;
    },
    onMove: ({dx}, shared) => {
        const {clientWidth, scrollWidth} = container.current;
        const handleWidth = thumb.current.clientWidth;
        const trackWidth = track.current.clientWidth;
        container.current.scrollLeft = shared.initial + dx * (scrollWidth - clientWidth) / (trackWidth - handleWidth);
    },
});