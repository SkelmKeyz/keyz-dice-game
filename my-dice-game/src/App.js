// src/App.js
import React, { useState } from "react";
import "./App.css";

function App() {
  const [dice, setDice] = useState([1, 1]);

  const rollDice = () => {
    setDice([
      Math.floor(Math.random() * 6) + 1,
      Math.floor(Math.random() * 6) + 1,
    ]);
  };

  return (
    <div className="App">
      <h1>🎲 Skelm Dice Roller 🎲</h1>
      <div className="dice-container">
        {dice.map((value, i) => (
          <div key={i} className="die">
            {value}
          </div>
        ))}
      </div>
      <button onClick={rollDice}>Roll Dice</button>
    </div>
  );
}

export default App;

