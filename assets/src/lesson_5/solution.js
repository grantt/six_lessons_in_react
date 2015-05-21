// Mixins
var FluxMixin = Fluxxor.FluxMixin(React);

// Action constants
var constants = {
    CLEAR_INPUT: 'CLEAR_INPUT',
    GENERATE_LOREM_IPSUM: 'GENERATE_LOREM_IPSUM',
    GENERATE_LOREM_IPSUM_ERROR: 'GENERATE_LOREM_IPSUM_ERROR',
    GENERATE_LOREM_IPSUM_SUCCESS: 'GENERATE_LOREM_IPSUM_SUCCESS',
    UPDATE_PREVIEW: 'UPDATE_PREVIEW',
    TOGGLE_SIDEBAR: 'TOGGLE_SIDEBAR',
    CREATE_DOCUMENT: 'CREATE_DOCUMENT',
    DELETE_DOCUMENT: 'DELETE_DOCUMENT',
    EDIT_DOCUMENT_TITLE: 'EDIT_DOCUMENT_TITLE',
    SAVE_DOCUMENT_TITLE: 'SAVE_DOCUMENT_TITLE',
    SELECT_DOCUMENT: 'SELECT_DOCUMENT',
    UPDATE_ACTIVE_DOCUMENT: 'UPDATE_ACTIVE_DOCUMENT'
};

var actions = {
    generateLoremIpsum: function(currentMarkdownEditor) {
        // we should still dispatch the original action, in case any stores
        // are listening for the first event, that kicks off the API call
        this.dispatch(constants.GENERATE_LOREM_IPSUM, currentMarkdownEditor);

        var that = this;
        $.get('http://baconipsum.com/api/?type=all-meat&paras=2&start-with-lorem=1', function(data, statusText) {
            if (statusText === 'success') {
                that.dispatch(constants.GENERATE_LOREM_IPSUM_SUCCESS, data);
            } else {
                that.dispatch(constants.GENERATE_LOREM_IPSUM_ERROR);
            }
        });
    },
    updatePreview: function(currentMarkdownEditor) {
        this.dispatch(constants.UPDATE_PREVIEW, currentMarkdownEditor);
    },

    clearInput: function() {
        this.dispatch(constants.CLEAR_INPUT);
    },

    toggleSidebar: function() {
        this.dispatch(constants.TOGGLE_SIDEBAR);
    },

    createDocument: function() {
        this.dispatch(constants.CREATE_DOCUMENT);
    },

    deleteDocument: function() {
        this.dispatch(constants.DELETE_DOCUMENT);
    },

    selectDocument: function(selectedDocument) {
        this.dispatch(constants.SELECT_DOCUMENT, selectedDocument);
    },

    editDocumentTitle: function(title) {
        this.dispatch(constants.EDIT_DOCUMENT_TITLE, title);
    },

    saveDocumentTitle: function(title) {
        this.dispatch(constants.SAVE_DOCUMENT_TITLE, title);
    },

    updateActiveDocument: function(doc) {
        this.dispatch(constants.UPDATE_ACTIVE_DOCUMENT, doc);
    }
};

// Subcomponents
var TopNav = React.createClass({
    mixins: [
        FluxMixin,
        Fluxxor.StoreWatchMixin('DocumentsStore')
    ],

    styles : {
        container: {
            width: '100%',
            backgroundColor: '#424242',
            color: '#e9e9e9'
        },
        ul: {
            padding: '0px 0px',
            margin: '0% 0% 0% 12%',
            listStyle: 'none',
            overflow: 'auto'
        },
        li: {
            display: 'inline',
            listStyleType: 'none',
            marginRight: '15px',
            cursor: 'pointer'
        }
    },

    getStateFromFlux: function() {
        var flux = this.getFlux();
        return flux.store('DocumentsStore').getState();
    },

    handleNewDocument: function() {
        console.log("click!!!");
        var flux = this.getFlux();
        flux.actions.createDocument();
    },

    render: function() {
        var that = this;
        var classes = 'fa fa-lg fa-plus';

        return (
            <div style={this.styles.container}>
                <ul style={this.styles.ul}>
                    {this.state.documents.map(function(doc) {
                        if (doc.id === that.state.activeDocument.id) {
                            doc = _.extend(doc, {selected: true})
                        }
                        return <DocumentTab data={doc} key={doc.id}/>;
                    })}
                    <li style={this.styles.li} onClick={ this.handleNewDocument }><i className={ classes } /></li>
                </ul>
            </div>
        );
    }
});

var DocumentTab = React.createClass({
    mixins: [
        FluxMixin
    ],

    styles : {
        li: {
            display: 'inline',
            listStyleType: 'none',
            cursor: 'pointer',
            marginRight: '15px',
            padding: '5px'
        },
        selectedLi: {
            display: 'inline',
            listStyleType: 'none',
            cursor: 'pointer',
            marginRight: '15px',
            padding: '5px',
            background: '#666666',
            fontWeight: 'bold'
        }
    },
    handleSelect: function() {
        var flux = this.getFlux();
        flux.actions.selectDocument(this.props.data);
    },

    saveTitleEdit: function() {
        var flux = this.getFlux();
        flux.actions.generateLoremIpsum(val);
    },

    render: function() {
        return (
            <li
                style={this.props.data.selected && this.styles.selectedLi || this.styles.li}
                onClick={ this.handleSelect }
            >{this.props.data.title}</li>
        );
    }
});

var Sidebar = React.createClass({
    mixins: [
        FluxMixin,
        Fluxxor.StoreWatchMixin('DocumentsStore')
    ],

    styles: {
        container: {
            WebkitBoxSizing: 'border-box',
            MozBoxSizing: 'border-box',
            boxSizing: 'border-box',
            float: 'left',
            width: '12%',
            backgroundColor: '#424242',
            color: '#e9e9e9'
        },
        ul: {
            padding: '0px 5px',
            marginTop: '0px',
            marginBottom: '0px'
        },
        li: {
            paddingTop: '2px',
            paddingBottom: '2px',
            cursor: 'pointer'
        },
        i: {
            width: '25px'
        }
    },

    getStateFromFlux: function() {
        var flux = this.getFlux();
        return flux.store('DocumentsStore').getState();
    },

    handleClear: function() {
        var flux = this.getFlux();
        flux.actions.clearInput();
    },

    handleDelete: function() {
        var flux = this.getFlux();
        flux.actions.deleteDocument();
    },

    handleRename: function() {
        console.log("rename");
        var flux = this.getFlux();
        flux.actions.editDocumentTitle();
    },

    setZeroClipboardText: function() {
        if (this.state.clipboardClient) {
            this.state.clipboardClient.setText(this.state.markdownInput);
        }
    },

    componentDidMount: function() {
        var client = new ZeroClipboard(document.getElementsByClassName('clipboard-li'));
        this.setState({ clipboardClient: client });
        this.setZeroClipboardText();
    },

    render: function() {
        this.setZeroClipboardText();
        var deleteLi;
        if (this.state.documents.length > 0) {
            deleteLi = <li style={this.styles.li} onClick={ this.handleDelete }><i style={this.styles.i} className="fa-lg fa fa-trash-o"/>Delete</li>;
        }
        return (
            <div style={this.styles.container}>
                <ul style={this.styles.ul}>
                    <li style={this.styles.li}  onClick={ this.handleRename }><i style={this.styles.i} className="fa-lg fa fa-pencil"/>Rename Document</li>
                    <li style={this.styles.li} className='clipboard-li'><i style={this.styles.i} className="fa-lg fa fa-clipboard"/>Copy to Clipoard</li>
                    <li style={this.styles.li} onClick={ this.handleClear }><i style={this.styles.i} className="fa-lg fa fa-eraser"/>Clear</li>
                    {deleteLi}
                </ul>
            </div>
        );
    }
});

var DocumentsStore = Fluxxor.createStore({
    mixins: [
        FluxMixin
    ],

    initialize: function() {
        this.documents = [];

        this.bindActions(
            constants.CREATE_DOCUMENT, this.onCreateDocument,
            constants.DELETE_DOCUMENT, this.onDeleteDocument,
            constants.EDIT_DOCUMENT_TITLE, this.onEditDocumentTitle,
            constants.SAVE_DOCUMENT_TITLE, this.onSaveDocumentTitle,
            constants.GENERATE_LOREM_IPSUM, this.generateLoremIpsum,
            constants.GENERATE_LOREM_IPSUM_SUCCESS, this.generateLoremIpsumSuccess,
            constants.GENERATE_LOREM_IPSUM_ERROR, this.generateLoremIpsumError,
            constants.CLEAR_INPUT, this.onClearInput,
            constants.UPDATE_PREVIEW, this.onUpdatePreview,
            constants.SELECT_DOCUMENT, this.onSelectDocument
        );
        this.onCreateDocument();
    },

    onCreateDocument: function() {
        _.each(this.documents, function(document){
            document.selected = false;
        });
        var id = _.uniqueId();
        var newDoc = {id: id, title: 'Untitled_'+id, text: ''};
        this.documents.push(newDoc);

        this.activeDocument = newDoc;

        this.emit('change');
    },

    onDeleteDocument: function() {
        var that = this;
        this.documents = this.documents.filter(function(document) {
            return document.id != that.activeDocument.id
        });

        this.activeDocument = _.last(this.documents);

        this.emit('change');
    },

    onSelectDocument: function(payload) {
        _.each(this.documents, function(document){
            document.selected = false;
        });

        this.activeDocument = _.findWhere(this.documents, {id: payload.id});

        this.emit('change');
    },

    onEditDocumentTitle: function() {
        this.activeEdit = true;

        this.emit('change');
    },

    onSaveDocumentTitle: function(title) {
        this.activeEdit = false;
        this.activeDocument.title = title;

        this.emit('change');
    },

    generateLoremIpsum:function() {
        console.log('Generating lorem ipsum from the store....');
    },

    generateLoremIpsumError: function() {
        console.error('There was an error generating lorem ipsum...');
    },

    generateLoremIpsumSuccess: function(loremIpsum) {
        // tells whatever views are listening that the data has changed
        this.activeDocument.text += loremIpsum;
        this.emit('change');
    },

    onUpdatePreview: function(payload) {
        // tells whatever views are listening that the data has changed
        this.activeDocument.text = payload;
        this.emit('change');
    },

    onClearInput: function() {
        // tells whatever views are listening that the data has changed
        this.activeDocument.text = '';
        this.emit('change');
    },

    getState: function() {
        return {
            documents: this.documents,
            activeDocument: this.activeDocument,
            activeEdit: this.activeEdit
        };
    }
});

// Controller View
var Application = React.createClass({
    mixins: [
        FluxMixin
    ],

    render: function() {
        return (
            <div>
                <TopNav/>
                <Sidebar/>
                <MarkdownViewer />
            </div>
        )
    }
});

// Markdown Viewer component
var MarkdownViewer = React.createClass({
    mixins: [
        FluxMixin,
        Fluxxor.StoreWatchMixin('DocumentsStore')
    ],

    getStateFromFlux: function() {
        var flux = this.getFlux();
        return flux.store('DocumentsStore').getState();
    },

    render: function() {
        if (this.state.documents.length > 0) {
            return (
                <div>
                    <MarkdownEditor
                        flux={ flux }
                        textareaRows="10"
                        textAreaCols="50"
                    />
                    <MarkdownPreview
                        flux={ flux }
                    />
                </div>
            )
        } else {
            return (
                <div></div>
            )
        }

    }
});

// Markdown editor component
var MarkdownEditor = React.createClass({
    mixins: [
        FluxMixin,
        Fluxxor.StoreWatchMixin('DocumentsStore')
    ],

    styles: {
        container: {
            WebkitBoxSizing: 'border-box',
            MozBoxSizing: 'border-box',
            boxSizing: 'border-box',
            float: 'left',
            width: '43.0%',
            marginLeft: '1.0%'
        },
        textarea: {
            fontFamily: 'Courier, monospace',
            WebkitBoxSizing: 'border-box',
            MozBoxSizing: 'border-box',
            boxSizing: 'border-box',
            width: '100%',
            minHeight: '500px',
            border: 0,
            resize: 'vertical'

        },
        button: {
            border: 0,
            WebkitBorderRadius: 3,
            MozBorderRadius: 3,
            borderRadius: 3,
            color: '#ffffff',
            fontSize: 12,
            background: '#3299bb',
            padding: '10px 20px 10px 20px',
            textDecoration: null
        },
        buttonHover: {
            border: 0,
            WebkitBorderRadius: 3,
            MozBorderRadius: 3,
            borderRadius: 3,
            color: '#ffffff',
            fontSize: 12,
            background: '#26768E',
            padding: '10px 20px 10px 20px',
            textDecoration: null
        },
        titleEdit: {
            fontSize: '2em',
            fontWeight: 'bold',
            border: '1px solid #666666',
            background: 'none'
        }
    },

    getInitialState: function() {
        return {buttonHover: false}
    },

    getStateFromFlux: function() {
        var flux = this.getFlux();
        return flux.store('DocumentsStore').getState();
    },

    handleLoremIpsumClick: function() {
        var flux = this.getFlux();
        flux.actions.generateLoremIpsum();
    },

    // we need an onChange handler since React textarea elements
    // with value attributes are considered "controlled", and as such
    // the textarea would not be editable by users. this makes the
    // text area editable for users
    handleOnChange: function(event) {
        var state = _.extend(this.state.activeDocument, {text: event.target.value});
        this.setState(
            {
                activeDocument: state
            }
        );
    },

    handleOnKeyUp: function(event) {
        var flux = this.getFlux();
        flux.actions.updatePreview(this.state.activeDocument.text);
    },

    setHoverTrue: function() {
        this.setState({
            buttonHover: true
        });
    },

    setHoverFalse: function() {
        this.setState({
            buttonHover: false
        });
    },

    saveDocumentTitle: function(event) {
        var flux = this.getFlux();
        flux.actions.saveDocumentTitle(event.target.value);
    },

    render: function() {
        var header;
        if (this.state.activeEdit === true) {
            header = <input type='text' placeholder={this.state.activeDocument.title} onBlur={this.saveDocumentTitle} ref="titleInput" style={this.styles.titleEdit}/>;
        } else {
            header = <h2>{this.state.activeDocument.title} Editor</h2>;
        }

        return (
            <div style={this.styles.container}>
                {header}
                <textarea
                    style={this.styles.textarea}
                    ref="markdownTextarea"
                    data={ this.state.activeDocument.id }
                    value={ this.state.activeDocument.text }
                    onChange={ this.handleOnChange }
                    onKeyUp={ this.handleOnKeyUp }
                />
                <br />
                <button
                    style={this.state.buttonHover && this.styles.buttonHover || this.styles.button}
                    onMouseOver={ this.setHoverTrue } onMouseOut={ this.setHoverFalse }
                    onClick={ this.handleLoremIpsumClick }
                >Get Lorem Ipsum!</button>
            </div>
        );
    }
});

// Markdown preview component
var MarkdownPreview = React.createClass({
    mixins: [
        FluxMixin,
        Fluxxor.StoreWatchMixin('DocumentsStore')
    ],

    styles: {
        container: {
            WebkitBoxSizing: 'border-box',
            MozBoxSizing: 'border-box',
            boxSizing: 'border-box',
            float: 'left',
            width: '43.0%',
            marginLeft: '1.0%'
        },
        mdPreview: {
            WebkitBoxSizing: 'border-box',
            MozBoxSizing: 'border-box',
            boxSizing: 'border-box',
            background: '#f0f0f0',
            padding: '5px 15px',
            minHeight: '500px'
        }
    },

    getStateFromFlux: function() {
        var flux = this.getFlux();
        return flux.store('DocumentsStore').getState();
    },

    render: function() {
        var div;
        if (this.state.activeDocument.text) {
            div = <div
                id='mdPreview'
                style={this.styles.mdPreview}
                dangerouslySetInnerHTML={ { __html: marked(this.state.activeDocument.text, {sanitize: true}) } }
            />;
        } else {
            div = <div
                id='mdPreview'
                style={this.styles.mdPreview}
            />;
        }

        return (
            <div style={this.styles.container}>
                <h2>{this.state.activeDocument.title} Preview</h2>
            {div}
            </div>
        )
    }
});

// Fluxxor application initialization and main rendering
var stores = {
    DocumentsStore: new DocumentsStore()
};

// register actions and stores with fluxxor application
// this creates a flux instance
var flux = new Fluxxor.Flux(stores, actions);

React.render(
    <Application
        flux={ flux }
    />,
    document.getElementById('container')
);