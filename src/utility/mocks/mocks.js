/**
 * Copyright (c) 2020, Amdocs Corp.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * All the exports in this file provide a fallback when components are rendered in
 * non-browser environments (i.e. server) and the window object is not defined.
 * This is only an issue when the code is accessing the window statically (like in
 * propTypes) or during the initial render. Any further runtime access to the window
 * object is OK since that code is only executed in the browser.
 */

const isServer = typeof window === 'undefined';

export const _window = isServer ? function window() {} : window;

export const _document = isServer ? function document() {} : document;

export const ResizeObserver = isServer ? function ResizeObserver() {} : window.ResizeObserver;

export const DOMRect = isServer ? function DOMRect() {} : window.DOMRect;

export const Element = isServer ? function Element() {} : window.Element;

export const requestAnimationFrame = isServer && window.requestAnimationFrame ? function requestAnimationFrame() {} : window.requestAnimationFrame.bind(window);

export const cancelAnimationFrame = isServer && window.cancelAnimationFrame ? function cancelAnimationFrame() {} : window.cancelAnimationFrame.bind(window);