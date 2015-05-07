// Lesson 1 Solution - solution.js

var HelloWorld = React.createClass({

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
      <div>
        <h2>Hello {this.props.name}!</h2>
      <p>Greetings to {this.props.name}: {this.state.greetings}</p>
        <button onClick={this.handleClick} type="button">Say Hi!</button>
      </div>
    )
  }
});
React.render(
  <HelloWorld name="Jomo Blarrem" />,
  document.getElementById('container')
);
