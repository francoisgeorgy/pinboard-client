import React, { Component } from 'react';

class Bookmarks extends Component {

    static cssForCount(count) {
        if (count < 5) {
            return 'c5';
        } else if (count < 10) {
            return 'c10';
        } else if (count < 20) {
            return 'c20';
        } else if (count < 50) {
            return 'c50';
        } else if (count < 100) {
            return 'c100';
        } else {
            return 'cMax';
        }
    }

    constructor(props) {
        super(props);
    }

    render() {
        console.log('Bookmarks.render', this.props);
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