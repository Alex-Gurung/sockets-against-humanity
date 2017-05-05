import React from 'react';
import ReactDOMServer from 'react-dom/server';
import express from 'express';

const fs = require('fs');
const cah_json = JSON.parse(fs.readFileSync('public/cah.json', 'utf8'));

let app = express();

// Set the view engine to ejs app.set('view engine', 'ejs'); Serve static files
// from the 'public' folder
app.use(express.static('public'));

// GET / app.get('/', function (req, res) {     console.log(__dirname)
// res.sendFile(__dirname + '/index.html');   // res.render('layout', {   //
// content: ReactDOMServer.renderToString(<HelloWorld />)   // }); }); Start
// server
var server_port = process.env.OPENSHIFT_NODEJS_PORT || 8080
var server_ip_address = process.env.OPENSHIFT_NODEJS_IP || '127.0.0.1'
let server = app.listen(server_port, server_ip_address, function () {
  let host = server
    .address()
    .address;
  let port = server
    .address()
    .port;

  if (host === '::') {
    host = 'localhost';
  }

  console.log('App listening at http://%s:%s', host, port);
});
// let server = app.listen(process.env.PORT || 8080, function () {     var host
// = server.address().address;     var port = server.address().port;
// console.log('Example app listening at http://' + host + ':' + port); })

let io = require('socket.io')(server)
let games_list = {};
let decks_list = {};
let position_list = {};
let chosen_cards = {};
position_list['global'] = {}
games_list['global'] = {}
decks_list['global'] = {}
let username_list = {}
io.sockets.on('connection', (socket) => {
  // console.log('new connection');
  // console.log(czar_string)
  socket.on('disconnect', () => {
    var old_room = socket.room
    var old_id = socket.id
    if (games_list.hasOwnProperty(old_room)) {
      if (games_list[old_room].hasOwnProperty(old_id)) {
        delete games_list[old_room][old_id]
      }
      // if (Object.keys(games_list[socket.room]).length == 0) {
      //   delete games_list[socket.room]
      // }
    }
    if (chosen_cards.hasOwnProperty(old_room)) {
      if (chosen_cards[old_room].hasOwnProperty(old_id)) {
        delete chosen_cards[old_room][old_id]
      }
      // if (Object.keys(chosen_cards[old_room]).length == 0) {
      //   delete chosen_cards[old_room]
      // }
    }
    if (username_list.hasOwnProperty(old_room)) {
      if (username_list[old_room].hasOwnProperty(old_id)) {
        delete username_list[old_room][old_id]
      }
      // if (Object.keys(username_list[old_room]).length == 0) {
      //   delete username_list[old_room]
      // }
    }
    if (position_list.hasOwnProperty(old_room)) {
      var was_czar = false;
      if (position_list[old_room].hasOwnProperty(old_id)) {
        was_czar = position_list[old_room][old_id] === 'czar'
        delete position_list[old_room][old_id]
      }
      // if (Object.keys(position_list[old_room].length == 0)) {
      //   console.log('delete position list')
      //   delete position_list[old_room]
      // } else {
        if (was_czar) {
          var keys = Object.keys(position_list[old_room])
          console.log(keys)
          if (keys){
          position_list[old_room][keys[0]] = 'czar'}
        } else {
          var foundCzar = false;
          var continue_looking = true;
          for (var key in position_list[old_room]) {
            if (continue_looking) {
              if (position_list[old_room].hasOwnProperty(key)) {
                if (position_list[old_room][key] === 'czar') {
                  position_list[old_room][key] = 'player'
                  foundCzar = true;
                } else if (foundCzar) {
                  position_list[old_room][key] = 'czar'
                  continue_looking = false;
                }
              }
            }
          }
          if (continue_looking && foundCzar) {
            position_list[old_room][keys[0]] = 'czar'
          }
        }
      // }
    }
    console.log(position_list[old_room])
    if (games_list.hasOwnProperty(old_room)) {
      socket
        .broadcast
        .to(old_room)
        .emit('update users', {
          game: games_list[old_room],
          position: position_list[old_room],
          nicknames: username_list[old_room]
        })
    }
    io.emit('returned game list', Object.keys(games_list))
    // console.log('new disconnection');
  });
  socket.on('connectedToApp', (username) => {
    // socket.username = username
    socket.room = 'global'
    socket.join('global')
    // console.log(username)
    // console.log(socket.id)
  })
  socket.on('create or join game', (game_id) => {
    // console.log('fsdfdsf')
    if (!games_list.hasOwnProperty(game_id)) {
      games_list[game_id] = {}
      games_list[game_id]['czar'] = socket.id
    }
    games_list[game_id][socket.id] = 0
    socket.join(game_id)
    socket.room = game_id
  })
  socket.on('entered room', (data) => {
    var game_id = data.ident
    var username = data.username
    var old_room = socket.room
    var old_id = socket.id
    if (games_list.hasOwnProperty(old_room)) {
      if (games_list[old_room].hasOwnProperty(old_id)) {
        delete games_list[old_room][socket.id]
      }
      // if (Object.keys(games_list[socket.room]).length == 0) {
      //   delete games_list[socket.room]
      // }
    }
    if (chosen_cards.hasOwnProperty(old_room)) {
      if (chosen_cards[old_room].hasOwnProperty(old_id)) {
        delete chosen_cards[old_room][old_id]
      }
      // if (Object.keys(chosen_cards[old_room]).length == 0) {
      //   delete chosen_cards[old_room]
      // }
    }
    if (username_list.hasOwnProperty(old_room)) {
      if (username_list[old_room].hasOwnProperty(old_id)) {
        delete username_list[old_room][old_id]
      }
      // if (Object.keys(username_list[old_room]).length == 0) {
      //   delete username_list[old_room]
      // }
    }
    if (position_list.hasOwnProperty(old_room)) {
      var was_czar = false;
      if (position_list[old_room].hasOwnProperty(old_id)) {
        was_czar = position_list[old_room][old_id] === 'czar'
        delete position_list[old_room][old_id]
      }
      // if (Object.keys(position_list[old_room].length == 0)) {
      //   console.log('delete position list')
      //   delete position_list[old_room]
      // } else {
        if (was_czar) {
          var keys = Object.keys(position_list[old_room])
          console.log(keys)
          if (keys){
          position_list[old_room][keys[0]] = 'czar'}
        } else {
          var foundCzar = false;
          var continue_looking = true;
          for (var key in position_list[old_room]) {
            if (continue_looking) {
              if (position_list[old_room].hasOwnProperty(key)) {
                if (position_list[old_room][key] === 'czar') {
                  position_list[old_room][key] = 'player'
                  foundCzar = true;
                } else if (foundCzar) {
                  position_list[old_room][key] = 'czar'
                  continue_looking = false;
                }
              }
            }
          }
          if (continue_looking && foundCzar) {
            position_list[old_room][keys[0]] = 'czar'
          }
        }
      // }
    }

    if (!games_list.hasOwnProperty(game_id)) {
      games_list[game_id] = {}
      username_list[game_id] = {}
      username_list[game_id][socket.id] = username
      // games_list[game_id]['czar'] = socket.id
      chosen_cards[game_id] = {}
      chosen_cards[game_id][socket.id] = ""
      position_list[game_id] = {}
      position_list[game_id][socket.id] = 'czar'
      decks_list[game_id] = {}
      decks_list[game_id]['deck'] = cah_json
      decks_list[game_id]['blackCards'] = decks_list[game_id]['deck']['blackCards']
      decks_list[game_id]['whiteCards'] = decks_list[game_id]['deck']['whiteCards']
      var index = Math.floor(Math.random() * decks_list[game_id]['blackCards'].length)
      decks_list[game_id]['black_card'] = decks_list[game_id]['blackCards'][index]
      delete decks_list[game_id]['blackCards'][index]
      if (decks_list[game_id]['blackCards'].length == 0) {
        decks_list[game_id]['blackCards'] = decks_list[game_id]['deck']['blackCards']
      }
    } else {
      username_list[game_id][socket.id] = username
      position_list[game_id][socket.id] = 'player'
    }


    var cards_list = []
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
      var index = Math.floor(Math.random() * decks_list[game_id]['whiteCards'].length)
      var this_card = decks_list[game_id]['whiteCards'][index];
      if (this_card) {
        cards_list.push(decks_list[game_id]['whiteCards'][index])
      }
      delete decks_list[game_id]['whiteCards'][index]
      if (decks_list[game_id]['whiteCards'].length == 0) {
        decks_list[game_id]['whiteCards'] = decks_list[game_id]['deck']['whiteCards']
      }
    }

    socket
      .broadcast
      .to(socket.room)
      .emit('update users', {
        game: games_list[socket.room],
        position: position_list[socket.room],
        nicknames: username_list[socket.room]
      })
    socket.leave(socket.room)
    socket.join(game_id)
    socket.cards = cards_list
    // console.log(cards_list)
    socket.emit('your cards', {
      white: cards_list,
      black: decks_list[game_id]['black_card']
    })



    socket.room = game_id
    games_list[game_id][socket.id] = 0



    // socket.emit('enter message', {user: socket.id, message: socket.id + "has
    // enter game: " + game_id})
    socket
      .broadcast
      .to(game_id)
      .emit('enter message', {
        user: socket.id,
        message: socket.id + "has enter game: " + game_id
      })
    socket
      .broadcast
      .to(game_id)
      .emit('update users', {
        game: games_list[game_id],
        position: position_list[game_id],
        nicknames: username_list[game_id]
      })
    socket.emit('update users', {
      game: games_list[game_id],
      position: position_list[game_id],
      nicknames: username_list[game_id]
    })

    // console.log(game_id)
    // console.log(socket.id)
    // console.log(socket.id)
    // console.log(games_list[game_id])
    io.emit('returned game list', Object.keys(games_list))
  })

  socket.on('selected cards', (selected_cards) => {
    chosen_cards[socket.room][socket.id] = selected_cards
    // console.log(chosen_cards[socket.room])
    // console.log(position_list[socket.room])
    var cards = []
    for (var key in chosen_cards[socket.room]) {
      if (chosen_cards[socket.room].hasOwnProperty(key)) {
        if (chosen_cards[socket.room][key].length > 0) {
          cards.push(chosen_cards[socket.room][key])
        }
      }
    }
    socket.broadcast.to(socket.room).emit('update chosen', cards)
    socket.emit('update chosen', cards)
  })

  socket.on('czar has chosen', (selected) => {
    for (var key in chosen_cards[socket.room]) {
      if (chosen_cards[socket.room].hasOwnProperty(key)) {
        if (chosen_cards[socket.room][key] == selected) {
          games_list[socket.room][key] += 1
        }
      }
    }

    var keys = Object.keys(position_list[socket.room])
    // console.log(keys)
    // var setCzar = 0;
    // var counter = 0
    var foundCzar = false;
    var continue_looking = true;
    for (var key in position_list[socket.room]) {
      if (continue_looking) {
        if (position_list[socket.room].hasOwnProperty(key)) {
          if (position_list[socket.room][key] === 'czar') {
            position_list[socket.room][key] = 'player'
            foundCzar = true;
          } else if (foundCzar) {
            position_list[socket.room][key] = 'czar'
            continue_looking = false;
          }
        }
      }
    }
    if (continue_looking && foundCzar) {
      position_list[socket.room][keys[0]] = 'czar'
    }
    // position_list[socket.room][keys[counter + 1]] = 'czar'

    console.log(position_list[socket.room])

    socket.broadcast.to(socket.room).emit('update users', {
      game: games_list[socket.room],
      position: position_list[socket.room],
      nicknames: username_list[socket.room]
    })
    socket.emit('update users', {
      game: games_list[socket.room],
      position: position_list[socket.room],
      nicknames: username_list[socket.room]
    })

    socket.broadcast.to(socket.room).emit('last winner', selected)
    socket.emit('last winner', selected)


    var index = Math.floor(Math.random() * decks_list[socket.room]['blackCards'].length)
    decks_list[socket.room]['black_card'] = decks_list[socket.room]['blackCards'][index]
    delete decks_list[socket.room]['blackCards'][index]
    if (decks_list[socket.room]['blackCards'].length == 0) {
      decks_list[socket.room]['blackCards'] = decks_list[socket.room]['deck']['blackCards']
    }
    while (!decks_list[socket.room]['black_card']) {
      var index = Math.floor(Math.random() * decks_list[socket.room]['blackCards'].length)
      decks_list[socket.room]['black_card'] = decks_list[socket.room]['blackCards'][index]
      delete decks_list[socket.room]['blackCards'][index]
      if (decks_list[socket.room]['blackCards'].length == 0) {
        decks_list[socket.room]['blackCards'] = decks_list[socket.room]['deck']['blackCards']
      }
    }


    socket.broadcast.to(socket.room).emit('new black', decks_list[socket.room]['black_card'])
    socket.emit('new black', decks_list[socket.room]['black_card'])

    socket.broadcast.to(socket.room).emit('send me white', 'please')
    chosen_cards[socket.room] = {}
    // chosen_cards[socket.room][socket.id] = selected_cards
    // console.log(chosen_cards[socket.room])
    // console.log(position_list[socket.room])
    // var cards = []
    // for (var key in chosen_cards[socket.room]){
    //   if (chosen_cards[socket.room].hasOwnProperty(key)){
    //     if (chosen_cards[socket.room][key].length > 0) {
    //     cards.push(chosen_cards[socket.room][key])
    //   }
    //   }
    // }
    // socket.broadcast.to(socket.room).emit('update chosen', cards)
    // socket.emit('update chosen', cards)
  })

  socket.on('new white cards', (number) => {
    var cards_list = []
    while (cards_list.length < number) {
      var index = Math.floor(Math.random() * decks_list[socket.room]['whiteCards'].length)
      var this_card = decks_list[socket.room]['whiteCards'][index];
      if (this_card) {
        if (this_card && String(this_card) !== undefined && !String(this_card).includes('undefined')) {
          cards_list.push(decks_list[socket.room]['whiteCards'][index])
        }
      }
      delete decks_list[socket.room]['whiteCards'][index]
      if (decks_list[socket.room]['whiteCards'].length == 0) {
        decks_list[socket.room]['whiteCards'] = decks_list[socket.room]['deck']['whiteCards']
      }
    }
    socket.emit('new white cards', cards_list)


  })



  socket.on('get game list', (data) => {
    io.emit('returned game list', Object.keys(games_list))
  })
})