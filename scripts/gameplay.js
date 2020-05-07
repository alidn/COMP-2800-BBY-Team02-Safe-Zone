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

// Get the modal
var modal = document.getElementById("myModal");

// Get the button that opens the modal
var btn = document.getElementById("myBtn");

// Get the <span> element that closes the modal
var span = document.getElementsByClassName("close")[0];

// When the user clicks the button, open the modal 
btn.onclick = function() {
    modal.style.display = "block";
}

// When the user clicks on <span> (x), close the modal
span.onclick = function() {
    modal.style.display = "none";
}

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
    if (event.target == modal) {
        modal.style.display = "none";
  }
}
