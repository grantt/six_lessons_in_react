// Lesson 1 Exercise - exercise_2.js

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
    handleClick: function() {
        this.setState({
            likes: this.state.likes + 1
        });
    },
    render: function () {
        return (
            React.createElement("div", null, 
                React.createElement("h1", null, this.props.title), 
                React.createElement("h2", null, this.props.subtitle), 
                React.createElement("span", null, "Likes: ", this.state.likes), 
                React.createElement("button", {onClick: this.handleClick, type: "button"}, "Like this")
            )
        )
    }
});

React.render(
    React.createElement(TitleBar, null),
    document.getElementById('container')
);
