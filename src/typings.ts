import React from "react";

/** The basic interface to a loaded component. */
export type XmlToReactLoaderComponent = React.FunctionComponent<
    Record<string, unknown> & {
        getComponent: (tag: string) => React.ReactNode;
    }
>;

/** This is the expected shape of a file loaded via this loader. */
export type XmlToReactLoaderExport = {
    /**
     * Default export will be a React component that spreads all props to the
     * root XML element, and a `getComponent` function to get the component
     * for each specific tag via its string.
     */
    default: XmlToReactLoaderComponent;

    /** The Component exported as a named export in addition to default. */
    Component: XmlToReactLoaderExport;

    /** The static attributes of the root element. */
    rootAttributes: { [key: string]: string | undefined };
};
