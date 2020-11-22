import React, {useContext, useCallback, useMemo} from 'react';
import {isEmpty} from 'utility/types';
import Icon from 'general/Icon';
import IconButton from 'form/IconButton';
import AdjustableContext from '../Adjustable.context';

const Pin = () => {
    const {boundingRect, setBoundingRect, placement} = useContext(AdjustableContext);
    const pin = useCallback(() => setBoundingRect({}), [setBoundingRect]);
    const isDisabled = useMemo(() =>
        isEmpty(boundingRect) || (Math.round(boundingRect.top) === placement.top && Math.round(boundingRect.left) === placement.left)
    , [boundingRect, placement]);

    return <IconButton icon={Icon.Types.TACK} disabled={isDisabled} onClick={pin}/>;
};

export default Pin;
