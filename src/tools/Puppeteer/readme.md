`<Puppeteer/>` and it's accompanying components/HOCs allow you to override the props of descendants
who are decorated in the `puppet()` HOC. This is useful in cases where you want components to
have different behaviors when they are nested in certain containers, or when you want to add
logic to a component on a higher abstraction layer.

### Motivation

Let's say you have a controlled input with a built-in option to show an error
message based on some validation function:

```jsx
const TextInput = ({value, onChange, validation}) => {
    const [error, setError] = useState(false);
    const handleOnChange = useCallback(e => {
        const {value} = e.target;
        setError(!validation(value));
        onChange(value);
    }, [onChange, validation, setError]);

    return (
        <>
            <input type='text' value={value} onChange={handleOnChange}/>
            {error && <div className='error'>This field has errors</div>}
        </>
    )
};
```

So far so good, but now you want to have another input, `NumberInput`, which is also validatable.
Instead of having the same code duplicated in multiple places, we need to share it.
There are multiple ways of doing so: using a *hook*, using a *HOC*, or just having a utility function used by both.

`<Puppeteer/>` offers another way, one in which the logic is lifted up to a higher abstraction
layer, completely removing the logic from the receiving component. From a [SOLID](https://en.wikipedia.org/wiki/SOLID) point of view,
this component already has too many responsibilities so even if you didn't need to share the above
logic, it makes sense moving it to another component, making both more readable and less likely to change.

To do that, we need to create another component, in which we will use `<Puppeteer/>` to control
the props of the descending `puppet()` wrapped component. All the validation logic will move to that
component, leaving the original `TextInput` clean of any validation responsibilities:

```jsx
const Validation = ({children, validation}) => {
    const [error, setError] = useState(false);

    return (
        <Puppeteer props={{
            onChange: props => value => {
                props.onChange(value); // Call the original prop
                setError(!validation(value));
            }
        }}>
            {children}
            {error && <div className='error'>This field has errors</div>}
        </Puppeteer>
    );
}

const TextInput = puppet(({value, onChange}) => {
    const handleOnChange = useCallback(e => {
        onChange(e.target.value);
    }, [onChange]);

    return (
        <input type='text' value={value} onChange={handleOnChange}/>
    );
});
```

The above components can be used like so:

```jsx
<Validation validation={value => value.length > 0}>
    <TextInput value={...} onChange={...}/>
<Validation>
```

## Namespacing

A `namespace` can be used to avoid collision between overridden props.
This can happen when you want to override a certain prop in one type of `puppet`, but
leave the same prop intact in another type of `puppet`.
Namespaces provide a way for grouping prop overrides so that one group does not affect the other.

It's important to note that a `puppet()` can consume a single namespace, but a component can
use multiple `Puppeteer`s with different namespaces to inject into multiple namespaces.

If no `namespace` is provided, the `global` namespace is used.
