function withSD() {
    document.getElementById("myNav").style.height = "0%";
    gameMode = 1;
    document.getElementById("myGame").style.height = "100%";
}

function withoutSD() {
    document.getElementById("myNav").style.height = "0%";
    gameMode = 0;
    document.getElementById("myGame").style.height = "100%";
}

function getHome() {
    location.replace('main.html');
}

function restart(){
    location.reload();
}

function study(){
    location.replace('study.html');
}