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

var AllGames = function (_React$Component) {
  _inherits(AllGames, _React$Component);

  function AllGames(props) {
    _classCallCheck(this, AllGames);

    var _this = _possibleConstructorReturn(this, (AllGames.__proto__ || Object.getPrototypeOf(AllGames)).call(this, props));

    _this.state = { game_list: ['none'], listItems: ['none'].map(function (item) {
        _react2.default.createElement(
          'li',
          null,
          _react2.default.createElement(
            _reactRouterDom.Link,
            { to: '/game/' + item },
            String(item)
          )
        );
      }) };
    return _this;
  }

  _createClass(AllGames, [{
    key: 'setGameList',
    value: function setGameList(gameList_from_server) {
      var gameList = Array.from(gameList_from_server);
      // alert(typeof gameList)
      // alert(gameList.length)
      var listofLinks = gameList.map(function (game) {
        return _react2.default.createElement(
          'li',
          null,
          _react2.default.createElement(
            _reactRouterDom.Link,
            { to: '/game/' + game },
            String(game)
          )
        );
      });
      this.setState({ game_list: gameList, listItems: listofLinks });
      // this.setState({game_list: gameList, listItems: gameList.map((item) => {
      // <li><Link to={'/game/'+String({item})}>{String(item)}</Link></li>} )})
      // alert(this.state.listItems)
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
          'AllGames'
        ),
        _react2.default.createElement(
          'h2',
          null,
          this.state.game_list
        ),
        _react2.default.createElement(
          'ul',
          null,
          this.state.listItems
        )
      );
    }
  }, {
    key: 'componentDidMount',
    value: function componentDidMount() {
      var _this2 = this;

      socket.emit('get game list', 'true');

      socket.on('returned game list', function (data) {
        _this2.setGameList(data);
      });
    }
  }]);

  return AllGames;
}(_react2.default.Component);

exports.default = AllGames;