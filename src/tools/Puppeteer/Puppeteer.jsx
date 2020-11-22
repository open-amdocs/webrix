import React, {useContext} from 'react';
import {omit} from 'utility/object';
import {useObject} from 'hooks';
import PuppeteerContext from './Puppeteer.context';
import {propTypes, defaultProps} from './Puppeteer.props';

const Puppeteer = ({children, props, namespace}) => {
    const ctx = useContext(PuppeteerContext);
    const inherited = ctx[namespace] || {};
    const injected = {...inherited, ...props};

    Object.keys(inherited).forEach(prop => {
        if (props.hasOwnProperty(prop)) {
            injected[prop] = (originalProps, prototype) => {
                return props[prop]({...originalProps, [prop]: inherited[prop](originalProps, prototype)}, prototype);
            }
        }
    });

    return (
        <PuppeteerContext.Provider value={useObject({...ctx, [namespace]: injected})}>
            {children}
        </PuppeteerContext.Provider>
    );
};

Puppeteer.propTypes = propTypes.puppeteer;
Puppeteer.defaultProps = defaultProps.puppeteer;

Puppeteer.Break = ({children, props, namespace}) => {
    const ctx = useContext(PuppeteerContext);
    const inherited = ctx[namespace] || {};

    return (
        <PuppeteerContext.Provider value={{...ctx, [namespace]: props ? omit(inherited, ...props) : {}}}>
            {children}
        </PuppeteerContext.Provider>
    );
};

Puppeteer.Break.propTypes = propTypes.break;
Puppeteer.Break.defaultProps = defaultProps.break;
Puppeteer.Break.displayName = 'Puppeteer.Break';

export default Puppeteer;