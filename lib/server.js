'use strict';

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _server = require('react-dom/server');

var _server2 = _interopRequireDefault(_server);

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var fs = require('fs');
var cah_json = JSON.parse(fs.readFileSync('public/cah.json', 'utf8'));
function makeid(str_length) {
  var text = "";
  var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

  for (var i = 0; i < str_length; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }return text;
}

var czar_string = makeid(100);

var app = (0, _express2.default)();

// Set the view engine to ejs app.set('view engine', 'ejs'); Serve static files
// from the 'public' folder
app.use(_express2.default.static('public'));

// GET / app.get('/', function (req, res) {     console.log(__dirname)
// res.sendFile(__dirname + '/index.html');   // res.render('layout', {   //
// content: ReactDOMServer.renderToString(<HelloWorld />)   // }); }); Start
// server
var server = app.listen(8080, function () {
  var host = server.address().address;
  var port = server.address().port;

  if (host === '::') {
    host = 'localhost';
  }

  console.log('Example app listening at http://%s:%s', host, port);
});
// let server = app.listen(process.env.PORT || 8080, function () {     var host
// = server.address().address;     var port = server.address().port;
// console.log('Example app listening at http://' + host + ':' + port); })

var io = require('socket.io')(server);
var games_list = {};
var decks_list = {};
var position_list = {};
var chosen_cards = {};
position_list['global'] = {};
games_list['global'] = {};
decks_list['global'] = {};
io.sockets.on('connection', function (socket) {
  // console.log('new connection');
  // console.log(czar_string)
  socket.on('disconnect', function () {
    var old_room = socket.room;
    if (games_list.hasOwnProperty(socket.room)) {
      if (games_list[socket.room].hasOwnProperty(socket.id)) {
        delete games_list[socket.room][socket.id];
      }
      if (Object.keys(games_list[socket.room]).length == 0) {
        delete games_list[socket.room];
      }
    }
    if (games_list.hasOwnProperty(old_room)) {
      socket.broadcast.to(old_room).emit('update users', games_list[old_room]);
    }
    io.emit('returned game list', Object.keys(games_list));
    // console.log('new disconnection');
  });
  socket.on('connectedToApp', function (username) {
    // socket.username = username
    socket.room = 'global';
    socket.join('global');
    // console.log(username)
    // console.log(socket.id)
  });
  socket.on('create or join game', function (game_id) {
    console.log('fsdfdsf');
    if (!games_list.hasOwnProperty(game_id)) {
      games_list[game_id] = {};
      games_list[game_id]['czar'] = socket.id;
    }
    games_list[game_id][socket.id] = 0;
    socket.join(game_id);
    socket.room = game_id;
  });
  socket.on('entered room', function (game_id) {
    if (games_list.hasOwnProperty(socket.room)) {
      if (games_list[socket.room].hasOwnProperty(socket.id)) {
        delete games_list[socket.room][socket.id];
        delete chosen_cards[game_id][socket.id];
      }
    }

    if (!games_list.hasOwnProperty(game_id)) {
      games_list[game_id] = {};
      // games_list[game_id]['czar'] = socket.id
      chosen_cards[game_id] = {};
      chosen_cards[game_id][socket.id] = "";
      position_list[game_id] = {};
      position_list[game_id][socket.id] = 'czar';
      decks_list[game_id] = {};
      decks_list[game_id]['deck'] = cah_json;
      decks_list[game_id]['blackCards'] = decks_list[game_id]['deck']['blackCards'];
      decks_list[game_id]['whiteCards'] = decks_list[game_id]['deck']['whiteCards'];
      var index = Math.floor(Math.random() * decks_list[game_id]['blackCards'].length);
      decks_list[game_id]['black_card'] = decks_list[game_id]['blackCards'][index];
      delete decks_list[game_id]['blackCards'][index];
      if (decks_list[game_id]['blackCards'].length == 0) {
        decks_list[game_id]['blackCards'] = decks_list[game_id]['deck']['blackCards'];
      }
    } else {
      position_list[game_id][socket.id] = 'player';
    }

    var cards_list = [];
    // for (var i = 0; i < 7; i++){
    //   var index = Math.floor(Math.random() * decks_list[game_id]['whiteCards'].length)
    //   var this_card = decks_list[game_id]['whiteCards'][index];
    //   cards_list.push(this_card)
    //   delete decks_list[game_id]['whiteCards'][index]
    //   if (decks_list[game_id]['whiteCards'].length == 0){
    //     decks_list[game_id]['whiteCards'] = decks_list[game_id]['deck']['whiteCards']
    //   }
    // }
    while (cards_list.length < 7) {
      var index = Math.floor(Math.random() * decks_list[game_id]['whiteCards'].length);
      var this_card = decks_list[game_id]['whiteCards'][index];
      if (this_card) {
        cards_list.push(decks_list[game_id]['whiteCards'][index]);
      }
      delete decks_list[game_id]['whiteCards'][index];
      if (decks_list[game_id]['whiteCards'].length == 0) {
        decks_list[game_id]['whiteCards'] = decks_list[game_id]['deck']['whiteCards'];
      }
    }

    socket.cards = cards_list;
    // console.log(cards_list)
    socket.emit('your cards', { white: cards_list, black: decks_list[game_id]['black_card'] });

    socket.broadcast.to(socket.room).emit('update users', { game: games_list[socket.room], position: position_list[game_id] });
    socket.leave(socket.room);
    socket.room = game_id;
    games_list[game_id][socket.id] = 0;

    socket.join(game_id);

    // socket.emit('enter message', {user: socket.id, message: socket.id + "has
    // enter game: " + game_id})
    socket.broadcast.to(game_id).emit('enter message', {
      user: socket.id,
      message: socket.id + "has enter game: " + game_id
    });
    socket.broadcast.to(game_id).emit('update users', { game: games_list[game_id], position: position_list[game_id] });
    socket.emit('update users', { game: games_list[game_id], position: position_list[game_id] });

    // console.log(game_id)
    // console.log(socket.id)
    // console.log(socket.id)
    // console.log(games_list[game_id])
    io.emit('returned game list', Object.keys(games_list));
  });

  socket.on('selected cards', function (selected_cards) {
    console.log(selected_cards);
    chosen_cards[socket.room][socket.id] = selected_cards;
    socket.broadcast.to(socket.room).emit('update chosen', chosen_cards[socket.room]);
    socket.emit('update chosen', chosen_cards[socket.room]);
  });

  socket.on('get game list', function (data) {
    io.emit('returned game list', Object.keys(games_list));
  });
});