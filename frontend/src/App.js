import React, {Component} from 'react';
import PropTypes from 'prop-types';
import './App.css';
import Tags from "./components/Tags/index";
import Bookmarks from "./components/Bookmarks/index";

import { addUrlProps, UrlQueryParamTypes } from 'react-url-query';


/*
 {
     "_api_instance_hash": "58a89c01",
     "url": "https:\/\/technicshistory.wordpress.com\/2017\/08\/29\/the-electronic-computers-part-1-prologue\/",
     "title": "The Electronic Computers, Part 1: Prologue \u2013 Creatures of Thought",
     "description": "",
     "timestamp": 1512466909,
     "tags": [
         "computer",
         "history"
     ],
     "is_public": true,
     "is_unread": false,
     "others": 0,
     "hash": "01980446c1023663ea4f51c2afd4027a",
     "meta": "5d691ad2a37258f8d80526878823d48a"
 },


 [
    {"tag":".guitar-explorer","count":66},
    ...
 ]

*/


/**
 * Specify how the URL gets decoded here. This is an object that takes the prop
 * name as a key, and a query param specifier as the value. The query param
 * specifier can have a `type`, indicating how to decode the value from the
 * URL, and a `queryParam` field that indicates which key in the query
 * parameters should be read (this defaults to the prop name if not provided).
 */
const urlPropsQueryConfig = {
    bar: {type: UrlQueryParamTypes.string},
    foo: {type: UrlQueryParamTypes.number, queryParam: 'fooInUrl'},
};


class App extends Component {

    static propTypes = {
        bar: PropTypes.string,
        foo: PropTypes.number,
        // change handlers are automatically generated and passed if a config is provided
        // and `addChangeHandlers` isn't false. They use `replaceIn` by default, just
        // updating that single query parameter and keeping the other existing ones.
        onChangeFoo: PropTypes.func,
        onChangeBar: PropTypes.func,
        onChangeUrlQueryParams: PropTypes.func,
    }

    static defaultProps = {
        foo: 123,
        bar: 'bar',
    }

    constructor(props) {
        super(props);
        this.state = {
            error: null,
            tagsLoaded: false,
            items: [],
            tags: {}                // associative array {tags: {count, selected}}
            // allTags: {},           // associative array {tags: count}
            // selectedTags: []       // array of strings
        };
    }

    /*
    updateState(items) {
        // make a temp copy of the selected tags
        let selTags = [];
        for (const [tag, props] of Object.entries(this.state.tags)) {
            if (props.selected) {
                selTags.push(tag);
            }
        }

        let tags = {};
        for (let i=0; i<items.length; i++) {
            for (let k=0; k<items[i].tags.length; k++) {
                let t = items[i].tags[k];
                if (tags.hasOwnProperty(t)) {
                    tags[t].count++;
                } else {
                    tags[t] = {count: 1, selected: selTags.includes(t)};
                }
            }
        }

        this.setState({
            isLoaded: true,
            items,
            tags
        });
    }
    */

    setTags(items) {
        let tags = {};
        for (let i=0; i<items.length; i++) {
            if (items[i].count > 1) tags[items[i].tag] = {count: items[i].count, selected: false};
        }
        this.setState({
           tagsLoaded: true,
            tags
        });
    }

    /**
     * Update tags from current set of bookmarks
     * @param items
     */
    updateTags(bookmarks) {

        // make a temp copy of the selected tags
        let selTags = [];
        for (const [tag, props] of Object.entries(this.state.tags)) {
            if (props.selected) {
                selTags.push(tag);
            }
        }

        let tags = {};
        for (let i=0; i<bookmarks.length; i++) {
            for (let k=0; k<bookmarks[i].tags.length; k++) {
                let t = bookmarks[i].tags[k];
                if (tags.hasOwnProperty(t)) {
                    tags[t].count++;
                } else {
                    tags[t] = {count: 1, selected: selTags.includes(t)};
                }
            }
        }

        this.setState({
            tags
        });
    }

    setBookmarks(items) {
        console.log('setBookmarks', items);
        this.setState({
            items
        });
        this.updateTags(items);
    }

    fetchBookmarks() {

        console.log('fetchBookmarks');

        let selTags = [];

        for (const [tag, props] of Object.entries(this.state.tags)) {
            if (props.selected) {
                selTags.push(tag);
            }
        }

        let qs = selTags.length > 0 ? `?tags=${selTags.join()}` : '';

        fetch(`http://localhost/pri/dev/projets/pinboard-client/backend/getbookmarks.php${qs}`, {
            mode: 'cors'
        }).then(function(response) {
            if (response.status !== 200) {
                console.log(`Error: ${response.status}`);
                return;
            }
            return response.json();
        }).then(
            (result) => {
                console.log('result', result);
                // this.updateState(result);
                this.setBookmarks(result);
            },
            // Note: it's important to handle errors here instead of a catch() block
            //       so that we don't swallow exceptions from actual bugs in components.
            (error) => {
                this.setState({
                    // tagsLoaded: true,
                    error
                });
            }
        )
    }

    fetchAllTags() {
        fetch("http://localhost/pri/dev/projets/pinboard-client/backend/gettags.php", {
            mode: 'cors'
        }).then(function(response) {
            if (response.status !== 200) {
                console.log(`Error: ${response.status}`);
                return;
            }
            return response.json();
        }).then(
            (result) => {
                console.log('result', result);
                this.setTags(result);
            },
            // Note: it's important to handle errors here instead of a catch() block
            //       so that we don't swallow exceptions from actual bugs in components.
            (error) => {
                this.setState({
                    tagsLoaded: true,
                    error
                });
            }
        )
    }

    componentDidMount() {
        this.fetchAllTags();
    }

    handleTagClick = (t) => {
        let tags = {...this.state.tags};
        if (tags.hasOwnProperty(t)) {
            tags[t].selected = !tags[t].selected;
        }
        this.setState({tags}, () => {
            this.fetchBookmarks();
        });


        this.onChangeFoo(Math.round(Math.random() * 1000))

    }

    render() {
        const { error, tagsLoaded, items, tags } = this.state;
        if (error) {
            return <div>Error: {error.message}</div>;
        } else if (!tagsLoaded) {
            return <div>Loading tags...</div>;
        } else {
            return (
                <div>
                    <div>foo={this.props.foo} - bar={this.props.bar}</div>
                    <Tags tags={tags} handleClick={this.handleTagClick} />
                    <Bookmarks bookmarks={items} />
                </div>
            );
        }
    }

}


/**
 * We use the addUrlProps higher-order component to map URL query parameters
 * to props for MainPage. In this case the mapping happens automatically by
 * first decoding the URL query parameters based on the urlPropsQueryConfig.
 */
export default addUrlProps({urlPropsQueryConfig})(App);

// export default App;
