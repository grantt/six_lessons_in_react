// Lesson 1 Solution - solution_2.js

var Buttons = React.createClass({displayName: "Buttons",
    handleLike: function() {
        this.props.handleClick(1);
    },

    handleUnlike: function() {
        this.props.handleClick(-1);
    },

    render: function() {
        return(
            React.createElement("div", null, 
                React.createElement("button", {onClick: this.handleLike, type: "button"}, "Like this"), 
                 this.props.likes > 0 ? React.createElement("button", {onClick: this.handleUnlike, type: "button"}, "Unlike this") : null
            )
        );
    }
});

var TitleBar = React.createClass({displayName: "TitleBar",
    getDefaultProps: function() {
        return {
            title: 'A Title',
            subtitle: 'Just a Subtitle'
        }
    },
    getInitialState: function() {
        return {
            likes: 0
        }
    },
    handleClick: function(offset) {
        this.setState({
            likes: this.state.likes + offset
        });
    },
    render: function () {
        return (
            React.createElement("div", null, 
                React.createElement("h1", null, this.props.title), 
                React.createElement("h2", null, this.props.subtitle), 
                React.createElement("span", null, "Likes: ", this.state.likes), 
                React.createElement(Buttons, {handleClick: this.handleClick, likes: this.state.likes})
            )
        )
    }
});

React.render(
    React.createElement(TitleBar, null),
    document.getElementById('container')
);
