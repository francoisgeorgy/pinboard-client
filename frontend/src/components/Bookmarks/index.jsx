import React, { Component } from 'react';

class Bookmarks extends Component {

    componentDidMount() {
    }

    render() {
        return (
            <div className={"bookmarks"}>
                {
                    this.props.bookmarks.map(item => (
                        <div key={item.hash}><a href={item.url} target="_blank">{item.title}</a></div>
                    ))
                }
            </div>
        );
    }

    /*
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
    */
}

export default Bookmarks;