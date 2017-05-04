import React from 'react';
import {Link} from 'react-router-dom'
export default class createJoin extends React.Component {

  constructor(props) {
    super(props);
    this.createGame = this
      .createGame
      .bind(this);

    this.handleChange = this
      .handleChange
      .bind(this);
    this.state = {
      gameurl: '/game/'
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

  render() {
    return (
      <div>
        <h1>Create/Join</h1>
        {/*<button onClick={this.createGame}>
          Create/Join Game!
        </button>*/}
        
        <input type="text" value={this.state.gameid} onChange={this.handleChange}/>
        <Link to={this.state.gameurl}>Go to Game</Link>

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
