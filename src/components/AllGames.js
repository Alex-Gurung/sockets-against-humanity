import React from 'react';
import { Link } from 'react-router-dom'
export default class AllGames extends React.Component {

  constructor(props) {
    super(props);
    this.state = {game_list: ['none'], listItems: ['none'].map((item) => {
      <li><Link to={'/game/'+item}>{String(item)}</Link></li>
    })};
  }
  setGameList(gameList_from_server) {
    var gameList = Array.from(gameList_from_server);
    // alert(typeof gameList)
    // alert(gameList.length)
    var listofLinks = gameList.map((game) => 
      <li><Link to={'/game/' + game}>{String(game)}</Link></li>
    )
    this.setState({game_list: gameList, listItems: listofLinks})
    // this.setState({game_list: gameList, listItems: gameList.map((item) => {
    // <li><Link to={'/game/'+String({item})}>{String(item)}</Link></li>} )})
    // alert(this.state.listItems)
  }
  render() {
    return (
      <div>
          <h1>AllGames</h1>
          <h2>{this.state.game_list}</h2>
          <ul>{this.state.listItems}</ul>
          {/*<Link to={'/game/6'}>6</Link>*/}
        {/*<h1>Some App Name</h1>
        <ul className="header">
          <li>Home</li>
          <li>Create/Join</li>
        </ul>
        <div className="content">
            
        </div>*/}
      </div>
    );}
  componentDidMount() {
    socket.emit('get game list', 'true')
    
    socket.on('returned game list', (data) => {
      this.setGameList(data);
    })
  }
}
