import React from 'react';
import Header from './Header'
import Main from './Main'
const io = require('socket.io-client')  
const socket = io() 

export default class App extends React.Component {
  render() { 
    return (
      <div>
        <Header />
        <Main className="mainContent"/>
      </div>
    )
  }
  componentDidMount() {
    socket.emit('connectedToApp', 'true')
    console.log(socket.io.engine.id)
  }
  
}