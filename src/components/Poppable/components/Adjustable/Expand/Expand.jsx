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
