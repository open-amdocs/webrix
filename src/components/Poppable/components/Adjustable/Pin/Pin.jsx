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
