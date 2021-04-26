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

import React, {useEffect, useRef} from 'react';
import {node, func} from 'prop-types';
import {copyComponentRef} from 'utility/react';
import {readResizeObserverEntry} from 'utility/rect';
import {noop} from 'utility/memory';

const ResizeObserver = ({children, onResize}) => {
    const child = React.Children.only(children);
    const ref = useRef();
    const observer = useRef(new window.ResizeObserver(entries => {
        onResize(readResizeObserverEntry(entries[0]));
    }));
    useEffect(() => {
        const {current: obs} = observer;
        obs.observe(ref.current);
        return () => obs.disconnect();
    }, []);

    return React.cloneElement(child, {ref: copyComponentRef(child.ref, ref)});
};

ResizeObserver.propTypes = {
    children: node,
    onResize: func,
};

ResizeObserver.defaultProps = {
    children: null,
    onResize: noop,
};

export default ResizeObserver;