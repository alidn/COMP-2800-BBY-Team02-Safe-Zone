//Global Variables
let timer;
let timeElapsed = 0;
let timeTenth = 0;

//Array for User game history
/*let gameHistory = new Array();*/

//With social distancing game mode
function withSD() {
    document.getElementById("myNav").style.height = "0%";
    gameMode = 1;
    document.getElementById("myGame").style.height = "100%";
}

//Without social distancing game mode
function withoutSD() {
    document.getElementById("myNav").style.height = "0%";
    gameMode = 0;
    document.getElementById("myGame").style.height = "100%";
}

//Return to Main page 
function getHome() {
    location.replace('main.html');
}

//Restart Game
function restart() {
    location.reload();
}

//Go to Learn More page
function study() {
    location.replace('study.html');
}

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

//Dynamic Table based on data
/*
function GenerateTable() {
        //Build an array containing Customer records.
        gameHistory.push(["Game Date", "Score", "Time"]);
        gameHistory.push([25-05-2020, "15", "35"]);
        gameHistory.push([25-05-2020, "15", "35"]);
        gameHistory.push([25-05-2020, "15", "35"]);
        gameHistory.push([25-05-2020, "15", "35"]);
 
        //Create a HTML Table element.
        var table = document.createElement("TABLE");
        table.border = "1";
 
        //Get the count of columns.
        var columnCount = gameHistory[0].length;
 
        //Add the header row.
        var row = table.insertRow(-1);
        for (var i = 0; i < columnCount; i++) {
            var headerCell = document.createElement("TH");
            headerCell.innerHTML = gameHistory[0][i];
            row.appendChild(headerCell);
        }
 
        //Add the data rows.
        for (var i = 1; i < gameHistory.length; i++) {
            row = table.insertRow(-1);
            for (var j = 0; j < columnCount; j++) {
                var cell = row.insertCell(-1);
                cell.innerHTML = gameHistory[i][j];
            }
        }
 
        var dvTable = document.getElementById("dvTable");
        dvTable.innerHTML = "";
        dvTable.appendChild(table);
    }
*/