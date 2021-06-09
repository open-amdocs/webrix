import {_document, _window, Element, DOMRect, ResizeObserver} from './mocks';
import {expect} from 'chai';

it('Mock', () => {
    expect(_window).to.eql(global.window);
    expect(_document).to.eql(global.document);
    expect(Element).to.eql(global.window.Element);
    expect(DOMRect).to.eql(global.window.DOMRect);
    expect(ResizeObserver).to.eql(global.window.ResizeObserver);
});