//add all rectangles with x y coordinates saved so we can check collision


document.addEventListener('keydown', (event) => {
    if(event.key == "ArrowLeft" || event.key == "a"){
        playerLeft = true
    }
    else if(event.key == "ArrowRight" || event.key == "d"){
        playerRight = true
    }
  }, false);
  document.addEventListener('keyup', (event) => {
    if(event.key == "ArrowLeft" || event.key == "a"){
        playerLeft = false
    }
    else if(event.key == "ArrowRight" || event.key == "d"){
        playerRight = false
    }
    
  }, false);

var canvas = document.getElementById("theCanvas");
var ctx = canvas.getContext("2d");
var minSpeedSlider = document.getElementById("minSpeedSlider");
var minSpeedValue = document.getElementById("minSpeedValue");

var x = canvas.width / 2;
var y = canvas.height - 30;
var dxy = [-3, -3];
var minSpeed = 2;
var maxSpeed = 5;
var count = 0; 
var radius = 10;
var playerWidth = 40;
var playerHeight = 10;
var playerX = x;
var playerY = y;
var playerSpeed = 3;
var playerLeft = false;
var playerRight = false;

minSpeedSlider.oninput = function() {
    minSpeed = this.value;
    minSpeedValue.innerHTML = this.value;
}

//Check collision with game window, and update velocity of ball if collision occurs
function checkCollisonBallWindow() {
    var randNum = Math.random();
    var xCollisonLeft = x - radius <= 0;
    var xCollisonRight =  x + radius >= canvas.width;
    var yCollisonUp =  y - radius <= 0;
    var yCollisionDown = y + radius >= canvas.height;

    if((xCollisonLeft || xCollisonRight) && (yCollisonUp || yCollisionDown)){
        x -= dxy[0];
        y -= dxy[1];
        dxy[0] *= -(randNum + 0.5);
        dxy[1] *= -(randNum + 0.5);
        x += Math.sin
    }
    if (xCollisonLeft || xCollisonRight) {
        console.log(x);
        console.log(dxy[0]);
        console.log(y);
        console.log(dxy[1]);
        x -= dxy[0];
        dxy[0] *= -(randNum + 0.5)
        dxy[1] *= (randNum + 0.5)
    }
    if (yCollisonUp || yCollisionDown) {
        y -= dxy[1];
        dxy[0] *= (randNum + 0.5)
        dxy[1] *= -(randNum + 0.5)
    }

    if(Math.abs(dxy[0]) < minSpeed) {
        dxy[0] = Math.sign(dxy[0]) * minSpeed; 
    }
    if(Math.abs(dxy[1]) < minSpeed) {
        dxy[1] = Math.sign(dxy[1]) * minSpeed; 
    }
    if(Math.abs(dxy[0]) > maxSpeed) {
        dxy[0] = Math.sign(dxy[0]) * maxSpeed; 
    }
    if(Math.abs(dxy[1]) > maxSpeed) {
        dxy[1] = Math.sign(dxy[1]) * maxSpeed; 
    }
}

function checkCollisionPlayerWindow() {
    if(playerX < 0){
        playerX = 0;
    }
    else if(playerX + playerWidth > canvas.width){
        playerX = canvas.width - playerWidth;
    }
}
function updatePositions(){
    x += dxy[0];
    y += dxy[1];
    if(playerLeft){
        playerX -= playerSpeed;
    }
}

function gameUpdate() {
    //move into a function that draws all objects on screen
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI*2);
    ctx.rect(playerX, playerY, playerWidth,playerHeight);
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

function main() {
    setInterval(gameUpdate, 10);
}
main();
