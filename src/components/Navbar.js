import React from 'react';
import "./Navbar.css";

function Navbar() {
  return (
    <nav className='navbar'>
      <h2>Skelm Dice Roller</h2>
      <ul className="nav-links">
        <li>Home</li>
        <li>Bank</li>
        <li>Side Bets</li>
        <li>Game Log</li>
      </ul>
    </nav>
  );
}

export default Navbar;
