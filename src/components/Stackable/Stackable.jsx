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

import React, {useContext, forwardRef, useEffect, useState} from 'react';
import ReactDOM from 'react-dom';
import classNames from 'classnames';
import StackableContext from './Stackable.context';
import {BASE_Z_INDEX} from './Stackable.constants';
import {defaultProps, propTypes} from './Stackable.props';
import './Stackable.scss';

const Stackable = forwardRef(({target, parent, children, style, className, ...props}, ref) => {
    const {depth, ancestors: _ancestors} = useContext(StackableContext);
    const [ancestors, setAncestors] = useState('');
    const cls = classNames(`stackable depth-${depth}`, className);

    useEffect(() => {
        let ancestors = '';
        if (parent.current) {

            let {parentNode} = parent.current;
            while (parentNode && parentNode.className && parentNode.tagName !== 'BODY') {
                ancestors = `.${parentNode.className.split(' ').join('.')}${ancestors ? ' ' + ancestors : ''}`;
                parentNode = parentNode.parentNode;
            }
        }
        setAncestors(_ancestors + ancestors);
    }, [setAncestors, _ancestors, parent]);

    return ReactDOM.createPortal(
        <StackableContext.Provider value={{depth: depth + 1, ancestors: `${ancestors} .${cls.split(' ').join('.')}`}}>
            <div {...props} data-ancestors={ancestors} className={classNames(`stackable depth-${depth}`, className)} style={{...style, zIndex: depth + BASE_Z_INDEX}} ref={ref}>
                {children}
            </div>
        </StackableContext.Provider>,
        target
    );
});

Stackable.displayName = 'Stackable';
Stackable.propTypes = propTypes;
Stackable.defaultProps = defaultProps;

export default Stackable;
