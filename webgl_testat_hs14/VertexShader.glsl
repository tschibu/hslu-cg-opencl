attribute vec2 aVertexPosition;
attribute vec2 aVertexTextureCoord;
uniform mat4 uModelViewMatrix;
varying vec2 vTextureCoord;

void main() {
    vec4 position = vec4(aVertexPosition, 0.0, 1.0);
    gl_Position = uModelViewMatrix * position;
    vTextureCoord = aVertexTextureCoord;
}