import React, { Component } from 'react';

class Bookmarks extends Component {

    //TODO: add bookmark's tags as link's title attribute

    render() {
        console.log('Bookmarks.render'/* , this.props */);
        if (this.props.bookmarks.length === 0) {
            return <div className={"bookmarks"}>select at least one tag</div>;
        } else {
            return (
                <div className={"bookmarks"}>
                    {
                        this.props.bookmarks.map(item => (
                            <div key={item.hash}><a href={item.url} target="_blank" title={item.tags.sort().join(' ')}>{item.title}</a></div>
                        ))
                    }
                </div>
            );
        }
    }

}

export default Bookmarks;