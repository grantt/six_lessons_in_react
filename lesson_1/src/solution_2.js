// Lesson 1 Solution - solution_2.js

var Buttons = React.createClass({
    handleLike: function() {
        this.props.handleIncrement(1);
    },

    handleUnlike: function() {
        this.props.handleIncrement(-1);
    },

    render: function() {
        return(
            <div>
                <button onClick={this.handleLike} type="button">Like this</button>
                { this.props.likes > 0 ? <button onClick={this.handleUnlike} type="button">Unlike this</button> : null }
            </div>
        );
    }
});

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
    handleIncrement: function(offset) {
        this.setState({
            likes: this.state.likes + offset
        });
    },
    render: function () {
        return (
            <div>
                <h1>{this.props.title}</h1>
                <h2>{this.props.subtitle}</h2>
                <span>Likes: {this.state.likes}</span>
                <Buttons handleIncrement={this.handleIncrement} likes={this.state.likes} />
            </div>
        )
    }
});

React.render(
    <TitleBar />,
    document.getElementById('container')
);
