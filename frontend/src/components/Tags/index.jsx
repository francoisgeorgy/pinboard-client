import React, { Component } from 'react';
import classnames from 'classnames';

class Tags extends Component {

    componentDidMount() {
    }

    cssForCount(count) {
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

    render() {
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
    }
/*
    Object.keys(this.props.tags).map(key => {
        let count = this.props.tags[key];
        return <span className={this.props.selected.includes(key) ? 'on' : ''} onClick={() => this.props.handleClick(key)} key={key}>{key}:{count}</span>
    })
*/
}

export default Tags;