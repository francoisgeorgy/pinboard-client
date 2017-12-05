import React, { Component } from 'react';

class Tags extends Component {

    componentDidMount() {
    }

    render() {
        return (
            <div class="tags">
                {
                    Object.keys(this.props.all).map(key => {
                        let count = this.props.all[key];
                        return <span className={this.props.selected.includes(key) ? 'on' : ''} onClick={() => this.props.handleClick(key)} key={key}>{key}:{count}</span>
                    })
                }
            </div>
        );
    }
}

export default Tags;