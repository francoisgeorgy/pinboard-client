import React, { Component } from 'react';

class Tags extends Component {

    componentDidMount() {
    }

    render() {
        return (
            <div class="tags">
                {
                    Object.keys(this.props.tags).map(key => {
                        let p = this.props.tags[key];
                        return <span className={p.selected ? 'on' : ''} onClick={() => this.props.handleClick(key)} key={key}>{key}:{p.count}</span>
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