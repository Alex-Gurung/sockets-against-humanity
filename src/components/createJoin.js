import React from 'react';
import {Link} from 'react-router-dom'
import { Redirect } from 'react-router';
export default class createJoin extends React.Component {

  constructor(props) {
    super(props);
    this.createGame = this
      .createGame
      .bind(this);

    this.handleChange = this
      .handleChange
      .bind(this);
    this.handleKeyPress = this.handleKeyPress.bind(this);
    this.state = {
      gameurl: '/game/',
      redirect: false
    }
    socket.on('create game', function (data) {
      this.alert(message)
    })
  }

  createGame() {
    var game_id = prompt('game id: ')
    socket.emit('create or join game', game_id)
    this.setState({
      gameurl: '/game/' + game_id
    })
    // console.log('pressed button')
  }
  handleChange(event) {
    this.setState({
      gameid: event.target.value,
      gameurl: '/game/' + event.target.value
    });
  }

  handleKeyPress(event) {
    if(event.key === "Enter"){
        this.setState({redirect: true});
    }
  }

  render() {
    if (this.state.redirect) {
      return <Redirect push to={this.state.gameurl} />;
    }
    return (
      <div className={'flexBox'}>
        <div><h1>Create/Join</h1></div>
        {/*<button onClick={this.createGame}>
          Create/Join Game!
        </button>*/}
        
        <div><input className={'centerClass'}  type="text" value={this.state.gameid} onKeyPress={this.handleKeyPress} onChange={this.handleChange}/></div>
        <div><Link className={'centerClass'} to={this.state.gameurl}>Go to Game</Link></div>

        {/*<h1>Some App Name</h1>
        <ul className="header">
          <li>Home</li>
          <li>Create/Join</li>
        </ul>
        <div className="content">

        </div>*/}
      </div>
    );
  }
  // componentDidMount() {
  //   if (socket.hasOwnProperty('gameid')){
  //     socket.emit('entered room', 'global')
  //   }
  // }

}
