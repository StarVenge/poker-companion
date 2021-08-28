//TODO ADD ANTES AND BLINDS

let totalPlayers;

totalPlayers = 4;
let round = 0;

let players = [];
let playersInOrder = [];

//player class
class Player {
  constructor(name, startingBalance, id) {
    this.name = name;
    this.balance = startingBalance;
    this.id = id;
    this.infor = 0;
    this.bet = 0;
    this.folded = false;
    this.visited = false;
  }
}

//initialize each player
for(let i = 0; i<totalPlayers; i++) {
  let newPlayer = new Player(`Player ${i+1}`, 500 /*TODO INSERT STARTING BALANCE*/, i);
  players.push(newPlayer);
  playersInOrder.push(newPlayer);
}

players[0].visited = true;

//draws non-active players at the bottom of the screen
function drawNonActivePlayers() {
  for(let i = 1; i<totalPlayers; i++) {
    let node = document.createElement("div");
    node.className = "w3-col remove";
    node.style.width = `${1/(totalPlayers-1)*100}%`;
    node.style.minHeight = `100%`;
    node.style.display = `flex`;

    let cardNode = document.createElement('div');
    cardNode.className = "w3-card-4 w3-container color2";
    cardNode.style.display = `flex`;
    cardNode.style.minHeight = `100%`;
    cardNode.style.minWidth = `100%`;
    cardNode.style.alignItems = `center`;
    cardNode.style.justifyContent = `center`;
    cardNode.style.fontSize = '20px';
    cardNode.style.fontWeight = 'bold';

    if(players[i].folded) cardNode.className = "w3-card-4 w3-container w3-2019-eclipse";

    cardNode.appendChild(document.createTextNode(`${players[i].name}`));
    cardNode.appendChild(document.createElement('br'));
    cardNode.appendChild(document.createElement('br'));
    cardNode.appendChild(document.createTextNode(`Balance Remaining: $${players[i].balance}`));
    cardNode.appendChild(document.createElement('br'));
    cardNode.appendChild(document.createTextNode(`In for: $${players[i].infor}`));
    cardNode.appendChild(document.createElement('br'));
    cardNode.appendChild(document.createTextNode(`Bet: $${players[i].bet}`));

    node.appendChild(cardNode);
    document.getElementById("nonActivePlayers").appendChild(node);
  }
}

drawNonActivePlayers();

//draws active player in the middle of the screen AND actions
function drawActivePlayer() {
  let player = players[0];

  //contains player info
  let playerNode = document.createElement("div");
  playerNode.className = "w3-container remove";
  playerNode.style.width = `75%`;
  playerNode.style.display = `flex`;

  //card with player info
  let cardNode = document.createElement('div');
  cardNode.className = "w3-card-4 w3-container color5";
  cardNode.style.display = `flex`;
  cardNode.style.minWidth = `100%`;
  cardNode.style.alignItems = `center`;
  cardNode.style.justifyContent = `center`;
  cardNode.style.fontSize = '20px';
  cardNode.style.fontWeight = 'bold';

  cardNode.appendChild(document.createTextNode(`${player.name}`));
  cardNode.appendChild(document.createElement('br'));
  cardNode.appendChild(document.createElement('br'));
  cardNode.appendChild(document.createTextNode(`Balance Remaining: $${player.balance}`));
  cardNode.appendChild(document.createElement('br'));
  cardNode.appendChild(document.createTextNode(`In for: $${player.infor}`));
  cardNode.appendChild(document.createElement('br'));
  cardNode.appendChild(document.createTextNode(`Bet: $${player.bet}`));

  playerNode.appendChild(cardNode);
  document.getElementById("activePlayer").appendChild(playerNode);

  //contains buttons
  let buttonBlock = document.createElement('div');
  buttonBlock.className = "remove w3-bar-block w3-container"
  buttonBlock.style.width = "25%";

  //call button
  let callButton = document.createElement('button');
  callButton.className = "remove w3-bar-item w3-button w3-pale-green w3-border w3-hover-green";
  callButton.style.minHeight = "33.3%";
  callButton.style.display = "flex";
  callButton.style.justifyContent = "center";
  callButton.style.alignItems = "center";
  callButton.innerHTML = "Check";
  callButton.addEventListener("click", call);

  //checks whether button should say Check or Call
  let maxBet = getMaxBet();

  if(maxBet > 0) {
    if(maxBet > player.balance) maxBet = player.balance;
    callButton.innerHTML = `Call $${maxBet}`;
  }

  //bet button
  let betButton = document.createElement('button');
  betButton.className = "remove w3-bar-item w3-button w3-pale-yellow w3-border w3-hover-yellow";
  betButton.style.minHeight = "33.3%";
  betButton.style.display = "flex";
  betButton.style.justifyContent = "center";
  betButton.style.alignItems = "center";
  betButton.innerHTML = "Raise";
  betButton.addEventListener("click", openRaiseMenu);

  //fold button
  let foldButton = document.createElement('button');
  foldButton.className = "remove w3-bar-item w3-button w3-pale-red w3-border w3-hover-red";

  let numFolded = getNumFolded();
  if(numFolded == totalPlayers-1) {
    foldButton.className = "remove w3-bar-item w3-button w3-pale-red w3-border w3-hover-red w3-disabled";
    foldButton.disabled = true;
  }

  foldButton.style.minHeight = "33.3%";
  foldButton.style.display = "flex";
  foldButton.style.justifyContent = "center";
  foldButton.style.alignItems = "center";
  foldButton.innerHTML = "Fold";
  foldButton.addEventListener("click", fold);

  buttonBlock.appendChild(callButton);
  buttonBlock.appendChild(betButton);
  buttonBlock.appendChild(foldButton);

  document.getElementById("activePlayer").appendChild(buttonBlock);
}

drawActivePlayer();

//cycle to next player (or next hand if all players have been visited)
function cycle() {

  //cycle players[]
  let first = players.shift();
  players.push(first);

  //check if all players are visited and if they all have the same bet
  let allVisited = true;
  let allSameBet = true;

  let bet = -1;

  for(let i = 0; i<totalPlayers; i++) {
    if(!players[i].folded && !players[i].visited) {
      allVisited = false;
    }
    if(!players[i].folded && allSameBet && !players[i].balance == 0) {
      let tempBet = players[i].bet;
      if(bet==-1) bet = tempBet;
      else if(tempBet!=bet) allSameBet = false;
    }
  }

  // console.log(allVisited);
  // console.log(allSameBet);
  
  //visit first player
  players[0].visited = true;

  //if all visited and all have same bet, move to next round
  if(allVisited && allSameBet) {
    nextRound();
  }

  clear();
  drawActivePlayer();
  drawNonActivePlayers();

  //if the current player is folded, move on to the next player
  if(players[0].folded) cycle();
}

function getMaxBet() {
  //finds the max bet so far
  let maxBet = 0;

  for(let i = 0; i<players.length; i++) {
    let tempBet = players[i].bet;
    if(tempBet > maxBet) maxBet = tempBet;
  }

  return maxBet;
}

//clears all elements with the class remove
function clear() {
  let elements = document.getElementsByClassName("remove");

  for(let i = elements.length-1; i>=0; i--) {
    elements[i].remove();
  }
}

//opens the popUpMenu for a raise
function openRaiseMenu() {
  setOpenMenu(document.getElementById('raisePopup'));
  let player = players[0];

  let maxBet = getMaxBet();
  
  //adjusts the settings of the number input field
  document.getElementById("raisePopup").style.display = "block";
  document.getElementById("raiseInput").setAttribute("min", maxBet);
  document.getElementById("raiseInput").setAttribute("max", player.balance);
  document.getElementById("raiseInput").focus();
  document.getElementById("raiseInput").select();
}

//closes the popUpMenu for a raise
function closeRaiseMenu() {
  let val = Number(document.getElementById("raiseInput").value);

  //adjusts player's palance
  let player = players[0];
  player.balance-=val;
  player.infor+=val;
  player.bet+=val;

  //removes popup
  document.getElementById("raisePopup").style.display = "none";

  //cycles to next player
  cycle();
}

//call largest previous bet
function call() {
  let player = players[0];

  //finds the max bet so far
  let maxBet = getMaxBet();

  if(maxBet > player.balance) maxBet = player.balance;

  //adjusts balance
  let more = maxBet-player.bet;
  player.balance-=more;
  player.infor+=more;
  player.bet+=more;
  
  //cycle to next player
  cycle();
}


//checks if all players are folded
function getNumFolded() {
  let numFolded = 0;
  for(let i = 0; i<totalPlayers; i++) {
    if(players[i].folded) {
      numFolded++;
    }
  }

  return numFolded;
}


//folds current player
function fold() {
  let player = players[0];

  player.folded = true;

  let numFolded = getNumFolded();

  //if not all folded cycle
  if(numFolded != totalPlayers) cycle();

  //if all folded open the next hand menu but in reality this should never happen so it should just fucking break
  else {
    console.log("ALL THINGS ARE BREAKING IF YOU GET HERE");
    player.folded = false;
    openNextHandMenu();
  }

  if(numFolded == totalPlayers-1) {
    openNextHandMenu(players[0]);
  }
}



//moves on to the next round of play
function nextRound() {
  console.log("next round");

  //resets bets and visited
  for(let i = 0; i<totalPlayers; i++) {
    players[i].bet = 0;
    players[i].visited = false;
  }

  //finds lowest non-folded player
  let lowestNotFolded = Number.MAX_SAFE_INTEGER;
  for(let i = 0; i<totalPlayers; i++) {
    if(!players[i].folded) {
      let tempId = players[i].id;
      if(tempId < lowestNotFolded) lowestNotFolded = tempId;
    }
  }

  //cycles to lowest non-folded player
  let id = players[0].id;
  while(id!=lowestNotFolded) {
    let first = players.shift();
    players.push(first);
    id=players[0].id;
  }

  players[0].visited = true;
}

//generates the winner options for the next hand menu
function generateWinnerOptions() {
  let winnerInput = document.getElementById("nextHandWinnerInput");

  for(let i = 0; i<totalPlayers; i++) {
    let option = document.createElement("option");
    option.innerHTML = players[i].name;
    option.value = players[i].name;

    winnerInput.appendChild(option);
  } 
}

generateWinnerOptions();

//opens next hand menu
function openNextHandMenu(winningPlayerInput) {
  let winnerInput = document.getElementById("nextHandWinnerInput");
  let popup = document.getElementById("nextHandPopup");

  setOpenMenu(popup);

  popup.style.display = "block";

  winnerInput.focus();

  if(winningPlayerInput) {
    document.getElementById("nextHandWinnerInput").value = winningPlayerInput.name;
  }
}

//closes next hand menu
function closeNextHandMenu() {
  let winner = document.getElementById("nextHandWinnerInput").value;

  nextRound();

  //finds index of the winner
  let winnerIndex;
  for(let i = 0; i<totalPlayers; i++) {
    if(players[i].name == winner) winnerIndex = i;
  }

  //gives winning player the pot
  let winningPlayer = players[winnerIndex];
  let pot = 0;
  let winningPlayerInFor = winningPlayer.infor;

  for(let i = 0; i<totalPlayers; i++) {
    if(winningPlayerInFor < players[i].infor) {
      pot+=winningPlayerInFor;
      players[i].balance+=players[i].infor-winningPlayerInFor;
    }
    else {
      pot+=players[i].infor;
    }

    players[i].infor = 0;
    players[i].folded = false;
  }
  winningPlayer.balance+=pot;

  //remove popup
  document.getElementById("nextHandPopup").style.display = "none";

  //go back to first player
  while(players[0].id != 0) {
    let first = players.shift();
    players.push(first);
  }

  //redraw everything
  clear();
  drawActivePlayer();
  drawNonActivePlayers();

}

//opens player menu
function openPlayerMenu() {

  // let winnerInput = document.getElementById("nextHandWinnerInput");
  let popup = document.getElementById("playerMenuPopup");
  setOpenMenu(popup);

  popup.style.display = "block";

  let playerNumberInput = document.getElementById("playerNumberInput");

  //adjusts the settings of the number input field
  playerNumberInput.setAttribute("min", 0);
  playerNumberInput.value = totalPlayers;

  let form = document.getElementById("playerMenuForm");

  //event listener for number of players selector changing
  playerNumberInput.addEventListener('input', ()=> {
    
    let difference = playerNumberInput.value-(form.childElementCount-4)/2;

    //if number increased
    if(difference > 0) {
      let b = form.removeChild(form.lastChild);
      let p = form.removeChild(form.lastChild);

      let label = document.createElement("label");
      label.innerHTML = "Player " + (playerNumberInput.value) + "'s name: ";

      let textField = document.createElement("input");
      textField.className = "w3-input w3-border";
      textField.setAttribute("type", "text");
      textField.value = "Player " + (playerNumberInput.value);

      form.appendChild(label);
      form.appendChild(textField);

      form.appendChild(p);
      form.appendChild(b);
    }

    //if number decreased
    else if(difference < 0) {
      let b = form.removeChild(form.lastChild);
      let p = form.removeChild(form.lastChild);
      form.removeChild(form.lastChild);
      form.removeChild(form.lastChild);

      form.appendChild(p);
      form.appendChild(b);
    }
  });

  //remove children except text field and label
  while(form.childElementCount!=2) {
    form.removeChild(form.lastChild);
  }

  //generate player boxes
  for(let i = 0; i<totalPlayers; i++) {
    let label = document.createElement("label");
    label.innerHTML = "Player " + (i+1) + "'s name: ";

    let textField = document.createElement("input");
    textField.className = "w3-input w3-border";
    textField.setAttribute("type", "text");
    textField.value = playersInOrder[i].name;

    form.appendChild(label);
    form.appendChild(textField);
  } 

  //generate button and spacing
  let p = document.createElement("p");
  p.style.height = "40px";
  form.appendChild(p);

  let b = document.createElement("button");
  b.id = "closePlayerMenuPopup";
  b.className = "w3-round w3-display-bottommiddle w3-margin-bottom w3-container w3-button w3-green";
  b.innerHTML = "Confirm Changes";
  form.appendChild(b);

}

//closes the player menu
function closePlayerMenu() {

  let form = document.getElementById("playerMenuForm");
  let playerNumberInput = document.getElementById("playerNumberInput");
 
  let difference = playerNumberInput.value - totalPlayers;
  totalPlayers = playerNumberInput.value;

  //if number of players increased
  if(difference > 0) {
    for(let i = 0; i<difference; i++) {
      let newPlayer = new Player(name, 500 /*TODO INSERT STARTING BALANCE*/, i);
      players.push(newPlayer);
      playersInOrder.push(newPlayer);
    }
  }

  //if number of players decreased
  else if(difference < 0) {
    for(let i = 0; i<difference*-1; i++) {
      let toRemove = playersInOrder.pop();
      let removeIndex = players.indexOf(toRemove);
      players.splice(removeIndex, 1);
    }
  }

  //rename each player
  for(let i = 0; i<totalPlayers; i++) {
    playersInOrder[i].name = form.children[3+2*i].value;
  }

  document.getElementById("playerMenuPopup").style.display = "none";

  //redraw everything
  clear();
  drawActivePlayer();
  drawNonActivePlayers();
}

//opens the cheat sheet
function openCheatSheet() {
  document.getElementById("cheatSheetPopup").style.display = "block";
  setOpenMenu(document.getElementById("cheatSheetPopup"));
}

//opens shortcuts menu
function openShortcutsMenu() {
  document.getElementById("shortcutsPopup").style.display = "block";
  setOpenMenu(document.getElementById("shortcutsPopup"));
}

//stores currently open menu
let openMenu;

//changes currently open element
function setOpenMenu(element) {
  openMenu = element;
}

//adds keydown event listeners
document.addEventListener("keydown", (e) => {
  let key = e.key;


  if(key=="c") call();
  else if(key == "r") openRaiseMenu();
  else if(key== "f") fold();
  else if(key == "n") cycle();
  else if(key == "h") openNextHandMenu();
  else if(key == "p") openPlayerMenu();
  else if(key == "x") openCheatSheet();
  else if(key =="/") openShortcutsMenu();

  else if(key == "Escape") {
    openMenu.style.display = "none";
  }
});
