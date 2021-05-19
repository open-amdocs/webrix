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

import React, {forwardRef, useCallback, useRef, memo} from 'react';
import {node} from 'prop-types';
import {copyComponentRef} from 'utility/react';
import {getBoxShadow} from './Shadow.utils';
import './Shadow.scss';

export const ScrollShadow = forwardRef(({children}, ref) => {
    const scrollbar = React.Children.only(children);
    const {onScroll} = scrollbar.props;
    const shadow = useRef();
    const handleOnScroll = useCallback(e => {
        shadow.current.style.boxShadow = getBoxShadow(e);
        onScroll(e);
    }, [onScroll]);

    return (
        <>
            <div className='scroll-shadow' ref={copyComponentRef(ref, shadow)}/>
            {React.cloneElement(scrollbar, {onScroll: handleOnScroll})}
        </>
    );
});

ScrollShadow.propTypes = {
    children: node,
};

ScrollShadow.defaultProps = {
    children: null,
};

ScrollShadow.displayName = 'Scrollbar.Shadow';

export default memo(ScrollShadow);