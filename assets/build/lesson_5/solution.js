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
    generateLoremIpsum: function(currentMarkdownInput) {
        // we should still dispatch the original action, in case any stores
        // are listening for the first event, that kicks off the API call
        this.dispatch(constants.GENERATE_LOREM_IPSUM, currentMarkdownInput);

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

// Subcomponents
var TopNav = React.createClass({displayName: "TopNav",
    mixins: [
        FluxMixin
    ],

    styles : {
        container: {
            width: '100%',
            backgroundColor: '#424242',
            color: '#e9e9e9'
        },
        ul: {
            padding: '0px 5px',
            margin: '0px 0px',
            listStyle: 'none'
        },
        li: {
            display: 'inline-block',
            marginRight: '15px'
        }
    },
    handleSidebarToggle: function() {
        var flux = this.getFlux();
        flux.actions.toggleSidebar();
    },

    render: function() {
        var classes = 'fa fa-lg ';
        classes += this.props.sidebarOpen ? 'fa-times' : 'fa-bars';

        return(
            React.createElement("div", {style: this.styles.container}, 
                React.createElement("ul", {style: this.styles.ul}, 
                    React.createElement("li", {style: this.styles.li, onClick:  this.handleSidebarToggle}, React.createElement("i", {className:  classes })), 
                    React.createElement("li", {style: this.styles.li}, "My Awesome Markdown preview generator")
                )
            )
        );
    }
});

var Sidebar = React.createClass({displayName: "Sidebar",
    mixins: [
        FluxMixin,
        Fluxxor.StoreWatchMixin('MarkdownInputStore')
    ],

    styles: {
        container: {
            WebkitBoxSizing: 'border-box',
            MozBoxSizing: 'border-box',
            boxSizing: 'border-box',
            backgroundColor: '#424242',
            color: '#e9e9e9'
        },
        ul: {
            padding: '0px 5px',
            marginTop: '0px',
            marginBottom: '0px'
        }
    },

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
                React.createElement("div", {style: this.styles.container}, 
                    React.createElement("ul", {style: this.styles.ul, className: "fa-ul"}, 
                        React.createElement("li", {onClick:  this.handleClear}, React.createElement("i", {className: "fa-li fa fa-eraser"}), "Clear"), 
                        React.createElement("li", {className: "clipboard-li"}, React.createElement("i", {className: "fa-li fa fa-clipboard"}), "Copy to Clipoard")
                    )
                )
            );
        } else {
            return React.createElement("ul", null);
        }
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

// Controller View
var Application = React.createClass({displayName: "Application",
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
                React.createElement(TopNav, {sidebarOpen:  this.state.sidebarOpen}), 
                React.createElement(Sidebar, {sidebarOpen:  this.state.sidebarOpen}), 
                React.createElement(MarkdownEditor, null)
            )
        )
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

var MarkdownInputStore = Fluxxor.createStore({
    initialize: function() {
        this.markdownInput = '';

        // reigsters the following callbacks with the dispatcher
        this.bindActions(
            constants.GENERATE_LOREM_IPSUM, this.generateLoremIpsum,
            constants.GENERATE_LOREM_IPSUM_SUCCESS, this.generateLoremIpsumSuccess,
            constants.GENERATE_LOREM_IPSUM_ERROR, this.generateLoremIpsumError,
            constants.UPDATE_PREVIEW, this.updatePreview
        );
    },

    generateLoremIpsum:function(currentInput) {
        console.log('Generating lorem ipsum from the store....');
        this.markdownInput = currentInput;
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

    getState: function() {
        return {
            markdownInput: this.markdownInput
        };
    }
});

// Markdown input component
var MarkdownInput = React.createClass({displayName: "MarkdownInput",
    mixins: [
        FluxMixin,
        Fluxxor.StoreWatchMixin('MarkdownInputStore')
    ],

    styles: {
        container: {
            WebkitBoxSizing: 'border-box',
            MozBoxSizing: 'border-box',
            boxSizing: 'border-box',
            float: 'left',
            width: '49.5%',
            marginRight: '0.5%'
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
        }
    },

    getInitialState: function() {
        return {hover: false}
    },

    getStateFromFlux: function() {
        var flux = this.getFlux();
        return flux.store('MarkdownInputStore').getState();
    },

    handleLoremIpsumClick: function() {
        var flux = this.getFlux();
        flux.actions.generateLoremIpsum(this.state.markdownInput);
    },

    // we need an onChange handler since React textarea elements
    // with value attributes are considered "controlled", and as such
    // the textarea would not be editable by users. this makes the
    // text area editable for users
    handleOnChange: function(event) {
        this.setState({ markdownInput: event.target.value });
    },

    handleOnKeyUp: function(event) {
        var flux = this.getFlux();
        flux.actions.updatePreview(this.state.markdownInput);
    },

    setHoverTrue: function() {
        this.setState({
            hover: true
        });
    },

    setHoverFalse: function() {
        this.setState({
            hover: false
        });
    },

    render: function() {
        return (
            React.createElement("div", {style: this.styles.container}, 
                React.createElement("h2", null, "Editor"), 
                React.createElement("textarea", {
                    style: this.styles.textarea, 
                    ref: "markdownTextarea", 
                    value:  this.state.markdownInput, 
                    onChange:  this.handleOnChange, 
                    onKeyUp:  this.handleOnKeyUp}
                ), 
                React.createElement("br", null), 
                React.createElement("button", {
                    style: this.state.hover && this.styles.buttonHover || this.styles.button, 
                    onMouseOver:  this.setHoverTrue, onMouseOut:  this.setHoverFalse, 
                    onClick:  this.handleLoremIpsumClick
                }, "Get Lorem Ipsum!")
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

    styles: {
        container: {
            WebkitBoxSizing: 'border-box',
            MozBoxSizing: 'border-box',
            boxSizing: 'border-box',
            float: 'left',
            width: '49.5%',
            marginLeft: '0.5%'
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
        return flux.store('MarkdownInputStore').getState();
    },

    render: function() {
        return (
            React.createElement("div", {style: this.styles.container}, 
                React.createElement("h2", null, "Preview"), 
                React.createElement("div", {
                    id: "mdPreview", 
                    style: this.styles.mdPreview, 
                    dangerouslySetInnerHTML:  { __html: marked(this.state.markdownInput, {sanitize: true})} }
                )
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
    React.createElement(Application, {
        flux:  flux, 
        sidebarOpen:  true }
    ),
    document.getElementById('container')
);