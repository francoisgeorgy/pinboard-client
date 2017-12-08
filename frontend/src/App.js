import React, {Component} from 'react';
import './App.css';
import Tags from "./components/Tags/index";
import Bookmarks from "./components/Bookmarks/index";

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


class App extends Component {


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
        this.BE = 'https://www.fgeorgy.ch/private/pinboard';
        //const BE = 'http://localhost/pri/dev/projets/pinboard-client/backend';
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

        fetch(`${this.BE}/getbookmarks.php${qs}`, {
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
        fetch(`${this.BE}/gettags.php`, {
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
                    <Tags tags={tags} handleClick={this.handleTagClick} />
                    <Bookmarks bookmarks={items} />
                </div>
            );
        }
    }

}

export default App;
