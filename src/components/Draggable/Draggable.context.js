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

import React, {useRef, useMemo} from 'react';
import {node} from 'prop-types';

export const Context = React.createContext({});

const ContextProvider = ({children}) => {
    const monitor = useRef({source: null, target: null});
    const getSource = () => monitor.current.source;
    const setSource = source => monitor.current.source = source;
    const getTarget = () => monitor.current.target;
    const setTarget = source => monitor.current.target = source;
    return (
        <Context.Provider value={useMemo(() => ({getSource, setSource, getTarget, setTarget}), [])}>
            {children}
        </Context.Provider>
    );
};

ContextProvider.propTypes = {
    children: node,
};

ContextProvider.defaultProps = {
    children: null,
};

export default ContextProvider;