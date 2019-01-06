//
// Computer Graphics
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
    uSampler2DId: -1,
    vTextureCoordId: -1,
    uModelViewMatrixId : -1,
};

/**
 * Startup function to be called when the body is loaded
 */
function startup() {
    "use strict";
    var canvas = document.getElementById("myCanvas");
    gl = createGLContext(canvas);
    initGL();
    loadTexture();
}

/**
 * InitGL should contain the functionality that needs to be executed only once
 */
function initGL() {
    "use strict";
    ctx.shaderProgram = loadAndCompileShaders(gl, 'VertexShader.glsl', 'FragmentShader.glsl');
    setUpAttributesAndUniforms();
    setUpBuffers();
    gl.clearColor(0, 0, 0, 1);
}

/**
 * Setup all the attribute and uniform variables
 */
function setUpAttributesAndUniforms() {
    "use strict";
    // finds the index of the variable in the program
    ctx.aVertexPositionId = gl.getAttribLocation(ctx.shaderProgram,
        "aVertexPosition");
    ctx.aVertexTextureCoordId = gl.getAttribLocation(ctx.shaderProgram,
        "aVertexTextureCoord");
    ctx.uSampler2DId = gl.getUniformLocation(ctx.shaderProgram,
        "uSampler2D");
    ctx.uModelViewMatrixId = gl.getUniformLocation(ctx.shaderProgram,
        "uModelViewMatrix");
}

/**
 * Setup the buffers to use. If more objects are needed this should be split in a file per object.
 */
function setUpBuffers() {
    "use strict";
    rectangleObject.buffer = gl.createBuffer();
    var vertices = [
        0,0,
        1,0,
        0,2,

    ];
    gl.bindBuffer(gl.ARRAY_BUFFER, rectangleObject.buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW)

    rectangleObject.textureBuffer = gl.createBuffer();
    var textureCoord = [
        0, 0,
        1, 0,
        1, 1,
    ];
    gl.bindBuffer(gl.ARRAY_BUFFER, rectangleObject.textureBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(textureCoord), gl.STATIC_DRAW)

}

var rectangleObject = {
    buffer: -1,
    textureBuffer: -1
};

/**
 * Draw the scene.
 */
function draw() {
    "use strict";
    console.log("INFO: Start drawing");
    gl.clear(gl.COLOR_BUFFER_BIT);

    // add drawing routines here
    gl.bindBuffer(gl.ARRAY_BUFFER, rectangleObject.buffer);
    gl.vertexAttribPointer(ctx.aVertexPositionId, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(ctx.aVertexPositionId);

    // add texture
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, lennaTxt.textureObj);
    gl.uniform1i(ctx.uSampler2DId, 0);

    gl.bindBuffer(gl.ARRAY_BUFFER, rectangleObject.textureBuffer);
    gl.vertexAttribPointer(ctx.aVertexTextureCoordId, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(ctx.aVertexTextureCoordId);

    // first triangle
    let matrix = mat4.create();
    let orthoMatrix = mat4.create();

    mat4.ortho(orthoMatrix, -100, 100, -100, 100, 0, 1);
    mat4.scale(matrix, orthoMatrix, [50,50,1]);
    gl.uniformMatrix4fv(ctx.uModelViewMatrixId, false, matrix);
    gl.drawArrays(gl.TRIANGLE_FAN, 0, 3);

    // TO DO during testat
    // second triangle (down)
    let transMatrix = mat4.create();
    mat4.translate(transMatrix, orthoMatrix, [0,-100,0]);

    mat4.scale(matrix, transMatrix, [25,25,0]);
    gl.uniformMatrix4fv(ctx.uModelViewMatrixId, false, matrix);
    gl.drawArrays(gl.TRIANGLE_FAN, 0, 3);

    // third triangle (left)
    let rotaMatrix = mat4.create();
    mat4.translate(transMatrix, orthoMatrix, [-50,0,0]);
    mat4.rotate(rotaMatrix, transMatrix, Math.PI/2, [0,0,1]);

    mat4.scale(matrix, rotaMatrix, [25,25,1]);
    gl.uniformMatrix4fv(ctx.uModelViewMatrixId, false, matrix);
    gl.drawArrays(gl.TRIANGLE_FAN, 0, 3);

    console.log("INFO: Finish drawing");

}


// keep texture parameters in an object so we can mix textures and objects
let lennaTxt = {
    textureObj: {}
};

/**
 * Initialize a texture from an image
 * @param image the loaded image
 * @param textureObject WebGL Texture Object
 */
function initTexture(image, textureObject) {
    // create a new texture
    gl.bindTexture(gl.TEXTURE_2D, textureObject);
    // set parameters for the texture
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_NEAREST);
    gl.generateMipmap(gl.TEXTURE_2D);
    // turn texture off again
    gl.bindTexture(gl.TEXTURE_2D, null);
}

/**
 * Load an image as a texture
 */
function loadTexture() {
    var image = new Image();
    // create a texture object
    lennaTxt.textureObj = gl.createTexture();
    image.onload = function () {
        initTexture(image, lennaTxt.textureObj);
        // make sure there is a redraw after the loading of the texture
        draw();
    };
    // setting the src will trigger onload
    image.src = "../img/lena512.png";
};