import {createContext} from 'react';
import {noop} from 'utility/memory';

export default createContext({boundingRect: {}, setBoundingRect: noop, sizes: {}, placement: {}});
