import React, {Component} from 'react';
import './App.css';
import Wrapper from "./components/Wrapper";
import {Route, Switch} from "react-router-dom";

class App extends Component {

    constructor(props) {
        super(props);
        this.state = {
            error: null,
            tagsLoaded: false,
            items: [],
            tags: {}                // associative array {tags: {count, selected}}
        };
    }

    render() {
        return (
            <div>
                <Switch>
                    <Route exact path='/' component={Wrapper}/>
                    <Route path='/:tags' component={Wrapper}/>
                </Switch>
            </div>
        );
    }

}

export default App;
