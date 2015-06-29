// Fluxxor application initialization and main rendering
var stores = {
    DocumentStore: new DocumentStore()
};

// register actions and stores with fluxxor application
// this creates a flux instance
var flux = new Fluxxor.Flux(stores, actions);

React.render(
    <MarkdownViewer
        flux={flux}
    />,
    document.getElementById('container')
);