import {useRef} from 'react';
import {isEqual} from 'utility/object';

export default obj => {
    const ref = useRef(obj);
    if (!isEqual(ref.current, obj)) {
        ref.current = obj;
    }
    return ref.current;
};