import React, { Component } from 'react';
import classnames from 'classnames';
import {Link, Route} from "react-router-dom";
import Bookmarks from "../Bookmarks";
import Tags from "../Tags";

class Results extends Component {

    constructor(props) {
        super(props);
        this.state = {
            error: null,
            tagsLoaded: false,
            itemsLoaded: false,
            items: [],
            tags: {}                // associative array {tags: {count, selected}}
            // allTags: {},           // associative array {tags: count}
            // selectedTags: []       // array of strings
        };
    }

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

    updateTags(bookmarks) {

        console.log('updateTags');

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
        console.log('setBookmarks');
        this.setState({
            itemsLoaded: true,
            items
        });
        this.updateTags(items);
    }

    fetchBookmarks() {

        console.log('Results.fetchBookmarks');

        let selTags = [];

        for (const [tag, props] of Object.entries(this.state.tags)) {
            if (props.selected) {
                selTags.push(tag);
            }
        }

        let qs = selTags.length > 0 ? `?tags=${selTags.join()}` : '';

        console.log(`Results.fetchBookmarks qs=${qs}`);

        fetch(`http://localhost/pri/dev/projets/pinboard-client/backend/getbookmarks.php${qs}`, {
            mode: 'cors'
        }).then(function(response) {

            console.log('Results.fetchBookmarks response received');
            if (response.status !== 200) {
                console.log(`Error: ${response.status}`);
                return;
            }
            return response.json();

        }).then(

            (result) => {
                console.log('fetchBookmarks result');
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
        console.log('Results.fetchAllTags');
        fetch("http://localhost/pri/dev/projets/pinboard-client/backend/gettags.php", {
            mode: 'cors'
        }).then(function(response) {
            console.log('Results.fetchAllTags response received');
            if (response.status !== 200) {
                console.log(`Error: ${response.status}`);
                return;
            }
            return response.json();
        }).then(
            (result) => {
                console.log('Results.fetchAllTags result');
                this.setTags(result);
            },
            // Note: it's important to handle errors here instead of a catch() block
            //       so that we don't swallow exceptions from actual bugs in components.
            (error) => {
                console.log('Results.fetchAllTags error');
                this.setState({
                    tagsLoaded: true,
                    error
                });
            }
        )
    }

    fetch(tag) {
        console.log("fetch {}", tag);
        //if (this.props.match.params.tag === 'all') {
        if (tag === 'all') {
            this.fetchAllTags();
        } else {
            console.log('fetch bookmarks and extract tags');
            this.fetchBookmarks(tag);
        }
    }

    componentDidMount() {
        console.log('Results.componentDidMount', this.props.match.params.tag);
        this.fetchAllTags();
    }


    // When your component receives new props from its parent, componentWillReceiveProps(nextProps) is triggered.
    // This is a great time to check if there are changes in the incoming props when compared to your current props
    // and trigger a state change based on the new values. A common use-case for this is resetting state based on a change.
    componentWillReceiveProps() {
        console.log('Results.componentWillReceiveProps', this.props.match.params.tag);
        this.fetch('all');
    }



    render() {

        console.log('Results.render for tag', this.props.match.params.tag);

        const m = this.props.match;
        const tag = this.props.match.params.tag;
        const base = tag === 'all' ? '' : `${m.url}`;   // url=/guitar/javascript, base=/guitar/javascript
        console.log(`Results.render: url=${m.url}, base=${base}`);

        const { error, tagsLoaded, itemsLoaded, items, tags } = this.state;

        if (error) {
            console.log(`Results.render: ERROR`);
            return <div>Error: {error.message}</div>;
        }

        if (!tagsLoaded) {
            console.log(`Results.render: tags not loaded`);
            return <div>Loading tags...</div>;
        }

        if ((tag !== 'all') && (!itemsLoaded)) {
            console.log(`Results.render: tags!=all and items not loaded, calling fetch(${tag})`);
            this.fetch(tag);
            return <div>updating...</div>;
        }

        /*if (error) {
            console.log(`Results.render: ERROR`);
            return <div>Error: {error.message}</div>;
        } else*/
        /*if (!tagsLoaded) {
            console.log(`Results.render: tags not loaded`);
            return <div>Loading tags...</div>;
        } else*/ /*{*/

            console.log(`Results.render: render results; base=`, base);
            console.log(`Results.render: render results; tags=`, tags);

            return (
                <div>
                    <Tags tags={tags} base={base}/>
{/*
                    <div className="tags">
                        {
                            Object.keys(tags).sort().map(key => {
                                let p = tags[key];
                                let css = classnames({
                                    'on': p.selected,
                                    [`${Results.cssForCount(p.count)}`]: true
                                });
                                // return <span className={css} key={key} title={p.count}>{key}?{q}</span>
                                return (
                                    <span className={css} key={key} title={p.count}>
                                        <Link to={`${base}/${key}`}>{key}</Link>
                                    </span>
                                );

                                // return <span className={css} onClick={() => this.props.handleClick(key)} key={key}
                                //              title={p.count}>{key}</span>
                            })
                        }
                        <Route path={`${m.url}/:tag`} component={Results}/>
                    </div>
*/}
                    <Route path={`${m.url}/:tag`} component={Results} />
                    <Bookmarks bookmarks={items} />
                </div>
            );
        /*}*/
        /*
        return (
            <div className="tags">
                {
                    Object.keys(this.props.tags).sort().map(key => {
                        let p = this.props.tags[key];
                        let css = classnames({
                            'on': p.selected,
                            [`${this.cssForCount(p.count)}`]: true
                        });
                        return <span className={css} onClick={() => this.props.handleClick(key)} key={key} title={p.count}>{key}</span>
                    })
                }
            </div>
        );
        */
    }
/*
    Object.keys(this.props.tags).map(key => {
        let count = this.props.tags[key];
        return <span className={this.props.selected.includes(key) ? 'on' : ''} onClick={() => this.props.handleClick(key)} key={key}>{key}:{count}</span>
    })
*/
}

export default Results;