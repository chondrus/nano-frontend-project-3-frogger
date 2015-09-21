
/*
 * Helper functions and globals
 */

// there is probably a better way to do globals
var startingRow = 5;
var startingCol = 2;
var baseWidth = 101;
var baseHeight = 85;

var playerSprites =  [
    'images/char-boy.png',
    'images/char-cat-girl.png',
    'images/char-horn-girl.png',
    'images/char-pink-girl.png',
    'images/char-princess-girl.png',
];

// Returns a random integer between min (included) and max (excluded)
// Using Math.round() will give you a non-uniform distribution!
// source:
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/random
function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}

/*
 * Classes and associated methods
 */

// Enemies our player must avoid
var Enemy = function() {

    // The image/sprite for our enemies, this uses
    // a helper we've provided to easily load images
    this.sprite = 'images/enemy-bug.png';

    // Location and speed are randomized;
    // games could vary wildly in difficulty.
    // The bug's row (y) never changes, so it
    // is just stored for easier collision detection.
    this.row = getRandomInt(1, 4);
    this.x = (getRandomInt(-2, 5)) * baseWidth;
    this.y = (this.row * baseHeight) - 25;
    this.speed = getRandomInt(40, 400);
};

// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt) {

    // Multiply movement by the dt parameter - this ensures
    // the game runs at the same speed for all computers.
    this.x += (this.speed *dt);

    // wrap once it's well past the screen to somewhere
    // before the screen - the randomness here prevents
    // a player from predicting when a bug will reappear
    if (this.x > 5 * baseWidth) {
        this.x = getRandomInt(-3 * baseWidth, -1 * baseWidth);
    }

    // collision detection
    // row is simplified, as the bugs and player are both constrained
    // to being in one row (as opposed to spanning rows)
    if (this.row == player.row) {

        // column collision detected modeled off of
        // https://developer.mozilla.org/en-US/docs/Games/Techniques/2D_collision_detection
        // variables are only to enhance readability
        var playerX = player.col * baseWidth;
        var playerWidth = 90;
        var bugWidth = 85;

        if (this.x < playerX + playerWidth &&
           this.x + bugWidth > playerX) {
            console.log("BLAM");
            player.blam();
        }
    }
};


// Draw the enemy on the screen
Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

// Player class - holds the information of the player character,
// namely the image and the col and row location
var Player = function() {

    // initial sprite & index
    this.spriteIndex = getRandomInt(0, playerSprites.length);
    this.sprite = playerSprites[this.spriteIndex];

    // player can only move in columns and rows, so that
    // is what is stored (as opposed to x and y)
    this.col = startingCol;
    this.row = startingRow;
};

// Player update: adds the new row and the col of the player
// to the player's current row and col, and resets on win
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

// picks a different chacater to be on collision
Player.prototype.blam = function() {

    // new index that is NOT the old index
    var newIndex = this.spriteIndex;
    while (newIndex === this.spriteIndex) {
        newIndex = getRandomInt(0, playerSprites.length);
    }

    this.spriteIndex = newIndex;
    this.sprite = playerSprites[this.spriteIndex];

    // and reset
    this.reset();
};


// returns the player to the beginning, in either win or collision
Player.prototype.reset = function() {
    this.col = startingCol;
    this.row = startingRow;
};

// displays the player character
Player.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.col * baseWidth, this.row * 83);
};


/*
 * Object Instantiation and Listener adding
 */

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
