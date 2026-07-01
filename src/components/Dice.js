import React from 'react';

const Dice = ({ die1, die2 }) => (
  <div className='dice-container'>
    <img src={`/images/dice${die1}.png`} alt={`Die ${die1}`} />
    <img src={`/images/dice${die2}.png`} alt={`Die ${die2}`} />
  </div>
);

export default Dice;