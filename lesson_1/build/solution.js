// Lesson 1 Solution - solution.js

var HelloWorld = React.createClass({displayName: "HelloWorld",

  getDefaultProps: function() {
    return {
      name: 'User'
    }
  },
  getInitialState: function() {
    return {
      greetings: 0
    }
  },
  handleClick: function() {
    this.setState({
      greetings: this.state.greetings + 1
    });
  },
  render: function () {
    return (
      React.createElement("div", null, 
        React.createElement("h2", null, "Hello ", this.props.name, "!"), 
      React.createElement("p", null, "Greetings to ", this.props.name, ": ", this.state.greetings), 
        React.createElement("button", {onClick: this.handleClick, type: "button"}, "Say Hi!")
      )
    )
  }
});
React.render(
  React.createElement(HelloWorld, {name: "Jomo Blarrem"}),
  document.getElementById('container')
);
