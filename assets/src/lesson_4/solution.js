// Mixins
var FluxMixin = Fluxxor.FluxMixin(React);

// Action constants
var constants = {
    GENERATE_LOREM_IPSUM: 'GENERATE_LOREM_IPSUM',
    GENERATE_LOREM_IPSUM_ERROR: 'GENERATE_LOREM_IPSUM_ERROR',
    GENERATE_LOREM_IPSUM_SUCCESS: 'GENERATE_LOREM_IPSUM_SUCCESS',
    UPDATE_PREVIEW: 'UPDATE_PREVIEW'
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
    }
};

// Base CSS styles
var styles = {
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
            'text': ''
        };

        this.bindActions(
            constants.GENERATE_LOREM_IPSUM, this.generateLoremIpsum,
            constants.GENERATE_LOREM_IPSUM_SUCCESS, this.generateLoremIpsumSuccess,
            constants.GENERATE_LOREM_IPSUM_ERROR, this.generateLoremIpsumError,
            constants.UPDATE_PREVIEW, this.onUpdatePreview
        );
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

    getState: function() {
        return {
            document: this.document
        };
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

    render: function() {
        return (
            <div style={this.styles.container}>
                <h2>Editor</h2>
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
                <h2>Preview</h2>
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
                    textareaRows="10"
                    textAreaCols="50"
                />
                <MarkdownPreview
                    flux={flux}
                />
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
    <MarkdownViewer
        flux={flux}
    />,
    document.getElementById('container')
);