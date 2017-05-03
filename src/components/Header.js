import React from 'react';
// import SimpleCounter from './SimpleCounter';
import {Link} from 'react-router-dom'

export default class User extends React.Component {
  render() {
    return (
      <div>
        <nav>
          <ul className="navigation">
            <li className="headerList">
              <Link to='/'>Home</Link>
            </li>
            <li className="headerList">
              <Link to='/createjoin'>create/join</Link>
            </li>
            <li className="headerList">
              <Link to='/game'>Games</Link>
            </li>
          </ul>
        </nav>
      </div>
    );
  }
}
