The `<Movable/>` component can be used to create items that can be move around. As opposed to a draggable element,
the `<Movable/>` component does not require a source/target configuration. All it does it trigger an event when the user
moves it around, passing the mouse position (`x/y`), the difference in the coordinates since the beginning of the event 
(`dx/dy`), and the difference in the coordinates since the last event (`cx/cy`)
 
 
Name|Type|Default|Description
---|---|---|---
`onBeginMove`|func|`() => null`|Specifies a callback to be called when the user begins to move the element
`onMove`|func|`() => null`|Specifies a callback to be continuously called as the user moves the element around. Receives `x/y/dx/dy/cx/cy` as arguments (see description above for more info)
`onEndMove`|func|`() => null`|Specifies a callback to be called when the user stops moving the element
 
# Basic Example
 
In this example you can see how, using the `onMove`, we can change the element coordinates based on `dx/dy` and 
the initial position.
```
<Movable onMove={...}/>
```

# Constraint Movement
 
The `<Movable/>` component gives you complete control over the positioning of the element by only passing information
through the event without actually manipulating the element itself. This can be used to apply constraints on the
element. In this example, we ignore the movement of the mouse on the `x` axis to constraint the element to the `y`
axis.

# Snapping
 
Similarly to the previous example, more complex constraints can be applied, like snapping.
This can be achieved by applying the following to the coordinates of the element:

```
const GRID_SIZE = 20;
Math.round(x / GRID_SIZE) * GRID_SIZE;
``` 
