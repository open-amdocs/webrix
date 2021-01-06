![Webrix logo](https://github.com/open-amdocs/webrix-docs/raw/master/src/resources/images/webrix-logo-dark.png)
  
[![GitHub license](https://img.shields.io/badge/license-Apache%202-blue)](https://github.com/open-amdocs/webrix/blob/master/LICENSE)
[![CircleCI Status](https://circleci.com/gh/open-amdocs/webrix.svg?style=shield&circle-token=:circle-token)](https://circleci.com/gh/open-amdocs/webrix)
[![codecov](https://codecov.io/gh/open-amdocs/webrix/branch/master/graph/badge.svg)](https://codecov.io/gh/open-amdocs/webrix)
[![npm version](https://badge.fury.io/js/webrix.svg)](https://www.npmjs.com/package/webrix)
[![semantic-release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg)](https://github.com/semantic-release/semantic-release)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](https://github.com/open-amdocs/webrix/blob/master/CONTRIBUTING.md)

Powerful building blocks for React-based web applications.

For the full documentation, API overview and live examples, visit the official [Webrix documentation site](http://webrix.amdocs.com).

### What Is Webrix?

Webrix is a set of small, single-purpose components, each aimed at overcoming a specific UI challenge.
It's not a component bank, but rather a set of components with which you can build your own component bank, whether it's basic or highly complex.

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

* [Movable](http://webrix.amdocs.com/docs/components/movable)
* [Stackable](http://webrix.amdocs.com/docs/components/stackable)
* [Pannable](http://webrix.amdocs.com/docs/components/pannable)
* [Resizable](http://webrix.amdocs.com/docs/components/resizable)
* [Poppable](http://webrix.amdocs.com/docs/components/poppable)
* [Scalable](http://webrix.amdocs.com/docs/components/Scalable)
* [Scrollable](http://webrix.amdocs.com/docs/components/scrollable)
* [Collapsible](http://webrix.amdocs.com/docs/components/collapsible)

### Hooks

* [useBooleanState](http://webrix.amdocs.com/docs/hooks/usebooleanstate)
* [usePrevious](http://webrix.amdocs.com/docs/hooks/useprevious)
* [useMounted](http://webrix.amdocs.com/docs/hooks/usemounted)
* [useClickOutside](http://webrix.amdocs.com/docs/hooks/useclickoutside)
* [useTimeout](http://webrix.amdocs.com/docs/hooks/usetimeout)
* [useDebounce](http://webrix.amdocs.com/docs/hooks/usedebounce)
* [useThrottle](http://webrix.amdocs.com/docs/hooks/usethrottle)
* [useObject](http://webrix.amdocs.com/docs/hooks/useobject)

### Tools

* [ResizeObserver](http://webrix.amdocs.com/docs/tools/resizeobserver)
* [Puppeteer](http://webrix.amdocs.com/docs/tools/puppeteer)