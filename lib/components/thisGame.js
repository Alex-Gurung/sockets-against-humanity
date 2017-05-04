'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactRouterDom = require('react-router-dom');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }
// import {Link} from 'react-router'


var thisGame = function (_React$Component) {
  _inherits(thisGame, _React$Component);

  function thisGame(props) {
    _classCallCheck(this, thisGame);

    var _this = _possibleConstructorReturn(this, (thisGame.__proto__ || Object.getPrototypeOf(thisGame)).call(this, props));

    _this.state = {
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
      selected: [],
      last_winner: "last_winner"
    };
    _this.selectCard = _this.selectCard.bind(_this);
    _this.czarSelect = _this.czarSelect.bind(_this);
    return _this;
  }

  _createClass(thisGame, [{
    key: 'someoneEntered',
    value: function someoneEntered(data) {
      // alert(data.message)
      console.log(data.message);
    }
  }, {
    key: 'updateUsers',
    value: function updateUsers(data) {
      var gameList = data.game;
      var position = data.position;
      // alert(data)
      this.setState({
        position_list: position,
        users: String(Object.keys(gameList)),
        game_list: gameList
      });
      // console.log('data' + data) alert(this.state.my_cards)
    }
  }, {
    key: 'updateChosen',
    value: function updateChosen(cards) {
      var listofChosen = [];
      // alert(cards[0])
      for (var i = 0; i < cards.length; i++) {
        var ident = "chosencard-" + String(i);
        listofChosen.push(_react2.default.createElement(
          'button',
          { onClick: this.czarSelect, className: "", id: ident },
          String(cards[i])
        ));
      }
      this.setState({ played_cards: listofChosen });
    }
  }, {
    key: 'czarSelect',
    value: function czarSelect(e) {
      if (this.state.position_list[socket.io.engine.id] === 'czar') {
        if (this.state.played_cards.length == Object.keys(this.state.game_list).length - 1) {
          e.currentTarget.setAttribute("class", "bg-indigo");
          socket.emit('czar has chosen', e.currentTarget.innerText);
        }
      }
    }
  }, {
    key: 'selectCard',
    value: function selectCard(e) {
      if (this.state.position_list[socket.io.engine.id] !== 'czar') {
        // alert(this.state.position_list[socket.io.engine.id])
        if (this.state.selected.length < this.state.num_to_select) {
          // alert(e.currentTarget.innerText)
          var temp_list = this.state.card_list;
          // for (var i = 0; i < temp_list.length; i++) {
          // temp_list[i].setAttribute("disabled", "disabled") }
          e.currentTarget.setAttribute("class", "bg-indigo");
          var the_selects = this.state.selected;
          the_selects.push(e.currentTarget.innerText);
          // alert(the_selects)
          this.setState({ selected: the_selects });
        }
        if (this.state.selected.length == this.state.num_to_select) {
          socket.emit('selected cards', this.state.selected);
        }
      }
    }
  }, {
    key: 'updateCards',
    value: function updateCards(cards) {
      // this.setState({gameid: this.state.gameId, users: this.state.users,
      // game_list:this.state.game_list, my_cards: cards});
      var white_cards = Array.from(cards.white);
      console.log(white_cards);
      var listofCards = [];
      for (var i = 0; i < white_cards.length; i++) {
        var ident = "card-" + String(i);
        listofCards.push(_react2.default.createElement(
          'button',
          { onClick: this.selectCard, className: "bg-white", id: ident },
          String(white_cards[i])
        ));
      }
      // var listofCards = white_cards.map((card) =>   <li
      // classID={card}>{String(card)}</li> )
      this.setState({ my_cards: cards, card_list: listofCards, black_card: cards.black.text, num_to_select: cards.black.pick });
      // alert(cards)
    }
  }, {
    key: 'updateLast',
    value: function updateLast(selected) {
      this.setState({ last_winner: selected });
    }
  }, {
    key: 'updateBlack',
    value: function updateBlack(blackCard) {
      this.setState({ black_card: blackCard.text, num_to_select: blackCard.pick, played_cards: "Played Cards go here" });
    }
  }, {
    key: 'updateWhite',
    value: function updateWhite(new_whites) {
      // alert(new_whites)
      var buttons = document.querySelectorAll("button");
      buttons.forEach(function (element) {
        element.className = "bg-white";
      });
      var selects = this.state.selected;
      var cards = this.state.my_cards;
      var white_cards = Array.from(cards.white);
      // console.log(white_cards)
      var new_white_counter = 0;
      for (var q = 0; q < white_cards.length; q++) {
        for (var e = 0; e < selects.length; e++) {
          if (white_cards[q] === selects[e]) {
            white_cards[q] = new_whites[new_white_counter];
            new_white_counter += 1;
          }
        }
      }
      // console.log(white_cards)
      var listofCards = [];
      for (var i = 0; i < white_cards.length; i++) {
        var ident = "card-" + String(i);
        listofCards.push(_react2.default.createElement(
          'button',
          { onClick: this.selectCard, className: "bg-white", id: ident },
          String(white_cards[i])
        ));
      }
      cards.white = white_cards;
      this.setState({ my_cards: cards, card_list: listofCards, selected: [], played_cards: "Played Cards go here" });
    }
  }, {
    key: 'render',
    value: function render() {
      return _react2.default.createElement(
        'div',
        null,
        _react2.default.createElement(
          'h1',
          null,
          'Id: ',
          this.state.gameId,
          '  ||  ',
          _react2.default.createElement(
            'span',
            null,
            'Your Position: ',
            this.state.position_list[socket.io.engine.id]
          )
        ),
        _react2.default.createElement(
          'h3',
          null,
          'Number users: ',
          String(Object.keys(this.state.game_list).length),
          '  ||  ',
          _react2.default.createElement(
            'span',
            null,
            'Your Score: ',
            String(this.state.game_list[socket.io.engine.id])
          )
        ),
        _react2.default.createElement(
          'h3',
          null,
          'Ugly dict (format later) : ',
          JSON.stringify(this.state.game_list)
        ),
        _react2.default.createElement(
          'h4',
          null,
          'Last winner: ',
          this.state.last_winner
        ),
        _react2.default.createElement(
          'h1',
          null,
          'Black Card: ',
          this.state.black_card
        ),
        _react2.default.createElement(
          'h3',
          null,
          'Number to Select: ',
          this.state.num_to_select
        ),
        _react2.default.createElement(
          'p',
          null,
          'Your Cards:'
        ),
        _react2.default.createElement(
          'p',
          null,
          this.state.card_list
        ),
        _react2.default.createElement(
          'p',
          null,
          'Played Cards:'
        ),
        _react2.default.createElement(
          'p',
          null,
          this.state.played_cards
        )
      );
    }
  }, {
    key: 'componentDidMount',
    value: function componentDidMount() {
      var _this2 = this;

      socket.emit('entered room', this.state.gameId);
      socket.on('enter message', function (data) {
        _this2.someoneEntered(data);
      });
      socket.on('update users', function (data) {
        _this2.updateUsers(data);
      });
      socket.on('your cards', function (cards) {
        console.log(cards);
        _this2.updateCards(cards);
      });

      socket.on('update chosen', function (cards) {
        _this2.updateChosen(cards);
      });

      socket.on('last winner', function (selected) {
        _this2.updateLast(selected);
      });

      socket.on('new black', function (blackCard) {
        _this2.updateBlack(blackCard);
      });

      socket.on('send me white', function (please) {
        socket.emit('new white cards', _this2.state.num_to_select);
      });

      socket.on('new white cards', function (new_whites) {
        _this2.updateWhite(new_whites);
      });
    }
  }]);

  return thisGame;
}(_react2.default.Component);

exports.default = thisGame;