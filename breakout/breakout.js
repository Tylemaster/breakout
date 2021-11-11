//grabbing page elements
let canvas = document.getElementById("theCanvas");
let ctx = canvas.getContext("2d");
let minSpeedSlider = document.getElementById("minSpeedSlider");
let minSpeedValue = document.getElementById("minSpeedValue");
let maxSpeedSlider = document.getElementById("maxSpeedSlider");
let maxSpeedValue = document.getElementById("maxSpeedValue");

//player variables
let playerWidth = 40;
let playerHeight = 10;
let playerX = canvas.width / 2;
let playerY = canvas.height - 30;
let playerSpeed = 5;
let playerLeft = false;
let playerRight = false;

//brick variables
let brickHp = 3;
let bricksPerRow = 3;
let brickWidth = 50;
let brickHeight = 15;
let brickRows = 7;
let brickHorizontalMargin = (canvas.width - (bricksPerRow * brickWidth))/(bricksPerRow + 1);
let brickVerticalMargin = ((canvas.height/2) - (brickRows * brickHeight))/(brickRows);
let brickArray = [];

//ball values
let radius = 7;
let ballStart = [canvas.width / 2, (canvas.height / 2) + radius + brickHeight]
let xBall = ballStart[0];
let yBall = ballStart[1];
let initialBallSpeed = 2;
let dxy = [initialBallSpeed, initialBallSpeed];
let minSpeed = 2;
let maxSpeed = 4;

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


//populating array of brick objects
createBrickArray = () => {
    let xIndex;
    let curXCoordinate;
    let rowIndex = 0;
    let curYCoordinate = brickVerticalMargin;
    while(rowIndex < brickRows) {
        xIndex = 0;
        curXCoordinate = brickHorizontalMargin;
        while(xIndex <= bricksPerRow) {
            let newBrick = new BreakoutBrick(curXCoordinate, curYCoordinate);
            brickArray.push(newBrick);
            curXCoordinate += brickWidth + brickHorizontalMargin;
            xIndex++;
        }
        rowIndex++;
        curYCoordinate += brickHeight + brickVerticalMargin;
    }
}

drawBricks = () => {
    for(let brick of brickArray){
        ctx.beginPath();
        ctx.rect(brick.xCoordinate, brick.yCoordinate, brick.width, brick.height);
        if(brick.hp == 3){
            ctx.fillStyle = "#4FFF33";
        }
        else if(brick.hp == 2) {
            ctx.fillStyle = "#FFF633";
        }
        else {
            ctx.fillStyle = "#FF3333"
        }
        ctx.fill();
        ctx.closePath();
    }
}

//Check collision with game window, and update velocity of ball if collision occurs
checkCollisonBallWindow = () => {
    let xCollisonLeft = xBall - radius <= 0;
    let xCollisonRight = xBall + radius >= canvas.width;
    let yCollisonUp = yBall - radius <= 0;
    let yCollisionDown = yBall + radius >= canvas.height;

    ballCollisionResolving(xCollisonLeft||xCollisonRight, yCollisonUp);
    if(yCollisionDown) {
        xBall = ballStart[0];
        yBall = ballStart[1];
        dxy = [initialBallSpeed, initialBallSpeed];
        brickArray = [];
        createBrickArray();
    }
}

ballCollisionResolving = (xCollision, yCollision) => {
    let randNum = Math.random();
    if (xCollision && yCollision) {
        xBall -= dxy[0];
        yBall -= dxy[1];
        dxy[0] *= -(randNum + 0.5);
        dxy[1] *= -(randNum + 0.5);
    }
    if (xCollision) {
        xBall -= dxy[0];
        dxy[0] *= -(randNum + 0.5)
        dxy[1] *= (randNum + 0.5)
    }
    if (yCollision) {
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

checkCollisionBallPlayer = () => {
    ballCollisionResolving((ballLineCollisionDetection(playerX + playerWidth, playerX + playerWidth, playerY, playerY + playerHeight) || ballLineCollisionDetection(playerX, playerX, playerY, playerY +  playerY + playerHeight)), ballLineCollisionDetection(playerX, playerX + playerWidth, playerY, playerY));
}

checkCollisonBallBricks = () => {
    for( var brickIndex = 0; brickIndex < brickArray.length; brickIndex++){
        let brickX1 = brickArray[brickIndex].xCoordinate;
        let brickX2 = brickArray[brickIndex].xCoordinate + brickArray[brickIndex].width;
        let brickY1 = brickArray[brickIndex].yCoordinate;
        let brickY2 = brickArray[brickIndex].yCoordinate + brickArray[brickIndex].height;
        if(ballLineCollisionDetection(brickX1, brickX2, brickY1, brickY1) || ballLineCollisionDetection(brickX1, brickX2, brickY2, brickY2)) {
            ballCollisionResolving(false, true);
            ballDamage(brickIndex);
        }
        else if(ballLineCollisionDetection(brickX1, brickX1, brickY1, brickY2) || ballLineCollisionDetection(brickX2, brickX2, brickY1, brickY2)) {
            ballCollisionResolving(true, false);
            ballDamage(brickIndex);
        }
    }
}

ballDamage = (brickIndex) => {
    brickArray[brickIndex].hp--;
    if(brickArray[brickIndex].hp <= 0) {
        brickArray.splice(brickIndex, 1);
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

ballLineCollisionDetection = (lineX1, lineX2, lineY1, lineY2) => {
  //chane toi balls

    let dx = lineX2 - lineX1;
    let dy = lineY2 - lineY1;

    let sx = lineX1 - xBall;
    let sy = lineY1 - yBall;


    let tx = lineX2 - xBall;
    let ty = lineY2 - yBall;

    //check if one end of line segment falls within circle using pythagorean theorem
    //in other words, if the length of the line between the endpoint and the centre of the circle is less than the radius
    //of the circle, that means the point is within the circle
    if(tx**2 + ty**2 < radius**2){
        return true;
    }

    //again checking if the 
    let c = (sx**2) + (sy**2) - (radius**2);
    // console.log(c);
    if(c < 0){
        return true;
    }

    let b = 2 * (dx * sx + dy * sy);
    let a = dx**2 + dy**2;

    if(Math.abs < 1.0e-12) {
        return false;
    }

    var discr = b**2 - 4 * a * c;

    if(discr < 0 ){
        return false;
    }

    discr = Math.sqrt(discr);

    var k1 = (-b - discr) / (2 * a);
    if(k1 >=0 && k1 <= 1){
        return true;
    }
    var k2 = (-b + discr) / (2 * a);
    if(k2 >=0 && k2 <= 1){
        return true;
    }
    return false;

    // let circleToCentreLength = Math.sqrt(((xBall-centreX)**2) + ((yBall - centreY)**2));
    // return((radius) >= circleToCentreLength);
}

gameUpdate = () => {
    //move into a function that draws all objects on screen
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawBricks();
    ctx.beginPath();
    ctx.arc(xBall, yBall, radius, 0, Math.PI * 2);
    ctx.rect(playerX, playerY, playerWidth, playerHeight);
    ctx.fillStyle = "#0095DD";
    ctx.fill();
    ctx.closePath();
    checkCollisonBallWindow();
    checkCollisionPlayerWindow();
    checkCollisionBallPlayer();
    checkCollisonBallBricks();
    //update
    updatePositions()


}

main = () => {
    createBrickArray();
    console.log(brickArray);
    setInterval(gameUpdate, 10);
}
main();
