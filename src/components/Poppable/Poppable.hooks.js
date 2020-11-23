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

import {useRef, useEffect} from 'react';
import {equal} from 'utility/rect';
import {useTimeout} from 'hooks';
import {getPlacement, refsReady, getBoundingRects} from './Poppable.utils';
import {POLLING_INTERVAL} from './Poppable.constants';

export const useBoundingRects = (target, reference, container, {top, left}) => {
    if (refsReady(target, reference, container)) {
        const {tbr, rbr, cbr} = getBoundingRects(target, reference, container);
        return {tbr: new DOMRect(left, top, tbr.width, tbr.height), rbr, cbr}
    }
    return {tbr: {}, rbr: {}, cbr: {}};
};

const useBoundingRectListener = (target, container, reference, callback) => {
    const prev = useRef({});
    return () => {
        if (refsReady(target, reference, container)) {
            const {tbr, rbr, cbr, wbr} = getBoundingRects(target, reference, container);
            if (!prev.current.cbr
                || !equal(cbr, prev.current.cbr)
                || !equal(rbr, prev.current.rbr)
                || !equal(tbr, prev.current.tbr)) {
                callback(rbr, tbr, cbr, wbr);
                prev.current.cbr = cbr;
                prev.current.rbr = rbr;
                prev.current.tbr = tbr;
            }
        }
    }
};

export const usePosition = ({target, container, reference, placements, default: _default, onPlacement, overflow}) => {
    const {start, stop} = useTimeout(() => updatePosition(), POLLING_INTERVAL, true);
    const updatePosition = useBoundingRectListener(target, container, reference, (rbr, tbr, cbr, wbr) => {
        const _placements = placements(rbr, tbr);
        const desired = _placements[_default];
        const newPosition = getPlacement({tbr, cbr, rbr, wbr}, _placements, desired, overflow);
        if(!tbr || newPosition.top !== tbr.top || newPosition.left !== tbr.left) {
            onPlacement(newPosition);
        }
    });

    // Continuously update the position of the target (if the cbr/rbr have changed)
    updatePosition();
    useEffect(() => {
        start();
        return () => stop();
    }, [start, stop]);
};
