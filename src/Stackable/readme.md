The `<Stackable/>` can be used to render children into an external DOM node, while communicating depth
and DOM nesting between the portals.

## Motivation

Certain UI elements like dialogs, popovers and menus need to appear on top of their containing element.
This is usually done with absolute positioning and z-indexing. However, `z-index`s are relative to the parent's stacking
context, so it is possible for a lower z-index to appear above a higher z-index, if the former has a higher stacking context.

#### The Component To End All `z-index` Issues

To solve the above issue, we use portals. Using portals we can send the elements to the body, thus resetting their stacking context.
However, when we use portals, not only do we reset the stacking context, but we also completely flatten the DOM tree.

This is where `<Stackable/>` comes in: It allows us to reset the stacking context while maintaining 
the stacking context between the portal'ed elements.

## Props 
 
Name|Type|Default|Description
---|---|---|---
`target`|Element|`document.body`|Specifies portal target.
`descendants`|Function|`() => null`|Specifies a function to be called when the component mounts/updated. Receives the list of descendant DOM elements as an argument.
`children`|Node|`null`|Specifies the children of the component.
 
 > NOTE: Any prop other than the supported props will be injected to the containing div.
 
# Stacking
 
You can stack portal'ed elements by nesting them. 
A nested `<Stackable/>` receives a higher `z-index` than it's parent.
The lowest z-index is specified in `BASE_Z_INDEX`.

```
<Stackable> <-- Receives a z-index of BASE_Z_INDEX
    <Stackable/> <-- Receives a z-index of BASE_Z_INDEX + 1
</Stackable>
```

# Event Propagation

In React, events are propagated based on the React tree, and not the DOM tree.
This means that events are propagated through portals (see https://reactjs.org/docs/portals.html#event-bubbling-through-portals).

We leverage this fact in this example to show how click events are propagated through nested
`Stackable` components, despite the fact that they are siblings in the DOM.

# Ancestors

In this story, clicking on a `<Stackable/>` will show the list of classes of all of its ancestors
starting from the furthest to the closest ancestor. Notice that the list of ancestors is displayed
according to the React component tree, and not the DOM tree.