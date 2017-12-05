import React, { Component } from 'react';

class Bookmarks extends Component {

    componentDidMount() {
    }

    render() {
        return (
            <ul>
                {
                    this.props.bookmarks.map(item => (
                        <li key={item.hash}>{item.title} {item.url}</li>
                    ))
                }
            </ul>
        );
    }
}

export default Bookmarks;