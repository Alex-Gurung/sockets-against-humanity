import React from 'react';
// import {Link} from 'react-router'
import {Switch, Route} from 'react-router-dom'
export default class thisGame extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      gameId: props.match.params.gameidstring,
      users: 'you',
      game_list: {
        'you': 0
      },
      my_cards: [],
      card_list: [],
      black_card: "",
      position_list: [],
      played_cards: "Cards go here",
      played_cards_list: [],
      num_to_select: 0,
      selected: []
    }
    this.selectCard = this
      .selectCard
      .bind(this)
  }
  someoneEntered(data) {
    // alert(data.message)
    console.log(data.message);
  }

  updateUsers(data) {
    var gameList = data.game
    var position = data.position
    // alert(data)
    this.setState({
      position_list: position,
      users: String(Object.keys(gameList)),
      game_list: gameList
    });
    // console.log('data' + data) alert(this.state.my_cards)
  }

  updateChosen(cards) {
    var listofChosen = [];
    alert(cards[0])
    for (var i = 0; i < cards.length; i++) {
      var ident = "chosencard-" + String(i)
      listofChosen.push(
        <button id={ident}>{String(cards[i])}</button>
      )
    }
    this.setState({played_cards: listofChosen})
  }

  selectCard(e) {
    if (this.state.position_list[socket.io.engine.id] !== 'czar') {
      alert(this.state.position_list[socket.io.engine.id])
      if (this.state.selected.length < this.state.num_to_select) {
        alert(e.currentTarget.innerText)
        var temp_list = this.state.card_list
        // for (var i = 0; i < temp_list.length; i++) {
        //   temp_list[i].setAttribute("disabled", "disabled")
        // }
        e.currentTarget.setAttribute("class", "bg-indigo")
        var the_selects = this.state.selected
        the_selects.push(e.currentTarget.innerText)
        alert(the_selects)
        this.setState({selected: the_selects})
      }
      if (this.state.selected.length == this.state.num_to_select) {
        socket.emit('selected cards', this.state.selected)
      }
    }

  }

  updateCards(cards) {
    // this.setState({gameid: this.state.gameId, users: this.state.users,
    // game_list:this.state.game_list, my_cards: cards});
    var white_cards = Array.from(cards.white)
    console.log(white_cards)
    var listofCards = []
    for (var i = 0; i < white_cards.length; i++) {
      var ident = "card-" + String(i)
      listofCards.push(
        <button onClick={this.selectCard} id={ident}>{String(white_cards[i])}</button>
      )
    }
    // var listofCards = white_cards.map((card) =>   <li
    // classID={card}>{String(card)}</li> )
    this.setState({my_cards: cards, card_list: listofCards, black_card: cards.black.text, num_to_select: cards.black.pick});
    // alert(cards)
  }

  render() {
    return (
      <div>
        <h1>Id: {this.state.gameId}</h1>
        {/*<h2>User: {String(Object.keys(this.state.users))}</h2>*/}
        <h2>Users: {this.state.users}</h2>
        <h2>Your Position: {this.state.position_list[socket.io.engine.id]}</h2>
        <h2>Number users: {String(Object.keys(this.state.game_list).length)}</h2>
        <h1>Black Card: {this.state.black_card}</h1>
        <h2>Number to Select: {this.state.num_to_select}</h2>
        <p>Your Cards:
        </p>
        <p>{this.state.card_list}</p>
        <p>Played Cards:
        </p>
        <p>{this.state.played_cards}</p>
      </div>
    );
  }
  componentDidMount() {
    socket.emit('entered room', this.state.gameId)
    socket.on('enter message', (data) => {
      this.someoneEntered(data);
    })
    socket.on('update users', (data) => {
      this.updateUsers(data);
    })
    socket.on('your cards', (cards) => {
      console.log(cards)
      this.updateCards(cards);
    })

    socket.on('update chosen', (cards) => {
      this.updateChosen(cards);
    })

  }
}
