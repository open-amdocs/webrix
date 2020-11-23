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

import React, {useContext, useCallback, useState, useEffect, useRef} from 'react';
import PropTypes from 'prop-types';
import {isEmpty} from 'utility/types';
import Icon from 'general/Icon';
import Poppable from 'general/Poppable';
import IconButton from 'form/IconButton';
import AdjustableContext from '../Adjustable.context';
import {isExpanded, isDisabled, expandPopover, minimizePopover} from './Expand.utils';

const Expand = ({expanded: initiallyExpanded}) => {
    const _initiallyExpanded = useRef(false);
    const [expanded, setExpanded] = useState(false);
    const {boundingRect, setBoundingRect, sizes, placement} = useContext(AdjustableContext);
    const {tbr, cbr} = useContext(Poppable.Context);

    useEffect(() => {
        if (initiallyExpanded && !expanded && !_initiallyExpanded.current && (!isEmpty(boundingRect) || !isEmpty(placement))) {
            const _placement = !isEmpty(boundingRect) ? boundingRect : placement;
            expandPopover(_placement, tbr, cbr, sizes, setBoundingRect);
            _initiallyExpanded.current = true;
        }
    }, [expanded, placement, boundingRect]);

    useEffect(() => {
        setExpanded(isExpanded(boundingRect, tbr, cbr, sizes));
    }, [boundingRect, sizes, setExpanded, tbr]);

    const handleOnExpand = useCallback(() => expanded
        ? minimizePopover(boundingRect, tbr, sizes, setBoundingRect)
        : expandPopover(boundingRect, tbr, cbr, sizes, setBoundingRect),
    [expanded, tbr, cbr, boundingRect, setBoundingRect]);

    const disabled = isDisabled(expanded, boundingRect, tbr, cbr, sizes);

    return <IconButton icon={expanded ? Icon.Types.MINIMIZE_SCREEN : Icon.Types.MAXIMIZE_SCREEN} onClick={handleOnExpand} disabled={disabled}/>;
};

Expand.propTypes = {
    expanded: PropTypes.bool,
};

Expand.defaultProps = {
    expanded: false,
};

export default Expand;
