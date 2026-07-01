import React from 'react';

function Controls({ onPlaceBet, onSettleRound, roller }) {
  return (
    <div className='controls'>
      <h3>Controls</h3>
      <p>Current Roller: {roller}</p>
      <button onClick={() => onPlaceBet("player1", 50)}>Player 1 Bet R50</button>
      <button onClick={() => onPlaceBet("player2", 50)}>Player 2 Bet R50</button>
      <button onClick={() => onSettleRound("player1")}>Settle Round (P1 wins)</button>
      <button onClick={() => onSettleRound("player2")}>Settle Round (P2 wins)</button>
    </div>
  );
}

export default Controls;
