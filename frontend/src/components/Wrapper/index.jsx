import React, { Component } from 'react';
import Bookmarks from "../Bookmarks";
import Tags from "../Tags";

class Wrapper extends Component {

    constructor(props) {
        super(props);
        this.state = {
            error: null,
            tagsLoaded: false,
            tags: {},                // associative array {tags: {count, selected}}
            itemsLoaded: false,
            items: [],
            loading: true
        };
    }

    getTags(items) {
        let tags = {};
        for (let i=0; i<items.length; i++) {
            if (items[i].count > 1) tags[items[i].tag] = {count: items[i].count, selected: false};
        }
        return tags;
    }

    updateTags(bookmarks) {
        console.log('Wrapper.updateTags');
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
        return tags;
    }

    setBookmarks(items) {
        console.log('Wrapper.setBookmarks');
        let newTags = this.updateTags(items);
        this.setState({
            tags: newTags,
            itemsLoaded: true,
            items,
            loading: false
        });
    }

    fetchBookmarks(tags) {

        //console.log('Wrapper.fetchBookmarks');

        // let selTags = [];
        //
        // for (const [tag, props] of Object.entries(this.state.tags)) {
        //     if (props.selected) {
        //         selTags.push(tag);
        //     }
        // }
        //
        // let qs = selTags.length > 0 ? `?tags=${selTags.join()}` : '';
        let qs = tags.length > 0 ? `?tags=${tags}` : '';

        console.log(`Wrapper.fetchBookmarks qs=${qs}`);

/*
        this.setState({
            loading: true
        });
*/

        fetch(`http://localhost/pri/dev/projets/pinboard-client/backend/getbookmarks.php${qs}`, {
            mode: 'cors'
        }).then(function(response) {

            console.log('Wrapper.fetchBookmarks response received');
            if (response.status !== 200) {
                console.log(`Error: ${response.status}`);
                return;
            }
            return response.json();

        }).then(

            (result) => {
                // this.updateState(result);
                this.setBookmarks(result);
            },

            // Note: it's important to handle errors here instead of a catch() block
            //       so that we don't swallow exceptions from actual bugs in components.
            (error) => {
                this.setState({
                    // tagsLoaded: true,
                    error,
                    loading: false
                });
            }
        )
    }

    fetchAllTags() {
        console.log('Wrapper.fetchAllTags');
        fetch("http://localhost/pri/dev/projets/pinboard-client/backend/gettags.php", {
            mode: 'cors'
        }).then(function(response) {
            console.log('Wrapper.fetchAllTags response received');
            if (response.status !== 200) {
                console.log(`Error: ${response.status}`);
                return;
            }
            return response.json();
        }).then(
            (result) => {
                //this.setTags(result);
                this.setState({
                    tagsLoaded: true,
                    tags: this.getTags(result),
                    itemsLoaded: false,
                    items: [],   // no bookmarks when ALL tags
                    loading: false
                });
            },
            // Note: it's important to handle errors here instead of a catch() block
            //       so that we don't swallow exceptions from actual bugs in components.
            (error) => {
                console.log('Wrapper.fetchAllTags error');
                this.setState({
                    tagsLoaded: true,
                    error,
                    loading: false
                });
            }
        )
    }

    fetch(tags) {
        console.log(`fetch ${tags}`);
        //if (this.props.match.params.tags === 'all') {
        if (tags === 'all') {
            this.fetchAllTags();
        } else {
            console.log('fetch bookmarks and extract tags');
            this.fetchBookmarks(tags);
        }
    }

    componentDidMount() {
        console.log('Wrapper.componentDidMount', this.props.match.params.tags);
        this.fetchAllTags();
    }

    componentWillReceiveProps(nextProps) {
        console.log('Wrapper.componentWillReceiveProps', nextProps);
        const newTagsList = (nextProps.match.params && nextProps.match.params.hasOwnProperty('tags')) ? nextProps.match.params.tags : 'all';
        this.fetch(newTagsList);
    }

    render() {

        const m = this.props.match;
        const tagsList = this.props.match.params.tags || 'all';
        const base = tagsList === 'all' ? '' : `${m.url}`;   // url=/guitar/javascript, base=/guitar/javascript
        console.log(`Wrapper.render: url=${m.url} base=${base} tagsList=${tagsList}`);

        const { error, tagsLoaded, /*itemsLoaded,*/ items, tags } = this.state;

        if (error) {
            console.log(`Wrapper.render: ERROR`);
            return <div>Error: {error.message}</div>;
        }

        if (!tagsLoaded) {
            console.log(`Wrapper.render: tags not loaded`);
            return <div>Loading tags...</div>;
        }

        console.log(`Wrapper.render: render results`);
        return (
            <div>
                <Tags tags={tags} base={base} tagsParam={m.url} />
                <Bookmarks bookmarks={items} />
            </div>
        );
    }

}

export default Wrapper;