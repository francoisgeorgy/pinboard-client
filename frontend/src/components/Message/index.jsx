import React, { Component } from 'react';
import classnames from 'classnames';

class Message extends Component {

    render() {
        return (
            <div className={classnames('message', this.props.type)}>
                {this.props.message}
            </div>
        );

    }

}

export default Message;