import {useRef, useCallback} from 'react';

const start = (args, timeout, callback, delay, recurring) => {
    clearTimeout(timeout.current);
    timeout.current = setTimeout(() => {
        callback(...args);
        if (recurring) {
            start(args, timeout, callback, delay, recurring);
        }
    }, delay);
};

const stop = timeout => {
    clearTimeout(timeout.current);
};

export default (callback, delay, recurring) => {
    const timeout = useRef();
    return {
        start: useCallback((...args) => start(args, timeout, callback, delay, recurring), [timeout, callback, delay, recurring]),
        stop: useCallback(() => stop(timeout), [timeout]),
    };
};
