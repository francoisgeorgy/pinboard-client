import React, {Component} from 'react';
import './App.css';
import Tags from "./components/Tags/index";
import Bookmarks from "./components/Bookmarks/index";


class App extends Component {

    constructor(props) {
        super(props);
        this.state = {
            error: null,
            isLoaded: false,
            items: [],
            allTags: {},           // associative array {tags: count}
            selectedTags: []       // array of strings
        };
    }

    updateState(data) {
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
    */
        let allTags = {};
        for (let i=0; i<data.length; i++) {
            for (let k=0; k<data[i].tags.length; k++) {
                let t = data[i].tags[k];
                if (allTags.hasOwnProperty(t)) {
                    allTags[t]++;
                } else {
                    allTags[t] = 1;
                }
            }
        }
        console.log(allTags);

        // filter selectedTags
        let selTags = [];
        for (let i=0; i < this.state.selectedTags.length; i++) {
            let t = this.state.selectedTags[i];
            if (allTags.hasOwnProperty(t)) {
                selTags.push(t)
            }
        }
        console.log(selTags);

        this.setState({
            isLoaded: true,
            items: data,
            allTags: allTags,
            selectedTags: selTags
        });
    }

    componentDidMount() {
        fetch("http://localhost/pri/dev/projets/pinboard-client/backend/getbookmarks.php", {
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
                this.updateState(result);
            },
            // Note: it's important to handle errors here instead of a catch() block
            //       so that we don't swallow exceptions from actual bugs in components.
            (error) => {
                this.setState({
                    isLoaded: true,
                    error
                });
            }
        )
    }

    // changeTagState(event) {
    //     this.setState({btnNewScreen: !this.state.btnNewScreen})
    // }

    handleTagClick = (t) => {
        console.log('handleTagClick', t);
        let selected = this.state.selectedTags;
        if (selected.includes(t)) {
            // selected.
        } else {

        }
    }

    render() {
        const { error, isLoaded, items, allTags, selectedTags } = this.state;
        if (error) {
            return <div>Error: {error.message}</div>;
        } else if (!isLoaded) {
            return <div>Loading...</div>;
        } else {
            //console.log('items', items);
            return (
                <div>
                    <Tags all={allTags} selected={selectedTags} handleClick={this.handleTagClick} />
                    <Bookmarks bookmarks={items} />
                </div>
            );
        }
    }

}

export default App;
