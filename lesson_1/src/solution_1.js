// Lesson 1 Solution - solution_1.js

var TitleBar = React.createClass({
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
    handleIncrement: function() {
        this.setState({
            likes: this.state.likes + 1
        });
    },
    render: function () {
        return (
            <div>
                <h1>{this.props.title}</h1>
                <h2>{this.props.subtitle}</h2>
                <span>Likes: {this.state.likes}</span>
                <button onClick={this.handleIncrement} type="button">Like this</button>
            </div>
        )
    }
});

React.render(
    <TitleBar />,
    document.getElementById('container')
);
