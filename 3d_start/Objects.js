/**
 * Created by Remo Schwarzentruber
 */

/**
 *
 * Define a Cube
 */

/**
 *
 * @param gl the gl object for which to define the sphere
 * @param color from the cube
 */

function WireFrameCube(gl, color) {
        function defineVertices(gl)
        {
            var vertices = [
                -0.5,  0.5,  0.5,    // v0
                -0.5, -0.5,  0.5,    // v1
                 0.5, -0.5,  0.5,    // v2
                 0.5,  0.5,  0.5,    // v3
                -0.5,  0.5, -0.5,    // v4
                -0.5, -0.5, -0.5,    // v5
                 0.5, -0.5, -0.5,    // v6
                 0.5,  0.5, -0.5     // v7
            ];
            var buffer = gl.createBuffer();
            gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
            gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
            return buffer;
        }

        function defineEdges(gl)
        {
            var vertexIndices = [
                0, 1,
                0, 3,
                0, 4,
                6, 2,
                6, 7,
                6, 5,
                1, 2,
                1, 5,
                4, 7,
                4, 5,
                3, 2,
                3, 7
            ];

            var buffer = gl.createBuffer();
            gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, buffer);
            gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(vertexIndices), gl.STATIC_DRAW);

            return buffer;
        }

        return {
            bufferVertices: defineVertices(gl),
            bufferEdges: defineEdges(gl),
            color: color,
            draw: function (gl, aVertexPositionId, aVertexColorId)
            {
                gl.bindBuffer(gl.ARRAY_BUFFER, this.bufferVertices);
                gl.vertexAttribPointer(aVertexPositionId, 3, gl.FLOAT, false, 0, 0);
                gl.enableVertexAttribArray(aVertexPositionId);

                gl.disableVertexAttribArray(aVertexColorId);
                gl.vertexAttrib4fv(aVertexColorId, this.color);

                gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.bufferEdges);
                gl.drawElements(gl.LINES, 24, gl.UNSIGNED_SHORT, 0);
            }
        }
    }


