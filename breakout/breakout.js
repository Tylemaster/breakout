//event listeners for moving left and right
document.addEventListener('keydown', (event) => {
    if (event.key == "ArrowLeft" || event.key == "a") {
        playerLeft = true
    }
    else if (event.key == "ArrowRight" || event.key == "d") {
        playerRight = true
    }
}, false);
document.addEventListener('keyup', (event) => {
    if (event.key == "ArrowLeft" || event.key == "a") {
        playerLeft = false
    }
    else if (event.key == "ArrowRight" || event.key == "d") {
        playerRight = false
    }
}, false);

//grabbing page elements
let canvas = document.getElementById("theCanvas");
let ctx = canvas.getContext("2d");
let minSpeedSlider = document.getElementById("minSpeedSlider");
let minSpeedValue = document.getElementById("minSpeedValue");
let maxSpeedSlider = document.getElementById("maxSpeedSlider");
let maxSpeedValue = document.getElementById("maxSpeedValue");


//ball values
let xBall = canvas.width / 2;
let yBall = canvas.height - 30;
let dxy = [-3, -3];
let minSpeed = 2;
let maxSpeed = 5;
let radius = 10;

//player variables
let playerWidth = 40;
let playerHeight = 10;
let playerX = xBall;
let playerY = yBall;
let playerSpeed = 3;
let playerLeft = false;
let playerRight = false;

//brick variables
let brickHp = 3;
let brickWidth = 50;
let brickHeight = 20;
let brickRows = 4;
let brickArray = [];

//creating a brick object constructor
function BreakoutBrick(x,y) {
    this.xCoordinate = x;
    this.yCoordinate = y;
    this.hp = brickHp;
    this.width = brickWidth;
    this.height = brickHeight;
}


//update min speed based on user input to slider
minSpeedSlider.oninput = function () {
    minSpeed = this.value;
    minSpeedValue.innerHTML = this.value;
}

//update max speed based on user input to slider
maxSpeedSlider.oninput = function () {
    maxSpeed = this.value;
    maxSpeedValue.innerHTML = this.value;
}

//populating array of brick objects
createBrickArray = () => {
    xIndex = 0;
    rowIndex = 0;
    while(rowIndex <= brickRows) {
        while(xIndex + brickWidth <= canvas.width) {
            newBrick = BreakoutBrick(xIndex * brickWidth, rowIndex * brickHeight);
            brickArray.append(newBrick);
        }
    }
}

//Check collision with game window, and update velocity of ball if collision occurs
checkCollisonBallWindow = () => {
    let randNum = Math.random();
    let xCollisonLeft = xBall - radius <= 0;
    let xCollisonRight = xBall + radius >= canvas.width;
    let yCollisonUp = yBall - radius <= 0;
    let yCollisionDown = yBall + radius >= canvas.height;

    if ((xCollisonLeft || xCollisonRight) && (yCollisonUp || yCollisionDown)) {
        xBall -= dxy[0];
        yBall -= dxy[1];
        dxy[0] *= -(randNum + 0.5);
        dxy[1] *= -(randNum + 0.5);
        xBall += Math.sin
    }
    if (xCollisonLeft || xCollisonRight) {
        console.log(xBall);
        console.log(dxy[0]);
        console.log(yBall);
        console.log(dxy[1]);
        xBall -= dxy[0];
        dxy[0] *= -(randNum + 0.5)
        dxy[1] *= (randNum + 0.5)
    }
    if (yCollisonUp || yCollisionDown) {
        yBall -= dxy[1];
        dxy[0] *= (randNum + 0.5)
        dxy[1] *= -(randNum + 0.5)
    }

    if (Math.abs(dxy[0]) < minSpeed) {
        dxy[0] = Math.sign(dxy[0]) * minSpeed;
    }
    if (Math.abs(dxy[1]) < minSpeed) {
        dxy[1] = Math.sign(dxy[1]) * minSpeed;
    }
    if (Math.abs(dxy[0]) > maxSpeed) {
        dxy[0] = Math.sign(dxy[0]) * maxSpeed;
    }
    if (Math.abs(dxy[1]) > maxSpeed) {
        dxy[1] = Math.sign(dxy[1]) * maxSpeed;
    }
}

checkCollisionPlayerWindow = () => {
    if (playerX < 0) {
        playerX = 0;
    }
    else if (playerX + playerWidth > canvas.width) {
        playerX = canvas.width - playerWidth;
    }
}
updatePositions = () => {
    xBall += dxy[0];
    yBall += dxy[1];
    if (playerLeft) {
        playerX -= playerSpeed;
    }
    if (playerRight) {
        playerX += playerSpeed;
    }
}

gameUpdate = () => {
    //move into a function that draws all objects on screen
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.beginPath();
    ctx.arc(xBall, yBall, radius, 0, Math.PI * 2);
    ctx.rect(playerX, playerY, playerWidth, playerHeight);
    ctx.fillStyle = "#0095DD";
    ctx.fill();
    ctx.closePath();
    checkCollisonBallWindow();
    checkCollisionPlayerWindow();
    //check ball - player collision
    //check ball - rectangle collison
    //update
    updatePositions()


}

main = () => {
    setInterval(gameUpdate, 10);
}
main();
