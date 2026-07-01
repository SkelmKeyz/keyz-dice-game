import React, { useState } from "react";
import './App.css';

import Navbar from './components/Navbar';
import Dice from './components/Dice';
import SectionCard from './components/SectionCard';
import Bank from './components/Bank';
import Balance from './components/Balance';
import Pot from './components/Pot';
import SideBets from './components/SideBets';
import Controls from './components/Controls';
import GameLog from './components/GameLog';

function App() {
  const [die1, setDie1] = useState(1);
  const [die2, setDie2] = useState(1);

  const roll = () => {
    setDie1(Math.floor(Math.random() * 6) + 1);
    setDie2(Math.floor(Math.random() * 6) + 1);
  };

  const [gameState, setGameState] = useState ({
    isFirstRoll: true,
    point: null,
    roller: "player1",
    pot: 50,
    bank: {
      loanPool: 200,
      balances: { player1: 1000, player2: 1000 },
      bets: [],
      winStreak: { player1: 0, player2: 0},
      totalWins: { player1: 0, player2: 0},
      specialLossStreak: { player1: 0, player2: 0},
      last3Bets: { player1: [], player2: []},
    },
    players: ["player1", "player2"],

  });

  const settleRound = (winner) => {
  setGameState(prev => ({
    ...prev,
    pot: 0,
    bank: {
      ...prev.bank,
      balances: {
        ...prev.bank.balances,
        [winner]: prev.bank.balances[winner] + prev.pot
      },
      bets: [] 
    }

    
  }));
};




  const placeBet = (player, amount) => {
    setGameState(prev => ({
    ...prev,
    pot: prev.pot + amount,
    bank: {
      ...prev.bank,
      balances: {
        ...prev.bank.balances,
        [player]: prev.bank.balances[player] - amount
      },
      bets: [...prev.bank.bets, { player, amount }]
    }
  }));


};

  
 
  return (
    <div className='App'>
      <Navbar />
      <main className='App-main'>
        <h1>🎲 Kasi Culture Game 🎲</h1>
        <div className='App-content'>
          <SectionCard className="dice-card">
            <Dice die1={die1} die2={die2} />
            <p>Current: {die1}, {die2}</p>
            <button onClick={roll}>Roll Dice</button>
          </SectionCard>

          <SectionCard className="pot-card">
            <>
              <p>Pot: {gameState.pot} Credits</p>
              <p>Player 1 balance: {gameState.bank.balances.player1} Credits</p>
              <p>Player 2 balance: {gameState.bank.balances.player2} Credits</p>
            </>
          </SectionCard>

          <SectionCard className="bank-card">
            <Bank />
          </SectionCard>

          <SectionCard className="balance-card">
            <Balance />
          </SectionCard>

          <SectionCard className="sidebets-card">
            <SideBets />
          </SectionCard>

          <SectionCard className="controls-card">
            <Controls 
              onPlaceBet={placeBet}
              onSettleRound={settleRound}
              roller={gameState.roller} 
            />
          </SectionCard>

          <SectionCard className="gamelog-card">
            <GameLog />
          </SectionCard>
        </div>
      </main>
    </div>
  );
}

export default App;


