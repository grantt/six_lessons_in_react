// Mixins
var FluxMixin = Fluxxor.FluxMixin(React);

// Action constants
var constants = {
    GENERATE_LOREM_IPSUM: 'GENERATE_LOREM_IPSUM',
    GENERATE_LOREM_IPSUM_ERROR: 'GENERATE_LOREM_IPSUM_ERROR',
    GENERATE_LOREM_IPSUM_SUCCESS: 'GENERATE_LOREM_IPSUM_SUCCESS'
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
            constants.GENERATE_LOREM_IPSUM, this.handleLoremIpsum,
            constants.GENERATE_LOREM_IPSUM_SUCCESS, this.handleLoremIpsumSuccess,
            constants.GENERATE_LOREM_IPSUM_ERROR, this.handleLoremIpsumError
        );
    },

    handleLoremIpsum:function() {
        console.log('Generating lorem ipsum from the store....');
    },

    handleLoremIpsumError: function() {
        console.error('There was an error generating lorem ipsum...');
    },

    handleLoremIpsumSuccess: function(loremIpsum) {
        this.document.text += loremIpsum;

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

    render: function() {
        return (
            <div>
                <textarea
                    rows={ this.props.textareaRows }
                    cols={ this.props.textAreaCols }
                    value={this.state.document.text}
                    onChange={this.handleOnChange}
                />
                <br />
                <button
                    onClick={this.handleLoremIpsumClick}
                >Get Lorem Ipsum!</button>
            </div>
        );
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
    <MarkdownEditor
        flux={flux}
        textareaRows="10"
        textAreaCols="50"
    />,
    document.getElementById('container')
);