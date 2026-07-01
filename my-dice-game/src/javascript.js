//Game State constructor
function GameState (isFirstRoll, point, roller, pot, bank, players) {
    this.isFirstRoll = isFirstRoll,
    this.point = point,
    this.roller = roller,
    this.pot = pot,
    this.bank = bank,
    this.players = players;
}

//New Game State 
let gameState = new GameState(
    true,
    null,
    "player1",
    50,
    {
        loanPool: 200,
        balances: { player1: 1000, player2: 1000},
        bets: [],
        winStreak: { player1: 0, player2: 0},
        totalWins: { player1: 0, player2: 0},
        specialLossStreak: { player1: 0, player2: 0},
        last3Bets: { player1: [], player2: []},
 },
["player1","player2"]
);

// Logging
function addLog(message) {
    let log = document.getElementById("gameLog");
    if (!log) return;
    let entry = document.createElement("p");
    entry.textContent = message;
    log.appendChild(entry);
}

// Display Update
function updateDisplay() {
    document.querySelector("#potDisplay").textContent = `Pot: ${gameState.pot} Credits`;
    document.querySelector("#bankBalanceP1").textContent = "Player 1 balance: " + gameState.bank.balances.player1 + " Credits";
    document.querySelector("#bankBalanceP2").textContent = "Player 2 balance: " + gameState.bank.balances.player2 + " Credits";
    document.querySelector("#loanPool").textContent = "Loan Pool: " + gameState.bank.loanPool + " Credits";
}

// Dice Animation
function animateDice(imgElement) {
    let final = Math.floor(Math.random() * 6) + 1;
    let counter = 0 ;

    let interval = setInterval(() => {
        counter++;
        let temp = Math.floor(Math.random() * 6) + 1;
        imgElement.setAttribute("src", "images/dice" + temp + ".png");

        if (counter > 10) {
            clearInterval(interval);
            imgElement.setAttribute("src", "images/dice" + final + ".png");
        }
    }, 100);

    return final;
}



// Betting
function placeBet(player, amount) {
    if (amount < 20) {
        addLog("R20 I do!");
        return;
    }

    if (gameState.bank.balances[player] < amount) {
        addLog(player + " has insufficient funds"); 
        return;
    }

    
    gameState.bank.balances[player] = Math.max(0, Number(gameState.bank.balances[player]) - amount);

   
    gameState.pot = Number(gameState.pot) + amount;

    gameState.bank.bets.push({ player, amount });

    gameState.bank.last3Bets[player].push(amount);
    if (gameState.bank.last3Bets[player].length > 3) {
        gameState.bank.last3Bets[player].shift();
    }

    addLog(player + " placed bet of R" + amount);
    updateDisplay();
}



function settleRound(winner) {
    gameState.bank.balances[winner] += gameState.pot;
    gameState.bank.totalWins[winner] += 1;
    gameState.bank.winStreak[winner] += 1;

    gameState.pot = 0;
    gameState.bank.bets = [];

    addLog(winner + " wins the round!");
    updateDisplay();
}

function applyBankRules(player) {
    if (gameState.bank.winStreak[player] === 3) {
        let fee = Math.max(...gameState.bank.last3Bets[player]) * 0.3;
        gameState.bank.loanPool += fee;
        gameState.bank.balances[player] -= fee;
        gameState.bank.winStreak[player] = 0;

        addLog("Streak Tax applied to " + player);
    }

    if (gameState.bank.totalWins[player] === 5) {
        let fee = Math.max(...gameState.bank.last3Bets[player]) * 3;
        gameState.bank.loanPool += fee;
        gameState.bank.balances[player] -= fee;
        gameState.bank.winStreak[player] = 0;

        addLog("Wins-5 Pick-up Tax applied to " + player);
    }

    updateDisplay();
}

// Loan
function requestLoan(player, amount) {
    let contributions = gameState.bank.last3Bets[player].reduce((a, b) => a + b, 0);
    if (amount > gameState.bank.loanPool - contributions) {
        addLog("Loan exceeds available pool");
        return;

    }

    gameState.bank.balances[player] += amount;
    gameState.bank.loanPool -= amount;

    addLog(player + " borrowed R" + amount);
    updateDisplay();
}

// Side-bets
function specialSideBets(player, amount, sum) {
    let straightWinFee = gameState.pot * 0.25;

    if (gameState.isFirstRoll && (sum === 7 || sum === 11)) {
        
        gameState.bank.balances[player] = Math.max(0, gameState.bank.balances[player] - straightWinFee);

        let opponent = player === "player1" ? "player2" : "player1";
        gameState.bank.balances[opponent] += straightWinFee;

        addLog("Straight win side bet pays! Roller: " + gameState.roller);
    } else {
        addLog("No straight win! Roller: " + gameState.roller);
    }

    let noWinFee = gameState.pot * 0.25;

    if (!gameState.isFirstRoll) {
        gameState.bank.balances[player] = Math.max(0, gameState.bank.balances[player] - noWinFee);

        let opponent = player === "player1" ? "player2" : "player1";
        gameState.bank.balances[opponent] += noWinFee;

        addLog("No Win bet pays! Roller: " + gameState.roller);
    } else {
        addLog("No Win bet fails. Roller still in play.");
    }

    updateDisplay();
}







// Logic
let img1 = document.querySelector(".img1");

let d1 = Math.random();
d1 = d1 * 6;
d1 = Math.floor(d1) + 1;
img1.setAttribute("src", "images/dice" + d1 + ".png");

let img2 = document.querySelector(".img2");

let d2 = Math.random();
d2 = d2 * 6;
d2 = Math.floor(d2) + 1;
img2.setAttribute("src", "images/dice" + d2 + ".png");







// Reset
function resetGameState() {
    gameState.isFirstRoll = true;
    gameState.point = null;
    gameState.roller = "player1";
    addLog("Game reset:");
    updateDisplay();
}

// Roll Handler
function handClick() {
    let d1 = animateDice(document.querySelector(".img1"));
    let d2 = animateDice(document.querySelector(".img2"));
    let sum = d1 + d2;

    addLog(`${gameState.roller} rolled ${d1} + ${d2} = ${sum}`);
    specialSideBets(gameState.roller, 20, sum);

    let message = "";
    let currentRoller = gameState.roller;
    

    if (gameState.isFirstRoll) {
        if (sum === 7 || sum === 11) {
            addLog(`${gameState.roller} Instant win!`);
            message = "🚩 " + currentRoller + " Wins Instantly!";
            resetGameState();
             
        } else if (sum === 2 || sum === 3 || sum === 12) {
            addLog(`${gameState.roller} Instant lose!`);
            message = "🚩 " + currentRoller + " Loses Instantly!";
            resetGameState();             
        }
        else  {
            gameState.point = sum;
            gameState.isFirstRoll = false;
            addLog(`${gameState.roller} sets point to ${sum}`);
            message = "Point Pay! " + currentRoller + " sets point to " + sum;     
        }
        
    }  else {
      if (sum === gameState.point) {
        addLog(`${gameState.roller} hit the point to and wins!`);
        message = "Point Pay! " + currentRoller + " Hit the Point";
        resetGameState();
         
      } else if (sum === 7) {
        addLog(`${gameState.roller} rolled 7 and loses!`);
        message = "Point Pay! " + currentRoller + " Hit Crap No. 7";
        resetGameState();
         
      } else {
        addLog(`${gameState.roller} re-rolls...`);
        message = "Point Pay! " + currentRoller + " Re-Roll"; 
        let currentIndex = gameState.players.indexOf(currentRoller);
        gameState.roller = gameState.players[(currentIndex + 1) % gameState.players.length];

    }
}

    updateDisplay();
   
    setTimeout(() => {
        let h1 = document.querySelector("h1"); 
        h1.textContent = message;

        if (message.includes("wins")) {
            h1.className = "win";
        } else if (message.includes("Loses") || message.includes("Craps No. 7")) {
            h1.className = "lose";
        } else {
            h1.className = "";

        }

        
    }, 1200);
}




document.querySelector('#rollSection button').addEventListener("click", handClick);
