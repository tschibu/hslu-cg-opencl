//
// DI Computer Graphics
//
// WebGL Exercises
//

// Register function to call after document has loaded
window.onload = startup;

// the gl object is saved globally
var gl;

// we keep all local parameters for the program in a single object
var ctx = {
    shaderProgram: -1,
    aVertexPositionId: -1,
    uColorId: -1,
    uProjectionMatId: -1,
    uModelMatId: -1
};

// we keep all the parameters for drawing a specific object together
var rectangleObject = {
    buffer: -1
};


var model = {
    xPlayerSize: 10,
    yPlayerSize: 100
}

/**
 * Startup function to be called when the body is loaded
 */
function startup() {
    "use strict";
    var canvas = document.getElementById("myCanvas");
    gl = createGLContext(canvas);
    initGL();
    window.addEventListener('keyup', onKeyup, false);
    window.addEventListener('keydown', onKeydown, false);
    //();
    requestAnimationFrame(draw);
}

/**
 * InitGL should contain the functionality that needs to be executed only once
 */
function initGL() {
    "use strict";
    ctx.shaderProgram = loadAndCompileShaders(gl, 'VertexShader.glsl', 'FragmentShader.glsl');
    setUpAttributesAndUniforms();
    setUpBuffers();

    setUpWorld();

    gl.clearColor(0.1, 0.1, 0.1, 1);
}

/**
 * Set up the world coordinates
 */
function setUpWorld() {
    // Setup the world coordinates
    var projectionMat = mat3.create();
    mat3.fromScaling(projectionMat, [2.0 / gl.drawingBufferWidth, 2.0 / gl.drawingBufferHeight]);
    gl.uniformMatrix3fv(ctx.uProjectionMatId, false, projectionMat);
}


/**
 * Setup all the attribute and uniform variables
 */
function setUpAttributesAndUniforms() {
    "use strict";
    ctx.aVertexPositionId = gl.getAttribLocation(ctx.shaderProgram, "aVertexPosition");
    ctx.uColorId = gl.getUniformLocation(ctx.shaderProgram, "uColor");
    ctx.uProjectionMatId = gl.getUniformLocation(ctx.shaderProgram, "uProjectionMat");
    ctx.uModelMatId = gl.getUniformLocation(ctx.shaderProgram, "uModelMat");
}

/**
 * Setup the buffers to use. If more objects are needed this should be split in a file per object.
 */
function setUpBuffers() {
    "use strict";
    rectangleObject.buffer = gl.createBuffer();
    var vertices = [
        -0.5, -0.5,
        0.5, -0.5,
        0.5, 0.5,
        -0.5, 0.5];
    gl.bindBuffer(gl.ARRAY_BUFFER, rectangleObject.buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
}


/**
 * Draw the scene.
 */
function draw() {
    "use strict";
    // console.log("Start - Drawing");
    gl.clear(gl.COLOR_BUFFER_BIT);

    gl.bindBuffer(gl.ARRAY_BUFFER, rectangleObject.buffer);
    gl.vertexAttribPointer(ctx.aVertexPositionId, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(ctx.aVertexPositionId);

    gl.uniform4f(ctx.uColorId, 0.75, 1, 0, 1);


    // move player right
    if (isDown(key.UP)) {
        player_right.position[1] < 245 ? player_right.position[1] += 5 : player_right.position[1] = 250;
    }

    if (isDown(key.DOWN)) {
        player_right.position[1] > -245 ? player_right.position[1] -= 5 : player_right.position[1] = -250;
    }

    // move player left
    if (isDown(key.W)) {
        player_left.position[1] < 245 ? player_left.position[1] += 5 : player_left.position[1] = 250;
    }

    if (isDown(key.S)) {
        player_left.position[1] > -245 ? player_left.position[1] -= 5 : player_left.position[1] = -250;
    }

    // ball (collision right)
    if (ball.position[0] > 337 && ball.position[0] < 344) {
        if (ball.position[1] < player_right.position[1] + 50 && ball.position[1] > player_right.position[1] - 50) {
            ball.movement[0] *= -1;
        }
    }

    // (collision left)
    if (ball.position[0] < -337 && ball.position[0] > -344) {
        if (ball.position[1] < player_left.position[1] + 50 && ball.position[1] > player_left.position[1] - 50) {
            ball.movement[0] *= -1;
        }
    }

    if (Math.abs(ball.position[1]) >= 292) {
        ball.movement[1] *= -1;
    }

    ball.position[0] += ball.movement[0];
    ball.position[1] += ball.movement[1];


    drawGameElement(player_left);
    drawGameElement(player_right);
    drawGameElement(middle_line);
    drawGameElement(ball);

    // console.log("Read - Drawing");
    requestAnimationFrame(draw);
}

// First Player
var player_left = {
    position : [-350, 0],
    size: [20, 100]
};

// Second Player
var player_right = {
    position : [350, 0],
    size: [20, 100]
};

// middle-line
var middle_line = {
    position : [0, 0],
    size: [1, 6000]
};

// Ping Pong ball
var ball = {
    position : [0, 0],
    size: [16, 16],
    movement: [6, 4]
}


function drawGameElement(gameElement) {
    var modelMat = mat3.create();
    mat3.fromTranslation(modelMat, gameElement.position);
    mat3.scale(modelMat, modelMat, gameElement.size);
    gl.uniformMatrix3fv(ctx.uModelMatId, false, modelMat);
    gl.drawArrays(gl.TRIANGLE_FAN, 0, 4);
}

// Key Handling
var key = {
    _pressed: {},

    // Player Right
    LEFT: 37,
    UP: 38,

    RIGHT: 39,
    DOWN: 40,

    // Player Left
    W: 87,
    S: 83
};

function isDown(keyCode) {
    return key._pressed[keyCode];
}

function onKeydown(event) {
    key._pressed[event.keyCode] = true;
}

function onKeyup(event) {
    delete key._pressed[event.keyCode];
}
