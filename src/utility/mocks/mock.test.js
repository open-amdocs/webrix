import {_document, _window, Element, DOMRect, ResizeObserver} from './mocks';

it('Mock', () => {
    expect(_window).toEqual(global.window);
    expect(_document).toEqual(global.document);
    expect(Element).toEqual(global.window.Element);
    expect(DOMRect).toEqual(global.window.DOMRect);
    expect(ResizeObserver).toEqual(global.window.ResizeObserver);
});