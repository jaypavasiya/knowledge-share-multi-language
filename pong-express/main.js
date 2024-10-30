(function () {
    var requestAnimationFrame = window.requestAnimationFrame ||
        window.mozRequestAnimationFrame ||
        window.webkitRequestAnimationFrame ||
        window.msRequestAnimationFrame;

    window.requestAnimationFrame = requestAnimationFrame;
})();

var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");

var width = 500, height = 500;

//starting co-ordinates for the player
var startx = 70;
var starty = 350;

var player = {
    x: startx,
    y: starty,
    width: 20,
    height: 20,
    speed: 3,
    velX: 0,
    velY: 0,
    jumping: false,
    color: "blue",
    lives: 3
};

var platform = {
    color: "black"
};

var platform1 = {
    x: 30,
    y: 430,
    width: 100,
    height: 20,
    color: "black"
};

var platform2 = {
    x: 150,
    y: 350,
    width: 100,
    height: 20
};

var platform3 = {
    x: 270,
    y: 270,
    width: 100,
    height: 20
};

var platform4 = {
    x: 390,
    y: 180,
    width: 100,
    height: 20
};

var platform5 = {
    x: 150,
    y: 150,
    width: 100,
    height: 20
};

var coin = {
    x: 190,
    y: 430,
    width: 20,
    height: 20,
    color: "red"
};

var enemy = {
    x: width - 20,
    y: height - 20,
    width: 20,
    height: 20,
    color: "green",
    speed: 3
};

var platforms = [platform1, platform2, platform3, platform4, platform5];

var keys = [];
var score = 0;
var direction;
var nearest;

var friction = 0.8;
var gravity = 0.2;

var jumps = 0;
var gameover = false;

canvas.width = width;
canvas.height = height;

function game() {

    update();
    render();

    requestAnimationFrame(game);
}

function update() {

    //if player is not grounded
    if (player.velY != 0) {
        player.jumping = true;
    } else {
        player.jumping = false;
    }

    //check keys
    if (keys[38]) {
        //up arrow
        if (!player.jumping) {
            player.velY = -player.speed * 2;
            jumps = 1;
        }
    }

    if (jumps == 1) {
        //double jump
        if (keys[32]) {
            player.velY = -player.speed * 2;
            jumps = 2;
        }
    }

    if (keys[39]) {
        //right arrow
        if (player.velX < player.speed) {
            player.velX++;
        }
    }

    if (keys[37]) {
        //left arrow
        if (player.velX > -player.speed) {
            player.velX--;
        }
    }

    //apply physics
    player.velX *= friction;
    player.velY += gravity;

    player.x += player.velX;
    player.y += player.velY;

    //canvas collisions
    if (player.x < 0) player.x = 0;
    if (player.y < 0) player.y = 0;
    if (player.x >= width - player.width) player.x = width - player.width;

    //if player is on the floor
    if (player.y > height - player.height) {
        player.y = height - player.height
        player.velY = 0;
        jumps = 0;
    }

    //change enemy direction if collision
    if (enemy.x >= width - enemy.width) {
        enemy.x = width - enemy.width
        enemy.speed = -enemy.speed;
    }

    if (enemy.x < 0) {
        enemy.x = 0;
        enemy.speed = Math.abs(enemy.speed);
    }

    enemy.x += enemy.speed;

    //get the nearest object to the player
    getnearest();

    //which direction is the player from the colliding object
    getdirection(player, nearest);

    //colliding with platforms
    if (collision(player, nearest)) solid(player, nearest);

    //colliding with a coin
    if (collision(player, coin)) addscore();

    //colliding with enemies
    if (collision(player, enemy)) die();

    //game over, stop event listening
    if (player.lives < 1) {
        document.body.removeEventListener("keydown", function (e) { keys[e.keyCode] = true; });
        document.body.removeEventListener("keyup", function (e) { keys[e.keyCode] = false; });
    }

}

function render() {
    //clear canvas
    ctx.clearRect(0, 0, width, height);

    //add player
    ctx.fillStyle = player.color;
    ctx.fillRect(player.x, player.y, player.width, player.height);

    //add platforms
    ctx.fillStyle = platform.color;

    for (var i = 0; i < platforms.length; i++) {
        ctx.fillRect(platforms[i].x, platforms[i].y, platforms[i].width, platforms[i].height);
    }

    //add coin
    ctx.fillStyle = coin.color;
    ctx.fillRect(coin.x, coin.y, coin.width, coin.height);

    //add enemy
    ctx.fillStyle = enemy.color;
    ctx.fillRect(enemy.x, enemy.y, enemy.width, enemy.height);

    //add score counter
    ctx.fillStyle = "red";
    ctx.font = "bold 22px helvetica";
    ctx.textAlign = "start";
    ctx.fillText("Score: " + score, 10, 30);

    //add life counter
    ctx.fillStyle = "blue";
    ctx.font = "bold 22px helvetica";
    ctx.fillText("Lives: " + player.lives, 10, 55);

    if (player.lives < 1) {
        //game over screen
        ctx.fillStyle = "gray";
        ctx.fillRect(0, 0, width, height);
        ctx.fillStyle = "white";
        ctx.fontStyle = "bold 22px helvetica";
        ctx.textAlign = "center";
        ctx.fillText("GAME OVER", width / 2, height / 2);
        ctx.fontStyle = "bold 12px helvetica";
        ctx.fillText("score: " + score, width / 2, height / 2 + 25);
    }

}

function addscore() {
    //move the coin
    coin.x = Math.random() * (width - 20);
    coin.y = Math.random() * (height - 20);

    //increase score
    score++;
}

function die() {
    //set the player back to its original position
    player.x = startx;
    player.y = starty;

    //decrease the leaves
    player.lives--;
}

function getnearest() {

    //X and Y middle points of all solid elements
    var playermiddleX = player.x + (player.width / 2);
    var playermiddleY = player.y + (player.height / 2);

    var middlex = [];
    var middley = [];
    var a = [];
    var b = [];
    var distances = [];

    for (var i = 0; i < platforms.length; i++) {

        middlex[i] = platforms[i].x + (platforms[i].width / 2);
        middley[i] = platforms[i].y + (platforms[i].height / 2);

        a[i] = Math.abs(middlex[i] - playermiddleX);
        b[i] = Math.abs(middley[i] - playermiddleY);

        distances[i] = Math.sqrt((a[i] * a[i]) + (b[i] * b[i]));

    }

    var smallest = Math.min.apply(Math, distances);

    //find out which object has that smallest distance
    var pos = distances.indexOf(smallest);
    nearest = platforms[pos];

}

function getdirection(first, second) {
    if (first.x + first.width <= second.x) direction = "left";
    if (first.x >= second.x + second.width) direction = "right";
    if (first.y + first.height <= second.y) direction = "above";
    if (first.y >= second.y + second.height) direction = "below";
}

function collision(first, second) {
    //if the first's position intersects with the second
    return !(first.x > second.x + second.width ||
        first.x + first.width < second.x ||
        first.y > second.y + second.height ||
        first.y + first.height < second.y);
}

function solid(first, second) {
    if (direction == "left") first.x = second.x - first.width;
    if (direction == "right") first.x = second.x + second.width;
    if (direction == "above") {
        first.y = second.y - first.height;
        player.velY = 0;
        jumps = 0;
    }
    if (direction == "below") {
        first.y = second.y + second.height;
        player.velY = 2;
    }
}

document.body.addEventListener("keydown", function (e) { keys[e.keyCode] = true; });
document.body.addEventListener("keyup", function (e) { keys[e.keyCode] = false; });

window.addEventListener("load", function () { game(); });