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
    const source = useRef({current: null});
    const target = useRef({current: null});
    const event = useRef({});
    const getSource = () => source.current.current;
    const setSource = s => source.current = s;
    const getTarget = () => target.current.current;
    const setTarget = t => target.current = t;
    return (
        <Context.Provider value={useMemo(() => ({getSource, setSource, getTarget, setTarget, event}), [])}>
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