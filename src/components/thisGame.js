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
      black_card: "initial_black",
      position_list: [],
      played_cards: "Played Cards go here",
      played_cards_list: [],
      num_to_select: 0,
      num_needed: 0,
      selected: [],
      last_winner: "last_winner",
      nicknames: {'you': 'you'},
      user_to_score: {'you': 0},
      your_name: "you"
    }
    this.selectCard = this
      .selectCard
      .bind(this)
    this.czarSelect = this
      .czarSelect
      .bind(this)
  }
  someoneEntered(data) {
    // alert(data.message)
    console.log(data.message);
  }

  updateUsers(data) {
    var gameList = data.game
    var position = data.position
    var usernames = data.nicknames
    var chosen = data.chosenCards
    var new_user_to_score = []
    var ids = Object.keys(gameList)
    var my_name = ""
    for (var i = 0; i < ids.length; i++){
      if (usernames.hasOwnProperty(ids[i])){
        if (ids[i] == socket.id){
          my_name = usernames[ids[i]]
        }
        new_user_to_score.push({'user':usernames[ids[i]], 'score':gameList[ids[i]]})
        // new_user_to_score[usernames[ids[i]]] = gameList[ids[i]]
      }
    }
    // alert(data)
    this.setState({
      position_list: position,
      users: String(Object.keys(gameList)),
      game_list: gameList,
      user_to_score: new_user_to_score,
      your_name: my_name,
    });
     $('.rows').remove();
    for (var i = 0; i < new_user_to_score.length; i++){
      var markup = "<tr class='rows'><td>" + new_user_to_score[i]['user'] + "</td><td>" + new_user_to_score[i]['score']+ "</td></tr>"
      // var new_row = $(document.createElement('tr'))
      // $(document.createElement('td').var(new_user_to_score[i]['user'])).appendTo(new_row);
      // $(document.createElement('td').var(new_user_to_score[i]['score'])).appendTo(new_row);
      $("table tbody").append(markup);
    }
    console.log(new_user_to_score)
  //   $('#scoreTable').dynatable({
  //   dataset: {
  //     records: [new_user_to_score]
  //   }
  // });
  
    this.updateChosen(chosen)
    // console.log('data' + data) alert(this.state.my_cards)
  }

  updateChosen(cards) {
    var listofChosen = [];
    // alert(cards[0])
    if (cards){
    for (var i = 0; i < cards.length; i++) {
      var ident = "chosencard-" + String(i)
      listofChosen.push(
        <button onClick={this.czarSelect} className={""} id={ident}>{String(cards[i])}</button>
      )
    }
    }
    this.setState({played_cards: listofChosen})
  }

  czarSelect(e) {
    if (this.state.position_list[socket.io.engine.id] === 'czar') {
      if (this.state.played_cards.length == Object.keys(this.state.game_list).length - 1) {
        e
          .currentTarget
          .setAttribute("class", "bg-indigo")
        socket.emit('czar has chosen', e.currentTarget.innerText)
        this.setState({played_cards:"Played Cards go here"})
      }
    }
  }

  selectCard(e) {
    if (this.state.position_list[socket.io.engine.id] !== 'czar') {
      // alert(this.state.position_list[socket.io.engine.id])
      if (this.state.selected.length < this.state.num_to_select) {
        // alert(e.currentTarget.innerText)
        var temp_list = this.state.card_list
        // for (var i = 0; i < temp_list.length; i++) {
        // temp_list[i].setAttribute("disabled", "disabled") }
        e
          .currentTarget
          .setAttribute("class", "bg-indigo")
        var the_selects = this.state.selected
        the_selects.push(e.currentTarget.innerText)
        // alert(the_selects)
        this.setState({selected: the_selects})
      }
      console.log('num have ')
      console.log(this.state.selected.length)
      console.log('num need')
      console.log(this.state.num_to_select)
      console.log(this.state.num_needed)
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
      if (!String(white_cards[i]).includes('undefined')){
      listofCards.push(
        <button onClick={this.selectCard} className={"bg-white"} id={ident}>{white_cards[i]}</button>
      )
    }
    else{
      socket.emit('new white cards', 1)
    }
    }
    // var listofCards = white_cards.map((card) =>   <li
    // classID={card}>{String(card)}</li> )
    this.setState({my_cards: cards, card_list: listofCards, black_card: cards.black.text, num_needed:cards.black.pick, num_to_select: cards.black.pick});
    // alert(cards)
    // $('button').flowtype();
  }

  updateLast(selected) {
    this.setState({last_winner: selected})
  }

  updateBlack(blackCard) {
    this.setState({black_card: blackCard.text, num_needed: blackCard.pick, num_to_select: blackCard.pick, played_cards:"Played Cards go here"})
  }

  updateWhite(new_whites) {
    // alert(new_whites)
    // var buttons = document.querySelectorAll("button")
    // buttons.forEach((element) => {
    //   element.className = "bg-white"
    // })
    var selects = this.state.selected
    var cards = this.state.my_cards
    var white_cards = Array.from(cards.white)
    // console.log(white_cards)
    var new_white_counter = 0
    for (var q = 0; q < white_cards.length; q++){
        for (var e = 0; e < selects.length; e++){
          if (white_cards[q] === selects[e]){
            white_cards[q] = new_whites[new_white_counter]
            new_white_counter+=1
          }
        }
    }
    // console.log(white_cards)
    var listofCards = []
    for (var i = 0; i < white_cards.length; i++) {
      var ident = "card-" + String(i)
      if (!String(white_cards[i]).includes('undefined')){
      listofCards.push(
        <button onClick={this.selectCard} className={"bg-white"} id={ident}>{String(white_cards[i])}</button>
      )
      document.getElementById(ident).className = ""
      document.getElementById(ident).classList.add('bg-white')
    }
      else{
        var current_needed = this.state.num_needed
        this.setState({num_needed: current_needed+1})
      }
    }
    cards.white = white_cards
    this.setState({my_cards: cards, card_list: listofCards, selected:[], played_cards:"Played Cards go here"})
  }

  render() {
    return (
      <div>
        <h1><span>Your Position: {this.state.position_list[socket.io.engine.id]}</span></h1>
        {/*<h2>User: {String(Object.keys(this.state.users))}</h2>*/}
        {/*<h2>Users: {this.state.users}</h2>*/}
        <h2>Number users: {String(Object.keys(this.state.game_list).length)}  ||  <span>Your Score: {String(this.state.game_list[socket.io.engine.id])}  ||  </span>
        <span>Your name: {String(this.state.your_name)}</span>
        </h2>
        {/*<h3>Ugly dict (format later) : {JSON.stringify(this.state.game_list)}</h3>*/}
        <table id="scoreTable">
        <thead>
          <th>user</th>
          <th>score</th>
        </thead>
        <tbody>
        </tbody>
      </table>
        <h1>Black Card: {this.state.black_card}</h1>
        <h3>Number to Select: {this.state.num_to_select}</h3>
        <p>Your Cards:</p>
        <p>{this.state.card_list}</p>
        <p>Played Cards:</p>
        <p>{this.state.played_cards}</p>
      </div>
    );
  }
  componentDidMount() {
    socket.emit('entered room', {ident: this.state.gameId, username: prompt('enter username')})
    socket.on('enter message', (data) => {
      this.someoneEntered(data);
    })
    socket.on('update users', (data) => {
      this.updateUsers(data);
    })
    socket.on('update users bad?', (data) => {
      this.updateUsers(data);
      this.setState({selected: []})
      alert('someone disconnected, ignore pre-existing highlighted cards')
    })
    socket.on('your cards', (cards) => {
      console.log(cards)
      this.updateCards(cards);
    })

    socket.on('update chosen', (cards) => {
      this.updateChosen(cards);
    })

    socket.on('last winner', (selected) => {
      this.updateLast(selected);
    })

    socket.on('new black', (blackCard) => {
      this.updateBlack(blackCard)
    })

    socket.on('send me white', (please) => {
      socket.emit('new white cards', this.state.num_needed)
    })

    socket.on('new white cards', (new_whites) => {
      this.updateWhite(new_whites)
    })

  }
}
