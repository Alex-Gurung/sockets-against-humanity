import React from 'react';
import ReactDOM from 'react-dom';
import App from './components/App'
import { BrowserRouter } from 'react-router-dom'
// import { Router, Route, Switch } from 'react-router'
// import {
//   BrowserRouter as Router,
//   Route,
//   Link
// } from 'react-router-dom'
// import Home from './components/Home';
// import createJoin from './components/createJoin';
/*
const RouterRender = () => (
  <Router>
    <div>
      <ul>
        <li><Link to="/">Home</Link></li>
        <li><Link to="/createjoin">Create/Join</Link></li>
      </ul>

      <hr/>

      <Route exact path="/" component={Home}/>
      <Route path="/createjoin" component={About}/>
    </div>
  </Router>
)

ReactDOM.render(
    RouterRender, document.getElementById('app'));*/
// import { Router, Route, hashHistory } from 'react-router'

ReactDOM.render((
<BrowserRouter>
    <App />
  </BrowserRouter>
), document.getElementById('app'))