import {configure} from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
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
global.window.ResizeObserver = class {
    disconnect = sinon.spy();
    observe = sinon.spy();
};

global.DOMRect = function (x, y, width, height) {this.x = x; this.y = y; this.left = x; this.top = y; this.width = width; this.height = height; this.bottom = y + height; this.right = x + width;};