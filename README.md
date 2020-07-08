# XML to React Loader

A bundle loader intended to take XML files as input and produce abstract
React components to render in React-style applications.

Unlike other loaders, this one does not assume the usage of React primitives
for components. You can use your own Components or leave them as is.
In addition, no transpiling should be required. This loader automatically
generates valid JavaScript syntax that does not need to go through a jsx
tool.

## Setup

Add this loader as a rule for XML or XML derived files in your setup.

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

Alternatively you can manually invoke this loader on specific files

```js
import Component from "!xml-to-react-loader!./path/to/file.xml";
```

## Examples

If this is your xml file:

```xml
<note date="2020-07-07T23:04:29+00:00" author="John Doe">
  <heading>Reminder</heading>
  <body>Don't forget <bold>me</bold> this weekend!</body>
</note>
```

It will produce a JavaScript file roughly equivalent to the following:

```tsx
import React from 'react';

export const Component = (
  getComponent: (tagname: string) => React.ReactNode,
  ...props: Record<string, unknown>
): React.FunctionComponent => {
  const Note = getComponent ? getComponent('node') : 'note';
  const Heading = getComponent ? getComponent('heading') : 'heading';
  const Body = getComponent ? getComponent('body') : 'body';
  const Bold = getComponent ? getComponent('bold') : 'body';

  return (
    <Note date="2020-07-07T23:04:29+00:00" author="John Doe" {...props}>
      <Heading>Reminder</Heading>
      <Body>Don&comma;t forget <Bold>me</Bold> this weekend!</Body>
    </Note>
  );
}

export default Component;

export const rootAttributes = {
  author: "John Doe",
  date: "2020-07-07T23:04:29+00:00",
};

```

_Note_: There is no need to transform the JSX syntax, this loader does that
automatically. The JSX syntax in this example is preserved to enhance
readability.

### Usage

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
    getComponent={(tag) => tagMappings[tag] || 'p'}
    {...props}
  />
);
```

Because it is common that React primitive elements will not match your xml
file 1:1, every component can take a `getComponent` prop to get your
appropriate component for each tag.

It is simply a function that will be called with the tag `string` to get a
component for, and should return something React can create, which means
probably a `string` or `Component`.

## Options

This loader accepts one option.

```ts
type Options = {
  reactPath?: string;
}
```

The option `reactPath` can be set if you have a unique path to react, the only
required peer dependency. If this option is omitted the usual process of using
`require.context` to get the path will be used. In most cases this should be
sufficient.

## TypeScript

This project is written and maintained in TypeScript. Because loaders are not
directly a part of TypeScript, typings can be difficult. This module exports
the appropriate types to expect from a file emitted from the loader, you
will just need to hook up the definitions according to how you import them.

```ts
// your-typings-file.d.ts

import { XmlToReactLoaderExport } from 'xml-to-react-loader';

declare module '*.xml' {
  const _: XmlToReactLoaderExport;
  export = _;
}

// or

declare module '!xml-to-react-loader!*' {
  const _: XmlToReactLoaderExport;
  export = _;
}
```
