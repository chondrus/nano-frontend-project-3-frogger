
/*
 * Returns a random integer between min (included) and max (excluded)
 * Using Math.round() will give you a non-uniform distribution!
 * source:
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/random
 */
function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}

// Enemies our player must avoid
var Enemy = function() {
    // Variables applied to each of our instances go here,
    // we've provided one for you to get started

    // The image/sprite for our enemies, this uses
    // a helper we've provided to easily load images
    this.sprite = 'images/enemy-bug.png';

    // location and speed are randomized;
    // games could vary wildly in difficulty.
    // the bug's row (y) never changes, so store it for easier collision detection
    this.row = getRandomInt(1, 4);
    this.x = (getRandomInt(-2, 5)) * 101;
    this.y = (this.row * 85) - 25;
    this.speed = getRandomInt(40, 400);
};

// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt) {
    // You should multiply any movement by the dt parameter
    // which will ensure the game runs at the same speed for
    // all computers.
    this.x += (this.speed *dt);

    // wrap once it's well past the screen
    if (this.x > 6*85){
        this.x = -3*85;
    }

    // collision detection
    // row is simplified, as the bugs and player are both constrained
    // to being in one row (as opposed to spanning rows)
    if (this.row == player.row) {

        // column collision detected modeled off of
        // https://developer.mozilla.org/en-US/docs/Games/Techniques/2D_collision_detection
        // variables are only to enhance readability
        var playerX = player.col * 101;
        var playerWidth = 90;
        var bugWidth = 85;

        if (this.x < playerX + playerWidth &&
           this.x + bugWidth > playerX) {
            console.log("BLAM");
            player.reset();
        }
    }
};


// Draw the enemy on the screen, required method for game
Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

// Now write your own player class
// This class requires an update(), render() and
// a handleInput() method.
var Player = function() {
    // variables applied to each instance
    this.sprite = 'images/char-princess-girl.png';

    // player can only move in columns and rows, so that
    // is what is stored (as opposed to x and y)
    this.col = 2;
    this.row = 5;
};

Player.prototype.update = function(col, row) {
    if (col !== undefined) {
        // col can only be [0-4]
        var newCol = this.col + col;
        if (newCol >= 0 && newCol <= 4) {
            this.col = newCol;
        }
    }
    if (row !== undefined) {
        // row can only be between [0-5]
        var newRow = this.row + row;
        if (newRow > 0 && newRow <= 5) {
            this.row = newRow;
        }
        // row 0 - victory!
        if (newRow === 0) {
            console.log("Victory!");
            player.reset();
        }
    }
};

// Calls the update function based on the input given
Player.prototype.handleInput = function(input) {
    switch (input) {
        case "up":
            this.update(0, -1);
            break;
        case "down":
            this.update(0, 1);
            break;
        case "left":
            this.update(-1, 0);
            break;
        case "right":
            this.update(1, 0);
            break;
        default:
            break;
    }
};

Player.prototype.reset = function() {
    this.col = 2;
    this.row = 5;
};

Player.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.col * 101, this.row * 83);
};


// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
// Place the player object in a variable called player
var allEnemies = [
    new Enemy(),
    new Enemy(),
    new Enemy(),
    new Enemy(),
    new Enemy(),
];
var player = new Player();


// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };

    player.handleInput(allowedKeys[e.keyCode]);
});
