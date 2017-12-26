import React, { Component } from 'react';
import SearchInput, {createFilter} from 'react-search-input'

const KEYS_TO_FILTERS = ['tags', 'title'];

class Bookmarks extends Component {

    constructor (props) {
        super(props);
        this.state = {
            searchTerm: ''
        };
        this.searchUpdated = this.searchUpdated.bind(this)
    }

    searchUpdated (term) {
        this.setState({searchTerm: term})
    }

    render() {
        console.log('Bookmarks.render'/* , this.props */);

        if (this.props.bookmarks.length === 0) {
            return <div className={"bookmarks"}>select at least one tag</div>;
        } else {

            const filtered = this.props.bookmarks.filter(createFilter(this.state.searchTerm, KEYS_TO_FILTERS));

            return (
                <div>
                    <div>
                        <div className={"refresh-link"}>
                            <button onClick={this.props.handleRefresh}>force refresh</button>
                        </div>
                        <SearchInput className="search-input" placeholder="filter" onChange={this.searchUpdated} />
                    </div>
                    <div className={"bookmarks"}>
                        {
                            filtered.map(item => (
                                <div key={item.hash}><a href={item.url} target="_blank" title={item.tags.sort().join(' ')}>{item.title}</a></div>
                            ))
                        }
                    </div>
                </div>
            );
        }
    }

}

export default Bookmarks;