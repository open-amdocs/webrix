import React, {useContext, forwardRef} from 'react';
import PuppeteerContext from './Puppeteer.context';

export default (namespace = 'global') => WrappedComponent => {
    const Puppet = forwardRef((props, ref) => {
        const ctx = useContext(PuppeteerContext);
        const injected = {...(ctx[namespace] || {}), ...ctx.global};

        return (
            <WrappedComponent
                ref={ref}
                {...props}
                {...Object.entries(injected).reduce((acc, [name, value]) => ({...acc, [name]: value(props, WrappedComponent)}), {})}
            />
        );
    });

    Puppet.displayName = `puppet(${WrappedComponent.name || WrappedComponent.displayName || ''})`;
    Puppet.WrappedComponent = WrappedComponent;

    return Puppet;
};