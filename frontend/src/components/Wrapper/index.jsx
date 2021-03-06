import React, { Component } from 'react';
import Bookmarks from "../Bookmarks";
import Tags from "../Tags";
import Message from "../Message";

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
        this.selectedTags = [];
        this.handleRefresh = this.handleRefresh.bind(this);
    }

    updateSelectedTags(tagsParam) {
        console.log('updateSelectedTags', tagsParam);
        this.selectedTags = tagsParam.length === 0 ? [] : tagsParam.replace('/', '').split(',');
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
        let tags = {};
        for (let i=0; i<bookmarks.length; i++) {
            for (let k=0; k<bookmarks[i].tags.length; k++) {
                let t = bookmarks[i].tags[k];
                if (tags.hasOwnProperty(t)) {
                    tags[t].count++;
                } else {
                    tags[t] = {count: 1, selected: this.selectedTags.includes(t)};
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
            tagsLoaded: true,
            itemsLoaded: true,
            items,
            loading: false
        });
    }

    fetchBookmarks(refresh /*tags*/) {

        let qs = this.selectedTags.length > 0 ? `?tags=${this.selectedTags}` : '';

        if (refresh === true) {
            qs += qs === '' ? '?' : '&';
            qs += 'refresh=1';
        }

        this.setState({
            loading: true
        });

        fetch(`${process.env.REACT_APP_BACKEND}/getbookmarks.php${qs}`, {
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
        fetch(`${process.env.REACT_APP_BACKEND}/gettags.php`, {
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

    fetch() {
        console.log(`fetch ${this.selectedTags}`);
        if (this.selectedTags.length === 0 /*tags === 'all'*/) {
            this.fetchAllTags();
        } else {
            console.log('fetch bookmarks and extract tags');
            this.fetchBookmarks(/*tags*/);
        }
    }

    handleRefresh() {
        this.fetchBookmarks(true);
    }

    componentDidMount() {
        console.log('Wrapper.componentDidMount', this.props.match.params.tags);
        this.updateSelectedTags((this.props.match.params && this.props.match.params.hasOwnProperty('tags')) ? this.props.match.params.tags : '');
        this.fetch();
    }

    componentWillReceiveProps(nextProps) {
        console.log('Wrapper.componentWillReceiveProps', nextProps);
        this.updateSelectedTags((nextProps.match.params && nextProps.match.params.hasOwnProperty('tags')) ? nextProps.match.params.tags : '');
        this.fetch();
    }

    render() {

        const m = this.props.match;
        const tagsList = this.props.match.params.tags || 'all';
        const base = tagsList === 'all' ? '' : `${m.url}`;
        const { error, tagsLoaded, items, tags, loading } = this.state;

        if (error) {
            return <div>Error: {error.message}</div>;
        }

        if (!tagsLoaded) {
            return <div>Loading tags...</div>;
        }

        return (
            <div>
                <Tags tags={tags} base={base} tagsParam={m.url} />
                {loading &&
                    <Message message={"Please wait, retrieving bookmarks"} type={"info"} />
                }
                <Bookmarks bookmarks={items} handleRefresh={this.handleRefresh} />
            </div>
        );
    }

}

export default Wrapper;