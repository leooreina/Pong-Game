let canvas = {
    width: 800,
    height: 600
};

let scoreOne = 0; // Score of the player one
let scoreTwo = 0; // Score of the player two
let winPlayerOne = 'Player One Wins!'; // Appears on screen when player one wins
let winPlayerTwo = 'Player Two Wins!'; // Appears on screen when player two wins

function setup() {
    createCanvas(canvas.width, canvas.height); // create the canvas
    playerOne = new Player(); // new instance of Player object - playerOne
    playerTwo = new Player(); // new instance of Player object - playerTwo
    pongball = new Ball(); // new instance of Ball object - pongball

    playerOne.x = width - (width - 3); // sets a new position of the x for playerOne
    playerTwo.x = width - 17; // sets a new position of the x for playerTwo

}



function draw() {
    // sets the colour of the background and writes the score for both players
    background(77, 0, 77);
    fill(255, 51, 153);
    textSize(50);
    text(scoreOne, 50, 50);
    text(scoreTwo, width - 80, 50);

    // calls the drawPlayer and update functions
    playerOne.drawPlayer();
    playerOne.update();
    playerTwo.drawPlayer();
    playerTwo.update();

    // calls the update, drawBall and edges functions
    pongball.update();
    pongball.drawBall();
    pongball.edges();

    // calls the playerWins function for restart the game
    playerWins();


}

/* The KeyPressed function is used to accept keyboard entries and moves
 * the player one and two for down and up.
 */
function keyPressed() {

    // If up arrow is pressed (player two)
    if (keyCode === UP_ARROW) {
        playerTwo.direction(0, -5);

    // if down arrow is pressed (player two)
    } else if (keyCode === DOWN_ARROW) {
        playerTwo.direction(0, 5);

    // if "W" is pressed (player one)
    } else if (keyCode === 87) {

        playerOne.direction(0, -5);

    // if "S" is pressed (player two)
    } else if (keyCode === 83) {

        playerOne.direction(0, 5);
    }
}

/* When someone wins the game, the pongball returns 
 * to the middle of the screen and page is reloaded
 */
function endGame() {
    pongball.x = width / 2;
    pongball.y = -20;
    window.location.reload();
}


/* If any of the players reach 5 points, the phrase 
 * will appears in the screen showing the winner.
 */
function playerWins() {
    if (scoreOne === 5) {
        winner = winPlayerOne;
        fill(255, 51, 153);
        textSize(48);
        text(winner, width / 4, height / 2);
        setTimeout(endGame, 1500); // Wait 1.5 secons and calls endGame function

    } else if (scoreTwo === 5) {
        winner = winPlayerTwo;
        fill(255, 51, 153);
        textSize(48);
        text(winner, width / 4, height / 2);
        setTimeout(endGame, 1500); // Wait 1.5 secons and calls endGame function

    }
}

/* The two functions below checks for collisions between the ball
 * and some of the players. When the collision is detected, return true
 */
function checkCollisionsPlayerOne() {
    if (pongball.x - 15 < playerOne.x + playerOne.sizeX && pongball.y < playerOne.y + playerOne.sizeY && pongball.y + pongball.sizeY > playerOne.y) {

        if (pongball.x > playerOne.x) {

            return true;
        }
    }
}

function checkCollisionsPlayerTwo() {
    if (pongball.x - 5 > playerTwo.x - playerTwo.sizeX && pongball.y < playerTwo.y + playerTwo.sizeY && pongball.y + pongball.sizeY > playerTwo.y) {

        if (pongball.x < playerTwo.x) {

            return true;
        }
    }
}


/* Class Player
 */
class Player {
    constructor() {
        this.x; // position x on canvas
        this.y = canvas.height / 2.6; // position y on canvas
        this.xspeed = 0; // sets the xspeed = 0
        this.yspeed = 0; // sets the yspeed = 0
        this.sizeX = 15; // width of the player
        this.sizeY = canvas.height / 4; // height of the player
    }

    direction(x, y) {
        this.xspeed = x;
        this.yspeed = y;
    }

    update() {
        this.x = this.x + this.xspeed;
        this.y = this.y + this.yspeed;

        // Avoid the player to get off the screen
        if (this.y < 0) {
            this.direction(0, 1); // yspeed = 1 and xspeed = 0
        }
        if (this.y > canvas.height - canvas.height / 4) {
            this.direction(0, -1); // yspeed = -1 and xspeed = 0
        }
    }

    drawPlayer() {
        // Draws the player on canvas
        fill(255, 51, 153);
        rect(this.x, this.y, this.sizeX, this.sizeY);
    }
}



/* Class Ball
*/
class Ball {
    constructor() {
        this.x = width / 2; // position x on canvas
        this.y = height / 2; // position y on canvas
        this.angle = random(-PI/4, PI/4); // randomize the angle that the ball is launched
        this.xspeed = 8 * cos(this.angle); // speed for the x
        this.yspeed = 8 * sin(this.angle); // speed for the y

        this.sizeX = 10; // width of the ball
        this.sizeY = 10; // height of the ball

    }

    direction(x, y) {
        this.xspeed = x; 
        this.yspeed = y;
    }

    update() {
        this.x = this.x + this.xspeed;
        this.y = this.y + this.yspeed;

        /* The source of this algorithm is from the Coding Train youtube channel
         * with the name Coding Challenge #67 - Pong Game.
        
         * If checkCollisionsPlayerOne function return true,
         * the ball will be rotate between 45 and -45 degrees,
         * making the Pong game works.
         */
        if (checkCollisionsPlayerOne()) {
            let difference = this.y - (playerOne.y - playerOne.sizeY);
            let rad = radians(45);
            let angle = map(difference, 0, playerOne.sizeY * 2, -rad, rad);
            this.xspeed = 8 * cos(angle);
            this.yspeed = 8 * sin(angle);
            this.x = playerOne.x + playerOne.sizeX + 15;
        }

        /* If checkCollisionsPlayerTwo function return true,
         * the ball will be rotate between 135 and -135 degrees,
         * making the Pong game works.
         */
        if (checkCollisionsPlayerTwo()) {
            let difference = this.y - (playerTwo.y - playerTwo.sizeY);
            let rad = radians(135);
            let angle = map(difference, 0, playerTwo.sizeY * 1.28, -rad, rad);
            this.xspeed = 8 * cos(angle);
            this.yspeed = 8 * sin(angle);
            this.x = playerTwo.x - playerTwo.sizeX + 7.5;
        }
    }

    reset() {
        this.x = width / 2; // when the ball get off the screen, return to the middle (x)
        this.y = height / 2; // when the ball get off the screen, return to the middle (y)
        this.angle = random(-PI/4, PI/4); // randomize the angle that the ball is launched
        this.xspeed = 8 * cos(this.angle); // speed for the x
        this.yspeed = 8 * sin(this.angle); // speed for the y

        // Use to avoid the bug that makes the ball being launched up or down on the screen
        if (random(1) < 0.5) {
            this.xspeed *= -1; // Reverse the movement when it touches the wall
        }

    }

    edges() {
        // Avoid the ball to get of the screen in the y
        if (this.y < 0 || this.y > height) {
            this.yspeed *= -1; // Reverse the movement when it touches the wall
        }

        // Score for the player One
        if (this.x > width) {
            scoreOne++;
            this.reset();
        }

        // Score for the player Two
        if (this.x < 0) {
            scoreTwo++;
            this.reset();

        }
    }

    drawBall() {
        fill(255, 51, 153);
        circle(this.x , this.y, 10);
    }
}
