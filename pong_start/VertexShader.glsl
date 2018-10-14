// Position / Punkte / Wo ist es
attribute vec2 aVertexPosition;

uniform mat3 uModelMat;
uniform mat3 uProjectionMat;

void main() {
    // gl_Position = vec4(aVertexPosition, 0, 1);
    gl_Position = vec4((uProjectionMat * uModelMat) * vec3(aVertexPosition, 1), 1);
}