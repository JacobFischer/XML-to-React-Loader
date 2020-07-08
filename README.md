# XML to React Loader

A bundle loader intended to take XML files as input and produce abstract
React components to render in React-style applications.

Unlike other loaders, this one does not assume the usage of React primitives
for components. You can use your own Components or leave them as is.
In addition, no transpiling should be required. This loader automatically
generates valid JavaScript syntax that does not need to go through a jsx
tool.

## Usage

```js
{
  module: {
    rules: [
      {
        test: /\.(svg|xml)$/,
        use: {
          loader: 'xml-to-react-loader'
        }
      }
    ]
  }
}
```

### Examples

If this is your example file:

```xml
<note date="2020-07-07T23:04:29+00:00" author="John Doe">
  <heading>Reminder</heading>
  <body>Don't forget <bold>me</bold> this weekend!</body>
</note>
```

It will produce a React functional component roughly equivalent to:

```tsx
import React from 'react';

export default (
  getComponent: (tagname: string) => string | React.Component,
  ...props: Record<string, unknown>,
): React.FunctionComponent => {
  const Note = getComponent && getComponent('node') || 'note';
  const Heading = getComponent && getComponent('heading') || 'heading';
  const Body = getComponent && getComponent('body') || 'body';
  const Bold = getComponent && getComponent('bold') || 'body';

  return (
    <Note date="2020-07-07T23:04:29+00:00" author="John Doe" {...props}>
      <Heading>Reminder</Heading>
      <Body>Don&comma;t forget <Bold>me</Bold> this weekend!</Body>
    </Note>
  );
}

export const rootAttributes = {
  author: "John Doe",
  date: "2020-07-07T23:04:29+00:00",
};

```

Usage:

```jsx
import NoteComponent from 'note.xml';

const tagMappings = {
  heading: 'h1',
  note: (props) => (
    <html>
      <body>
        <div {...props} />
      </body>
    </html>
  ),
  bold: 'b',
}

const Component = (props: {}) => (
  <NoteComponent
    getComponent={(tag: string) => tagMappings[tag] || 'p'}
    {...props}
  />
);
```

This defines the tags

The `default` export is the Component.
The attributes of the root element are exposed via a `rootAttributes` export.

### Component Overrides

Because it is common that React primitive elements will not match your xml
file 1:1, every component can take a `getComponent` prop to get your
appropriate component for each tag.
