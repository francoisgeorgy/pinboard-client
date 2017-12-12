import React, { Component } from 'react';
import classnames from 'classnames';
import {Link} from "react-router-dom";

class Tags extends Component {

    static cssForCount(count) {
        if (count < 5) {
            return 'c5';
        } else if (count < 10) {
            return 'c10';
        } else if (count < 40) {
            return 'c20';
        } else if (count < 80) {
            return 'c50';
        } else if (count < 200) {
            return 'c100';
        } else {
            return 'cMax';
        }
    }

    render() {
        console.log('Tags.render', this.props.tagsParam, this.props);
        let base = this.props.base;
        return (
            <div className="tags">
                {
                    (base.length > 0) &&
                    <span className="c10 all">
                        <Link to='/'>ALL</Link>
                    </span>
                }
                {
                    Object.keys(this.props.tags).sort().map(tag => {

                        let p = this.props.tags[tag];
                        let css = classnames({
                            'on': p.selected,
                            [`${Tags.cssForCount(p.count)}`]: true
                        });

                        // si tag courant est déjà dans l'URL alors on l'enlève:
                        let uri;
                        if (base.indexOf(tag) >= 0) {

                            uri = base;

                            if (uri === `/${tag}`) {
                                uri = '/';
                            } else {

                                if (uri.startsWith(`/${tag},`)) {
                                    uri = uri.replace(`/${tag},`, '/');
                                }

                                if (uri.endsWith(`,${tag}`)) {
                                    uri = uri + ',';    // add a comma so it will be handled by the next replace
                                }
                                uri = uri.replace(`,${tag},`, ',');

                                if (uri.endsWith(',')) {
                                    uri = uri.substring(0, uri.length - 1);
                                }

                            }

                        } else {
                            uri = base.length > 0 ? (base + ',' + tag) : tag;
                        }

                        return (
                            <span className={css} key={tag} title={p.count}>
                                <Link to={`${uri}`}>{tag}</Link>
                            </span>
                        );
                    })
                }
            </div>
        );

    }

}

export default Tags;