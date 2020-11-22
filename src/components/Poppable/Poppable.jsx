import React, {useRef, forwardRef, memo, useCallback} from 'react';
import classNames from 'classnames';
import Stackable from '../Stackable';
import {copyComponentRef} from 'utility/react';
import puppet from 'tools/Puppeteer/Puppet.hoc';
import Puppeteer from 'tools/Puppeteer/Puppeteer';
import {usePosition, useBoundingRects} from './Poppable.hooks';
import {getPositionClass} from './Poppable.utils';
import PoppableContext from './Poppable.context';
import {propTypes, defaultProps} from './Poppable.props';

export const Poppable = forwardRef(({children, container, reference, placements, default: _default, onPlacement, placement, overflow, className, style, ...props}, ref) => {
    const target = useRef();
    usePosition({target, container, reference, placements, default: _default, onPlacement, overflow});
    const rects = useBoundingRects(target, reference, container, placement);
    const handleOnContextMenu = useCallback(e => e.stopPropagation(), []); // prevent onContextMenu event bubbling from the react portal to the react tree

    return (
        <Puppeteer.Break namespace='poppable'>
            <Stackable {...props} className={classNames('poppable', className, getPositionClass(rects.tbr, rects.rbr))} style={{...style, ...placement}}
                ref={copyComponentRef(ref, target)} parent={reference} onContextMenu={handleOnContextMenu}>
                <PoppableContext.Provider value={rects}>
                    {children}
                </PoppableContext.Provider>
            </Stackable>
        </Puppeteer.Break>
    );
});

Poppable.propTypes = propTypes;
Poppable.defaultProps = defaultProps;
Poppable.displayName = 'Poppable.Manual';

export default memo(puppet('poppable')(Poppable));
