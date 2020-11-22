import React from 'react';

// By default, the condition is to only consider actual inside clicks (including clicks through portals)
export default React.createContext(isClickedInside => !isClickedInside);