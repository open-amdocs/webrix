import {configure} from 'enzyme';
import Adapter from '@cfaester/enzyme-adapter-react-18';
import sinon from 'sinon';

configure({adapter: new Adapter()});

global.DOMRect = function (x = 0, y = 0, width = 0, height = 0) {this.x = x; this.y = y; this.left = x; this.top = y; this.width = width; this.height = height; this.bottom = y + height; this.right = x + width;};
global.window.requestAnimationFrame = sinon.spy();
global.window.cancelAnimationFrame = sinon.spy();
global.ResizeObserver = class {
    disconnect = sinon.spy();
    observe = sinon.spy();
};