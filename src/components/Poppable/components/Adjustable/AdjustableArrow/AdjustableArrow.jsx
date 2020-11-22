import React, {useContext} from 'react';
import {isEmpty} from 'utility/types';
import Arrow from '../../Arrow/Arrow';
import AdjustableContext from '../Adjustable.context';

const AdjustableArrow = () => {
    const {boundingRect} = useContext(AdjustableContext);
    return isEmpty(boundingRect) ? <Arrow/> : null;
};

export default AdjustableArrow;
