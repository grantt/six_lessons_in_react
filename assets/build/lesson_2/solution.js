// Mixins
var FluxMixin = Fluxxor.FluxMixin(React);

// Action constants
var constants = {
    GENERATE_LOREM_IPSUM: 'GENERATE_LOREM_IPSUM',
    GENERATE_LOREM_IPSUM_ERROR: 'GENERATE_LOREM_IPSUM_ERROR',
    GENERATE_LOREM_IPSUM_SUCCESS: 'GENERATE_LOREM_IPSUM_SUCCESS'
};

var actions = {
    generateLoremIpsum: function() {
        // we should still dispatch the original action, in case any stores
        // are listening for the first event, that kicks off the API call
        this.dispatch(constants.GENERATE_LOREM_IPSUM);

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

var LoremIpsumStore = Fluxxor.createStore({
    initialize: function() {
        this.generatedIpsum = '';

        // reigsters the following callbacks with the dispatcher
        this.bindActions(
            constants.GENERATE_LOREM_IPSUM, this.generateLoremIpsum,
            constants.GENERATE_LOREM_IPSUM_SUCCESS, this.generateLoremIpsumSuccess,
            constants.GENERATE_LOREM_IPSUM_ERROR, this.generateLoremIpsumError
        );
    },

    generateLoremIpsum:function() {
        console.log('Generating lorem ipsum from the store....');
    },

    generateLoremIpsumError: function() {
        console.error('There was an error generating lorem ipsum...');
    },

    generateLoremIpsumSuccess: function(loremIpsum) {
        this.generatedIpsum = loremIpsum;
        // tells whatever views are listening that the data has changed
        this.emit('change');
    },

    getState: function() {
        return {
            loremIpsum: this.generatedIpsum
        };
    }
});

// Markdown input component
var MarkdownInput = React.createClass({displayName: "MarkdownInput",
    mixins: [
        FluxMixin,
        Fluxxor.StoreWatchMixin('LoremIpsumStore')
    ],

    getStateFromFlux: function() {
        var flux = this.getFlux();
        return flux.store('LoremIpsumStore').getState();
    },

    handleLoremIpsumClick: function() {
        var flux = this.getFlux();
        flux.actions.generateLoremIpsum();
    },

    render: function() {
        return (
            React.createElement("div", null, 
                React.createElement("textarea", {
                    rows:  this.props.textareaRows, 
                    cols:  this.props.textAreaCols, 
                    value:  this.state.loremIpsum}
                ), 
                React.createElement("br", null), 
                React.createElement("button", {onClick:  this.handleLoremIpsumClick}, "Get Lorem Ipsum!")
            )
        );
    }
});

// Fluxxor application initialization and main rendering
var stores = {
    LoremIpsumStore: new LoremIpsumStore()
};

// register actions and stores with fluxxor application
// this creates a flux instance
var flux = new Fluxxor.Flux(stores, actions);

React.render(
    React.createElement(MarkdownInput, {
        flux:  flux, 
        textareaRows: "10", 
        textAreaCols: "50"}
    ),
    document.getElementById('container')
);