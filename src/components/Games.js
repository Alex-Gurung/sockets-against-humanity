import React from 'react';
// import {Link} from 'react-router'
import {
  Switch,
  Route,
} from 'react-router-dom'
import AllGames from './AllGames'
import thisGame from './thisGame'

export default class Games extends React.Component {
  render() {
    return (
      <div>
          {/*<h2>Games</h2>*/}
        <Switch>
    <Route exact path='/game' component={AllGames}/>
    <Route path='/game/:gameidstring' component={thisGame}/>
  </Switch>
      </div>
    );
  }
}
