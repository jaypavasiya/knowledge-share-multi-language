/* Sources:

"Coding an HTML5 Canvas Game with JS in 5 min 30 sec" by Gamkedo
https://www.youtube.com/watch?v=KoWqdEACyLI 

"Html5 Query selector" on W3Schools:
https://www.w3schools.com/jsref/met_document_queryselector.asp

"Resize html5 canvas to fit window" on stuckoverflow
https://stackoverflow.com/questions/1664785/resize-html5-canvas-to-fit-window

"Drawing shapes with canvas" from Mozilla developer blog
https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API/Tutorial/Drawing_shapes
*/

var versionInformation = "HTML5 Pong";

var canvasElement, context;
var screenW, screenH, displayScale;

var game_frame_rate = 40;

var mouse_x = 0, mouse_y = 0;
var mouse_moved = false;

var score1, score2;
var enemy_velocity = 0;

var pedal_1_y, pedal_2_y;
var pedal_1_x, pedal_2_x;
var pedal_thikness;
var pedal_height;

var ball_radius;
var ball_speed, ball_speed_angle;
var ball_velocity_x, ball_velocity_y;
var ball_x, ball_y;

window.onload = function () {
    // get html dom element
    canvasElement = document.querySelector('canvas');

    canvasElement.addEventListener('mousemove', onMouseMove);

    // resize using the canvas element, must be called second
    // event will be dispatched each time the window screen is resized
    window.addEventListener('resize', onWindowResize, false);
    // call function for the first time to initialize screen size
    onWindowResize();

    // start new game 
    newGame();

    // get 2D drawing context from canvas element 
    context = canvasElement.getContext('2d');
    // start an update function 40 times per second
    setInterval(update, 1000 / game_frame_rate);
}

function onMouseMove(event) {
    var rect = canvasElement.getBoundingClientRect();
    mouse_moved = true;
    mouse_x = (event.clientX - rect.left) / (rect.right - rect.left) * canvasElement.width;
    mouse_y = (event.clientY - rect.top) / (rect.bottom - rect.top) * canvasElement.height;
}

function update() {
    updateOnFrame();

    drawOnFrame();
}

function newGame() {
    // reset variables
    score1 = score2 = 0;
    ball_speed_angle = 0;

    // initial pedal variables relative to screen size 
    pedal_1_y = pedal_2_y = screenH / 2 - pedal_height / 2;

    resetBall(Math.random() > 0.5 ? 1 : -1);
}



function onWindowResize() {
    canvasElement.width = screenW = window.innerWidth;
    canvasElement.height = screenH = window.innerHeight;

    // simple scale factor calculation relative to screen size
    var minScreenSize = Math.min(screenW, screenH);
    if (minScreenSize <= 400) displayScale = 1;
    else if (minScreenSize <= 600) displayScale = 2;
    else if (minScreenSize <= 1000) displayScale = 2.5;
    else displayScale = 3;

    // screen / pedal, relative size 
    pedal_thikness = 10 * displayScale;
    pedal_height = screenH / 6.5;
    pedal_1_x = 30;
    pedal_2_x = screenW - pedal_thikness - 30;

    // pedal / ball, relative size 
    ball_radius = pedal_thikness / 2;

    // ball speed relative to screen size and frame rate
    ball_speed = displayScale * 240 / game_frame_rate;

    // enemy speed relative to screen size and frame rate
    enemy_velocity = displayScale * 80 / game_frame_rate;
}

function updateOnFrame() {
    var level_difficulty = 1 + score1 / 4;

    // calculate ball velocity based on angle 
    calcBallVelocity(ball_speed_angle, ball_speed * level_difficulty);

    // move ball 
    ball_x += ball_velocity_x;
    ball_y += ball_velocity_y;

    // bounce ball if it touches the screen upper/lower limit
    if ((ball_y < 0 && ball_velocity_y < 0) || (ball_y > screenH && ball_velocity_y > 0)) {
        ball_speed_angle = Math.atan2(-ball_velocity_y, ball_velocity_x);
    }

    // calculate enemy speed
    var enemy_speed = enemy_velocity * level_difficulty;

    // move enemy
    if (pedal_2_y + pedal_height / 2 < ball_y) pedal_2_y += enemy_speed;
    if (pedal_2_y + pedal_height / 2 > ball_y) pedal_2_y -= enemy_speed;

    // move player pedal
    if (mouse_moved) {
        pedal_1_y = mouse_y;
    }

    // check ball vs player pedal collision 
    if (ball_x - ball_radius < pedal_1_x + pedal_thikness)
        if (ball_y > pedal_1_y && ball_y < pedal_1_y + pedal_height) {
            // invert x velocity 
            //ball_speed_angle = Math.atan2( ball_velocity_y, Math.abs(ball_velocity_x) );

            // deflect ball relative to hit point on the pedal
            var hit = (ball_y - pedal_1_y) / pedal_height - 0.5;
            ball_speed_angle = (Math.PI / 2) * hit;
        }
    // check ball vs enemy pedal collision 
    if (ball_x + ball_radius > pedal_2_x)
        if (ball_y > pedal_2_y && ball_y < pedal_2_y + pedal_height) {
            // invert x velocity 
            //ball_speed_angle = Math.atan2( ball_velocity_y, -Math.abs(ball_velocity_x) );

            // deflect ball relative to hit point on the pedal
            var hit = (ball_y - pedal_2_y) / pedal_height - 0.5;
            ball_speed_angle = Math.PI + (Math.PI / 2) * -hit;
        }

    // pedal_1_x, pedal_1_y, pedal_thikness, pedal_height

    // check for score 

    if (ball_x < 0) {
        score2++;
        resetBall(-1);
    }
    if (ball_x > screenW) {
        score1++;
        resetBall(1);
    }
}

function resetBall(direction) {
    ball_x = screenW / 2;
    ball_y = screenH / 2;

    ball_speed_angle = (Math.random() - 0.5) * Math.PI / 2;

    if (direction < 0) ball_speed_angle += Math.PI;
}

function drawOnFrame() {
    // fill background with black color  
    context.fillStyle = 'black';
    context.fillRect(0, 0, screenW, screenH);

    // display game information 
    context.font = getFont(18);
    context.fillStyle = 'gray';
    var titleText = versionInformation;
    context.fillText(titleText, 20, 40);

    // display game scores
    context.font = getFont(26);
    var textPedding = 10 * displayScale;
    context.fillRect(screenW / 2 - 2, 0, 4, 30 + textPedding);
    context.fillText(score1, screenW / 2 - 50 - textPedding, 20 + textPedding);
    context.fillText(score2, screenW / 2 + 30 + textPedding, 20 + textPedding);

    // display peddals
    context.fillStyle = 'white';
    context.fillRect(pedal_1_x, pedal_1_y, pedal_thikness, pedal_height);
    context.fillRect(pedal_2_x, pedal_2_y, pedal_thikness, pedal_height);

    // display ball
    context.beginPath();
    context.arc(ball_x, ball_y, ball_radius, 0, Math.PI * 2, true);
    context.fill();

}


function getFont(size) {
    return (size * displayScale) + 'px Arial';
}

function calcBallVelocity(angle, speed) {
    ball_velocity_x = Math.cos(angle) * speed;
    ball_velocity_y = Math.sin(angle) * speed;
}