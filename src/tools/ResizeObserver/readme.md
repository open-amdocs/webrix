The `<ResizeObserver/>` can be used to listen to size changes in the given child component.
This component uses the browser's `ResizeObserver` internally.

## Props

Name|Type|Default|Description
---|---|---|---
`children`|node|`null`|Specifies a single child to observe for size changes.
`onResize`|function|`() => null`|Specifies an event handler to be called when the given child changes its size. The handler will receive an object with the keys `width` and `height`.
