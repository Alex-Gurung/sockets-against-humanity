import React from 'react';
// import {Link} from 'react-router'
import {
  Switch,
  Route,
} from 'react-router-dom'
import Home from './Home'
import Games from './Games'
import createJoin from './createJoin'

export default class Main extends React.Component {
  render() {
    return (
      <div>
        <Switch>
          <Route exact path='/' component={Home}/> {/* both /roster and /roster/:number begin with /roster */}
          <Route path='/game' component={Games}/>
          <Route path='/createjoin' component={createJoin}/>
        </Switch>
      </div>
    );
  }
}
