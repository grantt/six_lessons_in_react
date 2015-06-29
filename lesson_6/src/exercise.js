// Mixins
var FluxMixin = Fluxxor.FluxMixin(React);

// Action constants
var constants = {
    CLEAR_INPUT: 'CLEAR_INPUT',
    GENERATE_LOREM_IPSUM: 'GENERATE_LOREM_IPSUM',
    GENERATE_LOREM_IPSUM_ERROR: 'GENERATE_LOREM_IPSUM_ERROR',
    GENERATE_LOREM_IPSUM_SUCCESS: 'GENERATE_LOREM_IPSUM_SUCCESS',
    UPDATE_PREVIEW: 'UPDATE_PREVIEW',
    CREATE_DOCUMENT: 'CREATE_DOCUMENT',
    DELETE_DOCUMENT: 'DELETE_DOCUMENT',
    EDIT_DOCUMENT_TITLE: 'EDIT_DOCUMENT_TITLE',
    SAVE_DOCUMENT_TITLE: 'SAVE_DOCUMENT_TITLE'
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

    editDocumentTitle: function(title) {
        this.dispatch(constants.EDIT_DOCUMENT_TITLE, title);
    },

    saveDocumentTitle: function(title) {
        this.dispatch(constants.SAVE_DOCUMENT_TITLE, title);
    }
};

// Base CSS styles
var styles = {
    li: {
        padding: '5px',
        display: 'inline-block',
        listStyleType: 'none',
        marginRight: '15px',
        cursor: 'pointer'
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
        background: '#26768E'
    }
};

// Stores
var DocumentStore = Fluxxor.createStore({
    mixins: [
        FluxMixin
    ],

    initialize: function() {
        this.document = {
            'text': '',
            'title': 'Untitled'
        };
        this.isEditActive = false;

        this.bindActions(
            constants.EDIT_DOCUMENT_TITLE, this.onEditDocumentTitle,
            constants.SAVE_DOCUMENT_TITLE, this.onSaveDocumentTitle,
            constants.GENERATE_LOREM_IPSUM, this.generateLoremIpsum,
            constants.GENERATE_LOREM_IPSUM_SUCCESS, this.generateLoremIpsumSuccess,
            constants.GENERATE_LOREM_IPSUM_ERROR, this.generateLoremIpsumError,
            constants.CLEAR_INPUT, this.onClearInput,
            constants.UPDATE_PREVIEW, this.onUpdatePreview
        );
    },

    onEditDocumentTitle: function() {
        this.isEditActive = true;

        this.emit('change');
    },

    onSaveDocumentTitle: function(title) {
        this.isEditActive = false;
        this.document.title = title;

        this.emit('change');
    },

    generateLoremIpsum:function() {
        console.log('Generating lorem ipsum from the store....');
    },

    generateLoremIpsumError: function() {
        console.error('There was an error generating lorem ipsum...');
    },

    generateLoremIpsumSuccess: function(loremIpsum) {
        this.document.text += loremIpsum;

        this.emit('change');
    },

    onUpdatePreview: function(payload) {
        this.document.text = payload;

        this.emit('change');
    },

    onClearInput: function() {
        this.document.text = '';

        this.emit('change');
    },

    getState: function() {
        return {
            document: this.document,
            isEditActive: this.isEditActive
        };
    }
});

var Sidebar = React.createClass({
    displayName : 'Sidebar',

    mixins: [
        FluxMixin,
        Fluxxor.StoreWatchMixin('DocumentStore')
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
        return flux.store('DocumentStore').getState();
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
        var flux = this.getFlux();
        flux.actions.editDocumentTitle();
    },

    render: function() {
        return (
            <div style={this.styles.container}>
                <ul style={this.styles.ul}>
                    <li style={this.styles.li} onClick={this.handleRename}><i style={this.styles.i} className="fa-lg fa fa-pencil"/>Rename Document</li>
                    <li style={this.styles.li} onClick={this.handleClear}><i style={this.styles.i} className="fa-lg fa fa-eraser"/>Clear</li>
                </ul>
            </div>
        );
    }
});

// Markdown editor Subcomponent
var MarkdownEditor = React.createClass({
    displayName : 'MarkdownEditor',

    mixins: [
        FluxMixin,
        Fluxxor.StoreWatchMixin('DocumentStore')
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
        titleEdit: {
            WebkitBoxSizing: 'border-box',
            MozBoxSizing: 'border-box',
            boxSizing: 'border-box',
            width: '100%',
            color: '#424242',
            fontFamily: '"Exo", "Helvetica Neue", Helvetica, Arial, sans-serif',
            fontSize: '2em',
            fontWeight: 'bold',
            padding: 'none',
            border: 'none',
            margin: '-1px 0 16px -1px',
            lineHeight: '1.7',
            background: 'none'
        }
    },

    getInitialState: function() {
        return {buttonHover: false}
    },

    getStateFromFlux: function() {
        var flux = this.getFlux();
        return flux.store('DocumentStore').getState();
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
        var state = _.extend(this.state.document, {text: event.target.value});
        this.setState(
            {
                document: state
            }
        );
    },

    handleOnKeyUp: function() {
        var flux = this.getFlux();
        flux.actions.updatePreview(this.state.document.text);
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

    handleTitleEditorKeyDown: function(event) {
        if (event.keyCode == 13 ) {
            return this.saveDocumentTitle(event);
        }
    },

    saveDocumentTitle: function(event) {
        var flux = this.getFlux();
        flux.actions.saveDocumentTitle(event.target.value);
    },

    render: function() {
        var header;
        if (this.state.isEditActive === true) {
            header = (<input
                type='text'
                defaultValue={this.state.document.title}
                onBlur={this.saveDocumentTitle}
                onKeyDown={this.handleTitleEditorKeyDown}
                style={this.styles.titleEdit}
                autoFocus='true'
            />);
        } else {
            header = <h2>{this.state.document.title} Editor</h2>;
        }

        return (
            <div style={this.styles.container}>
                {header}
                <textarea
                    style={this.styles.textarea}
                    value={this.state.document.text}
                    onChange={this.handleOnChange}
                    onKeyUp={this.handleOnKeyUp}
                />
                <br />
                <button
                    style={this.state.buttonHover ? _.extend({}, styles.button, styles.buttonHover) : styles.button}
                    onMouseOver={this.setHoverTrue}
                    onMouseOut={this.setHoverFalse}
                    onClick={this.handleLoremIpsumClick}
                >Get Lorem Ipsum!</button>
            </div>
        );
    }
});

// Markdown preview Subcomponent
var MarkdownPreview = React.createClass({
    displayName : 'MarkdownPreview',

    mixins: [
        FluxMixin,
        Fluxxor.StoreWatchMixin('DocumentStore')
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
        return flux.store('DocumentStore').getState();
    },

    render: function() {
        var div;
        if (this.state.document.text) {
            div = (<div
                id='mdPreview'
                style={this.styles.mdPreview}
                dangerouslySetInnerHTML={{__html: marked(this.state.document.text, {sanitize: true})}}
            />);
        } else {
            div = (<div
                id='mdPreview'
                style={this.styles.mdPreview}
            />);
        }

        return (
            <div style={this.styles.container}>
                <h2>{this.state.document.title} Preview</h2>
            {div}
            </div>
        )
    }
});

// Markdown Viewer Component
var MarkdownViewer = React.createClass({
    displayName : 'MarkdownViewer',

    mixins: [
        FluxMixin,
        Fluxxor.StoreWatchMixin('DocumentStore')
    ],

    getStateFromFlux: function() {
        var flux = this.getFlux();
        return flux.store('DocumentStore').getState();
    },

    render: function() {
        return (
            <div>
                <MarkdownEditor
                    flux={flux}
                />
                <MarkdownPreview
                    flux={flux}
                />
            </div>
        )
    }
});


// Application Controller View
var Application = React.createClass({
    displayName : 'Application',

    mixins: [
        FluxMixin
    ],

    render: function() {
        return (
            <div>
                <Sidebar/>
                <MarkdownViewer />
            </div>
        )
    }
});

// Fluxxor application initialization and main rendering
var stores = {
    DocumentStore: new DocumentStore()
};

// register actions and stores with fluxxor application
// this creates a flux instance
var flux = new Fluxxor.Flux(stores, actions);

React.render(
    <Application
        flux={flux}
    />,
    document.getElementById('container')
);