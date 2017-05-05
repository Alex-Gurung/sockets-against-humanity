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

var createJoin = function (_React$Component) {
  _inherits(createJoin, _React$Component);

  function createJoin(props) {
    _classCallCheck(this, createJoin);

    var _this = _possibleConstructorReturn(this, (createJoin.__proto__ || Object.getPrototypeOf(createJoin)).call(this, props));

    _this.createGame = _this.createGame.bind(_this);

    _this.handleChange = _this.handleChange.bind(_this);
    _this.state = {
      gameurl: '/game/'
    };
    socket.on('create game', function (data) {
      this.alert(message);
    });
    return _this;
  }

  _createClass(createJoin, [{
    key: 'createGame',
    value: function createGame() {
      var game_id = prompt('game id: ');
      socket.emit('create or join game', game_id);
      this.setState({
        gameurl: '/game/' + game_id
      });
      // console.log('pressed button')
    }
  }, {
    key: 'handleChange',
    value: function handleChange(event) {
      this.setState({
        gameid: event.target.value,
        gameurl: '/game/' + event.target.value
      });
    }
  }, {
    key: 'render',
    value: function render() {
      return _react2.default.createElement(
        'div',
        { className: 'flexBox' },
        _react2.default.createElement(
          'h1',
          null,
          'Create/Join'
        ),
        _react2.default.createElement('input', { className: 'centerClass', type: 'text', value: this.state.gameid, onChange: this.handleChange }),
        _react2.default.createElement('br', null),
        _react2.default.createElement(
          _reactRouterDom.Link,
          { className: 'centerClass', to: this.state.gameurl },
          'Go to Game'
        )
      );
    }
    // componentDidMount() {
    //   if (socket.hasOwnProperty('gameid')){
    //     socket.emit('entered room', 'global')
    //   }
    // }

  }]);

  return createJoin;
}(_react2.default.Component);

exports.default = createJoin;