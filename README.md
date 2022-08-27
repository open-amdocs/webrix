<p align="center">
  <img src="https://github.com/open-amdocs/webrix-docs/raw/master/src/resources/images/og-image.png" height="300"/>
</p>
<p align="center">
  Powerful building blocks for React-based web applications.<br/>
  For documentation, API overview and live examples, visit <a href="https://webrix.amdocs.com">webrix.amdocs.com</a>.
</p>

---

<p align="center">
  <a href="https://www.npmjs.com/package/webrix">
    <img src="https://img.shields.io/npm/dt/webrix.svg" />
  </a>
  <a href="https://www.npmjs.com/package/webrix">
    <img src="https://badge.fury.io/js/webrix.svg" />
  </a>
  <a href="https://circleci.com/gh/open-amdocs/webrix">
    <img src="https://circleci.com/gh/open-amdocs/webrix.svg?style=shield&circle-token=:circle-token" />
  </a>
  <a href="https://codecov.io/gh/open-amdocs/webrix">
    <img src="https://codecov.io/gh/open-amdocs/webrix/branch/master/graph/badge.svg" />
  </a>
  <a href="https://github.com/open-amdocs/webrix/blob/master/CONTRIBUTING.md">
    <img src="https://img.shields.io/badge/PRs-welcome-brightgreen.svg" />
  </a>
</p>

<br/>
<br/>

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

Webrix has peer dependencies for `react`, `react-dom` and `prop-types`, so be sure to install them as well:

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
