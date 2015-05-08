// Subcomponents
var TopNav = React.createClass({
    render: function() {
        var classes = 'fa fa-lg ';
        classes += this.props.sidebarOpen ? 'fa-times' : 'fa-bars';

        return(
            <ul>
                <li><i className={ classes } /></li>
                <li>My Awesome Markdown preview generator</li>
            </ul>
        );
    }
});

var Sidebar = React.createClass({
    render: function() {
        var styles = {
            ul: {
                display: this.props.sidebarOpen ? 'block' : 'none'
            }
        };

        return (
            <ul className="fa-ul" style={ styles.ul }>
                <li><i className="fa-li fa fa-eraser" />Clear</li>
                <li><i className="fa-li fa fa-clipboard" />Copy to Clipoard</li>
                <li><i className="fa-li fa fa-file-text-o" />New Markdown document</li>
            </ul>
        );
    }
});

// Controller View
var Navigation = React.createClass({
    render: function() {
        return (
            <div>
                <Sidebar { ...this.props } />
                <TopNav { ...this.props } />
            </div> 
        )
    }
});

React.render(
    <Navigation sidebarOpen={ true } />,
    document.getElementById('nav-container')
);