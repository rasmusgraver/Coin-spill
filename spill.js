
const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");
canvas.width = 1200;
canvas.height = 630;


let coinCollect = document.getElementById("coin_collect")
let coinSpawn = document.getElementById("coin_spawn")
let game_Over = document.getElementById("game_over")
let music = document.getElementById("music")


let gameOver = false;
let timeLeft = 10;

document.addEventListener('keydown', function(event) {
   
    if (!gameOver) {
        music.play();
    }
});

updateTimerDisplay();


function updateTimerDisplay() {

    var timerDisplay = document.getElementById("timer");
    timerDisplay.textContent = "Tid igjen: " + timeLeft + " sekunder";

    var countdown = setInterval(function () {
        if (gameOver) {
            clearInterval(countdown);
            return;
        }
        timeLeft--;
        timerDisplay.textContent = "Tid igjen: " + timeLeft + " sekunder";

        if (timeLeft <= 0) {
            clearInterval(countdown);
            gameOver = true;
        }
    }, 1000);
}

let score = 0;
let coinTimer;


//Definer objekter start
let rectangle = {
    x: 0,
    y: 0,
    width: 50,
    height: 50,
    color: "blue",
    keys: {}
};

rectangle.y = canvas.height - rectangle.height;

let ball1 = {
    x: 100,
    y: 100,
    radius: 20,
    color: "red",
    x_velocity: 6,
    y_velocity: 5
};

let ball2 = {
    x: 200,
    y: 200,
    radius: 15,
    color: "orange",
    x_velocity: 4,
    y_velocity: -6
};

let ball3 = {
    x: 300,
    y: 200,
    radius: 25,
    color: "pink",
    x_velocity: -4,
    y_velocity: -6
};

let ball4 = {
    x: 150,
    y: 100,
    radius: 5,
    color: "red",
    x_velocity: 5,
    y_velocity: 7
};

let ball5 = {
    x: 120,
    y: 30,
    radius: 15,
    color: "green",
    x_velocity: 3,
    y_velocity: 7
};

let coin = {
    x: 0,
    y: 0,
    radius: 10,
    color: "yellow",
    image: new Image()
};

const balls = [ball1, ball2, ball3, ball4, ball5];
//Definer objekter slutt//

resetCoinTimer()
updateCoinPosition()


//Coin egenskaper start
function resetCoinTimer() {

    if (coinTimer) clearInterval(coinTimer);
    coinTimer = setInterval(updateCoinPosition, 5000);
}


function updateCoinPosition() {
    if (!gameOver) {
        coin.x = Math.random() * (canvas.width - coin.radius * 2) + coin.radius; // Random x-coordinate
        coin.y = Math.random() * (canvas.height - coin.radius * 2) + coin.radius; // Random y-coordinate
        coinSpawn.play()
    }
}


coin.image.src = 'bilder/coin.png';

function drawCoin() {
    ctx.drawImage(coin.image, coin.x - coin.radius, coin.y - coin.radius, coin.radius * 2, coin.radius * 2);
}

//Coin egenskaper slutt//



// Tegning start

function drawRectangle(rect) {
    ctx.fillStyle = rect.color;
    ctx.fillRect(rect.x, rect.y, rect.width, rect.height);
}

function drawBalls(balls) {
    balls.forEach(function (ball) {
        ctx.beginPath();
        ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
        ctx.fillStyle = ball.color;
        ctx.fill();
        ctx.closePath();
    });
}



function drawScore() {
    ctx.fillStyle = "black";
    ctx.font = "20px Arial";
    ctx.fillText("Score: " + score, 10, 20);
}


//Tegning slutt//

function UpdateCanvas() {
    if (!gameOver) {
        clearCanvas();
        drawRectangle(rectangle);
        drawCoin()
        drawBalls(balls);
        moveBalls(balls);
        checkCollision(balls);
        checkCollition(coin);
        updateRectanglePosition();
        requestAnimationFrame(UpdateCanvas);

    }


    else {
        GameOver()
    }
}

function GameOver() {

    music.pause()
    game_Over.play()


    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "white";
    ctx.font = "30px Arial";
    ctx.fillText("Game Over", canvas.width / 2 - 80, canvas.height / 2);


    ctx.fillText(`Din score: ${score}`, canvas.width / 2 - 70, canvas.height / 2 + 40);


    // ctx.fillStyle = "green";
    // ctx.fillRect(canvas.width / 2 - 50, canvas.height / 2 + 50, 120, 40);
    ctx.fillStyle = "white";
    ctx.fillText("Trykk for å starte på nytt", canvas.width / 2 - 150, canvas.height / 2 + 80);

    canvas.addEventListener("click", restartGame);
}


function restartGame(event) {
     window.location.reload();  
    }


// Bevegelse start
function moveBalls(balls) {
    balls.forEach(function (ball) {
        ball.x += ball.x_velocity;
        ball.y += ball.y_velocity;


        if (ball.x + ball.radius > canvas.width || ball.x - ball.radius < 0) {
            ball.x_velocity = -ball.x_velocity;
        }
        if (ball.y + ball.radius > canvas.height || ball.y - ball.radius < 0) {
            ball.y_velocity = -ball.y_velocity;
        }
    });
}

function updateRectanglePosition() {
    const speed = 6;
    if (rectangle.keys && rectangle.keys[37] && rectangle.x > 0) rectangle.x -= speed;
    if (rectangle.keys && rectangle.keys[38] && rectangle.y > 0) rectangle.y -= speed;
    if (rectangle.keys && rectangle.keys[39] && rectangle.x + rectangle.width < canvas.width) rectangle.x += speed;
    if (rectangle.keys && rectangle.keys[40] && rectangle.y + rectangle.height < canvas.height) rectangle.y += speed; // Down arrow
}

//Bevegelse slutt

//Check collitions start

function checkCollision(ball) {
    balls.forEach(function (ball) {
        if (
            rectangle.x + 1 < ball.x + ball.radius &&
            rectangle.x + rectangle.width - 1 > ball.x - ball.radius &&
            rectangle.y + 1 < ball.y + ball.radius &&
            rectangle.y + rectangle.height - 1 > ball.y - ball.radius
        ) {
            gameOver = true;
        }
    });
}


function checkCollition(coin) {
    if (rectangle.x < coin.x + coin.radius &&
        rectangle.x + rectangle.width > coin.x - coin.radius &&
        rectangle.y < coin.y + coin.radius &&
        rectangle.y + rectangle.height > coin.y - coin.radius) {
        updateCoinPosition();
        coinCollect.play();
        resetCoinTimer(); // Reset the timer when the coin is collected
        score += 100;
        document.getElementById("score").innerText = score;
        timeLeft += 3
    }

}

// Check collition stop //



// Function to clear the canvas
function clearCanvas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}

// Event listener for keydown events
document.addEventListener("keydown", function (event) {
    if (!rectangle.keys) rectangle.keys = {};
    rectangle.keys[event.keyCode] = true;
});

// Event listener for keyup events
document.addEventListener("keyup", function (event) {
    rectangle.keys[event.keyCode] = false;
});

// Start animation loop
requestAnimationFrame(UpdateCanvas);