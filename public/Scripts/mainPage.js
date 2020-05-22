//Single player redirect
function game() {
  location.replace("gameplay.html");
}

//Multiplayer redirect
function multiplayer() {
  // location.replace('multiplayer.html');
  window.location.href = "/react/chooseroom";
}

//Leader board redirect
function leaderboard() {
  // location.replace("http://localhost:4000/leaderboard");
  window.location.href = "/ejs/leaderboard";
}

//Study page redirect
function study() {
  // location.replace("study.html");
  window.location.href = "/HTML-shell/study.html";
}
