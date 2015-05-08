// Mixins
var FluxMixin = Fluxxor.FluxMixin(React);

// Action constants
var constants = {
    CLEAR_INPUT: 'CLEAR_INPUT',
    GENERATE_LOREM_IPSUM: 'GENERATE_LOREM_IPSUM',
    GENERATE_LOREM_IPSUM_ERROR: 'GENERATE_LOREM_IPSUM_ERROR',
    GENERATE_LOREM_IPSUM_SUCCESS: 'GENERATE_LOREM_IPSUM_SUCCESS',
    UPDATE_PREVIEW: 'UPDATE_PREVIEW',
    TOGGLE_SIDEBAR: 'TOGGLE_SIDEBAR'
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
    },

    updatePreview: function(currentMarkdownInput) {
        this.dispatch(constants.UPDATE_PREVIEW, currentMarkdownInput);
    },

    clearInput: function() {
        this.dispatch(constants.CLEAR_INPUT);
    },

    toggleSidebar: function() {
        this.dispatch(constants.TOGGLE_SIDEBAR);
    }
};

var MarkdownInputStore = Fluxxor.createStore({
    initialize: function() {
        this.markdownInput = '';

        // reigsters the following callbacks with the dispatcher
        this.bindActions(
            constants.CLEAR_INPUT, this.clearInput,
            constants.GENERATE_LOREM_IPSUM, this.generateLoremIpsum,
            constants.GENERATE_LOREM_IPSUM_SUCCESS, this.generateLoremIpsumSuccess,
            constants.GENERATE_LOREM_IPSUM_ERROR, this.generateLoremIpsumError,
            constants.UPDATE_PREVIEW, this.updatePreview
        );
    },

    generateLoremIpsum:function(currentInput) {
        console.log('Generating lorem ipsum from the store....');
    },

    generateLoremIpsumError: function() {
        console.error('There was an error generating lorem ipsum...');
    },

    generateLoremIpsumSuccess: function(loremIpsum) {
        this.markdownInput += loremIpsum;
        // tells whatever views are listening that the data has changed
        this.emit('change');
    },

    updatePreview: function(currentInput) {
        // tells whatever views are listening that the data has changed
        this.markdownInput = currentInput;
        this.emit('change');
    },

    clearInput: function() {
        this.markdownInput = '';
        this.emit('change');
    },

    getState: function() {
        return {
            markdownInput: this.markdownInput
        };
    }
});

var NavigationStore = Fluxxor.createStore({
    initialize: function() {
        this.sidebarOpen = false;

        this.bindActions(
            constants.TOGGLE_SIDEBAR, this.toggleSidebar
        );
    },

    toggleSidebar: function() {
        this.sidebarOpen = !this.sidebarOpen;
        console.log(this.sidebarOpen);
        this.emit('change');
    },

    getState: function() {
        return {
            sidebarOpen: this.sidebarOpen
        };
    }
});

// Markdown Editor component
var MarkdownEditor = React.createClass({displayName: "MarkdownEditor",
    render: function() {
        return (
            React.createElement("div", null, 
                React.createElement(MarkdownInput, {
                    flux:  flux, 
                    textareaRows: "10", 
                    textAreaCols: "50"}
                ), 
                React.createElement(MarkdownPreview, {
                    flux:  flux }
                )
            )
        )
    }
});

// Markdown input component
var MarkdownInput = React.createClass({displayName: "MarkdownInput",
    mixins: [
        FluxMixin,
        Fluxxor.StoreWatchMixin('MarkdownInputStore')
    ],

    getStateFromFlux: function() {
        var flux = this.getFlux();
        return flux.store('MarkdownInputStore').getState();
    },

    handleLoremIpsumClick: function() {
        var flux = this.getFlux();
        flux.actions.generateLoremIpsum(this.state.markdownInput);
    },

    handleOnChange: function(event) {
        var flux = this.getFlux();
        flux.actions.updatePreview(event.target.value);
    },

    render: function() {
        return (
            React.createElement("div", {id: "md-editor"}, 
                React.createElement("textarea", {
                    rows:  this.props.textareaRows, 
                    cols:  this.props.textAreaCols, 
                    ref: "markdownTextarea", 
                    value:  this.state.markdownInput, 
                    onChange:  this.handleOnChange}
                ), 
                React.createElement("br", null), 
                React.createElement("button", {onClick:  this.handleLoremIpsumClick}, "Get Lorem Ipsum!")
            )
        );
    }
});

// Markdown preview component
var MarkdownPreview = React.createClass({displayName: "MarkdownPreview",
    mixins: [
        FluxMixin,
        Fluxxor.StoreWatchMixin('MarkdownInputStore')
    ],
    getStateFromFlux: function() {
        var flux = this.getFlux();
        return flux.store('MarkdownInputStore').getState();
    },
    render: function() {
        return (
            React.createElement("div", {
                id: "md-preview", 
                dangerouslySetInnerHTML:  { __html: marked(this.state.markdownInput, {sanitize: true})} }
            )
        )
    }
});


// Subcomponents
var TopNav = React.createClass({displayName: "TopNav",
    mixins: [
        FluxMixin
    ],

    handleSidebarToggle: function() {
        var flux = this.getFlux();
        flux.actions.toggleSidebar();
    },

    render: function() {
        var classes = 'fa fa-lg ';
        classes += this.props.sidebarOpen ? 'fa-times' : 'fa-bars';

        return(
            React.createElement("ul", null, 
                React.createElement("li", {onClick:  this.handleSidebarToggle}, React.createElement("i", {className:  classes })), 
                React.createElement("li", null, "My Awesome Markdown preview generator")
            )
        );
    }
});

var Sidebar = React.createClass({displayName: "Sidebar",
    mixins: [
        FluxMixin,
        Fluxxor.StoreWatchMixin('MarkdownInputStore')
    ],

    getStateFromFlux: function() {
        var flux = this.getFlux();
        return flux.store('MarkdownInputStore').getState();
    },

    handleClear: function() {
        var flux = this.getFlux();
        flux.actions.clearInput();
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

        if (this.props.sidebarOpen) {
            return (
                React.createElement("ul", {className: "fa-ul"}, 
                    React.createElement("li", {onClick:  this.handleClear}, React.createElement("i", {className: "fa-li fa fa-eraser"}), "Clear"), 
                    React.createElement("li", {className: "clipboard-li"}, React.createElement("i", {className: "fa-li fa fa-clipboard"}), "Copy to Clipoard")
                )
            );
        } else {
            return React.createElement("ul", null);
        }
    }
});

// Controller View
var Navigation = React.createClass({displayName: "Navigation",
    mixins: [
        FluxMixin,
        Fluxxor.StoreWatchMixin('NavigationStore')
    ],

    getStateFromFlux: function() {
        var flux = this.getFlux();
        return flux.store('NavigationStore').getState();
    },

    render: function() {
        return (
            React.createElement("div", null, 
                React.createElement(Sidebar, {sidebarOpen:  this.state.sidebarOpen}), 
                React.createElement(TopNav, {sidebarOpen:  this.state.sidebarOpen})
            ) 
        )
    }
});

// Fluxxor application initialization and main rendering
var stores = {
    MarkdownInputStore: new MarkdownInputStore(),
    NavigationStore: new NavigationStore()
};

// register actions and stores with fluxxor application
// this creates a flux instance
var flux = new Fluxxor.Flux(stores, actions);

React.render(
    React.createElement(MarkdownEditor, null),
    document.getElementById('markdown-container')
);

React.render(
    React.createElement(Navigation, {flux:  flux }),
    document.getElementById('nav-container')
);