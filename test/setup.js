import {configure} from 'enzyme';
import Adapter from '@wojtekmaj/enzyme-adapter-react-17';
import {JSDOM} from 'jsdom';
import sinon from 'sinon';

configure({adapter: new Adapter()});

//JSDOM configuration
const dom = new JSDOM(
    '<!DOCTYPE html><html><body></body></html>',
    {url: 'http://localhost/'}
);
global.window = dom.window;
global.document = dom.window.document;
global.Element = dom.window.Element;
global.window.requestAnimationFrame = sinon.spy();
global.window.cancelAnimationFrame = sinon.spy();
global.window.ResizeObserver = class {
    disconnect = sinon.spy();
    observe = sinon.spy();
};

global.DOMRect = function (x = 0, y = 0, width = 0, height = 0) {this.x = x; this.y = y; this.left = x; this.top = y; this.width = width; this.height = height; this.bottom = y + height; this.right = x + width;};