function withSD() {
    document.getElementById("myNav").style.height = "0%";
    gameMode = 1;
}

// Takes user to 'easy' version of the game.
function withoutSD() {
    document.getElementById("myNav").style.height = "0%";
    gameMode = 0;
}

// Sends user to the leaderboard page.
function getHome() {
    location.replace('main.html');
}