![Webrix logo](https://github.com/open-amdocs/webrix-docs/raw/master/src/resources/images/webrix-logo-dark.png)
  
[![GitHub license](https://img.shields.io/badge/license-Apache%202-blue)](https://github.com/open-amdocs/webrix/blob/master/LICENSE)
[![CircleCI Status](https://circleci.com/gh/open-amdocs/webrix.svg?style=shield&circle-token=:circle-token)](https://circleci.com/gh/open-amdocs/webrix)
[![codecov](https://codecov.io/gh/open-amdocs/webrix/branch/master/graph/badge.svg)](https://codecov.io/gh/open-amdocs/webrix)
[![npm version](https://badge.fury.io/js/webrix.svg)](https://www.npmjs.com/package/webrix)
[![semantic-release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg)](https://github.com/semantic-release/semantic-release)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](https://github.com/open-amdocs/webrix/blob/master/CONTRIBUTING.md)

Powerful building blocks for React-based web applications.

For the full documentation, API overview and live examples, visit the official [Webrix documentation site](https://webrix.amdocs.com).

### What Is Webrix?

After building numerous UI components, we realized that there are many common challenges that can be solved once and reused everywhere.

We then extracted those solutions into a set of small, single-purpose components, each aimed at overcoming a specific UI challenge.

We call these components "the bricks of the web" - hence the name Webrix.

Read more about [the motivation behind Webrix](https://webrix.amdocs.com/motivation).

### Installation

You can install Webrix with `npm` (or `yarn` if you prefer).

```bash
# With npm
npm i webrix

# With yarn
yarn add webrix
```

Webrix requires has peer dependencies for `react`, `react-dom` and `prop-types`, so be sure to install them as well:

```bash
npm i react react-dom prop-types
```

### Usage

Webrix components can be imported using named imports:

```js
import {Movable} from 'webrix';

<Movable {...props}/>
```

### Components

* [<Movable\/>](https://webrix.amdocs.com/docs/components/movable)
* [<Stackable\/>](https://webrix.amdocs.com/docs/components/stackable)
* [<Pannable\/>](https://webrix.amdocs.com/docs/components/pannable)
* [<Resizable\/>](https://webrix.amdocs.com/docs/components/resizable)
* [<Poppable\/>](https://webrix.amdocs.com/docs/components/poppable)
* [<Scalable\/>](https://webrix.amdocs.com/docs/components/Scalable)
* [<Scrollable\/>](https://webrix.amdocs.com/docs/components/scrollable)
* [<Collapsible\/>](https://webrix.amdocs.com/docs/components/collapsible)

### Hooks

* [useBooleanState()](https://webrix.amdocs.com/docs/hooks/usebooleanstate)
* [usePrevious()](https://webrix.amdocs.com/docs/hooks/useprevious)
* [useMounted()](https://webrix.amdocs.com/docs/hooks/usemounted)
* [useClickOutside()](https://webrix.amdocs.com/docs/hooks/useclickoutside)
* [useTimeout()](https://webrix.amdocs.com/docs/hooks/usetimeout)
* [useDebounce()](https://webrix.amdocs.com/docs/hooks/usedebounce)
* [useThrottle()](https://webrix.amdocs.com/docs/hooks/usethrottle)
* [useObject()](https://webrix.amdocs.com/docs/hooks/useobject)
* [useDimensions()](https://webrix.amdocs.com/docs/hooks/usedimensions)
* [useAnimationFrame()](https://webrix.amdocs.com/docs/hooks/useanimationframe)
* [useBoundingRectObserver()](https://webrix.amdocs.com/docs/hooks/useboundingrectobserver)
* [useEventListener()](https://webrix.amdocs.com/docs/hooks/useeventlistener)

### Tools

* [<ResizeObserver\/>](https://webrix.amdocs.com/docs/tools/resizeobserver)
* [<Puppeteer\/>](https://webrix.amdocs.com/docs/tools/puppeteer)