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

function restart() {
    location.reload();
}

function study() {
    location.replace('study.html');
}

let timer;
let timeElapsed = 0;
let timeTenth = 0;

function tick() {

    document.getElementById("score").innerHTML = "<h1>SCORE: " + timeElapsed + "." + timeTenth + " s</h1>";
    timeTenth++;
    if (timeTenth == 10) {
        timeElapsed++;
        timeTenth = 0;
    }
}

function start() {
    timer = setInterval(tick, 100);
}

function stop() {
    clearInterval(timer);
}