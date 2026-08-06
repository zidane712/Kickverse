let coins = 500;
let gems = 0;
let xp = 0;
let level = 1;
let dailyGoals = 0;

let chosenMode = "Penalty Shootout";
let chosenDifficulty = "Beginner";

let playerScore = 0;
let botScore = 0;
let shotNumber = 1;
let gameFinished = false;

const homeScreen = document.querySelector("#home-screen");
const modeScreen = document.querySelector("#mode-screen");
const penaltyScreen = document.querySelector("#penalty-screen");
const matchScreen = document.querySelector("#match-screen");
const resultsScreen = document.querySelector("#results-screen");
const playButton = document.querySelector("#play-button");
const backHomeButton = document.querySelector("#back-home");
const backModesButton = document.querySelector("#back-modes");
const startGameButton = document.querySelector("#start-game");

const dailyRewardButton = document.querySelector("#daily-reward");

const modeButtons = document.querySelectorAll(".mode-card");
const difficultyButtons = document.querySelectorAll(".difficulty");
const shotButtons = document.querySelectorAll("#shot-buttons button");

const goalkeeper = document.querySelector("#goalkeeper");
const ball = document.querySelector("#ball");

const selectionText = document.querySelector("#selection-text");
const gameMessage = document.querySelector("#game-message");

const playAgainButton = document.querySelector("#play-again");
const returnHomeButton = document.querySelector("#return-home");

playButton.addEventListener("click", () => {
  showScreen(modeScreen);
});

backHomeButton.addEventListener("click", () => {
  showScreen(homeScreen);
});

backModesButton.addEventListener("click", () => {
  showScreen(modeScreen);
});

returnHomeButton.addEventListener("click", () => {
  showScreen(homeScreen);
});

playAgainButton.addEventListener("click", () => {
  showScreen(penaltyScreen);
  resetGame();
});

dailyRewardButton.addEventListener("click", () => {
  if (dailyRewardButton.disabled) {
    return;
  }

  const reward = Math.floor(Math.random() * 101) + 50;

  coins += reward;

  document.querySelector("#reward-text").textContent =
    `You won ${reward} coins!`;

  dailyRewardButton.disabled = true;

  updateStats();
});

document.querySelectorAll(".coming-soon").forEach((button) => {
  button.addEventListener("click", () => {
    alert("This KickVerse feature is coming soon!");
  });
});

modeButtons.forEach((button) => {
  button.addEventListener("click", () => {
    modeButtons.forEach((card) => {
      card.classList.remove("selected");
    });

    button.classList.add("selected");
    chosenMode = button.dataset.mode;

    updateSelection();
  });
});

difficultyButtons.forEach((button) => {
  button.addEventListener("click", () => {
    difficultyButtons.forEach((difficultyButton) => {
      difficultyButton.classList.remove("active");
    });

    button.classList.add("active");
    chosenDifficulty = button.dataset.difficulty;

    updateSelection();
  });
});

startGameButton.addEventListener("click", () => {
  if (chosenMode === "Penalty Shootout") {
    document.querySelector("#difficulty-name").textContent =
        `${chosenDifficulty} Bot`;

    showScreen(penaltyScreen);
    resetGame();
} else if (chosenMode === "Match Mode") {
  matchMinute = 0;
homeMatchScore = 0;
awayMatchScore = 0;
matchRewardsGiven = false;
showScreen(matchScreen);
} else {
    alert(`${chosenMode} mode is coming in the next update!`);
}
});
shotButtons.forEach((button) => {
  button.addEventListener("click", () => {
    if (gameFinished) {
      return;
    }

    takeShot(button.dataset.shot);
  });
});

function showScreen(screenToShow) {
  const screens = [
    homeScreen,
    modeScreen,
    penaltyScreen,
    matchScreen,
resultsScreen
  ];

  screens.forEach((screen) => {
    screen.classList.add("hidden");
  });

  screenToShow.classList.remove("hidden");

  window.scrollTo({
    top: 0,
    behavior: "smooth"
  });
}

function updateSelection() {
  selectionText.textContent =
    `${chosenMode} · ${chosenDifficulty} Bot`;
}

function resetGame() {
  playerScore = 0;
  botScore = 0;
  shotNumber = 1;
  gameFinished = false;

  document.querySelector("#player-score").textContent = "0";
  document.querySelector("#bot-score").textContent = "0";
  document.querySelector("#shot-number").textContent = "1";

  gameMessage.textContent =
    "Choose where you want to shoot!";

  resetPositions();
  disableShotButtons(false);
}

function takeShot(playerChoice) {
  disableShotButtons(true);

  const choices = [
    "top-left",
    "top-middle",
    "top-right",
    "bottom-left",
    "bottom-middle",
    "bottom-right"
  ];

  const goalkeeperChoice =
    chooseGoalkeeperDirection(playerChoice, choices);

  moveBall(playerChoice);
  moveGoalkeeper(goalkeeperChoice);

  const saved = playerChoice === goalkeeperChoice;

  if (saved) {
    botScore++;

    gameMessage.textContent =
      "🧤 What a save! Unlucky, Chief!";
  } else {
    playerScore++;
    dailyGoals++;

    gameMessage.textContent =
      "⚽ GOOOAAALLL! Brilliant penalty!";
  }

  document.querySelector("#player-score").textContent =
    playerScore;

  document.querySelector("#bot-score").textContent =
    botScore;

  updateStats();

  setTimeout(() => {
    if (shotNumber >= 5) {
      finishGame();
      return;
    }

    shotNumber++;

    document.querySelector("#shot-number").textContent =
      shotNumber;

    resetPositions();

    gameMessage.textContent =
      "Choose where you want to shoot next!";

    disableShotButtons(false);
  }, 1100);
}

function chooseGoalkeeperDirection(playerChoice, choices) {
  let saveChance = 0.16;

  if (chosenDifficulty === "Skilled") {
    saveChance = 0.25;
  }

  if (chosenDifficulty === "Pro") {
    saveChance = 0.36;
  }

  if (chosenDifficulty === "Legend") {
    saveChance = 0.48;
  }

  if (Math.random() < saveChance) {
    return playerChoice;
  }

  return choices[Math.floor(Math.random() * choices.length)];
}

function finishGame() {
  gameFinished = true;

  let coinReward = 0;
  let xpReward = 0;

  const resultTitle = document.querySelector("#result-title");
  const resultIcon = document.querySelector("#result-icon");
  const resultMessage = document.querySelector("#result-message");

  if (playerScore > botScore) {
    coinReward = 100;
    xpReward = 50;

    resultTitle.textContent = "Victory!";
    resultIcon.textContent = "🏆";

    resultMessage.textContent =
      `You won ${playerScore}-${botScore}!`;
  } else if (playerScore === botScore) {
    coinReward = 50;
    xpReward = 25;

    resultTitle.textContent = "Draw!";
    resultIcon.textContent = "🤝";

    resultMessage.textContent =
      `The shootout finished ${playerScore}-${botScore}.`;
  } else {
    coinReward = 20;
    xpReward = 10;

    resultTitle.textContent = "Good Try!";
    resultIcon.textContent = "💪";

    resultMessage.textContent =
      `The bot won ${botScore}-${playerScore}.`;
  }

  coins += coinReward;
  xp += xpReward;

  levelUpIfNeeded();

  document.querySelector("#coins-won").textContent =
    `+${coinReward}`;

  document.querySelector("#xp-won").textContent =
    `+${xpReward}`;

  updateStats();

  setTimeout(() => {
    showScreen(resultsScreen);
  }, 900);
}

function levelUpIfNeeded() {
  let xpNeeded = level * 100;

  while (xp >= xpNeeded) {
    xp -= xpNeeded;
    level++;
    xpNeeded = level * 100;

    alert(`🎉 Level up! You reached Level ${level}!`);
  }
}

function moveBall(choice) {
  const positions = {
    "top-left": ["18%", "67%"],
    "top-middle": ["50%", "67%"],
    "top-right": ["82%", "67%"],
    "bottom-left": ["18%", "31%"],
    "bottom-middle": ["50%", "31%"],
    "bottom-right": ["82%", "31%"]
  };

  ball.style.left = positions[choice][0];
  ball.style.bottom = positions[choice][1];
  ball.style.transform =
    "translateX(-50%) scale(0.72)";
}

function moveGoalkeeper(choice) {
  const positions = {
    "top-left": ["18%", "28%"],
    "top-middle": ["50%", "28%"],
    "top-right": ["82%", "28%"],
    "bottom-left": ["18%", "68%"],
    "bottom-middle": ["50%", "68%"],
    "bottom-right": ["82%", "68%"]
  };

  goalkeeper.style.left = positions[choice][0];
  goalkeeper.style.top = positions[choice][1];
}

function resetPositions() {
  ball.style.left = "50%";
  ball.style.bottom = "28px";
  ball.style.transform =
    "translateX(-50%) scale(1)";

  goalkeeper.style.left = "50%";
  goalkeeper.style.top = "50%";
}

function disableShotButtons(disabled) {
  shotButtons.forEach((button) => {
    button.disabled = disabled;
  });
}

function updateStats() {
  document.querySelector("#coins").textContent = coins;
  document.querySelector("#gems").textContent = gems;
  document.querySelector("#xp").textContent = xp;
  document.querySelector("#level").textContent = level;

  document.querySelectorAll(".coins-copy").forEach((element) => {
    element.textContent = coins;
  });

  document.querySelectorAll(".xp-copy").forEach((element) => {
    element.textContent = xp;
  });

  document.querySelector("#challenge").textContent =
    Math.min(dailyGoals, 3);

  const xpNeeded = level * 100;
  const progress = Math.min((xp / xpNeeded) * 100, 100);

  document.querySelector("#xp-fill").style.width =
    `${progress}%`;
}

updateStats();
// Let each player choose their KickVerse name
let playerName = localStorage.getItem("kickversePlayerName");

if (!playerName) {
  playerName = prompt("Choose your KickVerse player name:")?.trim() || "Chief Creator";
  localStorage.setItem("kickversePlayerName", playerName);
}

document.querySelectorAll("h1, h2, h3, p, span").forEach((item) => {
  item.innerHTML = item.innerHTML.replaceAll("Chief Creator", playerName);
});
const backMatchModesButton = document.querySelector("#back-match-modes");
const matchPassButton = document.querySelector("#match-pass");
const matchAttackButton = document.querySelector("#match-attack");
const matchShootButton = document.querySelector("#match-shoot");
const matchDefendButton = document.querySelector("#match-defend");

const matchMinuteText = document.querySelector("#match-minute");
const homeMatchScoreText = document.querySelector("#home-match-score");
const awayMatchScoreText = document.querySelector("#away-match-score");
const matchCommentary = document.querySelector("#match-commentary");

let matchMinute = 0;
let homeMatchScore = 0;
let awayMatchScore = 0;
let matchRewardsGiven = false;
const matchBall = document.querySelector(".match-ball");

function moveBall(position) {
    if (position === "left") {
        matchBall.style.left = "25%";
    } else if (position === "center") {
        matchBall.style.left = "50%";
    } else if (position === "right") {
        matchBall.style.left = "75%";
    }
}
backMatchModesButton.addEventListener("click", () => {
  showScreen(modeScreen);
});

matchPassButton.addEventListener("click", () => {
  matchMinute += 5;
  matchCommentary.textContent = "Great pass! Kick FC keeps possession.";
  moveBall("left");
  updateMatchScreen();
});

matchAttackButton.addEventListener("click", () => {
  matchMinute += 7;

  if (Math.random() < 0.45) {
    matchCommentary.textContent = "Kick FC breaks forward into the box!";
    moveBall("right");
  } else {
    awayMatchScore += 1;
    matchCommentary.textContent = "Thunder United wins the ball and scores!";
  }

  updateMatchScreen();
});

matchShootButton.addEventListener("click", () => {
  matchMinute += 6;

  if (Math.random() < 0.55) {
    homeMatchScore += 1;
    matchCommentary.textContent = "GOAL! Kick FC scores!";
    moveBall("right");
  } else {
    matchCommentary.textContent = "The goalkeeper saves the shot!";
  }

  updateMatchScreen();
});

matchDefendButton.addEventListener("click", () => {
  matchMinute += 5;

  if (Math.random() < 0.65) {
    matchCommentary.textContent = "Brilliant defending! Danger cleared.";
    moveBall("left");
  } else {
    awayMatchScore += 1;
    matchCommentary.textContent = "Thunder United gets through and scores!";
  }

  updateMatchScreen();
});

function updateMatchScreen() {
  if (matchMinute >= 90) {
    matchMinute = 90;
    matchCommentary.textContent =
      `Full time! Kick FC ${homeMatchScore}-${awayMatchScore} Thunder United`;
if (!matchRewardsGiven) {
let coinReward = 20;
let xpReward = 10;

if (homeMatchScore > awayMatchScore) {
    coinReward = 100;
    xpReward = 50;
} else if (homeMatchScore === awayMatchScore) {
    coinReward = 50;
    xpReward = 25;
}

coins += coinReward;
xp += xpReward;
    updateStats();
    saveGame();
  document.querySelector("#result-title").textContent =
    homeMatchScore > awayMatchScore ? "Victory!" :
    homeMatchScore === awayMatchScore ? "Draw!" : "Defeat";

document.querySelector("#result-message").textContent =
    `Kick FC ${homeMatchScore}-${awayMatchScore} Thunder United`;

document.querySelector("#coins-won").textContent = `+${coinReward}`;
document.querySelector("#xp-won").textContent = `+${xpReward}`;
showScreen(resultsScreen);
    matchRewardsGiven = true;
}
    matchPassButton.disabled = true;
    matchAttackButton.disabled = true;
    matchShootButton.disabled = true;
    matchDefendButton.disabled = true;
  }

  matchMinuteText.textContent = matchMinute;
  homeMatchScoreText.textContent = homeMatchScore;
  awayMatchScoreText.textContent = awayMatchScore;
}
function loadGame() {
  coins = Number(localStorage.getItem("kickverseCoins")) || 500;
  gems = Number(localStorage.getItem("kickverseGems")) || 0;
  xp = Number(localStorage.getItem("kickverseXP")) || 0;
  level = Number(localStorage.getItem("kickverseLevel")) || 1;
  dailyGoals = Number(localStorage.getItem("kickverseDailyGoals")) || 0;

  updateStats();
}
function saveGame() {
  localStorage.setItem("kickverseCoins", coins);
  localStorage.setItem("kickverseGems", gems);
  localStorage.setItem("kickverseXP", xp);
  localStorage.setItem("kickverseLevel", level);
  localStorage.setItem("kickverseDailyGoals", dailyGoals);
}
loadGame();
window.addEventListener("pagehide", saveGame);
