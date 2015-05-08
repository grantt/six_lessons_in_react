// Subcomponents
var TopNav = React.createClass({displayName: "TopNav",
    render: function() {
        var classes = 'fa fa-lg ';
        classes += this.props.sidebarOpen ? 'fa-times' : 'fa-bars';

        return(
            React.createElement("ul", null, 
                React.createElement("li", null, React.createElement("i", {className:  classes })), 
                React.createElement("li", null, "My Awesome Markdown preview generator")
            )
        );
    }
});

var Sidebar = React.createClass({displayName: "Sidebar",
    render: function() {
        var styles = {
            ul: {
                display: this.props.sidebarOpen ? 'block' : 'none'
            }
        };

        return (
            React.createElement("ul", {className: "fa-ul", style:  styles.ul}, 
                React.createElement("li", null, React.createElement("i", {className: "fa-li fa fa-eraser"}), "Clear"), 
                React.createElement("li", null, React.createElement("i", {className: "fa-li fa fa-clipboard"}), "Copy to Clipoard"), 
                React.createElement("li", null, React.createElement("i", {className: "fa-li fa fa-file-text-o"}), "New Markdown document")
            )
        );
    }
});

// Controller View
var Navigation = React.createClass({displayName: "Navigation",
    render: function() {
        return (
            React.createElement("div", null, 
                React.createElement(Sidebar, React.__spread({},   this.props )), 
                React.createElement(TopNav, React.__spread({},   this.props ))
            ) 
        )
    }
});

React.render(
    React.createElement(Navigation, {sidebarOpen:  true }),
    document.getElementById('nav-container')
);